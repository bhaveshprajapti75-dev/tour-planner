import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

/**
 * Generic CRUD + Pagination + Search hook for admin pages.
 *
 * @param {Object} options
 * @param {Function} options.fetcher        - (params) => api.getList(params)  – must return { data }
 * @param {Function} [options.onDelete]     - (id) => api.delete(id)
 * @param {Function} [options.onCreate]     - (payload) => api.create(payload)
 * @param {Function} [options.onUpdate]     - (id, payload) => api.update(id, payload)
 * @param {Object}   [options.defaultForm]  - initial empty form shape
 * @param {number}   [options.pageSize=20]  - items per page
 * @param {Object}   [options.filters]      - extra filter state merged into fetcher params
 * @param {Function} [options.mapRow]       - transform each row after fetch (optional)
 */
export default function useCrudPage({
  fetcher,
  onDelete,
  onCreate,
  onUpdate,
  defaultForm = {},
  pageSize = 30,
  filters = {},
  mapRow,
} = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  // appliedSearch only updates on form submit, not every keystroke
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [saving, setSaving] = useState(false);

  // Confirm dialog
  const [confirmId, setConfirmId] = useState(null);

  // Stable filter key to detect changes
  const filterKey = JSON.stringify(filters);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  // Fetch data — runs inside useEffect with a local `cancelled` flag
  // so React 18 StrictMode double-mount can't leave loading stuck at true.
  const fetchIdRef = useRef(0);
  // Track whether we've successfully loaded data at least once —
  // used to avoid flashing the full-page spinner on subsequent fetches (page/filter change).
  const hasLoadedOnce = useRef(false);

  const load = useCallback(async () => {
    if (!fetcher) {
      setLoading(false);
      return;
    }

    // Increment fetch id — any older in-flight request becomes stale
    const id = ++fetchIdRef.current;

    try {
      // Show full loading spinner only on the very first fetch.
      // After that, keep showing stale data while the new data loads in the background.
      if (!hasLoadedOnce.current) setLoading(true);
      setError(null);
      const params = { page, page_size: pageSize, search: appliedSearch || undefined, ...filters };
      // Strip undefined/empty values
      Object.keys(params).forEach(k => {
        if (params[k] === undefined || params[k] === '') delete params[k];
      });
      const { data: res } = await fetcher(params);

      // If a newer load() was triggered while we were waiting, discard this result
      if (id !== fetchIdRef.current) return;

      let rows = Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : [];
      if (mapRow) rows = rows.map(mapRow);
      setData(rows);
      hasLoadedOnce.current = true;
      if (res.count != null) {
        setTotalCount(res.count);
        setTotalPages(Math.ceil(res.count / pageSize));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
      // If a newer load() was triggered, ignore this error
      if (id !== fetchIdRef.current) return;

      const message = err.response?.status === 403
        ? 'Access denied. You don\'t have permission.'
        : err.response?.status === 401
        ? 'Session expired. Please login again.'
        : err.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Is the backend running?'
        : 'Failed to load data';
      setError(message);
      setData([]);
    } finally {
      // ALWAYS clear loading if this is still the latest request
      if (id === fetchIdRef.current) setLoading(false);
    }
  }, [page, filterKey, fetcher, pageSize, appliedSearch, mapRow]);

  useEffect(() => {
    load();
    // Cleanup: invalidate this load so React 18 StrictMode double-mount
    // doesn't leave two requests racing — only the latest mount's response wins.
    return () => { fetchIdRef.current++; };
  }, [load]);

  // Search handler (call from form onSubmit / Enter key)
  const handleSearch = useCallback((e) => {
    e?.preventDefault?.();
    setAppliedSearch(search);
    setPage(1);
  }, [search]);

  // Open create modal
  const openCreate = useCallback(() => {
    setEditing(null);
    setForm({ ...defaultForm });
    setShowModal(true);
  }, [defaultForm]);

  // Open edit modal
  const openEdit = useCallback((item) => {
    setEditing(item);
    // Populate form from item – only pick keys that exist in defaultForm
    const populated = {};
    Object.keys(defaultForm).forEach(k => {
      populated[k] = item[k] ?? defaultForm[k];
    });
    setForm(populated);
    setShowModal(true);
  }, [defaultForm]);

  // Close modal
  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditing(null);
  }, []);

  // Submit create/update
  const handleSubmit = useCallback(async (payload, successMsg) => {
    if (!onCreate && !onUpdate) return;
    setSaving(true);
    try {
      if (editing && onUpdate) {
        await onUpdate(editing.id, payload ?? form);
        toast.success(successMsg || 'Updated successfully');
      } else if (onCreate) {
        await onCreate(payload ?? form);
        toast.success(successMsg || 'Created successfully');
      }
      closeModal();
      load();
      return true;
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === 'object' && msg !== null) {
        toast.error(Object.values(msg).flat().join(', '));
      } else {
        toast.error(msg || 'Save failed');
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [editing, form, onCreate, onUpdate, closeModal, load]);

  // Delete with confirmation
  const handleDelete = useCallback(async (id) => {
    if (!onDelete) return;
    try {
      await onDelete(id);
      toast.success('Deleted successfully');
      setConfirmId(null);
      load();
    } catch {
      toast.error('Delete failed');
    }
  }, [onDelete, load]);

  // Ask for confirmation before delete
  const askDelete = useCallback((id) => setConfirmId(id), []);
  const cancelDelete = useCallback(() => setConfirmId(null), []);
  const confirmDelete = useCallback(() => {
    if (confirmId) handleDelete(confirmId);
  }, [confirmId, handleDelete]);

  return {
    // Data
    data,
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalCount,

    // Search
    search,
    setSearch,
    handleSearch,

    // Modal
    showModal,
    editing,
    form,
    setForm,
    saving,
    openCreate,
    openEdit,
    closeModal,
    handleSubmit,

    // Delete
    confirmId,
    askDelete,
    cancelDelete,
    confirmDelete,
    handleDelete,

    // Inline toggle (e.g. is_active switch in table)
    toggleActive: async (row) => {
      if (!onUpdate) return;
      try {
        await onUpdate(row.id, { is_active: !row.is_active });
        // Optimistic: update the row in-place without full refetch
        setData(prev => prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r));
        toast.success(row.is_active ? 'Deactivated' : 'Activated');
      } catch {
        toast.error('Status update failed');
      }
    },

    // Utilities
    reload: load,
  };
}

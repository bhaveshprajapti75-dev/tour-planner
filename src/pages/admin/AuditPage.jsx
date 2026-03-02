import { useState, useMemo } from 'react';
import { Clock, Filter, X } from 'lucide-react';
import { auditAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import { DataTable, PageHeader, Badge, FilterDropdown } from '../../components/admin';

const ACTION_VARIANTS = {
  CREATE: 'green',
  UPDATE: 'blue',
  DELETE: 'red',
  LOGIN:  'purple',
  LOGOUT: 'gray',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export default function AuditPage() {
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const crud = useCrudPage({
    fetcher: auditAPI.getLogs,
    filters: {
      action: actionFilter || undefined,
      entity_type: entityFilter || undefined,
    },
  });

  const hasFilters = actionFilter || entityFilter;

  const clearFilters = () => {
    setActionFilter('');
    setEntityFilter('');
    setShowFilters(false);
  };

  const columns = useMemo(() => [
    {
      key: 'timestamp', label: 'Timestamp', render: r => (
        <div className="flex items-center gap-2 text-sm text-ink-light dark:text-white/50">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(r.timestamp || r.created_at)}
        </div>
      ),
    },
    {
      key: 'user', label: 'User', render: r => (
        <span className="text-sm font-bold text-ink dark:text-white">
          {r.user_name || r.user_email || r.user || 'System'}
        </span>
      ),
    },
    {
      key: 'action', label: 'Action', render: r => (
        <Badge variant={ACTION_VARIANTS[r.action] || 'blue'}>{r.action}</Badge>
      ),
    },
    {
      key: 'entity', label: 'Entity', render: r => (
        <div>
          <span className="text-sm font-bold text-ink dark:text-white">{r.entity_type || '-'}</span>
          {r.entity_id && <span className="text-xs text-ink-light dark:text-white/40 ml-1">#{r.entity_id}</span>}
        </div>
      ),
    },
    {
      key: 'details', label: 'Details', render: r => (
        <p className="text-sm text-ink-light dark:text-white/50 truncate max-w-xs">{r.description || r.changes || '-'}</p>
      ),
    },
  ], []);

  return (
    <div className="space-y-6">
      <PageHeader
        searchValue={crud.search}
        onSearchChange={e => crud.setSearch(e.target.value)}
        onSearchSubmit={crud.handleSearch}
        searchPlaceholder="Search logs..."
        extraActions={
          <button onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
              hasFilters ? 'bg-brand/5 border-brand text-brand' : 'bg-white dark:bg-d-card border-gray-200 dark:border-white/[0.08] text-ink dark:text-white'
            }`}>
            <Filter className="w-4 h-4" /> Filters
            {hasFilters && <span className="w-5 h-5 bg-brand text-white rounded-full text-xs flex items-center justify-center">{[actionFilter, entityFilter].filter(Boolean).length}</span>}
          </button>
        }
      />

      {showFilters && (
        <div className="bg-white dark:bg-d-card rounded-2xl border border-gray-100 dark:border-white/[0.08] p-4 flex flex-wrap gap-4 items-end">
          <FilterDropdown
            label="Action"
            value={actionFilter}
            onChange={setActionFilter}
            options={Object.keys(ACTION_VARIANTS).map(a => ({ value: a, label: a }))}
            placeholder="All Actions"
          />
          <div>
            <label className="block text-sm font-bold text-ink dark:text-white mb-1.5">Entity Type</label>
            <input type="text" placeholder="e.g. Country" value={entityFilter} onChange={e => setEntityFilter(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-d-card border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-ink dark:text-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 w-40" />
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm font-bold text-red-500 hover:text-red-600 cursor-pointer pb-1">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      )}

      <DataTable
        columns={columns} data={crud.data} loading={crud.loading}
        page={crud.page} totalPages={crud.totalPages} totalCount={crud.totalCount} onPageChange={crud.setPage}
        emptyMessage="No audit logs found"
      />
    </div>
  );
}

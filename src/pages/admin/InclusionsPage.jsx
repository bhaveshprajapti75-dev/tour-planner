import { useState, useEffect, useMemo, useCallback } from 'react';
import { ListChecks, Tag } from 'lucide-react';
import { Upload, Loader2 } from 'lucide-react';
import { inclusionsAPI, geographyAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import toast from 'react-hot-toast';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, Badge, ViewModal,
  Input, Select, Textarea, FilterDropdown,
} from '../../components/admin';

// ─── Inclusions / Exclusions Items Tab ────────────────────────────
const ITEM_FORM = { country: '', unique_code: '', category: '', item_service: '', type: 'INCLUSION', details_notes: '', source_files: '', display_order: 0, is_active: true };

function ItemsView({ categories, countries }) {
  const [filterType, setFilterType] = useState('');
  const [viewing, setViewing] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { errors, validate, clearError, clearErrors } = useFormValidation();
  const catOpts = useMemo(() => categories.map(c => ({ value: c.id, label: c.name })), [categories]);
  const countryOpts = useMemo(() => countries.map(c => ({ value: c.id, label: c.name })), [countries]);
  const countryMap = useMemo(() => Object.fromEntries(countries.map(c => [c.id, c.name])), [countries]);

  const itemRules = {
    item_service: v => !v?.trim() && 'Item/Service name is required',
    country: v => !v && 'Please select a country',
    unique_code: v => !v?.trim() && 'Unique code is required',
    category: v => !v && 'Please select a category',
    type: v => !v && 'Please select a type',
  };

  const crud = useCrudPage({
    fetcher: inclusionsAPI.getItems,
    onCreate: inclusionsAPI.createItem,
    onUpdate: inclusionsAPI.updateItem,
    onDelete: inclusionsAPI.deleteItem,
    defaultForm: ITEM_FORM,
    filters: { type: filterType || undefined },
  });

  const catMap = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c.name])), [categories]);

  const columns = useMemo(() => [
    { key: 'item_service', label: 'Item / Service', render: r => <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.item_service}</button> },
    { key: 'unique_code', label: 'Code', render: r => <span className="text-xs font-mono text-ink-light dark:text-white/50">{r.unique_code}</span> },
    { key: 'country', label: 'Country', render: r => <span className="text-sm text-ink-light dark:text-white/50">{countryMap[r.country] || '-'}</span> },
    { key: 'category', label: 'Category', render: r => <span className="text-sm text-ink-light dark:text-white/50">{catMap[r.category] || '-'}</span> },
    {
      key: 'type', label: 'Type', render: r => (
        <Badge variant={r.type === 'INCLUSION' ? 'green' : 'red'}>{r.type}</Badge>
      ),
    },
    {
      key: 'is_active', label: 'Status', render: r => (
        <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} />
      ),
    },
  ], [catMap, countryMap]);

  const onSubmit = e => {
    e.preventDefault();
    if (!validate(crud.form, itemRules)) return;
    crud.handleSubmit(crud.form);
  };
  const closeModal = () => { clearErrors(); crud.closeModal(); };
  const { form, setForm } = crud;

  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploading(true);
      const { data } = await inclusionsAPI.bulkUploadItems(formData);
      toast.success(`Uploaded! Created: ${data.created ?? 0}, Skipped: ${data.skipped ?? 0}`);
      if (data.errors?.length) toast.error(`Warnings: ${data.errors[0]}`, { duration: 6000 });
      setShowUpload(false);
      crud.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <PageHeader
        searchValue={crud.search}
        onSearchChange={e => crud.setSearch(e.target.value)}
        onSearchSubmit={crud.handleSearch}
        searchPlaceholder="Search items..."
        onAdd={crud.openCreate}
        addLabel="Add Item"
        extraActions={
          <button onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-d-card text-ink dark:text-white px-5 py-2.5 rounded-2xl border border-gray-200 dark:border-white/[0.08] hover:border-brand transition-all shadow-sm cursor-pointer">
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
        }
        filters={
          <FilterDropdown
            value={filterType}
            onChange={setFilterType}
            options={[{ value: 'INCLUSION', label: 'Inclusion' }, { value: 'EXCLUSION', label: 'Exclusion' }]}
            placeholder="All Types"
          />
        }
      />

      <DataTable
        columns={columns} data={crud.data} loading={crud.loading}
        page={crud.page} totalPages={crud.totalPages} totalCount={crud.totalCount} onPageChange={crud.setPage}
        renderActions={row => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.askDelete(row.id)} />}
      />

      <ConfirmDialog open={!!crud.confirmId} onConfirm={crud.confirmDelete} onCancel={crud.cancelDelete} />

      {/* View Modal */}
      <ViewModal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.item_service || 'Item Details'}
        fields={viewing ? [
          { label: 'Item / Service', value: viewing.item_service, colSpan: 2 },
          { label: 'Unique Code', value: viewing.unique_code },
          { label: 'Country', value: countryMap[viewing.country] || viewing.country },
          { label: 'Category', value: catMap[viewing.category] || viewing.category },
          { label: 'Type', value: viewing.type, type: 'badge', variant: viewing.type === 'INCLUSION' ? 'green' : 'red' },
          { label: 'Details / Notes', value: viewing.details_notes, type: 'multiline', colSpan: 2 },
          { label: 'Source Files', value: viewing.source_files },
          { label: 'Display Order', value: viewing.display_order },
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Item' : 'Add Item'} maxWidth="max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Item / Service" value={form.item_service} onChange={e => { setForm(f => ({ ...f, item_service: e.target.value })); clearError('item_service'); }} required error={errors.item_service} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Country" value={form.country} onChange={val => { setForm(f => ({ ...f, country: val })); clearError('country'); }} required
              options={countryOpts} placeholder="Select Country" searchable error={errors.country} />
            <Input label="Unique Code" value={form.unique_code} onChange={e => { setForm(f => ({ ...f, unique_code: e.target.value })); clearError('unique_code'); }} required error={errors.unique_code} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={val => { setForm(f => ({ ...f, category: val })); clearError('category'); }} required
              options={catOpts} placeholder="Select Category" searchable error={errors.category} />
            <Select label="Type" value={form.type} onChange={val => { setForm(f => ({ ...f, type: val })); clearError('type'); }} required
              options={[{ value: 'INCLUSION', label: 'Inclusion' }, { value: 'EXCLUSION', label: 'Exclusion' }]} error={errors.type} />
          </div>
          <Textarea label="Details / Notes" value={form.details_notes} onChange={e => setForm(f => ({ ...f, details_notes: e.target.value }))} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Source Files" value={form.source_files} onChange={e => setForm(f => ({ ...f, source_files: e.target.value }))} />
            <Input label="Display Order" type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
          </div>
          <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Bulk Upload Inclusions/Exclusions" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-ink-light dark:text-white/50">
            Upload a CSV or Excel file with columns:{' '}
            <span className="font-mono text-xs bg-canvas dark:bg-d-surface px-2 py-0.5 rounded">country_code, unique_code, type, category, item_service, details_notes, source_files, display_order</span>
          </p>
          <p className="text-xs text-ink-light dark:text-white/50">
            <strong>type</strong> must be <code>INCLUSION</code> or <code>EXCLUSION</code>. Categories are auto-created if they don&#39;t exist.
          </p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/[0.12] rounded-2xl p-8 cursor-pointer hover:border-brand transition-colors">
            <Upload className="w-8 h-8 text-ink-light dark:text-white/50 mb-3" />
            <span className="text-sm font-bold text-ink dark:text-white">Click to select file</span>
            <span className="text-xs text-ink-light dark:text-white/50 mt-1">.xlsx, .csv</span>
            <input type="file" accept=".xlsx,.csv" onChange={handleBulkUpload} className="hidden" disabled={uploading} />
          </label>
          {uploading && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 text-brand animate-spin" />
              <span className="text-sm font-medium text-ink dark:text-white">Uploading...</span>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

// ─── Categories Tab ───────────────────────────────────────────────
const CAT_FORM = { name: '', display_order: 0, is_active: true };

function CategoriesView() {
  const [viewing, setViewing] = useState(null);
  const { errors, validate, clearError, clearErrors } = useFormValidation();
  const crud = useCrudPage({
    fetcher: inclusionsAPI.getCategories,
    onCreate: inclusionsAPI.createCategory,
    onUpdate: inclusionsAPI.updateCategory,
    onDelete: inclusionsAPI.deleteCategory,
    defaultForm: CAT_FORM,
  });

  const columns = useMemo(() => [
    { key: 'name', label: 'Name', render: r => <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.name}</button> },
    { key: 'display_order', label: 'Order', render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.display_order}</span> },
    { key: 'is_active', label: 'Status', render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], []);

  const catRules = {
    name: v => !v?.trim() && 'Category name is required',
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!validate(crud.form, catRules)) return;
    crud.handleSubmit(crud.form);
  };
  const closeModal = () => { clearErrors(); crud.closeModal(); };
  const { form, setForm } = crud;

  return (
    <>
      <PageHeader
        searchValue={crud.search}
        onSearchChange={e => crud.setSearch(e.target.value)}
        onSearchSubmit={crud.handleSearch}
        searchPlaceholder="Search categories..."
        onAdd={crud.openCreate}
        addLabel="Add Category"
      />

      <DataTable
        columns={columns} data={crud.data} loading={crud.loading}
        page={crud.page} totalPages={crud.totalPages} totalCount={crud.totalCount} onPageChange={crud.setPage}
        renderActions={row => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.askDelete(row.id)} />}
      />

      <ConfirmDialog open={!!crud.confirmId} onConfirm={crud.confirmDelete} onCancel={crud.cancelDelete} />

      {/* View Modal */}
      <ViewModal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name || 'Category Details'}
        fields={viewing ? [
          { label: 'Name', value: viewing.name, colSpan: 2 },
          { label: 'Display Order', value: viewing.display_order },
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }} required error={errors.name} />
          <Input label="Display Order" type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
          <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>
    </>
  );
}

// ─── Main Page (Tabs) ─────────────────────────────────────────────
export default function InclusionsPage() {
  const [tab, setTab] = useState('items');
  const [categories, setCategories] = useState([]);

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    inclusionsAPI.getCategories({ page_size: 100 }).then(r => setCategories(r.data.results || r.data)).catch(() => {});
    geographyAPI.getCountries({ page_size: 100 }).then(r => setCountries(r.data.results || r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex bg-white dark:bg-d-card p-1 rounded-2xl border border-gray-100 dark:border-white/[0.08] w-fit shadow-sm">
        {[
          { key: 'items', label: 'Items', icon: ListChecks },
          { key: 'categories', label: 'Categories', icon: Tag },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer
              ${tab === t.key ? 'bg-brand text-white shadow-md' : 'text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'items' ? <ItemsView categories={categories} countries={countries} /> : <CategoriesView />}
    </div>
  );
}

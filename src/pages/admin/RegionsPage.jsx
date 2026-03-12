import { useState, useEffect, useMemo } from 'react';
import { geographyAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, ViewModal,
  Input, Select, Textarea, FilterDropdown, ImageUpload,
} from '../../components/admin';

const DEFAULT_FORM = { country: '', name: '', code: '', description: '', display_order: 0, is_active: true };

export default function RegionsPage() {
  const [countries, setCountries] = useState([]);
  const [filterCountry, setFilterCountry] = useState('');
  const [viewing, setViewing] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const { errors, validate, clearError, clearErrors } = useFormValidation();

  useEffect(() => {
    geographyAPI.getCountries({ page_size: 100 }).then(res => setCountries(res.data.results || res.data)).catch(() => {});
  }, []);

  const buildFormData = (formObj) => {
    const fd = new FormData();
    Object.entries(formObj).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
    });
    imageFiles.forEach(f => fd.append('images', f));
    removedImageIds.forEach(id => fd.append('remove_images', id));
    return fd;
  };

  const crud = useCrudPage({
    fetcher: geographyAPI.getRegions,
    onCreate: (data) => geographyAPI.createRegion(buildFormData(data)),
    onUpdate: (id, data) => geographyAPI.updateRegion(id, buildFormData(data)),
    onDelete: geographyAPI.deleteRegion,
    defaultForm: DEFAULT_FORM,
    filters: { country: filterCountry || undefined },
  });

  const countryMap = useMemo(() => Object.fromEntries(countries.map(c => [c.id, c.name])), [countries]);
  const countryOpts = useMemo(() => countries.map(c => ({ value: c.id, label: c.name })), [countries]);

  const columns = useMemo(() => [
    { key: 'name',    label: 'Name',    render: r => <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.name}</button> },
    { key: 'code',    label: 'Code',    render: r => <span className="text-sm text-ink-light dark:text-white/50 font-mono">{r.code || '-'}</span> },
    { key: 'country', label: 'Country', render: r => <span className="text-sm text-ink-light dark:text-white/50">{countryMap[r.country] || r.country}</span> },
    { key: 'images',  label: 'Images',  render: r => {
      const imgs = r.region_images || [];
      if (!imgs.length) return <span className="text-xs text-ink-light dark:text-white/50">-</span>;
      return (
        <div className="flex items-center -space-x-2">
          {imgs.slice(0, 3).map((img, i) => (
            <img key={img.id} src={img.image} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-d-card" style={{ zIndex: 3 - i }} />
          ))}
          {imgs.length > 3 && <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-d-card flex items-center justify-center text-[10px] font-bold text-ink-light dark:text-white/50">+{imgs.length - 3}</span>}
        </div>
      );
    }},
    { key: 'status',  label: 'Status',  render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], [countryMap]);

  const rules = {
    country: v => !v && 'Please select a country',
    name: v => !v?.trim() && 'Region name is required',
    code: v => !v?.trim() && 'Code is required',
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!validate(crud.form, rules)) return;
    crud.handleSubmit(crud.form);
  };

  const handleOpenCreate = () => { setImageFiles([]); setRemovedImageIds([]); crud.openCreate(); };
  const handleOpenEdit = (row) => { setImageFiles([]); setRemovedImageIds([]); crud.openEdit(row); };
  const closeModal = () => { clearErrors(); setImageFiles([]); setRemovedImageIds([]); crud.closeModal(); };

  return (
    <div className="space-y-6">
      <PageHeader
        searchValue={crud.search}
        onSearchChange={e => crud.setSearch(e.target.value)}
        onSearchSubmit={crud.handleSearch}
        searchPlaceholder="Search regions..."
        onAdd={handleOpenCreate}
        addLabel="Add Region"
        filters={
          <FilterDropdown
            value={filterCountry}
            onChange={setFilterCountry}
            options={countryOpts}
            placeholder="All Countries"
            searchable
          />
        }
      />

      <DataTable
        columns={columns}
        data={crud.data}
        loading={crud.loading}
        page={crud.page}
        totalPages={crud.totalPages}
        totalCount={crud.totalCount}
        onPageChange={crud.setPage}
        renderActions={row => <ActionButtons onEdit={() => handleOpenEdit(row)} onDelete={() => crud.askDelete(row.id)} />}
      />

      <ConfirmDialog open={!!crud.confirmId} onConfirm={crud.confirmDelete} onCancel={crud.cancelDelete} />

      {/* View Modal */}
      <ViewModal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name || 'Region Details'}
        fields={viewing ? [
          { label: 'Name', value: viewing.name, colSpan: 2 },
          { label: 'Code', value: viewing.code },
          { label: 'Country', value: countryMap[viewing.country] || viewing.country },
          { label: 'Description', value: viewing.description, type: 'multiline', colSpan: 2 },
          { label: 'Images', value: viewing.region_images?.length ? viewing.region_images : null, type: 'gallery', colSpan: 2 },
          { label: 'Display Order', value: viewing.display_order },
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Region' : 'Add Region'}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Select label="Country" value={crud.form.country} onChange={val => { crud.setForm(f => ({ ...f, country: val })); clearError('country'); }} required
            options={countryOpts} placeholder="Select Country" searchable error={errors.country} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" value={crud.form.name} onChange={e => { crud.setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }} required error={errors.name} />
            <Input label="Code" value={crud.form.code} onChange={e => { crud.setForm(f => ({ ...f, code: e.target.value })); clearError('code'); }} required error={errors.code} />
          </div>
          <Textarea label="Description" value={crud.form.description} onChange={e => crud.setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          <Input label="Display Order" type="number" value={crud.form.display_order} onChange={e => crud.setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
          <ImageUpload
            files={imageFiles}
            onChange={setImageFiles}
            existing={(crud.editing?.region_images || []).filter(img => !removedImageIds.includes(img.id))}
            onRemoveExisting={(id) => setRemovedImageIds(prev => [...prev, id])}
            label="Region Images"
          />
          <ToggleSwitch label="Active" checked={crud.form.is_active} onChange={val => crud.setForm(f => ({ ...f, is_active: val }))} />
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>
    </div>
  );
}

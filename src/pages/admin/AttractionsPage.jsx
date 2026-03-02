import { useState, useEffect, useMemo } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { attractionsAPI, geographyAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import toast from 'react-hot-toast';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, ViewModal,
  Input, Select, Textarea, FilterDropdown, MapLocationPicker, ImageUpload,
} from '../../components/admin';

const DEFAULT_FORM = {
  region: '', name: '', key_features_notes: '',
  latitude: '', longitude: '', display_order: 0, is_active: true,
};

export default function AttractionsPage() {
  const [regions, setRegions] = useState([]);
  const [filterRegion, setFilterRegion] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const { errors, validate, clearError, clearErrors } = useFormValidation();

  useEffect(() => {
    geographyAPI.getRegions({ page_size: 200 }).then(r => setRegions(r.data.results || r.data)).catch(() => {});
  }, []);

  const buildFormData = (formObj) => {
    const fd = new FormData();
    Object.entries(formObj).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
    });
    imageFiles.forEach(f => fd.append('images', f));
    return fd;
  };

  const [removedImageIds, setRemovedImageIds] = useState([]);

  const crud = useCrudPage({
    fetcher: attractionsAPI.getAttractions,
    onCreate: (data) => attractionsAPI.createAttraction(buildFormData(data)),
    onUpdate: (id, data) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
      });
      imageFiles.forEach(f => fd.append('images', f));
      removedImageIds.forEach(imgId => fd.append('remove_images', imgId));
      return attractionsAPI.updateAttraction(id, fd);
    },
    onDelete: attractionsAPI.deleteAttraction,
    defaultForm: DEFAULT_FORM,
    filters: { region: filterRegion || undefined },
  });

  const regionMap = useMemo(() => Object.fromEntries(regions.map(r => [r.id, r.name])), [regions]);
  const regionOpts = useMemo(() => regions.map(r => ({ value: r.id, label: r.name })), [regions]);

  const columns = useMemo(() => [
    { key: 'reference_no', label: 'Ref No', render: r => <span className="text-sm text-ink-light dark:text-white/50 font-mono">{r.reference_no}</span> },
    {
      key: 'name', label: 'Name', render: r => (
        <div>
          <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.name}</button>
          {r.key_features_notes && <div className="text-xs text-ink-light dark:text-white/50 mt-0.5 line-clamp-1">{r.key_features_notes}</div>}
        </div>
      ),
    },
    { key: 'region', label: 'Region', render: r => <span className="text-sm text-ink-light dark:text-white/50">{regionMap[r.region] || r.region}</span> },
    {
      key: 'images', label: 'Images', render: r => (
        <span className="text-xs text-ink-light dark:text-white/50">{r.images?.length || 0} img</span>
      ),
    },
    {
      key: 'coords', label: 'Coordinates', render: r => (
        <span className="text-xs text-ink-light dark:text-white/50 font-mono">
          {r.latitude && r.longitude ? `${r.latitude}, ${r.longitude}` : '-'}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], [regionMap]);

  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploading(true);
      const { data } = await attractionsAPI.bulkUpload(formData);
      toast.success(`Uploaded! Created: ${data.created || 0}, Skipped: ${data.skipped || 0}`);
      setShowUpload(false);
      crud.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const rules = {
    region: v => !v && 'Please select a region',
    name: v => !v?.trim() && 'Attraction name is required',
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!validate(crud.form, rules)) return;
    crud.handleSubmit(crud.form);
  };

  const handleOpenCreate = () => { setImageFiles([]); setRemovedImageIds([]); crud.openCreate(); };
  const handleOpenEdit = (row) => { setImageFiles([]); setRemovedImageIds([]); crud.openEdit(row); };
  const closeModal = () => { clearErrors(); setImageFiles([]); setRemovedImageIds([]); crud.closeModal(); };
  const { form, setForm } = crud;

  return (
    <div className="space-y-6">
      <PageHeader
        searchValue={crud.search}
        onSearchChange={e => crud.setSearch(e.target.value)}
        onSearchSubmit={crud.handleSearch}
        searchPlaceholder="Search attractions..."
        onAdd={handleOpenCreate}
        addLabel="Add Attraction"
        filters={
          <FilterDropdown
            value={filterRegion}
            onChange={setFilterRegion}
            options={regionOpts}
            placeholder="All Regions"
            searchable
          />
        }
        extraActions={
          <button onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-d-card text-ink dark:text-white px-5 py-2.5 rounded-2xl border border-gray-200 dark:border-white/[0.08] hover:border-brand transition-all shadow-sm cursor-pointer">
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
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
        title={viewing?.name || 'Attraction Details'}
        fields={viewing ? [
          { label: 'Reference No', value: viewing.reference_no },
          { label: 'Region', value: regionMap[viewing.region] || viewing.region },
          { label: 'Name', value: viewing.name, colSpan: 2 },
          { label: 'Key Features / Notes', value: viewing.key_features_notes, type: 'multiline', colSpan: 2 },
          { label: 'Location', value: viewing.latitude && viewing.longitude ? { lat: viewing.latitude, lng: viewing.longitude } : null, type: 'coords', colSpan: 2 },
          { label: 'Images', value: viewing.images?.length ? viewing.images : null, type: 'gallery', colSpan: 2 },
          { label: 'Display Order', value: viewing.display_order },
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      {/* Create / Edit Modal */}
      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Attraction' : 'Add Attraction'} maxWidth="max-w-5xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-5 gap-5">
            {/* Left column — form fields (3/5) */}
            <div className="col-span-3 space-y-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                <Select label="Region" value={form.region} onChange={val => { setForm(f => ({ ...f, region: val })); clearError('region'); }} required options={regionOpts} placeholder="Select Region" searchable error={errors.region} />
                <Input label="Display Order" type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <Input label="Name" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }} required error={errors.name} />
              <Textarea label="Key Features / Notes" value={form.key_features_notes} onChange={e => setForm(f => ({ ...f, key_features_notes: e.target.value }))} rows={2} />
              <ImageUpload
                files={imageFiles}
                onChange={setImageFiles}
                existing={(crud.editing?.images || []).filter(img => !removedImageIds.includes(img.id))}
                onRemoveExisting={(id) => setRemovedImageIds(prev => [...prev, id])}
                label="Attraction Images"
              />
              <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />
            </div>

            {/* Right column — map (2/5) */}
            <div className="col-span-2">
              <MapLocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onChange={({ latitude, longitude }) => setForm(f => ({ ...f, latitude, longitude }))}
              />
            </div>
          </div>
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Bulk Upload Attractions" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-ink-light dark:text-white/50">
            Upload an Excel or CSV with columns: <span className="font-mono text-xs bg-canvas dark:bg-d-surface px-2 py-0.5 rounded">region, name, latitude, longitude</span>
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
    </div>
  );
}

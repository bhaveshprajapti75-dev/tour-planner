import { useState, useEffect, useMemo } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { dayToursAPI, geographyAPI, attractionsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, Badge, ViewModal,
  Input, Select, MultiSelect, Textarea, FilterDropdown, DateInput, ReadOnlyInput,
} from '../../components/admin';

// Removed TRAVEL_TYPE_OPTIONS as it is defined at the Template level now.

const VALIDITY_MODE_OPTIONS = [
  { value: 'OPEN', label: 'Open Validity' },
  { value: 'DATE_RANGE', label: 'Date Range' },
  { value: 'MONTH', label: 'Month Based' },
  { value: 'YEAR', label: 'Year Based' },
];

const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'ISK', label: 'ISK — Icelandic Króna' },
  { value: 'CHF', label: 'CHF — Swiss Franc' },
];

const DEFAULT_FORM = {
  region: '', activity_combination: '', itinerary_text: '',
  validity_mode: 'OPEN', valid_from: '', valid_to: '',
  price: '', currency: 'INR',
  est_time_distance: '', overnight_location: '', source_file: '',
  display_order: 0, is_active: true,
};

export default function DayToursPage() {
  const [regions, setRegions] = useState([]);
  const [filterRegion, setFilterRegion] = useState('');
  const [viewing, setViewing] = useState(null);
  const [regionAttractions, setRegionAttractions] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { errors, validate, clearError, clearErrors } = useFormValidation();

  const rules = {
    region: v => !v && 'Please select a region',
    activity_combination: v => !v?.trim() && 'Activity combination is required',
    itinerary_text: v => !v?.trim() && 'Itinerary text is required',
  };

  useEffect(() => {
    geographyAPI.getRegions({ page_size: 200 }).then(r => setRegions(r.data.results || r.data)).catch(() => { });
  }, []);

  const crud = useCrudPage({
    fetcher: dayToursAPI.getDayTours,
    onCreate: async (data) => {
      const res = await dayToursAPI.createDayTour(data);
      if (selectedAttractions.length > 0) {
        await dayToursAPI.addAttractions(res.data.id, {
          attractions: selectedAttractions.map((a, i) => ({
            attraction_id: a.id,
            visit_order: i + 1,
          }))
        });
      }
      return res;
    },
    onUpdate: async (id, data) => {
      const res = await dayToursAPI.updateDayTour(id, data);

      // Sync attractions
      const oldAttrIds = (crud.editing?.attractions || []).map(a => a.attraction);
      const newAttrIds = selectedAttractions.map(a => a.id);

      const toRemove = oldAttrIds.filter(attrId => !newAttrIds.includes(attrId));
      const toAdd = newAttrIds.filter(attrId => !oldAttrIds.includes(attrId)).map(attrId => ({
        attraction_id: attrId,
        visit_order: newAttrIds.indexOf(attrId) + 1,
      }));

      // Execute removals
      for (const rmId of toRemove) {
        await dayToursAPI.removeAttraction({ day_tour_id: id, attraction_id: rmId }).catch(() => { });
      }

      // Execute additions
      if (toAdd.length > 0) {
        await dayToursAPI.addAttractions(id, { attractions: toAdd }).catch(() => { });
      }

      return res;
    },
    onDelete: dayToursAPI.deleteDayTour,
    defaultForm: DEFAULT_FORM,
    filters: { region: filterRegion || undefined },
  });

  // Fetch attractions when the region changes in the form
  useEffect(() => {
    if (!crud.form.region) {
      setRegionAttractions([]);
      return;
    }
    attractionsAPI.getAttractions({ region: crud.form.region, page_size: 200 })
      .then(res => setRegionAttractions(res.data.results || res.data))
      .catch(() => setRegionAttractions([]));
  }, [crud.form.region]);

  const regionMap = useMemo(() => Object.fromEntries(regions.map(r => [r.id, r.name])), [regions]);
  const regionOpts = useMemo(() => regions.map(r => ({ value: r.id, label: r.name })), [regions]);

  const columns = useMemo(() => [
    { key: 'unique_code', label: 'Code', render: r => <span className="text-sm font-mono text-ink-light dark:text-white/50">{r.unique_code}</span> },
    { key: 'activity_combination', label: 'Activity', render: r => <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.activity_combination}</button> },
    { key: 'region', label: 'Region', render: r => <span className="text-sm text-ink-light dark:text-white/50">{regionMap[r.region] || r.region}</span> },
    { key: 'price', label: 'Price', render: r => r.price ? <span className="text-sm font-medium text-ink dark:text-white">{r.currency} {r.price}</span> : <span className="text-xs text-ink-light dark:text-white/50">-</span> },
    {
      key: 'attractions', label: 'Attractions', render: r => (
        <Badge variant="brand">{r.attractions?.length || 0}</Badge>
      ),
    },
    { key: 'status', label: 'Status', render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], [regionMap]);

  const onSubmit = e => {
    e.preventDefault();
    if (!validate(crud.form, rules)) return;

    // Clean up dates for the backend (empty strings should be null/omitted, open validity should force omission)
    const payload = { ...crud.form };
    if (payload.validity_mode === 'OPEN') {
      delete payload.valid_from;
      delete payload.valid_to;
    } else {
      if (!payload.valid_from || payload.valid_from === '') delete payload.valid_from;
      if (!payload.valid_to || payload.valid_to === '') delete payload.valid_to;
    }

    crud.handleSubmit(payload);
  };

  const closeModal = () => { clearErrors(); setSelectedAttractions([]); crud.closeModal(); };

  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploading(true);
      const { data } = await dayToursAPI.bulkUpload(formData);
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
  const { form, setForm } = crud;

  // Intercept openEdit to load existing attractions
  const handleOpenEdit = (row) => {
    setSelectedAttractions(
      (row.attractions || []).sort((a, b) => a.visit_order - b.visit_order).map(a => ({
        id: a.attraction,
        name: a.attraction_name,
      }))
    );
    crud.openEdit(row);
  };
  const handleOpenCreate = () => {
    setSelectedAttractions([]);
    crud.openCreate();
  };

  const handleAttractionChange = (newIds) => {
    // newIds is an array of attraction IDs (numbers/strings)
    // We map them back to {id, name} objects for state
    const newSelections = newIds.map(id => {
      const attr = regionAttractions.find(a => String(a.id) === String(id));
      if (!attr) return selectedAttractions.find(sa => String(sa.id) === String(id)) || {};
      return { id: attr.id, name: attr.name };
    });
    setSelectedAttractions(newSelections);

    // Auto-generate activity_combination
    if (newSelections.length > 0) {
      setForm(f => ({
        ...f,
        activity_combination: newSelections.map(a => a.name).join(' • ')
      }));
      clearError('activity_combination');
    }
  };
  const showDateFields = form.validity_mode && form.validity_mode !== 'OPEN';

  return (
    <div className="space-y-6">
      <PageHeader
        searchValue={crud.search}
        onSearchChange={e => crud.setSearch(e.target.value)}
        onSearchSubmit={crud.handleSearch}
        searchPlaceholder="Search day tours..."
        onAdd={crud.openCreate}
        addLabel="Add Day Tour"
        extraActions={
          <button onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-d-card text-ink dark:text-white px-5 py-2.5 rounded-2xl border border-gray-200 dark:border-white/[0.08] hover:border-brand transition-all shadow-sm cursor-pointer">
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
        }
        filters={
          <FilterDropdown
            value={filterRegion}
            onChange={setFilterRegion}
            options={regionOpts}
            placeholder="All Regions"
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
        title={viewing?.activity_combination || 'Day Tour Details'}
        fields={viewing ? [
          { label: 'Unique Code', value: viewing.unique_code },
          { label: 'Region', value: regionMap[viewing.region] || viewing.region },
          { label: 'Activity Combination', value: viewing.activity_combination, colSpan: 2 },
          { label: 'Validity', value: VALIDITY_MODE_OPTIONS.find(o => o.value === viewing.validity_mode)?.label || viewing.validity_mode || '-' },
          { label: 'Price', value: viewing.price ? `${viewing.currency} ${viewing.price}` : '-' },
          { label: 'Overnight Location', value: viewing.overnight_location || '-' },
          { label: 'Est. Time/Distance', value: viewing.est_time_distance || '-' },
          { label: 'Source File', value: viewing.source_file || '-' },
          { label: 'Valid From', value: viewing.valid_from ? viewing.valid_from.split('-').reverse().join('/') : '-' },
          { label: 'Valid To', value: viewing.valid_to ? viewing.valid_to.split('-').reverse().join('/') : '-' },
          { label: 'Itinerary', value: viewing.itinerary_text, type: 'multiline', colSpan: 2 },
          { label: 'Attractions', value: viewing.attractions?.length ? `${viewing.attractions.length} linked` : 'None', type: 'badge', variant: 'brand' },
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      <Modal
        open={crud.showModal}
        onClose={closeModal}
        title={crud.editing ? 'Edit Day Tour' : 'Add Day Tour'}
        maxWidth="max-w-4xl"
        onSubmit={onSubmit}
        footer={<ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Region" value={form.region} onChange={val => { setForm(f => ({ ...f, region: val })); clearError('region'); }} required options={regionOpts} placeholder="Select Region" searchable error={errors.region} />
            <Input label="Overnight Location" value={form.overnight_location} onChange={e => setForm(f => ({ ...f, overnight_location: e.target.value }))} />
          </div>
          <div>
            <ReadOnlyInput label="Activity Combination" value={form.activity_combination} className="w-full" />
          </div>

          <Textarea label="Itinerary Text" value={form.itinerary_text} onChange={e => { setForm(f => ({ ...f, itinerary_text: e.target.value })); clearError('itinerary_text'); }} rows={3} required error={errors.itinerary_text} />

          <MultiSelect
            label="Linked Attractions"
            value={selectedAttractions.map(a => a.id)}
            onChange={handleAttractionChange}
            options={regionAttractions.map(a => ({ value: a.id, label: a.name }))}
            placeholder={form.region ? "Search and select attractions..." : "Please select a Region first..."}
            searchable
            disabled={!form.region}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input label="Price" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            <Select label="Currency" value={form.currency} onChange={val => setForm(f => ({ ...f, currency: val }))} options={CURRENCY_OPTIONS} />
            <Input label="Display Order" type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Validity Mode" value={form.validity_mode} onChange={val => setForm(f => ({ ...f, validity_mode: val, ...(val === 'OPEN' ? { valid_from: '', valid_to: '' } : {}) }))} options={VALIDITY_MODE_OPTIONS} placeholder="Select Mode" />
            <Input label="Est. Time/Distance" value={form.est_time_distance} onChange={e => setForm(f => ({ ...f, est_time_distance: e.target.value }))} />
          </div>

          <Input label="Source File" value={form.source_file} onChange={e => setForm(f => ({ ...f, source_file: e.target.value }))} />

          {showDateFields && (
            <div className="grid grid-cols-2 gap-4">
              <DateInput label="Valid From" value={form.valid_from} onChange={e => setForm(f => ({ ...f, valid_from: e.target.value }))} />
              <DateInput label="Valid To" value={form.valid_to} onChange={e => setForm(f => ({ ...f, valid_to: e.target.value }))} />
            </div>
          )}

          <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />

        </div>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Bulk Upload Day Tours" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-ink-light dark:text-white/50">
            Upload a CSV or Excel file with columns:{' '}
            <span className="font-mono text-xs bg-canvas dark:bg-d-surface px-2 py-0.5 rounded">region, activity_combination, itinerary_text, validity_mode, price, currency</span>
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

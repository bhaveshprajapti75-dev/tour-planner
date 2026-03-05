import { useState, useEffect, useMemo } from 'react';
import { dayToursAPI, geographyAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, Badge, ViewModal,
  Input, Select, Textarea, FilterDropdown, DateInput,
} from '../../components/admin';

const TRAVEL_TYPE_OPTIONS = [
  { value: 'GROUP', label: 'Group Tour' },
  { value: 'SOLO', label: 'Solo Travel' },
  { value: 'COUPLE', label: 'Couple' },
  { value: 'GENERAL', label: 'General' },
];

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
];

const DEFAULT_FORM = {
  region: '', activity_combination: '', itinerary_text: '',
  travel_type: 'GENERAL', validity_mode: 'OPEN', valid_from: '', valid_to: '',
  price: '', currency: 'INR',
  est_time_distance: '', overnight_location: '', source_file: '',
  display_order: 0, is_active: true,
};

export default function DayToursPage() {
  const [regions, setRegions] = useState([]);
  const [filterRegion, setFilterRegion] = useState('');
  const [viewing, setViewing] = useState(null);
  const { errors, validate, clearError, clearErrors } = useFormValidation();

  const rules = {
    region: v => !v && 'Please select a region',
    activity_combination: v => !v?.trim() && 'Activity combination is required',
    itinerary_text: v => !v?.trim() && 'Itinerary text is required',
  };

  useEffect(() => {
    geographyAPI.getRegions({ page_size: 200 }).then(r => setRegions(r.data.results || r.data)).catch(() => {});
  }, []);

  const crud = useCrudPage({
    fetcher: dayToursAPI.getDayTours,
    onCreate: dayToursAPI.createDayTour,
    onUpdate: dayToursAPI.updateDayTour,
    onDelete: dayToursAPI.deleteDayTour,
    defaultForm: DEFAULT_FORM,
    filters: { region: filterRegion || undefined },
  });

  const regionMap = useMemo(() => Object.fromEntries(regions.map(r => [r.id, r.name])), [regions]);
  const regionOpts = useMemo(() => regions.map(r => ({ value: r.id, label: r.name })), [regions]);

  const columns = useMemo(() => [
    { key: 'unique_code', label: 'Code', render: r => <span className="text-sm font-mono text-ink-light dark:text-white/50">{r.unique_code}</span> },
    { key: 'activity_combination', label: 'Activity', render: r => <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.activity_combination}</button> },
    { key: 'region', label: 'Region', render: r => <span className="text-sm text-ink-light dark:text-white/50">{regionMap[r.region] || r.region}</span> },
    { key: 'travel_type', label: 'Type', render: r => r.travel_type ? <Badge variant="blue">{r.travel_type}</Badge> : <span className="text-xs text-ink-light dark:text-white/50">-</span> },
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
    crud.handleSubmit(crud.form);
  };

  const closeModal = () => { clearErrors(); crud.closeModal(); };
  const { form, setForm } = crud;
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
        renderActions={row => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.askDelete(row.id)} />}
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
          { label: 'Travel Type', value: TRAVEL_TYPE_OPTIONS.find(o => o.value === viewing.travel_type)?.label || viewing.travel_type || '-' },
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

      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Day Tour' : 'Add Day Tour'} maxWidth="max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Region" value={form.region} onChange={val => { setForm(f => ({ ...f, region: val })); clearError('region'); }} required options={regionOpts} placeholder="Select Region" searchable error={errors.region} />
            <Select label="Travel Type" value={form.travel_type} onChange={val => setForm(f => ({ ...f, travel_type: val }))} options={TRAVEL_TYPE_OPTIONS} placeholder="Select Type" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Activity Combination" value={form.activity_combination} onChange={e => { setForm(f => ({ ...f, activity_combination: e.target.value })); clearError('activity_combination'); }} required error={errors.activity_combination} />
            <Input label="Overnight Location" value={form.overnight_location} onChange={e => setForm(f => ({ ...f, overnight_location: e.target.value }))} />
          </div>
          <Textarea label="Itinerary Text" value={form.itinerary_text} onChange={e => { setForm(f => ({ ...f, itinerary_text: e.target.value })); clearError('itinerary_text'); }} rows={3} required error={errors.itinerary_text} />
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
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>
    </div>
  );
}

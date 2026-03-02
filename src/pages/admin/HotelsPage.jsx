import { useState, useEffect, useMemo } from 'react';
import { Hotel } from 'lucide-react';
import { hotelsAPI, geographyAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, Badge, ViewModal,
  Input, Select, Textarea, FilterDropdown, TimePicker, ImageUpload,
} from '../../components/admin';

const DEFAULT_FORM = {
  country: '', region: '', name: '', star_rating: 3, address: '',
  contact_phone: '', contact_email: '', check_in_time: '', check_out_time: '',
  is_active: true,
};

const STAR_OPTIONS = [1, 2, 3, 4, 5].map(n => ({ value: n, label: `${n} Star` }));

export default function HotelsPage() {
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [filterRegion, setFilterRegion] = useState('');
  const [viewing, setViewing] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const { errors, validate, clearError, clearErrors } = useFormValidation();

  const rules = {
    country: v => !v && 'Please select a country',
    region: v => !v && 'Please select a region',
    name: v => !v?.trim() && 'Hotel name is required',
  };

  useEffect(() => {
    Promise.all([
      geographyAPI.getCountries({ page_size: 100 }),
      geographyAPI.getRegions({ page_size: 200 }),
    ]).then(([cRes, rRes]) => {
      setCountries(cRes.data.results || cRes.data);
      const regs = rRes.data.results || rRes.data;
      setAllRegions(regs);
      setRegions(regs);
    }).catch(() => {});
  }, []);

  const buildFormData = (formObj) => {
    const fd = new FormData();
    Object.entries(formObj).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
    });
    imageFiles.forEach(f => fd.append('images', f));
    return fd;
  };

  const crud = useCrudPage({
    fetcher: hotelsAPI.getHotels,
    onCreate: (data) => hotelsAPI.createHotel(buildFormData(data)),
    onUpdate: (id, data) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
      });
      return hotelsAPI.updateHotel(id, fd);
    },
    onDelete: hotelsAPI.deleteHotel,
    defaultForm: DEFAULT_FORM,
    filters: { region: filterRegion || undefined },
  });

  // Cascade: filter regions by selected country in form
  const formRegions = useMemo(() =>
    crud.form.country ? allRegions.filter(r => String(r.country) === String(crud.form.country)) : allRegions,
    [crud.form.country, allRegions]
  );

  const regionMap = useMemo(() => Object.fromEntries(allRegions.map(r => [r.id, r.name])), [allRegions]);
  const countryOpts = useMemo(() => countries.map(c => ({ value: c.id, label: c.name })), [countries]);
  const regionFilterOpts = useMemo(() => allRegions.map(r => ({ value: r.id, label: r.name })), [allRegions]);
  const formRegionOpts = useMemo(() => formRegions.map(r => ({ value: r.id, label: r.name })), [formRegions]);

  const renderStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  const columns = useMemo(() => [
    {
      key: 'name', label: 'Name', render: r => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center"><Hotel className="w-4 h-4" /></div>
          <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.name}</button>
        </div>
      ),
    },
    { key: 'region', label: 'Region', render: r => <span className="text-sm text-ink-light dark:text-white/50">{regionMap[r.region] || r.region}</span> },
    {
      key: 'star_rating', label: 'Rating', render: r => (
        <span className="text-amber-500 text-sm tracking-wider" title={`${r.star_rating} stars`}>{renderStars(r.star_rating)}</span>
      ),
    },
    { key: 'contact_phone', label: 'Phone', render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.contact_phone || '-'}</span> },
    { key: 'status', label: 'Status', render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], [regionMap]);

  const onSubmit = e => {
    e.preventDefault();
    if (!validate(crud.form, rules)) return;
    crud.handleSubmit(crud.form);
  };

  const handleOpenCreate = () => { setImageFiles([]); crud.openCreate(); };
  const handleOpenEdit = (row) => { setImageFiles([]); crud.openEdit(row); };
  const closeModal = () => { clearErrors(); setImageFiles([]); crud.closeModal(); };
  const { form, setForm } = crud;

  return (
    <div className="space-y-6">
      <PageHeader
        searchValue={crud.search}
        onSearchChange={e => crud.setSearch(e.target.value)}
        onSearchSubmit={crud.handleSearch}
        searchPlaceholder="Search hotels..."
        onAdd={handleOpenCreate}
        addLabel="Add Hotel"
        filters={
          <FilterDropdown
            value={filterRegion}
            onChange={setFilterRegion}
            options={regionFilterOpts}
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
        title={viewing?.name || 'Hotel Details'}
        fields={viewing ? [
          { label: 'Hotel Name', value: viewing.name, colSpan: 2 },
          { label: 'Country', value: countries.find(c => c.id === viewing.country)?.name || viewing.country },
          { label: 'Region', value: regionMap[viewing.region] || viewing.region },
          { label: 'Star Rating', value: viewing.star_rating, type: 'stars' },
          { label: 'Phone', value: viewing.contact_phone },
          { label: 'Email', value: viewing.contact_email },
          { label: 'Website', value: viewing.website, type: 'link' },
          { label: 'Address', value: viewing.address, type: 'multiline', colSpan: 2 },
          { label: 'Check-in Time', value: viewing.check_in_time },
          { label: 'Check-out Time', value: viewing.check_out_time },
          { label: 'Location', value: viewing.latitude && viewing.longitude ? { lat: viewing.latitude, lng: viewing.longitude } : null, type: 'coords', colSpan: 2 },
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Hotel' : 'Add Hotel'} maxWidth="max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-3.5">
          <div className="grid grid-cols-3 gap-3.5">
            <Select label="Country" value={form.country} onChange={val => { setForm(f => ({ ...f, country: val, region: '' })); clearError('country'); }} required
              options={countryOpts} placeholder="Select Country" searchable error={errors.country} />
            <Select label="Region" value={form.region} onChange={val => { setForm(f => ({ ...f, region: val })); clearError('region'); }} required
              options={formRegionOpts} placeholder="Select Region" searchable error={errors.region} />
            <Select label="Star Rating" value={form.star_rating} onChange={val => setForm(f => ({ ...f, star_rating: parseInt(val) }))} options={STAR_OPTIONS} />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <Input label="Hotel Name" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }} required error={errors.name} />
            <Input label="Email" type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            <Input label="Phone" value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} />
            <TimePicker label="Check-in" value={form.check_in_time} onChange={val => setForm(f => ({ ...f, check_in_time: val }))} />
            <TimePicker label="Check-out" value={form.check_out_time} onChange={val => setForm(f => ({ ...f, check_out_time: val }))} />
          </div>
          <Textarea label="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2} />
          <ImageUpload
            files={imageFiles}
            onChange={setImageFiles}
            existing={crud.editing?.images || []}
            label="Hotel Images"
          />
          <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>
    </div>
  );
}

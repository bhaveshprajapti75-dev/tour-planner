import { useState, useEffect, useMemo } from 'react';
import { Hotel } from 'lucide-react';
import { hotelsAPI, geographyAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, Badge, ViewModal,
  Input, Select, Textarea, FilterDropdown, TimePicker, ImageUpload, MapLocationPicker,
} from '../../components/admin';

const DEFAULT_FORM = {
  country: '', region: '', name: '', city: '', star_rating: 3, hotel_type: '',
  address: '', description: '', contact_phone: '', contact_email: '', website: '',
  check_in_time: '', check_out_time: '', latitude: '', longitude: '',
  price_per_night: '', price_notes: '', display_order: 0, is_active: true,
};

const STAR_OPTIONS = [1, 2, 3, 4, 5].map(n => ({ value: n, label: `${n} Star` }));

export default function HotelsPage() {
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [filterRegion, setFilterRegion] = useState('');
  const [viewing, setViewing] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
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
      imageFiles.forEach(f => fd.append('images', f));
      removedImageIds.forEach(imgId => fd.append('remove_images', imgId));
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
    { key: 'city', label: 'City', render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.city || '-'}</span> },
    {
      key: 'star_rating', label: 'Rating', render: r => (
        <span className="text-amber-500 text-sm tracking-wider" title={`${r.star_rating} stars`}>{renderStars(r.star_rating)}</span>
      ),
    },
    { key: 'images', label: 'Images', render: r => {
      const imgs = r.images || [];
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
    { key: 'contact_phone', label: 'Phone', render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.contact_phone || '-'}</span> },
    { key: 'status', label: 'Status', render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], [regionMap]);

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
          { label: 'City', value: viewing.city },
          { label: 'Hotel Type', value: viewing.hotel_type },
          { label: 'Star Rating', value: viewing.star_rating, type: 'stars' },
          { label: 'Phone', value: viewing.contact_phone },
          { label: 'Email', value: viewing.contact_email },
          { label: 'Website', value: viewing.website, type: 'link' },
          { label: 'Description', value: viewing.description, type: 'multiline', colSpan: 2 },
          { label: 'Address', value: viewing.address, type: 'multiline', colSpan: 2 },
          { label: 'Check-in Time', value: viewing.check_in_time },
          { label: 'Check-out Time', value: viewing.check_out_time },
          { label: 'Price / Night', value: viewing.price_per_night ? `INR ${Number(viewing.price_per_night).toLocaleString()}` : '—' },
          { label: 'Price Notes', value: viewing.price_notes },
          { label: 'Display Order', value: viewing.display_order },
          { label: 'Location', value: viewing.latitude && viewing.longitude ? { lat: viewing.latitude, lng: viewing.longitude } : null, type: 'coords', colSpan: 2 },
          { label: 'Images', value: viewing.images?.length ? viewing.images : null, type: 'gallery', colSpan: 2 },
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Hotel' : 'Add Hotel'} maxWidth="max-w-5xl">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {/* Left Column */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Select label="Country" value={form.country} onChange={val => { setForm(f => ({ ...f, country: val, region: '' })); clearError('country'); }} required
                  options={countryOpts} placeholder="Select Country" searchable error={errors.country} />
                <Select label="Region" value={form.region} onChange={val => { setForm(f => ({ ...f, region: val })); clearError('region'); }} required
                  options={formRegionOpts} placeholder="Select Region" searchable error={errors.region} />
              </div>
              <Input label="Hotel Name" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }} required error={errors.name} />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                <Input label="Hotel Type" value={form.hotel_type} onChange={e => setForm(f => ({ ...f, hotel_type: e.target.value }))} />
                <Select label="Star Rating" value={form.star_rating} onChange={val => setForm(f => ({ ...f, star_rating: parseInt(val) }))} options={STAR_OPTIONS} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Phone" value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} />
                <Input label="Email" type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
                <Input label="Website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
              </div>
              <Textarea label="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2} />
              <Textarea label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <TimePicker label="Check-in" value={form.check_in_time} onChange={val => setForm(f => ({ ...f, check_in_time: val }))} />
                <TimePicker label="Check-out" value={form.check_out_time} onChange={val => setForm(f => ({ ...f, check_out_time: val }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Price / Night (INR)" type="number" step="0.01" value={form.price_per_night} onChange={e => setForm(f => ({ ...f, price_per_night: e.target.value }))} />
                <Input label="Price Notes" value={form.price_notes} onChange={e => setForm(f => ({ ...f, price_notes: e.target.value }))} placeholder="e.g. ₹18,000/night" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Latitude" type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} />
                <Input label="Longitude" type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Display Order" type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
                <div className="flex items-end pb-1">
                  <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />
                </div>
              </div>
              <ImageUpload
                files={imageFiles}
                onChange={setImageFiles}
                existing={(crud.editing?.images || []).filter(img => !removedImageIds.includes(img.id))}
                onRemoveExisting={(id) => setRemovedImageIds(prev => [...prev, id])}
                label="Hotel Images"
              />
            </div>
          </div>

          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>
    </div>
  );
}

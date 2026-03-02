import { useState, useEffect, useMemo } from 'react';
import { geographyAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, ViewModal,
  Input, Select, FilterDropdown,
} from '../../components/admin';

const DEFAULT_FORM = { country: '', name: '', code: '', description: '', is_active: true };

export default function RegionsPage() {
  const [countries, setCountries] = useState([]);
  const [filterCountry, setFilterCountry] = useState('');
  const [viewing, setViewing] = useState(null);
  const { errors, validate, clearError, clearErrors } = useFormValidation();

  useEffect(() => {
    geographyAPI.getCountries({ page_size: 100 }).then(res => setCountries(res.data.results || res.data)).catch(() => {});
  }, []);

  const crud = useCrudPage({
    fetcher: geographyAPI.getRegions,
    onCreate: geographyAPI.createRegion,
    onUpdate: geographyAPI.updateRegion,
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
    { key: 'status',  label: 'Status',  render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], [countryMap]);

  const rules = {
    country: v => !v && 'Please select a country',
    name: v => !v?.trim() && 'Region name is required',
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!validate(crud.form, rules)) return;
    crud.handleSubmit(crud.form);
  };

  const closeModal = () => { clearErrors(); crud.closeModal(); };

  return (
    <div className="space-y-6">
      <PageHeader
        searchValue={crud.search}
        onSearchChange={e => crud.setSearch(e.target.value)}
        onSearchSubmit={crud.handleSearch}
        searchPlaceholder="Search regions..."
        onAdd={crud.openCreate}
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
        renderActions={row => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.askDelete(row.id)} />}
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
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Region' : 'Add Region'}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Select label="Country" value={crud.form.country} onChange={val => { crud.setForm(f => ({ ...f, country: val })); clearError('country'); }} required
            options={countryOpts} placeholder="Select Country" searchable error={errors.country} />
          <Input label="Name" value={crud.form.name} onChange={e => { crud.setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }} required error={errors.name} />
          <Input label="Code" value={crud.form.code} onChange={e => crud.setForm(f => ({ ...f, code: e.target.value }))} />
          <Input label="Description" value={crud.form.description} onChange={e => crud.setForm(f => ({ ...f, description: e.target.value }))} />
          <ToggleSwitch label="Active" checked={crud.form.is_active} onChange={val => crud.setForm(f => ({ ...f, is_active: val }))} />
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>
    </div>
  );
}

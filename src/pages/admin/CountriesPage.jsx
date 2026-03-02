import { useState, useMemo } from 'react';
import { geographyAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, ViewModal, Input,
} from '../../components/admin';

const DEFAULT_FORM = { name: '', code: '', iso_code: '', is_active: true };

export default function CountriesPage() {
  const [viewing, setViewing] = useState(null);
  const { errors, validate, clearError, clearErrors } = useFormValidation();
  const crud = useCrudPage({
    fetcher: geographyAPI.getCountries,
    onCreate: geographyAPI.createCountry,
    onUpdate: geographyAPI.updateCountry,
    onDelete: geographyAPI.deleteCountry,
    defaultForm: DEFAULT_FORM,
  });

  const columns = useMemo(() => [
    { key: 'name',     label: 'Name',     render: r => <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.name}</button> },
    { key: 'code',     label: 'Code',     render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.code}</span> },
    { key: 'iso_code', label: 'ISO Code', render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.iso_code || '-'}</span> },
    { key: 'status',   label: 'Status',   render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], []);

  const rules = {
    name: v => !v?.trim() && 'Country name is required',
    code: v => !v?.trim() && 'Code is required',
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
        searchPlaceholder="Search countries..."
        onAdd={crud.openCreate}
        addLabel="Add Country"
      />

      <DataTable
        columns={columns}
        data={crud.data}
        loading={crud.loading}
        page={crud.page}
        totalPages={crud.totalPages}
        totalCount={crud.totalCount}
        onPageChange={crud.setPage}
        onEmptyAction={crud.openCreate}
        emptyActionLabel="Add your first country"
        renderActions={row => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.askDelete(row.id)} />}
      />

      <ConfirmDialog open={!!crud.confirmId} onConfirm={crud.confirmDelete} onCancel={crud.cancelDelete}
        message="This will permanently delete the country." />

      {/* View Modal */}
      <ViewModal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name || 'Country Details'}
        fields={viewing ? [
          { label: 'Name', value: viewing.name, colSpan: 2 },
          { label: 'Code', value: viewing.code },
          { label: 'ISO Code', value: viewing.iso_code },
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Country' : 'Add Country'}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Name" value={crud.form.name} onChange={e => { crud.setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }} required error={errors.name} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Code" value={crud.form.code} onChange={e => { crud.setForm(f => ({ ...f, code: e.target.value.toUpperCase() })); clearError('code'); }} required maxLength={3} error={errors.code} />
            <Input label="ISO Code" value={crud.form.iso_code} onChange={e => crud.setForm(f => ({ ...f, iso_code: e.target.value.toUpperCase() }))} maxLength={3} />
          </div>
          <ToggleSwitch label="Active" checked={crud.form.is_active} onChange={val => crud.setForm(f => ({ ...f, is_active: val }))} />
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>
    </div>
  );
}

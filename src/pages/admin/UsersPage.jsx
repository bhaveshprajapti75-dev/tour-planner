import { useState, useMemo } from 'react';
import { usersAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, RoleBadge, ViewModal,
  Input, Select, FilterDropdown,
} from '../../components/admin';

const DEFAULT_FORM = {
  name: '', email: '', phone: '', password: '',
  is_active: true, flag: false,
};

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'AGENT', label: 'Agent' },
  { value: 'USER', label: 'User' },
];

export default function UsersPage() {
  const [filterRole, setFilterRole] = useState('');
  const [viewing, setViewing] = useState(null);
  const { errors, validate, clearError, clearErrors } = useFormValidation();

  const crud = useCrudPage({
    fetcher: usersAPI.getUsers,
    onCreate: usersAPI.createUser,
    onUpdate: (id, data) => {
      const payload = { ...data };
      if (!payload.password) delete payload.password;
      return usersAPI.updateUser(id, payload);
    },
    onDelete: usersAPI.deleteUser,
    defaultForm: DEFAULT_FORM,
    filters: { role: filterRole || undefined },
  });

  const columns = useMemo(() => [
    {
      key: 'name', label: 'Name', render: r => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
            {(r.name || r.email)?.[0]?.toUpperCase() || 'U'}
          </div>
          <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">
            {r.name || r.email}
          </button>
        </div>
      ),
    },
    { key: 'email',  label: 'Email', render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.email}</span> },
    { key: 'phone',  label: 'Phone', render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.phone || '-'}</span> },
    { key: 'role',   label: 'Role',  render: r => <RoleBadge role={r.role} /> },
    { key: 'created_by', label: 'Created By', render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.created_by?.name || r.created_by?.email || '-'}</span> },
    { key: 'status', label: 'Status', render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], []);

  const onSubmit = e => {
    e.preventDefault();
    const rules = {
      email: v => (!v?.trim() ? 'Email is required' : !/\S+@\S+\.\S+/.test(v) && 'Enter a valid email address'),
      name: v => !v?.trim() && 'Name is required',
      password: (v, data) => !crud.editing && !v?.trim() && 'Password is required',
    };
    if (!validate(crud.form, rules)) return;
    crud.handleSubmit(crud.form);
  };
  const closeModal = () => { clearErrors(); crud.closeModal(); };
  const { form, setForm } = crud;

  return (
    <div className="space-y-6">
      <PageHeader
        searchValue={crud.search}
        onSearchChange={e => crud.setSearch(e.target.value)}
        onSearchSubmit={crud.handleSearch}
        searchPlaceholder="Search users..."
        onAdd={crud.openCreate}
        addLabel="Add User"
        filters={
          <FilterDropdown
            value={filterRole}
            onChange={setFilterRole}
            options={ROLE_OPTIONS}
            placeholder="All Roles"
          />
        }
      />

      <DataTable
        columns={columns} data={crud.data} loading={crud.loading}
        page={crud.page} totalPages={crud.totalPages} totalCount={crud.totalCount} onPageChange={crud.setPage}
        renderActions={row => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.askDelete(row.id)} />}
      />

      <ConfirmDialog open={!!crud.confirmId} onConfirm={crud.confirmDelete} onCancel={crud.cancelDelete}
        message="This will permanently delete the user account." />

      {/* View Modal */}
      <ViewModal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name || viewing?.email || 'User Details'}
        fields={viewing ? [
          { label: 'Name', value: viewing.name, colSpan: 2 },
          { label: 'Email', value: viewing.email, colSpan: 2 },
          { label: 'Phone', value: viewing.phone || '-' },
          { label: 'Role', value: ROLE_OPTIONS.find(r => r.value === viewing.role)?.label || viewing.role, type: 'badge', variant: viewing.role === 'SUPER_ADMIN' ? 'blue' : 'brand' },
          { label: 'Created By', value: viewing.created_by?.name || viewing.created_by?.email || '-' },
          { label: 'Content Access Flag', value: viewing.flag ? 'Yes' : 'No', type: 'badge', variant: viewing.flag ? 'green' : 'gray' },
          { label: 'Status', value: viewing.is_active, type: 'status' },
        ] : []}
      />

      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit User' : 'Add User'}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }} required error={errors.name} />
          <Input label="Email" type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); clearError('email'); }} required error={errors.email} />
          <Input label="Phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Input
            label={crud.editing ? 'New Password (leave blank to keep)' : 'Password'}
            type="password"
            value={form.password}
            onChange={e => { setForm(f => ({ ...f, password: e.target.value })); clearError('password'); }}
            required={!crud.editing}
            error={errors.password}
          />
          <ToggleSwitch label="Allow access to super admin content" checked={form.flag} onChange={val => setForm(f => ({ ...f, flag: val }))} />
          <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>
    </div>
  );
}

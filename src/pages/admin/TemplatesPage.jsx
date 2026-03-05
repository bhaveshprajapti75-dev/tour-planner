import { useState, useEffect, useMemo, useRef } from 'react';
import { PlusCircle, Trash2, ListChecks, Check } from 'lucide-react';
import { templatesAPI, geographyAPI, dayToursAPI, inclusionsAPI } from '../../services/api';
import useCrudPage from '../../hooks/useCrudPage';
import useFormValidation from '../../hooks/useFormValidation';
import toast from 'react-hot-toast';
import {
  DataTable, PageHeader, Modal, ModalActions,
  ConfirmDialog, ActionButtons, StatusToggle, ToggleSwitch, Badge, IconButton, ViewModal,
  Input, Select, Textarea, ReadOnlyInput,
} from '../../components/admin';

const DEFAULT_FORM = {
  country: '', name: '', total_nights: 0, total_days: 1,
  description: '', is_default: false, is_active: true,
};

export default function TemplatesPage() {
  const [countries, setCountries] = useState([]);
  const [dayTours, setDayTours] = useState([]);

  useEffect(() => {
    Promise.all([
      geographyAPI.getCountries({ page_size: 100 }),
      dayToursAPI.getDayTours({ page_size: 200 }),
    ]).then(([cRes, dtRes]) => {
      setCountries(cRes.data.results || cRes.data);
      setDayTours(dtRes.data.results || dtRes.data);
    }).catch(() => {});
  }, []);

  const crud = useCrudPage({
    fetcher: templatesAPI.getTemplates,
    onCreate: templatesAPI.createTemplate,
    onUpdate: templatesAPI.updateTemplate,
    onDelete: templatesAPI.deleteTemplate,
    defaultForm: DEFAULT_FORM,
  });

  const countryMap = useMemo(() => Object.fromEntries(countries.map(c => [c.id, c.name])), [countries]);
  const countryOpts = useMemo(() => countries.map(c => ({ value: c.id, label: c.name })), [countries]);
  const dayTourOpts = useMemo(() => dayTours.map(dt => ({ value: dt.id, label: `${dt.unique_code} — ${dt.activity_combination}` })), [dayTours]);

  // Day management
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDays, setTemplateDays] = useState([]);
  const [dayForm, setDayForm] = useState({ day_number: 1, day_tour: '', is_arrival_day: false, is_departure_day: false });
  const [savingDay, setSavingDay] = useState(false);
  const [viewing, setViewing] = useState(null);
  const { errors, validate, clearError, clearErrors } = useFormValidation();
  const { errors: dayErrors, validate: validateDay, clearError: clearDayError, clearErrors: clearDayErrors } = useFormValidation();

  // Inclusions management
  const [showInclModal, setShowInclModal] = useState(false);
  const [inclTemplate, setInclTemplate] = useState(null);
  const [countryInclusions, setCountryInclusions] = useState([]);
  const [attachedIds, setAttachedIds] = useState(new Set());
  const [originalAttachedIds, setOriginalAttachedIds] = useState(new Set());
  const [inclLoading, setInclLoading] = useState(false);
  const [inclSaving, setInclSaving] = useState(false);
  const savingRef = useRef(false);

  const templateRules = {
    country: v => !v && 'Please select a country',
    name: v => !v?.trim() && 'Template name is required',
    total_nights: (v) => (v === '' || v === undefined || v === null) && 'Nights is required',
  };

  const dayRules = {
    day_number: v => {
      if (v === '' || v === null || v === undefined) return 'Day number is required';
      const n = Number(v);
      if (isNaN(n) || n < 1) return 'Must be at least 1';
    },
    day_tour: v => !v && 'Please select a day tour',
  };

  const loadDays = async (tplId) => {
    try {
      const { data } = await templatesAPI.getDays({ template: tplId });
      const days = data.results || data;
      setTemplateDays(days);
      return days;
    } catch { return []; }
  };

  const openDays = (t) => {
    setSelectedTemplate(t);
    loadDays(t.id).then(days => {
      const maxDay = days && days.length > 0 ? Math.max(...days.map(d => d.day_number)) : 0;
      setDayForm({ day_number: Math.min(maxDay + 1, t.total_days), day_tour: dayTourOpts[0]?.value || '', is_arrival_day: false, is_departure_day: false });
    });
    setShowDayModal(true);
  };

  const handleAddDay = async (e) => {
    e.preventDefault();
    if (!validateDay(dayForm, dayRules)) return;
    setSavingDay(true);
    try {
      const payload = {
        ...dayForm,
        day_number: Number(dayForm.day_number),
        day_tour: Number(dayForm.day_tour),
      };
      await templatesAPI.addDay(selectedTemplate.id, payload);
      toast.success('Day added');
      clearDayErrors();
      const days = await loadDays(selectedTemplate.id);
      const maxDay = days.length > 0 ? Math.max(...days.map(d => d.day_number)) : 0;
      setDayForm(f => ({ ...f, day_number: Math.min(maxDay + 1, selectedTemplate.total_days) }));
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Show field-level errors below inputs via validateDay
        const rules = {};
        for (const [key, val] of Object.entries(data)) {
          const msg = Array.isArray(val) ? val[0] : val;
          rules[key] = () => msg;
        }
        validateDay(dayForm, rules);
        // Show non-field errors as toast
        if (data.non_field_errors) toast.error(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
      } else {
        toast.error(typeof data === 'string' ? data : 'Add day failed');
      }
    } finally {
      setSavingDay(false);
    }
  };

  const handleDeleteDay = async (dayId) => {
    try {
      await templatesAPI.deleteDay(dayId);
      toast.success('Day removed');
      const days = await loadDays(selectedTemplate.id);
      const maxDay = days.length > 0 ? Math.max(...days.map(d => d.day_number)) : 0;
      setDayForm(f => ({ ...f, day_number: Math.min(maxDay + 1, selectedTemplate.total_days) }));
    } catch (err) {
      const msg = err.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Failed to remove day');
    }
  };

  const openInclusions = async (tpl) => {
    setInclTemplate(tpl);
    setShowInclModal(true);
    setInclLoading(true);
    try {
      const { data } = await inclusionsAPI.getItems({ country: tpl.country, page_size: 200 });
      const items = data.results || data;
      setCountryInclusions(items);
      const linked = new Set((tpl.incl_excl || []).map(ie => ie.incl_excl));
      setAttachedIds(linked);
      setOriginalAttachedIds(linked);
    } catch { toast.error('Failed to load inclusions'); }
    finally { setInclLoading(false); }
  };

  const toggleAttach = (itemId) => {
    setAttachedIds(prev => {
      const n = new Set(prev);
      if (n.has(itemId)) n.delete(itemId); else n.add(itemId);
      return n;
    });
  };

  const inclHasChanges = useMemo(() => {
    if (attachedIds.size !== originalAttachedIds.size) return true;
    for (const id of attachedIds) { if (!originalAttachedIds.has(id)) return true; }
    return false;
  }, [attachedIds, originalAttachedIds]);

  const saveInclusions = async () => {
    if (!inclTemplate || inclSaving || savingRef.current) return;
    
    savingRef.current = true;
    setInclSaving(true);
    
    try {
      const toAttach = [...attachedIds].filter(id => !originalAttachedIds.has(id));
      const toRemove = [...originalAttachedIds].filter(id => !attachedIds.has(id));
      
      if (toAttach.length === 0 && toRemove.length === 0) {
        return;
      }
      
      const results = await Promise.allSettled([
        ...toAttach.map(id => templatesAPI.attachInclusion(inclTemplate.id, { incl_excl: id })),
        ...toRemove.map(id => templatesAPI.removeInclusion(inclTemplate.id, { incl_excl: id })),
      ]);

      const failures = results.filter(r => r.status === 'rejected');
      
      if (failures.length === 0) {
        setOriginalAttachedIds(new Set(attachedIds));
        toast.success('Inclusions updated successfully');
      } else if (failures.length === results.length) {
        toast.error('Failed to save inclusions');
      } else {
        setOriginalAttachedIds(new Set(attachedIds));
        toast.success(`Saved with ${failures.length} warning(s)`);
      }
      // Refresh table data silently
      try { await crud.load(); } catch { /* ignore refresh errors */ }
    } catch {
      toast.error('Failed to save inclusions');
    } finally {
      setInclSaving(false);
      savingRef.current = false;
    }
  };

  const columns = useMemo(() => [
    { key: 'name', label: 'Name', render: r => <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.name}</button> },
    { key: 'code', label: 'Code', render: r => <span className="text-sm font-mono text-ink-light dark:text-white/50">{r.code || '-'}</span> },
    { key: 'country', label: 'Country', render: r => <span className="text-sm text-ink-light dark:text-white/50">{countryMap[r.country] || r.country}</span> },
    {
      key: 'duration', label: 'Duration', render: r => (
        <Badge variant="brand">{r.total_days}D / {r.total_nights}N</Badge>
      ),
    },
    { key: 'is_default', label: 'Default', render: r => r.is_default ? <Badge variant="blue">Default</Badge> : <span className="text-xs text-ink-light dark:text-white/50">-</span> },
    { key: 'status', label: 'Status', render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], [countryMap]);

  const onSubmit = e => {
    e.preventDefault();
    if (!validate(crud.form, templateRules)) return;
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
        searchPlaceholder="Search templates..."
        onAdd={crud.openCreate}
        addLabel="Add Template"
      />

      <DataTable
        columns={columns} data={crud.data} loading={crud.loading}
        page={crud.page} totalPages={crud.totalPages} totalCount={crud.totalCount} onPageChange={crud.setPage}
        renderActions={row => (
          <>
            <IconButton icon={ListChecks} onClick={() => openInclusions(row)} title="Manage Inclusions" variant="brand" />
            <IconButton icon={PlusCircle} onClick={() => openDays(row)} title="Manage Days" variant="green" />
            <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.askDelete(row.id)} />
          </>
        )}
      />

      <ConfirmDialog open={!!crud.confirmId} onConfirm={crud.confirmDelete} onCancel={crud.cancelDelete} />

      {/* View Modal */}
      <ViewModal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name || 'Template Details'}
        fields={viewing ? [
          { label: 'Template Name', value: viewing.name, colSpan: 2 },
          { label: 'Code', value: viewing.code },
          { label: 'Country', value: countryMap[viewing.country] || viewing.country },
          { label: 'Duration', value: `${viewing.total_days} Days / ${viewing.total_nights} Nights`, type: 'badge', variant: 'brand' },
          { label: 'Default Template', value: viewing.is_default, type: 'status' },
          { label: 'Status', value: viewing.is_active, type: 'status' },
          { label: 'Description', value: viewing.description, type: 'multiline', colSpan: 2 },
        ] : []}
      />

      {/* Template Form Modal */}
      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Template' : 'Add Template'}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Select label="Country" value={form.country} onChange={val => { setForm(f => ({ ...f, country: val })); clearError('country'); }} required options={countryOpts} placeholder="Select" searchable error={errors.country} />
          <Input label="Template Name" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }} required error={errors.name} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nights" type="number" min={0} value={form.total_nights}
              onChange={e => { const n = parseInt(e.target.value); setForm(f => ({ ...f, total_nights: isNaN(n) ? 0 : Math.max(0, n), total_days: (isNaN(n) ? 0 : Math.max(0, n)) + 1 })); clearError('total_nights'); }} required error={errors.total_nights} />
            <ReadOnlyInput label="Days" value={form.total_days} />
          </div>
          <Textarea label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
          <div className="flex gap-6">
            <ToggleSwitch label="Default Template" checked={form.is_default} onChange={val => setForm(f => ({ ...f, is_default: val }))} />
            <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />
          </div>
          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>

      {/* Day Management Modal */}
      <Modal open={showDayModal} onClose={() => setShowDayModal(false)}
        title={`Manage Days — ${selectedTemplate?.name || ''}`} maxWidth="max-w-2xl">
        {selectedTemplate && (
          <>
            <p className="text-sm text-ink-light dark:text-white/50 mb-4">
              {selectedTemplate.total_days} Days / {selectedTemplate.total_nights} Nights
            </p>

            {/* Existing Days */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-ink dark:text-white mb-3">Current Days</h4>
              {templateDays.length === 0 ? (
                <p className="text-sm text-ink-light dark:text-white/50">No days added yet</p>
              ) : (
                <div className="space-y-2">
                  {[...templateDays].sort((a, b) => a.day_number - b.day_number).map(day => (
                    <div key={day.id} className="flex items-center justify-between bg-canvas dark:bg-d-surface rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-bold text-sm">{day.day_number}</span>
                        <div>
                          <span className="text-sm font-bold text-ink dark:text-white">
                            {dayTours.find(dt => dt.id === day.day_tour)?.activity_combination || `Tour #${day.day_tour}`}
                          </span>
                          <div className="flex gap-2 mt-0.5">
                            {day.is_arrival_day && <Badge variant="blue">Arrival</Badge>}
                            {day.is_departure_day && <Badge variant="orange">Departure</Badge>}
                          </div>
                        </div>
                      </div>
                      <IconButton icon={Trash2} onClick={() => handleDeleteDay(day.id)} variant="red" title="Remove" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Day Form */}
            <form onSubmit={handleAddDay} className="space-y-4 border-t border-gray-100 dark:border-white/[0.08] pt-4">
              <h4 className="text-sm font-bold text-ink dark:text-white">Add Day</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Day Number" type="number" min={1} max={selectedTemplate.total_days} value={dayForm.day_number}
                  onChange={e => { setDayForm(f => ({ ...f, day_number: e.target.value })); clearDayError('day_number'); }} required error={dayErrors.day_number} />
                <Select label="Day Tour" value={dayForm.day_tour} onChange={val => { setDayForm(f => ({ ...f, day_tour: val })); clearDayError('day_tour'); }} required
                  options={dayTourOpts} placeholder="Select Tour" searchable error={dayErrors.day_tour} />
              </div>
              <div className="flex gap-6">
                <ToggleSwitch label="Arrival Day" checked={dayForm.is_arrival_day} onChange={val => setDayForm(f => ({ ...f, is_arrival_day: val }))} />
                <ToggleSwitch label="Departure Day" checked={dayForm.is_departure_day} onChange={val => setDayForm(f => ({ ...f, is_departure_day: val }))} />
              </div>
              <button type="submit" disabled={savingDay}
                className="w-full py-2 rounded-lg bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors shadow-sm cursor-pointer disabled:opacity-60">
                {savingDay ? 'Adding...' : 'Add Day'}
              </button>
            </form>
          </>
        )}
      </Modal>

      {/* Inclusions Management Modal */}
      <Modal open={showInclModal} onClose={() => setShowInclModal(false)}
        title={`Manage Inclusions — ${inclTemplate?.name || ''}`} maxWidth="max-w-2xl">
        {inclTemplate && (
          <>
            <p className="text-sm text-ink-light dark:text-white/50 mb-5">
              Toggle to attach/detach inclusions & exclusions for this template.
            </p>
            {inclLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            ) : countryInclusions.length === 0 ? (
              <p className="text-sm text-ink-light dark:text-white/50 text-center py-8">No inclusions found for this country. Add them from the Inclusions page first.</p>
            ) : (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                {['INCLUSION', 'EXCLUSION'].map(type => {
                  const items = countryInclusions.filter(i => i.type === type);
                  if (items.length === 0) return null;
                  return (
                    <div key={type}>
                      <h4 className={`text-sm font-extrabold uppercase tracking-wider mb-3 ${type === 'INCLUSION' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {type === 'INCLUSION' ? 'Inclusions' : 'Exclusions'}
                      </h4>
                      <div className="space-y-1.5">
                        {items.map(item => {
                          const attached = attachedIds.has(item.id);
                          return (
                            <button key={item.id} type="button" onClick={() => toggleAttach(item.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border
                                ${attached
                                  ? 'bg-brand/5 border-brand/20'
                                  : 'bg-canvas dark:bg-d-surface border-gray-100 dark:border-white/[0.06] hover:border-brand/15'}`}>
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2 transition-all
                                ${attached ? 'bg-brand border-brand' : 'border-gray-300 dark:border-white/20'}`}>
                                {attached && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-ink dark:text-white">{item.item_service}</span>
                                {item.details_notes && <p className="text-xs text-ink-light dark:text-white/40 mt-0.5 line-clamp-1">{item.details_notes}</p>}
                              </div>
                              <Badge variant={type === 'INCLUSION' ? 'green' : 'red'}>{type}</Badge>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.08] flex items-center justify-between">
              <p className="text-xs text-ink-light dark:text-white/40">
                <strong>{attachedIds.size}</strong> item{attachedIds.size !== 1 ? 's' : ''} attached to this template
              </p>
              <button
                type="button"
                onClick={saveInclusions}
                disabled={!inclHasChanges || inclSaving}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer
                  ${inclHasChanges
                    ? 'bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/20'
                    : 'bg-gray-100 dark:bg-white/10 text-ink-light dark:text-white/30 cursor-not-allowed'}`}
              >
                {inclSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

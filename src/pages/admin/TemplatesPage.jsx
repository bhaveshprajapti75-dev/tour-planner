import { useState, useEffect, useMemo, useRef } from 'react';
import { Star, ListChecks, Check } from 'lucide-react';
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
  country: '', region: '', name: '',
  description: '', travel_type: '', includes_night: false,
  is_default: false, is_active: true,
  // Day Tour — merged into form (for the single ItineraryTemplateDay)
  day_tour: '',
};

const TRAVEL_TYPE_OPTS = [
  { value: '', label: 'Any' },
  { value: 'COUPLE', label: 'Couple' },
  { value: 'GROUP', label: 'Group' },
  { value: 'SOLO', label: 'Solo' },
];

export default function TemplatesPage() {
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [dayTours, setDayTours] = useState([]);
  const [dayToursLoading, setDayToursLoading] = useState(false);

  // Load countries and all day-tours on mount
  useEffect(() => {
    geographyAPI.getCountries({ page_size: 100 }).then(r => setCountries(r.data.results || r.data)).catch(() => { });
    dayToursAPI.getDayTours({ page_size: 500 }).then(r => setDayTours(r.data.results || r.data)).catch(() => { });
  }, []);

  const crud = useCrudPage({
    fetcher: templatesAPI.getTemplates,
    onCreate: templatesAPI.createTemplate,
    onUpdate: templatesAPI.updateTemplate,
    onDelete: templatesAPI.deleteTemplate,
    defaultForm: DEFAULT_FORM,
  });

  const { form, setForm } = crud;

  // When country changes in the form, load regions for that country
  useEffect(() => {
    if (!form.country) { setRegions([]); return; }
    setRegionsLoading(true);
    geographyAPI.getRegions({ country: form.country, page_size: 100 })
      .then(r => setRegions(r.data.results || r.data))
      .catch(() => setRegions([]))
      .finally(() => setRegionsLoading(false));
  }, [form.country]);

  // When region changes in the form, filter day tours to that region
  useEffect(() => {
    if (!form.region) { return; }
    setDayToursLoading(true);
    dayToursAPI.getDayTours({ region: form.region, page_size: 500 })
      .then(r => setDayTours(r.data.results || r.data))
      .catch(() => { })
      .finally(() => setDayToursLoading(false));
  }, [form.region]);

  const countryMap = useMemo(() => Object.fromEntries(countries.map(c => [c.id, c.name])), [countries]);
  const countryOpts = useMemo(() => countries.map(c => ({ value: c.id, label: c.name })), [countries]);
  const regionOpts = useMemo(() => regions.map(r => ({ value: r.id, label: r.name })), [regions]);
  const dayTourOpts = useMemo(() => dayTours.map(dt => ({ value: dt.id, label: `${dt.unique_code} — ${dt.activity_combination}` })), [dayTours]);

  const [viewing, setViewing] = useState(null);

  // Set as Default
  const [settingDefault, setSettingDefault] = useState(null);
  const handleSetDefault = async (row) => {
    setSettingDefault(row.id);
    try {
      await templatesAPI.setDefaultTemplate(row.id);
      toast.success(`"${row.name}" is now the default for ${row.region_name || 'this region'}`);
      crud.load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to set default';
      toast.error(msg);
    } finally {
      setSettingDefault(null);
    }
  };

  // Inclusions management
  const [showInclModal, setShowInclModal] = useState(false);
  const [inclTemplate, setInclTemplate] = useState(null);
  const [countryInclusions, setCountryInclusions] = useState([]);
  const [attachedIds, setAttachedIds] = useState(new Set());
  const [originalAttachedIds, setOriginalAttachedIds] = useState(new Set());
  const [inclLoading, setInclLoading] = useState(false);
  const [inclSaving, setInclSaving] = useState(false);
  const savingRef = useRef(false);

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
      setOriginalAttachedIds(new Set(linked));
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
      if (toAttach.length === 0 && toRemove.length === 0) return;
      const results = await Promise.allSettled([
        ...toAttach.map(id => templatesAPI.attachInclusion(inclTemplate.id, { incl_excl: id })),
        ...toRemove.map(id => templatesAPI.removeInclusion(inclTemplate.id, { incl_excl: id })),
      ]);
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length === 0) {
        setOriginalAttachedIds(new Set(attachedIds));
        toast.success('Inclusions updated successfully');
      } else {
        setOriginalAttachedIds(new Set(attachedIds));
        toast.success(`Saved with ${failures.length} warning(s)`);
      }
      try { await crud.load(); } catch { /* ignore */ }
    } catch { toast.error('Failed to save inclusions'); }
    finally { setInclSaving(false); savingRef.current = false; }
  };

  // Form validation
  const { errors, validate, clearError, clearErrors } = useFormValidation();
  const templateRules = {
    country: v => !v && 'Please select a country',
    region: v => !v && 'Please select a region/city',
    name: v => !v?.trim() && 'Template name is required',
    day_tour: v => !v && 'Please select the day tour for this template',
  };

  const columns = useMemo(() => [
    { key: 'name', label: 'Name', render: r => <button type="button" onClick={() => setViewing(r)} className="text-sm font-bold text-brand hover:underline cursor-pointer text-left">{r.name}</button> },
    { key: 'code', label: 'Code', render: r => <span className="text-sm font-mono text-ink-light dark:text-white/50">{r.code || '-'}</span> },
    { key: 'country', label: 'Country', render: r => <span className="text-sm text-ink-light dark:text-white/50">{countryMap[r.country] || '-'}</span> },
    { key: 'region_name', label: 'City', render: r => <span className="text-sm text-ink-light dark:text-white/50">{r.region_name || '—'}</span> },
    {
      key: 'type', label: 'Type', render: r => (
        <Badge variant={r.includes_night ? 'brand' : 'blue'}>
          {r.includes_night ? '1D / 1N' : '1D only'}
        </Badge>
      ),
    },
    { key: 'is_default', label: 'Default', render: r => r.is_default ? <Badge variant="orange">Default</Badge> : <span className="text-xs text-ink-light dark:text-white/50">-</span> },
    { key: 'status', label: 'Status', render: r => <StatusToggle active={r.is_active} onChange={() => crud.toggleActive(r)} /> },
  ], [countryMap]);

  // When opening edit, pre-load region list and existing day_tour
  const handleEdit = async (row) => {
    // Load region's day tours for this row's region
    if (row.region) {
      dayToursAPI.getDayTours({ region: row.region, page_size: 500 })
        .then(r => setDayTours(r.data.results || r.data))
        .catch(() => { });
    }
    // Pre-load regions for this country
    if (row.country) {
      geographyAPI.getRegions({ country: row.country, page_size: 100 })
        .then(r => setRegions(r.data.results || r.data))
        .catch(() => { });
    }
    // Get existing day_tour from template's days
    const existingDayTour = row.days?.[0]?.day_tour || '';
    crud.openEdit({ ...row, day_tour: existingDayTour });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validate(form, templateRules)) return;

    // Build payload — backend handles day_tour → ItineraryTemplateDay via addDay action
    const payload = {
      country: form.country,
      region: form.region || null,
      name: form.name,
      description: form.description,
      travel_type: form.travel_type || null,
      includes_night: form.includes_night,
      is_default: form.is_default,
      is_active: form.is_active,
    };

    try {
      let templateId;
      if (crud.editing) {
        await templatesAPI.updateTemplate(crud.editing.id, payload);
        templateId = crud.editing.id;
      } else {
        const { data } = await templatesAPI.createTemplate(payload);
        templateId = data.id;
      }
      // Save/update the single day (day_number=1) — uses addDay action which upserts
      if (form.day_tour) {
        try {
          await templatesAPI.addDay(templateId, {
            day_number: 1,
            day_tour: Number(form.day_tour),
          });
        } catch {
          // Day tour attachment failed but template itself was saved
          toast.error('Template saved but day tour could not be attached');
        }
      }
      toast.success(crud.editing ? 'Template updated' : 'Template created');
      clearErrors();
      crud.closeModal();
      crud.load();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const rules = {};
        for (const [key, val] of Object.entries(data)) {
          const msg = Array.isArray(val) ? val[0] : val;
          rules[key] = () => msg;
        }
        validate(form, rules);
        if (data.non_field_errors) toast.error(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
      } else {
        toast.error('Save failed');
      }
    }
  };

  const closeModal = () => { clearErrors(); crud.closeModal(); };

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
            {/* Set as Default — only for region-scoped templates */}
            {row.region && !row.is_default && (
              <IconButton
                icon={Star}
                onClick={() => handleSetDefault(row)}
                title="Set as Default for this region"
                variant="orange"
                disabled={settingDefault === row.id}
              />
            )}
            <IconButton icon={ListChecks} onClick={() => openInclusions(row)} title="Manage Inclusions" variant="brand" />
            <ActionButtons onEdit={() => handleEdit(row)} onDelete={() => crud.askDelete(row.id)} />
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
          { label: 'City / Region', value: viewing.region_name || '—' },
          { label: 'Type', value: viewing.includes_night ? '1 Day + 1 Night' : '1 Day only', type: 'badge', variant: viewing.includes_night ? 'brand' : 'blue' },
          { label: 'Default Template', value: viewing.is_default, type: 'status' },
          { label: 'Status', value: viewing.is_active, type: 'status' },
          { label: 'Description', value: viewing.description, type: 'multiline', colSpan: 2 },
        ] : []}
      />

      {/* Template Create / Edit Modal — Day management merged in */}
      <Modal open={crud.showModal} onClose={closeModal} title={crud.editing ? 'Edit Template' : 'Add Template'} maxWidth="max-w-xl">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Country → Region cascade */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Country" value={form.country} required
              onChange={val => { setForm(f => ({ ...f, country: val, region: '' })); clearError('country'); }}
              options={countryOpts} placeholder="Select country" searchable error={errors.country}
            />
            <Select
              label="City / Region" value={form.region} required
              onChange={val => { setForm(f => ({ ...f, region: val })); clearError('region'); }}
              options={regionOpts} placeholder={regionsLoading ? 'Loading...' : 'Select city'}
              searchable error={errors.region} disabled={!form.country || regionsLoading}
            />
          </div>

          <Input label="Template Name" value={form.name} required
            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }}
            error={errors.name}
          />

          {/* Day Tour — the activity for this single-day template */}
          <Select
            label="Day Tour (Activities for this day)" value={form.day_tour} required
            onChange={val => { setForm(f => ({ ...f, day_tour: val })); clearError('day_tour'); }}
            options={dayTourOpts}
            placeholder={dayToursLoading ? 'Loading tours...' : (!form.region ? 'Select a region first' : 'Select day tour')}
            searchable error={errors.day_tour} disabled={!form.region || dayToursLoading}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Travel Type" value={form.travel_type}
              onChange={val => setForm(f => ({ ...f, travel_type: val }))}
              options={TRAVEL_TYPE_OPTS} placeholder="Any"
            />
            {/* Show computed type as read-only */}
            <ReadOnlyInput label="Duration" value={form.includes_night ? '1 Day + 1 Night' : '1 Day only'} />
          </div>

          <Textarea label="Description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
          />

          <div className="flex gap-6 flex-wrap">
            <ToggleSwitch
              label="Includes Night Stay"
              checked={form.includes_night}
              onChange={val => setForm(f => ({ ...f, includes_night: val }))}
            />
            <ToggleSwitch label="Default for City" checked={form.is_default} onChange={val => setForm(f => ({ ...f, is_default: val }))} />
            <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />
          </div>

          <ModalActions onCancel={closeModal} saving={crud.saving} isEdit={!!crud.editing} />
        </form>
      </Modal>

      {/* Inclusions Management Modal */}
      <Modal open={showInclModal} onClose={() => setShowInclModal(false)}
        title={`Manage Inclusions — ${inclTemplate?.name || ''}`} maxWidth="max-w-2xl">
        {inclTemplate && (
          <>
            <p className="text-sm text-ink-light dark:text-white/50 mb-5">
              Toggle to attach/detach inclusions &amp; exclusions for this template.
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
                                ${attached ? 'bg-brand/5 border-brand/20' : 'bg-canvas dark:bg-d-surface border-gray-100 dark:border-white/[0.06] hover:border-brand/15'}`}>
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
                <strong>{attachedIds.size}</strong> item{attachedIds.size !== 1 ? 's' : ''} attached
              </p>
              <button type="button" onClick={saveInclusions} disabled={!inclHasChanges || inclSaving}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer
                  ${inclHasChanges ? 'bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/20' : 'bg-gray-100 dark:bg-white/10 text-ink-light dark:text-white/30 cursor-not-allowed'}`}>
                {inclSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

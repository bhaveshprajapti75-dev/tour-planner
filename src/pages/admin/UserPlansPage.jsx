import { useState, useEffect, useCallback, useRef } from 'react';
import { plansAPI, geographyAPI } from '../../services/api';
import { FileText, Loader2, Trash2, Eye, Clock, MapPin, CalendarDays, Search, ChevronLeft, ChevronRight, User, X, Filter, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  DRAFT: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  CONFIRMED: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  SHARED: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  ARCHIVED: 'bg-gray-50 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400',
};

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'SHARED', label: 'Shared' },
  { value: 'ARCHIVED', label: 'Archived' },
];

function CustomDropdown({ value, onChange, options, placeholder = "Select...", minWidth = "140px" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => String(o.value) === String(value));

  return (
    <div className="relative" style={{ minWidth }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-d-card border border-gray-200 dark:border-white/[0.08] rounded-2xl text-sm font-bold text-ink dark:text-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all cursor-pointer"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-ink-light dark:text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute top-full left-0 right-0 mt-2 p-1 bg-white dark:bg-d-card border border-gray-100 dark:border-white/[0.08] rounded-2xl shadow-xl shadow-ink/5 dark:shadow-black/20 z-50 overflow-hidden"
          >
            <div className="max-h-[240px] overflow-y-auto overflow-x-hidden">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${String(value) === String(opt.value)
                    ? 'bg-brand/10 text-brand'
                    : 'text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface'
                    }`}
                >
                  {opt.icon && <opt.icon className="w-4 h-4 opacity-70" />}
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UserPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [countries, setCountries] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const pageSize = 15;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load countries for filter
  useEffect(() => {
    geographyAPI.getCountries({ page_size: 100 }).then(({ data }) => {
      setCountries(data.results || []);
    }).catch(() => { });
  }, []);

  useEffect(() => {
    loadPlans();
  }, [page, statusFilter, countryFilter, debouncedSearch]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const params = { page, page_size: pageSize };
      if (statusFilter) params.status = statusFilter;
      if (countryFilter) params.country = countryFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      const { data } = await plansAPI.getPlans(params);
      setPlans(data.results || []);
      setCount(data.count || 0);
    } catch {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await plansAPI.deletePlan(id);
      toast.success('Plan deleted');
      loadPlans();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const totalPages = Math.ceil(count / pageSize);
  const activeFilters = [statusFilter, countryFilter, debouncedSearch].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-ink dark:text-white">User Plans</h2>
          <p className="text-sm text-ink-light dark:text-white/50 font-medium">
            {count} {count === 1 ? 'plan' : 'plans'} found
            {activeFilters > 0 && <span className="ml-1 text-brand">({activeFilters} filter{activeFilters > 1 ? 's' : ''} active)</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light dark:text-white/40" />
          <input
            type="text"
            placeholder="Search by name, plan number, user, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-white dark:bg-d-card border border-gray-200 dark:border-white/[0.08] rounded-2xl text-sm font-medium text-ink dark:text-white placeholder:text-ink-light/50 dark:placeholder:text-white/30 focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ink/10 dark:bg-white/10 flex items-center justify-center hover:bg-ink/20 dark:hover:bg-white/20 transition-all cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="z-10 w-full sm:w-auto">
          <CustomDropdown
            value={countryFilter}
            onChange={(val) => { setCountryFilter(val); setPage(1); }}
            options={[{ value: '', label: 'All Countries' }, ...countries.map(c => ({ value: c.id, label: c.name }))]}
            placeholder="All Countries"
            minWidth="160px"
          />
        </div>
        <div className="z-10 w-full sm:w-auto">
          <CustomDropdown
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            options={STATUS_OPTIONS}
            placeholder="All Status"
            minWidth="140px"
          />
        </div>
        {activeFilters > 0 && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setCountryFilter(''); setPage(1); }}
            className="px-4 py-3 text-sm font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 text-ink/50 dark:text-white/40">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No plans found</p>
          {activeFilters > 0 && <p className="text-sm mt-2">Try adjusting your filters</p>}
        </div>
      ) : (
        <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-ink-light dark:text-white/50 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08]">
                  <th className="px-4 py-3 font-bold w-12">#</th>
                  <th className="px-6 py-3 font-bold">Plan</th>
                  <th className="px-6 py-3 font-bold">User</th>
                  <th className="px-6 py-3 font-bold">Country</th>
                  <th className="px-6 py-3 font-bold">Duration</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold">Created</th>
                  <th className="px-6 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, idx) => (
                  <tr key={plan.id} className="hover:bg-canvas dark:hover:bg-d-surface transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                    <td className="px-4 py-4 text-sm font-bold text-ink-light dark:text-white/40">
                      {((page - 1) * pageSize) + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <button
                          onClick={() => setSelectedPlan(plan)}
                          className="font-bold text-sm text-brand hover:text-brand-hover hover:underline underline-offset-2 cursor-pointer text-left transition-colors"
                        >
                          {plan.name}
                        </button>
                        <div className="text-xs text-ink-light dark:text-white/40 mt-0.5">{plan.plan_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold">
                          {(plan.user_name || plan.user_email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ink dark:text-white">{plan.user_name || '—'}</div>
                          <div className="text-xs text-ink-light dark:text-white/40">{plan.user_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink dark:text-white font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand" /> {plan.country_name || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink-light dark:text-white/50 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {plan.total_days}D / {plan.total_nights}N
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${STATUS_COLORS[(plan.status || '').toUpperCase()] || STATUS_COLORS.DRAFT}`}>
                        {(plan.status || '').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-light dark:text-white/50">
                      {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="View Details"
                          onClick={() => setSelectedPlan(plan)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-canvas dark:bg-d-surface text-ink-light dark:text-white/50 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(plan.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.08]">
            <span className="text-xs font-medium text-ink-light dark:text-white/40">
              Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, count)} of {count}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-canvas dark:bg-d-surface border border-gray-200 dark:border-white/[0.08] text-ink-light hover:text-ink transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-canvas dark:bg-d-surface border border-gray-200 dark:border-white/[0.08] text-ink-light hover:text-ink transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <PlanModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlanModal({ plan, onClose }) {
  const days = (plan.days || []).sort((a, b) => a.day_number - b.day_number);
  const inclExcl = plan.incl_excl || [];
  const inclusions = inclExcl.filter(i => i.type === 'INCLUSION');
  const exclusions = inclExcl.filter(i => i.type === 'EXCLUSION');

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-4 sm:inset-8 md:inset-y-8 md:inset-x-[10%] lg:inset-x-[15%] bg-white dark:bg-d-card rounded-3xl z-50 overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-white/[0.08]"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/[0.08] shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-ink dark:text-white">{plan.name}</h2>
            <p className="text-sm text-ink-light dark:text-white/50 font-medium mt-0.5">
              {plan.plan_number} • {plan.country_name} • {plan.total_days}D/{plan.total_nights}N
              {plan.start_date && ` • Start: ${plan.start_date.split('-').reverse().join('/')}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-canvas dark:bg-d-surface border border-gray-200 dark:border-white/[0.08] text-ink-light hover:text-ink dark:hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body — scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'User', value: plan.user_name || plan.user_email || '—', icon: User },
              { label: 'Country', value: plan.country_name || '—', icon: MapPin },
              { label: 'Duration', value: `${plan.total_days}D / ${plan.total_nights}N`, icon: Clock },
              { label: 'Status', value: (plan.status || '').toUpperCase(), icon: FileText },
            ].map(item => (
              <div key={item.label} className="bg-canvas dark:bg-d-surface p-4 rounded-2xl border border-gray-100 dark:border-white/[0.08]">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4 text-brand" />
                  <span className="text-xs font-bold text-ink-light dark:text-white/50 uppercase">{item.label}</span>
                </div>
                <div className="font-bold text-ink dark:text-white text-sm">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Client info */}
          {plan.client_name && (
            <div className="bg-canvas dark:bg-d-surface p-5 rounded-2xl border border-gray-100 dark:border-white/[0.08]">
              <h4 className="font-bold text-xs uppercase text-ink-light dark:text-white/50 mb-3">Client Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {plan.client_name && <div><span className="text-ink-light dark:text-white/40">Name:</span> <span className="font-bold text-ink dark:text-white">{plan.client_name}</span></div>}
                {plan.client_email && <div><span className="text-ink-light dark:text-white/40">Email:</span> <span className="font-bold text-ink dark:text-white">{plan.client_email}</span></div>}
                {plan.client_phone && <div><span className="text-ink-light dark:text-white/40">Phone:</span> <span className="font-bold text-ink dark:text-white">{plan.client_phone}</span></div>}
              </div>
            </div>
          )}

          {/* Day-by-day */}
          {days.length > 0 && (
            <div className="bg-canvas dark:bg-d-surface rounded-2xl border border-gray-100 dark:border-white/[0.08] overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-white/[0.08]">
                <h3 className="font-bold text-lg text-ink dark:text-white">Day-by-Day Itinerary</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                {days.map(day => (
                  <div key={day.id} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold text-sm shrink-0">
                      {day.day_number}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-ink dark:text-white">{day.day_tour_name || 'Day Tour'}</div>
                      {day.region_name && <div className="text-xs text-ink-light dark:text-white/40 mt-0.5">{day.region_name}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          {inclExcl.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-canvas dark:bg-d-surface rounded-2xl border border-gray-100 dark:border-white/[0.08] p-5">
                <h4 className="font-bold text-sm text-green-600 dark:text-green-400 uppercase mb-3">Inclusions</h4>
                {inclusions.length === 0 ? (
                  <p className="text-sm text-ink-light dark:text-white/40 italic">None</p>
                ) : (
                  <ul className="space-y-2">
                    {inclusions.map(item => (
                      <li key={item.id} className="flex items-start gap-2 text-sm text-ink/70 dark:text-white/60">
                        <span className="text-green-500 font-bold shrink-0">✓</span>
                        <span>{item.item_text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-canvas dark:bg-d-surface rounded-2xl border border-gray-100 dark:border-white/[0.08] p-5">
                <h4 className="font-bold text-sm text-red-500 uppercase mb-3">Exclusions</h4>
                {exclusions.length === 0 ? (
                  <p className="text-sm text-ink-light dark:text-white/40 italic">None</p>
                ) : (
                  <ul className="space-y-2">
                    {exclusions.map(item => (
                      <li key={item.id} className="flex items-start gap-2 text-sm text-ink/70 dark:text-white/60">
                        <span className="text-red-400 font-bold shrink-0">✗</span>
                        <span>{item.item_text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {plan.notes && (
            <div className="bg-canvas dark:bg-d-surface p-5 rounded-2xl border border-gray-100 dark:border-white/[0.08]">
              <h4 className="font-bold text-xs uppercase text-ink-light dark:text-white/50 mb-2">Notes</h4>
              <p className="text-sm text-ink/70 dark:text-white/60">{plan.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

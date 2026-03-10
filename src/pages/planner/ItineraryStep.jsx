import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Check, Download, Share2, Plane, Hotel, Clock,
  Route, Receipt, ChevronDown, ChevronUp,
  Pencil, X, Loader2
} from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

/* ── Helper: group consecutive days by region into city blocks ── */
function groupDaysByCity(days) {
  const groups = [];
  for (const day of days) {
    const last = groups[groups.length - 1];
    if (last && last.regionId === day.regionId) {
      last.days.push(day);
    } else {
      groups.push({
        regionId: day.regionId,
        regionName: day.regionName || 'Unknown',
        days: [day],
      });
    }
  }
  return groups;
}

/* ── City color palette (cycles) ── */
const CITY_COLORS = [
  { border: 'border-l-brand',      text: 'text-brand',      bg: 'bg-brand/10',    headerBg: 'from-brand/5 to-transparent' },
  { border: 'border-l-rose-500',   text: 'text-rose-500',   bg: 'bg-rose-500/10', headerBg: 'from-rose-500/5 to-transparent' },
  { border: 'border-l-amber-500',  text: 'text-amber-500',  bg: 'bg-amber-500/10',headerBg: 'from-amber-500/5 to-transparent' },
  { border: 'border-l-emerald-500',text: 'text-emerald-500',bg: 'bg-emerald-500/10',headerBg: 'from-emerald-500/5 to-transparent' },
  { border: 'border-l-sky-500',    text: 'text-sky-500',    bg: 'bg-sky-500/10',  headerBg: 'from-sky-500/5 to-transparent' },
  { border: 'border-l-purple-500', text: 'text-purple-500', bg: 'bg-purple-500/10',headerBg: 'from-purple-500/5 to-transparent' },
];

/* ── Mobile Summary ── */
function MobileSummary({ cityGroups, selectedCountry, draftPlan, totalDays, totalNights, travelType, dayTourTotal }) {
  const [expanded, setExpanded] = useState(false);
  const planInclExcl = draftPlan?.incl_excl || [];
  const inclusions = planInclExcl.filter(ie => ie.type === 'INCLUSION');
  const exclusions = planInclExcl.filter(ie => ie.type === 'EXCLUSION');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
      className="lg:hidden mt-10 bg-white dark:bg-d-card rounded-3xl border border-gray-200 dark:border-white/[0.08] shadow-lg overflow-hidden"
    >
      <div className="p-6 bg-gradient-to-br from-brand to-brand-hover text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Quotation Summary</div>
            <div className="text-3xl font-bold tracking-tight">
              {dayTourTotal > 0 ? `INR ${dayTourTotal.toLocaleString()}` : 'Custom Tour'}
            </div>
          </div>
          <Receipt className="w-8 h-8 text-white/30" />
        </div>
        <div className="flex gap-4 mt-4 text-xs font-bold text-white/70">
          <span>{totalDays}D / {totalNights}N</span>
          <span>•</span>
          <span>{selectedCountry?.name}</span>
          {travelType && <><span>•</span><span>{travelType}</span></>}
        </div>
      </div>

      {/* City-wise route */}
      <div className="p-5 space-y-3">
        {cityGroups.map((group, i) => (
          <div key={`${group.regionId}-${i}`} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/[0.06] last:border-0">
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${CITY_COLORS[i % CITY_COLORS.length].text}`} />
              <span className="font-bold text-ink dark:text-white text-sm">{group.regionName}</span>
            </div>
            <span className="text-xs font-bold text-ink/50 dark:text-white/40">{group.days.length} {group.days.length === 1 ? 'Night' : 'Nights'}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-canvas dark:bg-d-surface text-sm font-bold text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
      >
        {expanded ? 'Hide' : 'View'} Inclusions & Exclusions
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5 space-y-4">
          <div>
            <h4 className="font-bold text-xs uppercase text-brand mb-2">Included</h4>
            {inclusions.length === 0 && <p className="text-xs text-ink-light dark:text-white/40">No inclusions</p>}
            <ul className="space-y-1.5">
              {inclusions.map(item => (
                <li key={item.id} className="flex items-start gap-2 text-xs text-ink/70 dark:text-white/60">
                  <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" strokeWidth={3} />
                  <span>{item.item_text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase text-red-500 mb-2">Not Included</h4>
            {exclusions.length === 0 && <p className="text-xs text-ink-light dark:text-white/40">No exclusions</p>}
            <ul className="space-y-1.5">
              {exclusions.map(item => (
                <li key={item.id} className="flex items-start gap-2 text-xs text-ink/70 dark:text-white/60">
                  <span className="text-red-400 shrink-0 font-bold">✗</span>
                  <span>{item.item_text}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ItineraryStep() {
  const store = usePlannerStore();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const {
    itinerary, selectedCountry, totalDays, totalNights, travelType,
    selectedTemplate, buildItinerary, saving,
    draftPlan, editableItinerary,
    fetchCityTemplates, cityTemplates, cityTemplatesLoading,
    updateDayTemplate, finalizePlan, downloadPdf, refreshDraftPlan,
  } = store;

  const containerRef = useRef(null);
  const [swapTarget, setSwapTarget] = useState(null);
  const [swapping, setSwapping] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const usingDraft = draftPlan && editableItinerary.length > 0;
  const days = usingDraft ? editableItinerary : itinerary;
  const isConfirmed = draftPlan?.status?.toUpperCase() === 'CONFIRMED' || !!store.savedPlan;

  const cityGroups = useMemo(() => groupDaysByCity(days), [days]);
  const dayTourTotal = useMemo(() => days.reduce((sum, d) => sum + (d.dayTour?.price ? Number(d.dayTour.price) : 0), 0), [days]);

  useEffect(() => {
    if (!usingDraft && itinerary.length === 0 && selectedTemplate) buildItinerary();
    if (draftPlan?.id) refreshDraftPlan();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openSwap = async (day) => {
    if (!day.regionId) return;
    setSwapTarget(day);
    await fetchCityTemplates(day.regionId);
  };

  const handleSwap = async (template) => {
    if (!swapTarget) return;
    setSwapping(true);
    try {
      await updateDayTemplate(swapTarget.planDayId, template);
      toast.success('Template updated');
      setSwapTarget(null);
    } catch { toast.error('Failed to update template'); }
    finally { setSwapping(false); }
  };

  const handleFinalize = async () => {
    if (!isAuthenticated) { toast.error('Please log in to finalize your plan'); return; }
    setIsFinalizing(true);
    try { await finalizePlan(); toast.success('🎉 Plan finalized successfully!'); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed to finalize plan'); }
    finally { setIsFinalizing(false); }
  };

  const handleDownload = async () => {
    if (usingDraft && draftPlan) {
      setIsDownloading(true);
      try { await downloadPdf(draftPlan.id); }
      catch { toast.error('PDF download failed'); }
      finally { setIsDownloading(false); }
    } else {
      toast.success('Generating PDF…');
      window.dispatchEvent(new CustomEvent('download-pdf'));
    }
  };

  if (days.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-ink-light font-bold text-lg">
        No itinerary generated. Go back to the wizard to configure your trip.
      </div>
    );
  }

  return (
    <div className="pb-32 pt-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink dark:text-white mb-1">
          {totalNights} Nights in {cityGroups.map(g => g.regionName).join(', ')}
        </h2>
        <p className="text-base text-ink-light dark:text-white/60 font-medium">
          {selectedCountry?.name || 'Your destination'} · {totalDays} Days / {totalNights} Nights
          {travelType && ` · ${travelType}`}
        </p>
      </div>

      {/* ── Timeline with City-Grouped Cards ── */}
      <div ref={containerRef} className="relative mt-8 md:mt-12 max-w-6xl md:mx-auto px-4 lg:px-0">

        {/* Vertical dashed line (full length) */}
        <div className="absolute left-[27px] md:left-[220px] top-8 bottom-0 w-0 border-l-[2px] border-dashed border-ink/15 dark:border-white/15 z-0" />

        {/* Sticky plane icon */}
        <div className="absolute left-[27px] md:left-[220px] top-4 bottom-0 w-0 z-20 pointer-events-none">
          <div className="sticky top-[30vh] -translate-x-1/2 flex items-center justify-center w-12 h-12 bg-white dark:bg-d-card rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] border-4 border-white dark:border-d-card ring-2 ring-brand/20 text-2xl">
            ✈️
          </div>
        </div>

        {cityGroups.map((group, gIdx) => {
          const color = CITY_COLORS[gIdx % CITY_COLORS.length];
          const nights = group.days.length;

          return (
            <motion.div key={`${group.regionId}-${gIdx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.05 * gIdx }}
              className="relative md:flex pb-10 group"
            >
              {/* Left Column — City Name + Nights (replaces "Day 01") */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-100px' }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="pl-14 md:pl-0 md:w-[220px] md:pr-10 pt-6 md:pt-4 shrink-0 md:text-right mb-4 md:mb-0"
              >
                <h4 className={`font-extrabold text-2xl lg:text-3xl tracking-tight mb-1 transition-colors ${color.text}`}>
                  {group.regionName}
                </h4>
                <div className="text-sm font-bold text-ink-light dark:text-white/60 uppercase tracking-wide">
                  {nights} {nights === 1 ? 'Night' : 'Nights'}
                </div>
                <div className="flex items-center gap-1 mt-1 md:justify-end">
                  <MapPin className={`w-3 h-3 ${color.text} opacity-60`} />
                  <span className="text-xs font-semibold text-ink/40 dark:text-white/30">
                    Days {group.days[0].dayNumber}–{group.days[group.days.length - 1].dayNumber}
                  </span>
                </div>
              </motion.div>

              {/* Right Column — City Card with days inside */}
              <div className="pl-14 md:pl-10 flex-1 md:pt-3">
                <div className={`bg-white dark:bg-d-card rounded-[2rem] border border-ink/[0.04] dark:border-white/[0.04] shadow-xl shadow-ink/5 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border-l-4 ${color.border}`}>

                  {/* City card header */}
                  <div className={`px-5 py-4 bg-gradient-to-r ${color.headerBg} border-b border-gray-100 dark:border-white/[0.06]`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${color.bg} ${color.text} flex items-center justify-center`}>
                        <MapPin className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-ink dark:text-white tracking-tight">
                          {group.regionName}
                        </h3>
                        <p className="text-[11px] font-bold text-ink/40 dark:text-white/30">
                          {nights} {nights === 1 ? 'Night' : 'Nights'} · Day {group.days[0].dayNumber}–{group.days[group.days.length - 1].dayNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Days inside this city */}
                  <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {group.days.map((day) => {
                      const tour = day.dayTour;
                      const attractions = tour?.attractions || tour?.tour_attractions || [];
                      const canSwap = usingDraft && !!day.regionId;

                      return (
                        <div key={day.dayNumber} className="px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                          {/* Day date row */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`text-xs font-extrabold ${color.text} uppercase tracking-wider`}>
                              Day {String(day.dayNumber).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-bold text-ink/30 dark:text-white/20">
                              {day.date}
                            </span>
                            {day.isArrival && (
                              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold">Arrival</span>
                            )}
                            {day.isDeparture && (
                              <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-bold">Departure</span>
                            )}
                            {canSwap && (
                              <button onClick={() => openSwap(day)} title="Replace template"
                                className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ink/[0.04] dark:bg-white/[0.04] border border-ink/[0.08] dark:border-white/[0.08] text-[10px] font-bold text-ink/40 dark:text-white/30 hover:text-brand hover:border-brand/30 transition-all cursor-pointer">
                                <Pencil className="w-3 h-3" /> Swap
                              </button>
                            )}
                          </div>

                          {/* Activity title */}
                          <h5 className="font-bold text-ink dark:text-white text-sm mb-2 flex items-center gap-2">
                            <Route className="w-4 h-4 text-ink/30 dark:text-white/20 shrink-0" />
                            {tour?.activity_combination || day.templateName || (day.isDeparture ? 'Departure Day' : 'Free Day')}
                          </h5>

                          {/* Itinerary text */}
                          {tour?.itinerary_text && (
                            <p className="text-xs text-ink/60 dark:text-white/50 leading-relaxed mb-3 ml-6">{tour.itinerary_text}</p>
                          )}

                          {/* Attractions */}
                          {attractions.length > 0 && (
                            <div className="ml-6 mb-3">
                              <div className="flex flex-wrap gap-1.5">
                                {[...attractions].sort((a, b) => a.visit_order - b.visit_order).map((attr) => (
                                  <span key={attr.id}
                                    className="px-2.5 py-1 bg-canvas dark:bg-d-canvas rounded-lg text-[11px] font-semibold text-ink/60 dark:text-white/50 border border-ink/[0.04] dark:border-white/[0.04]">
                                    {attr.visit_order}. {attr.attraction_name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-2 ml-6">
                            {tour?.est_time_distance && (
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-ink-light dark:text-white/40 bg-ink/[0.04] dark:bg-white/[0.04] px-2.5 py-1 rounded-lg">
                                <Clock className="w-3 h-3" /> {tour.est_time_distance}
                              </div>
                            )}
                            {tour?.overnight_location && (
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-ink-light dark:text-white/40 bg-ink/[0.04] dark:bg-white/[0.04] px-2.5 py-1 rounded-lg">
                                <Hotel className="w-3 h-3" /> {tour.overnight_location}
                              </div>
                            )}
                            {usingDraft && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${day.includesNight ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'}`}>
                                {day.includesNight ? '+ Night' : 'Day only'}
                              </span>
                            )}
                            {tour?.price && Number(tour.price) > 0 && (
                              <span className="text-brand font-black text-xs ml-auto">
                                {tour.currency || 'INR'} {Number(tour.price).toLocaleString()}
                              </span>
                            )}
                          </div>

                          {day.isDeparture && !tour && (
                            <div className="flex items-center gap-3 text-ink/50 dark:text-white/30 ml-6 mt-2">
                              <Plane className="w-4 h-4 text-brand" />
                              <span className="font-semibold text-sm">Departure — Safe travels!</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Summary */}
      <MobileSummary cityGroups={cityGroups} selectedCountry={selectedCountry} draftPlan={draftPlan}
        totalDays={totalDays} totalNights={totalNights} travelType={travelType} dayTourTotal={dayTourTotal} />

      {/* Bottom Actions */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
        className="mt-6 bg-white dark:bg-d-card rounded-3xl border border-gray-200 dark:border-white/[0.08] p-8 shadow-lg max-w-4xl">
        <h3 className="font-extrabold text-xl text-ink dark:text-white mb-4">Ready to Go?</h3>
        <p className="text-sm text-ink-light dark:text-white/60 font-medium mb-6">
          {usingDraft
            ? `${isConfirmed ? 'Your plan is confirmed!' : 'Finalize your plan to lock it in.'} You can download the PDF anytime.`
            : 'Create your plan, download the PDF, or share it with friends.'}
        </p>
        <div className="flex flex-wrap gap-3">
          {usingDraft && !isConfirmed && (
            <button onClick={handleFinalize} disabled={isFinalizing}
              className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isFinalizing ? <><Loader2 className="w-4 h-4 animate-spin" /> Finalizing…</> : 'Finalize Plan'}
            </button>
          )}
          {isConfirmed && (
            <span className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-6 py-3 rounded-2xl font-bold text-sm">
              <Check className="w-4 h-4" /> Plan Confirmed
            </span>
          )}
          <button onClick={handleDownload} disabled={isDownloading}
            className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all cursor-pointer disabled:opacity-50">
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}
            className="flex items-center gap-2 bg-canvas dark:bg-d-surface text-ink dark:text-white px-6 py-3 rounded-2xl font-bold text-sm border border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer">
            <Share2 className="w-4 h-4" /> Share Plan
          </button>
        </div>
      </motion.div>

      {/* Swap Template Modal */}
      <AnimatePresence>
        {swapTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setSwapTarget(null); }}
          >
            <motion.div
              initial={{ y: 60, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 60, scale: 0.97 }}
              className="bg-white dark:bg-d-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-ink/[0.08] dark:border-white/[0.08] flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-lg text-ink dark:text-white">Replace Template</p>
                  <p className="text-xs text-ink/40 dark:text-white/30 mt-0.5">
                    Day {swapTarget.dayNumber} · {swapTarget.regionName}
                  </p>
                </div>
                <button onClick={() => setSwapTarget(null)}
                  className="w-8 h-8 rounded-xl bg-ink/[0.05] dark:bg-white/[0.05] flex items-center justify-center text-ink/50 dark:text-white/40 hover:bg-ink/10 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cityTemplatesLoading[swapTarget.regionId] ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-brand animate-spin" />
                  </div>
                ) : !(cityTemplates[swapTarget.regionId]?.length) ? (
                  <p className="text-sm text-ink/40 dark:text-white/30 text-center py-8">
                    No other templates for {swapTarget.regionName}.
                  </p>
                ) : (
                  cityTemplates[swapTarget.regionId].map(tmpl => {
                    const isCurrent = tmpl.id === swapTarget.templateId;
                    const tour = tmpl.days?.[0]?.day_tour_detail;
                    const attractions = tour?.attractions || tour?.tour_attractions || [];
                    return (
                      <button key={tmpl.id}
                        onClick={() => !swapping && !isCurrent && handleSwap(tmpl)}
                        disabled={swapping || isCurrent}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer
                          ${isCurrent
                            ? 'border-brand bg-brand/[0.04] ring-1 ring-brand/20'
                            : 'border-ink/[0.06] dark:border-white/[0.06] hover:border-brand/40 hover:bg-brand/[0.02]'}`}
                      >
                        {/* Header: name + selected badge */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Route className="w-4 h-4 text-ink/30 dark:text-white/20 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-ink dark:text-white leading-snug">{tour?.activity_combination || tmpl.name}</p>
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-bold">
                              <Check className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>

                        {/* Description / itinerary text */}
                        {tour?.itinerary_text && (
                          <p className="text-xs text-ink/50 dark:text-white/40 leading-relaxed mb-3 ml-6 line-clamp-2">{tour.itinerary_text}</p>
                        )}

                        {/* Attractions list */}
                        {attractions.length > 0 && (
                          <div className="ml-6 mb-3">
                            <div className="flex flex-wrap gap-1.5">
                              {[...attractions].sort((a, b) => a.visit_order - b.visit_order).map((attr) => (
                                <span key={attr.id}
                                  className="px-2 py-0.5 bg-canvas dark:bg-d-canvas rounded-md text-[10px] font-semibold text-ink/55 dark:text-white/45 border border-ink/[0.05] dark:border-white/[0.05]">
                                  {attr.visit_order}. {attr.attraction_name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Meta row: duration, type badge, default badge, price */}
                        <div className="flex flex-wrap items-center gap-2 ml-6">
                          {tour?.est_time_distance && (
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-ink-light dark:text-white/40 bg-ink/[0.04] dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3" /> {tour.est_time_distance}
                            </div>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tmpl.includes_night ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'}`}>
                            {tmpl.includes_night ? 'Day + Night' : 'Day only'}
                          </span>
                          {tmpl.is_default && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand/10 text-brand">Default</span>
                          )}
                          {tmpl.travel_type && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-ink/[0.04] dark:bg-white/[0.04] text-ink/50 dark:text-white/40">{tmpl.travel_type}</span>
                          )}
                          {tour?.price && Number(tour.price) > 0 && (
                            <span className="text-brand font-black text-xs ml-auto">
                              {tour.currency || 'INR'} {Number(tour.price).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

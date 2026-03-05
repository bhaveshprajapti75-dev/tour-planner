import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, Check, Loader2, Calendar, MapPin, ChevronDown, CheckCircle2, XCircle, Clock, Navigation, Star } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';

export default function StepTemplates() {
  const { templates, templatesLoading, selectedTemplate, selectedCountry, totalDays,
    fetchTemplates, selectTemplate } = usePlannerStore();
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (selectedCountry) {
      fetchTemplates(selectedCountry.id, totalDays);
    }
  }, [selectedCountry, totalDays]);

  // Auto-expand when selected
  useEffect(() => {
    if (selectedTemplate) setExpandedId(selectedTemplate.id);
  }, [selectedTemplate]);

  if (templatesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm font-medium text-ink/60 dark:text-white/50">Finding matching itineraries…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepHeader icon={LayoutTemplate} title="Choose your itinerary" desc={`${totalDays}-day plans for ${selectedCountry?.name || 'your destination'}`} />

      {templates.length === 0 && !templatesLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/10 flex items-center justify-center">
            <LayoutTemplate className="w-8 h-8 text-brand" />
          </div>
          <p className="text-lg font-semibold text-ink/60 dark:text-white/50">No templates found for {totalDays} days</p>
          <p className="text-sm mt-1 text-ink/40 dark:text-white/30">Try changing the duration</p>
        </div>
      )}

      <div className="space-y-4">
        {templates.map((tmpl, i) => {
          const isSelected = selectedTemplate?.id === tmpl.id;
          const isExpanded = expandedId === tmpl.id;
          const sortedDays = [...(tmpl.days || [])].sort((a, b) => a.day_number - b.day_number);

          return (
            <motion.div key={tmpl.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-[2rem] border transition-all overflow-hidden
                ${isSelected
                  ? 'bg-gradient-to-br from-brand/[0.03] via-white to-purple-500/[0.03] dark:from-brand/[0.06] dark:via-d-card dark:to-purple-500/[0.06] border-brand/30 shadow-[0_8px_30px_rgba(79,70,229,0.12)] ring-2 ring-brand/20'
                  : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.06] dark:border-white/[0.06] shadow-sm hover:shadow-lg hover:border-brand/15'
                }`}>

              {/* Header — click to select */}
              <div onClick={() => selectTemplate(tmpl)} className="flex items-start gap-4 p-6 cursor-pointer">
                {/* Radio */}
                <motion.div initial={false} animate={{ scale: isSelected ? 1 : 0.92 }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-all
                    ${isSelected ? 'bg-brand border-brand shadow-[0_0_10px_rgba(79,70,229,0.35)]' : 'border-ink/15 dark:border-white/15'}`}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </motion.div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-lg text-ink dark:text-white tracking-tight">{tmpl.name}</h3>
                    {tmpl.is_default && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                        <Star className="w-3 h-3" /> Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-ink/55 dark:text-white/45">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> {tmpl.total_days}D / {tmpl.total_nights}N
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5" /> {sortedDays.length} stops
                    </span>
                  </div>
                  {tmpl.description && (
                    <p className="text-sm text-ink/45 dark:text-white/35 mt-1.5 line-clamp-2">{tmpl.description}</p>
                  )}

                  {/* Compact day pills when collapsed */}
                  {!isExpanded && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {sortedDays.map((day) => (
                        <span key={day.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-ink/[0.04] dark:bg-white/[0.06] text-[11px] font-semibold text-ink/60 dark:text-white/50">
                          <span className="text-brand font-bold">D{day.day_number}</span>
                          <span className="max-w-[14ch] truncate">{day.day_tour_detail?.activity_combination?.split('&')[0]?.trim() || '—'}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expand toggle */}
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : tmpl.id); }}
                  className="shrink-0 w-9 h-9 rounded-xl bg-ink/[0.04] dark:bg-white/[0.06] flex items-center justify-center hover:bg-ink/[0.08] dark:hover:bg-white/[0.1] transition-colors cursor-pointer"
                  title={isExpanded ? 'Collapse' : 'View details'}>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-ink/50 dark:text-white/50" />
                  </motion.div>
                </button>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden">
                    <div className="px-6 pb-6 space-y-5">

                      {/* Day-by-day itinerary */}
                      <div className="rounded-2xl bg-canvas/60 dark:bg-d-surface/60 border border-ink/[0.04] dark:border-white/[0.04] p-4">
                        <h4 className="text-xs font-extrabold text-ink/60 dark:text-white/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5" /> Day-by-Day Itinerary
                        </h4>
                        <div className="space-y-3">
                          {sortedDays.map((day, idx) => {
                            const dt = day.day_tour_detail;
                            const isLast = idx === sortedDays.length - 1;
                            return (
                              <div key={day.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0
                                    ${day.is_arrival_day ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                                      day.is_departure_day ? 'bg-red-500/10 text-red-500 dark:text-red-400' :
                                      'bg-brand/10 text-brand'}`}>
                                    {day.day_number}
                                  </span>
                                  {!isLast && <div className="w-px flex-1 bg-ink/[0.08] dark:bg-white/[0.08] mt-1" />}
                                </div>
                                <div className="flex-1 min-w-0 pb-2">
                                  <p className="font-bold text-sm text-ink dark:text-white leading-snug">
                                    {day.is_arrival_day && <span className="text-green-600 dark:text-green-400">✈ Arrival — </span>}
                                    {day.is_departure_day && <span className="text-red-500 dark:text-red-400">✈ Departure — </span>}
                                    {dt?.activity_combination || `Day ${day.day_number}`}
                                  </p>
                                  {dt?.itinerary_text && (
                                    <p className="text-xs text-ink/50 dark:text-white/40 mt-1 leading-relaxed line-clamp-2">{dt.itinerary_text}</p>
                                  )}
                                  {dt?.attractions?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {[...dt.attractions].sort((a, b) => a.visit_order - b.visit_order).map((a) => (
                                        <span key={a.id} className="px-2 py-0.5 rounded-md bg-brand/[0.06] text-brand text-[10px] font-bold">{a.attraction_name}</span>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-ink/40 dark:text-white/30">
                                    {dt?.est_time_distance && (
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {dt.est_time_distance}</span>
                                    )}
                                    {dt?.overnight_location && (
                                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Overnight: {dt.overnight_location}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Inclusions / Exclusions — from template's own incl_excl data */}
                      {(() => {
                        const tInclusions = (tmpl.incl_excl || []).filter(ie => ie.type === 'INCLUSION');
                        const tExclusions = (tmpl.incl_excl || []).filter(ie => ie.type === 'EXCLUSION');
                        if (tInclusions.length === 0 && tExclusions.length === 0) return null;
                        return (
                          <div className="rounded-2xl bg-canvas/60 dark:bg-d-surface/60 border border-ink/[0.04] dark:border-white/[0.04] p-4">
                            <h4 className="text-xs font-extrabold text-ink/60 dark:text-white/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> What's in this Package
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {tInclusions.length > 0 && (
                                <div>
                                  <p className="text-xs font-extrabold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Included
                                  </p>
                                  <ul className="space-y-1.5">
                                    {tInclusions.map(ie => (
                                      <li key={ie.id} className="flex items-start gap-2 text-sm text-ink/75 dark:text-white/65">
                                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                                        <div>
                                          <span className="font-medium">{ie.item_text}</span>
                                          <span className="ml-1.5 text-[10px] text-ink/35 dark:text-white/25 font-semibold">({ie.category_name})</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {tExclusions.length > 0 && (
                                <div>
                                  <p className="text-xs font-extrabold text-red-500 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <XCircle className="w-3.5 h-3.5" /> Not Included
                                  </p>
                                  <ul className="space-y-1.5">
                                    {tExclusions.map(ie => (
                                      <li key={ie.id} className="flex items-start gap-2 text-sm text-ink/55 dark:text-white/45">
                                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" strokeWidth={2} />
                                        <div>
                                          <span className="font-medium">{ie.item_text}</span>
                                          <span className="ml-1.5 text-[10px] text-ink/35 dark:text-white/25 font-semibold">({ie.category_name})</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

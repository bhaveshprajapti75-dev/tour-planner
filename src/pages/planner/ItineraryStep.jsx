import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sunrise, Sun, Moon, Check, Download, Share2, Plane, Hotel, CalendarDays, Clock, Route, Eye, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

function MobileSummary({ itinerary, selectedCountry, selectedTemplate, totalDays, totalNights, travelType }) {
  const [expanded, setExpanded] = useState(false);

  const dayTourTotal = itinerary.reduce((sum, day) => {
    const price = day.dayTour?.price ? Number(day.dayTour.price) : 0;
    return sum + price;
  }, 0);

  const inclusions = (selectedTemplate?.incl_excl || []).filter(ie => ie.type === 'INCLUSION');
  const exclusions = (selectedTemplate?.incl_excl || []).filter(ie => ie.type === 'EXCLUSION');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      className="lg:hidden mt-10 bg-white dark:bg-d-card rounded-3xl border border-gray-200 dark:border-white/[0.08] shadow-lg overflow-hidden"
    >
      {/* Compact Header */}
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

      {/* Day-by-day breakdown */}
      <div className="p-5 space-y-2">
        {itinerary.map((day) => (
          <div key={day.dayNumber} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/[0.06] last:border-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0">{day.dayNumber}</span>
              <span className="font-medium text-ink/70 dark:text-white/60 line-clamp-1">
                {day.dayTour?.activity_combination || (day.isDeparture ? 'Departure' : 'Free Day')}
              </span>
            </div>
            {day.dayTour?.price && Number(day.dayTour.price) > 0 && (
              <span className="font-bold text-ink dark:text-white text-sm shrink-0 ml-2">INR {Number(day.dayTour.price).toLocaleString()}</span>
            )}
          </div>
        ))}
      </div>

      {/* Expandable Inclusions/Exclusions */}
      <button
        onClick={() => setExpanded(!expanded)}
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
  const { itinerary, selectedCountry, totalDays, totalNights, startDate, selectedTemplate,
    dayTourDetails, buildItinerary, savePlan, saving, savedPlan } = store;

  const containerRef = useRef(null);

  useEffect(() => {
    if (itinerary.length === 0 && selectedTemplate) {
      buildItinerary();
    }
  }, []);

  const days = itinerary;

  if (days.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-ink-light font-bold text-lg">
        No itinerary generated. Go back to the wizard to configure your trip.
      </div>
    );
  }

  const handleDownload = () => {
    toast.success('Generating PDF...');
    window.dispatchEvent(new CustomEvent('download-pdf'));
  };

  const handleCreate = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to create your plan');
      return;
    }
    try {
      await savePlan();
      toast.success('Plan created successfully! You can now download the PDF.');
    } catch {
      toast.error('Failed to create plan');
    }
  };

  return (
    <div className="pb-32 pt-6">
      <div className="mb-10">
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink dark:text-white mb-2">Your Itinerary</h2>
        <p className="text-lg text-ink-light dark:text-white/60 font-medium">
          {totalDays}-day tour in {selectedCountry?.name || 'your destination'} — {totalNights} nights
        </p>
      </div>

      {/* Timeline Container */}
      <div ref={containerRef} className="relative mt-8 md:mt-12 max-w-6xl md:mx-auto px-4 lg:px-0">

        {/* Vertical dashed line (full length) */}
        <div className="absolute left-[27px] md:left-[220px] top-8 bottom-0 w-0 border-l-[2px] border-dashed border-ink/15 dark:border-white/15 z-0" />

        {/* Sticky plane icon — follows viewport as you scroll */}
        <div className="absolute left-[27px] md:left-[220px] top-4 bottom-0 w-0 z-20 pointer-events-none">
          <div className="sticky top-[30vh] -translate-x-1/2 flex items-center justify-center w-12 h-12 bg-white dark:bg-d-card rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] border-4 border-white dark:border-d-card ring-2 ring-brand/20 text-2xl">
            ✈️
          </div>
        </div>

        {days.map((day, dIdx) => {
          const tour = day.dayTour;
          const attractions = tour?.attractions || [];

          return (
            <motion.div key={day.dayNumber}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.05 * dIdx }}
              className="relative md:flex pb-10 group">

              {/* Left Column (Day Info) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                className="pl-14 md:pl-0 md:w-[220px] md:pr-10 pt-6 md:pt-4 shrink-0 md:text-right mb-4 md:mb-0">
                <h4 className="font-extrabold text-2xl lg:text-3xl text-ink dark:text-white tracking-tight mb-1 transition-colors">
                  Day {String(day.dayNumber).padStart(2, '0')}
                </h4>
                <div className="text-sm font-bold text-ink-light dark:text-white/60 uppercase tracking-wide">{day.date}</div>
                {day.isArrival && (
                  <div className="mt-3">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold inline-block">Arrival Day</span>
                  </div>
                )}
                {day.isDeparture && (
                  <div className="mt-3">
                    <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold inline-block">Departure Day</span>
                  </div>
                )}
              </motion.div>

              {/* Right Column (Content) */}
              <div className="pl-14 md:pl-10 flex-1 md:pt-3">
                {/* Day Tour Card */}
                <div className="bg-white dark:bg-d-card rounded-[2rem] border border-ink/[0.04] dark:border-white/[0.04] p-5 shadow-xl shadow-ink/5 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

                  {/* Activity combination header */}
                  {tour?.activity_combination && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                        <Route className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-ink dark:text-white text-base">{tour.activity_combination}</h5>
                    </div>
                  )}

                  {/* Itinerary Text */}
                  {tour?.itinerary_text && (
                    <p className="text-sm text-ink/70 dark:text-white/60 leading-relaxed mb-4">{tour.itinerary_text}</p>
                  )}

                  {/* Attractions */}
                  {attractions.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <div className="text-xs uppercase tracking-widest font-extrabold text-ink/40 dark:text-white/30 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Attractions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {attractions.sort((a, b) => a.visit_order - b.visit_order).map((attr) => (
                          <span key={attr.id}
                            className="px-3 py-1.5 bg-canvas dark:bg-d-canvas rounded-xl text-xs font-semibold text-ink/70 dark:text-white/60 border border-ink/[0.04] dark:border-white/[0.04]">
                            {attr.visit_order}. {attr.attraction_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meta Info Row */}
                  <div className="flex flex-wrap items-center gap-3 mt-auto">
                    {tour?.est_time_distance && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-light dark:text-white/50 bg-ink/5 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5" /> {tour.est_time_distance}
                      </div>
                    )}
                    {tour?.overnight_location && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-light dark:text-white/50 bg-ink/5 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                        <Hotel className="w-3.5 h-3.5" /> Overnight: {tour.overnight_location}
                      </div>
                    )}
                    {tour?.price && Number(tour.price) > 0 && (
                      <span className="text-brand font-black text-sm ml-auto">
                        {tour.currency || 'INR'} {Number(tour.price).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Departure day — minimal */}
                  {day.isDeparture && !tour && (
                    <div className="flex items-center gap-3 text-ink/60 dark:text-white/40">
                      <Plane className="w-5 h-5 text-brand" />
                      <span className="font-semibold">Departure — Safe travels!</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Summary — only visible on small screens (sidebar is hidden) */}
      <MobileSummary itinerary={days} selectedCountry={selectedCountry} selectedTemplate={selectedTemplate} totalDays={totalDays} totalNights={totalNights} travelType={store.travelType} />

      {/* Bottom Actions */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
        className="mt-6 bg-white dark:bg-d-card rounded-3xl border border-gray-200 dark:border-white/[0.08] p-8 shadow-lg">
        <h3 className="font-extrabold text-xl text-ink dark:text-white mb-4">Ready to Go?</h3>
        <p className="text-sm text-ink-light dark:text-white/60 font-medium mb-6">
          Create your plan, download the PDF, or share it with friends.
        </p>
        <div className="flex flex-wrap gap-3">
          {!savedPlan && (
            <button onClick={handleCreate} disabled={saving}
              className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Creating…' : 'Create Plan'}
            </button>
          )}
          {savedPlan && (
            <span className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-6 py-3 rounded-2xl font-bold text-sm">
              <Check className="w-4 h-4" /> Plan Created
            </span>
          )}
          {savedPlan && (
            <button onClick={handleDownload}
              className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all cursor-pointer">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          )}
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}
            className="flex items-center gap-2 bg-canvas dark:bg-d-surface text-ink dark:text-white px-6 py-3 rounded-2xl font-bold text-sm border border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer">
            <Share2 className="w-4 h-4" /> Share Plan
          </button>
        </div>
      </motion.div>
    </div>
  );
}

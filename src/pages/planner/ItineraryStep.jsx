import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { MapPin, Sun, Sunrise, Moon, Replace, Trash2, Train, Hotel, Info, Plus, Check, SquareCheckBig, Download, Share2, Car, Plane } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import { cities, activities, hotels, getDistance } from '../../data/mockData';
import ActivityModal from '../../components/planner/ActivityModal';
import RouteMap from '../../components/planner/RouteMap';
import LeadGateModal from '../../components/planner/LeadGateModal';
import toast from 'react-hot-toast';

export default function ItineraryStep() {
  const store = usePlannerStore();
  const { itinerary, selectedCities, duration, consentGiven, setConsent, isLoggedIn, generateItinerary, vehicleCategory, removeActivityFromDay } = store;
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showGateModal, setShowGateModal] = useState(false);

  // Timeline Scroll Animation
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (itinerary.length === 0 && selectedCities.length > 0) {
      generateItinerary();
    }
  }, []);

  const days = itinerary;

  if (selectedCities.length === 0 || days.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-ink-light font-bold text-lg">
        No itinerary generated. Go back to the wizard to configure your trip.
      </div>
    );
  }

  const handleDownload = () => {
    if (!isLoggedIn) {
      setShowGateModal(true);
      return;
    }
    toast.success('Generating PDF...');
    // Trigger PDF download from the quotation sidebar
    window.dispatchEvent(new CustomEvent('download-pdf'));
  };

  return (
    <div className="pb-32 pt-6">
      <div className="mb-10">
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink dark:text-white mb-2">Your Itinerary</h2>
        <p className="text-lg text-ink-light dark:text-white/60 font-medium">
          {duration}-day tour across {selectedCities.length} cities — fully customizable
        </p>
      </div>

      <RouteMap />

      {/* Timeline */}
      <div ref={containerRef} className="relative mt-8 md:mt-12 max-w-6xl md:mx-auto px-4 lg:px-0">
        {/* Vertical dotted line background */}
        <div className="absolute left-[27px] md:left-[220px] top-8 bottom-0 w-0 border-l-[2px] border-dashed border-ink/15 dark:border-white/15" />

        {/* Animated Progress Line */}
        <motion.div
          style={{ scaleY }}
          className="absolute left-[26.5px] md:left-[219.5px] top-8 bottom-0 w-[3px] bg-gradient-to-b from-brand via-purple-500 to-brand origin-top rounded-full shadow-[0_0_12px_rgba(79,70,229,0.8)] z-0"
        />

        {days.map((day, dIdx) => {
          const isNewCity = dIdx === 0 || day.cityId !== days[dIdx - 1]?.cityId;
          const city = cities.find(c => c.id === day.cityId);
          const nextDay = days[dIdx + 1];
          const isTransit = nextDay && nextDay.cityId !== day.cityId;
          const dist = isTransit ? getDistance(day.cityId, nextDay.cityId) : null;

          return (
            <motion.div key={day.dayNum}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.05 * dIdx }}
              className="relative md:flex pb-10 group">

              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                className="absolute left-[27px] md:left-[220px] top-8 md:top-6 w-4 h-4 -translate-x-[7px] rounded-full bg-brand shadow-[0_0_15px_rgba(79,70,229,0.6)] border-[3px] border-white dark:border-d-card z-10 transition-transform duration-300 group-hover:scale-150"
              />

              {/* Left Column (Day Info) */}
              <div className="pl-14 md:pl-0 md:w-[220px] md:pr-10 pt-6 md:pt-4 shrink-0 md:text-right mb-4 md:mb-0">
                <h4 className="font-extrabold text-2xl lg:text-3xl text-ink dark:text-white tracking-tight mb-1 transition-colors">
                  Day {String(day.dayNum).padStart(2, '0')}
                </h4>
                <div className="text-sm font-bold text-ink-light dark:text-white/60 uppercase tracking-wide">{day.date}</div>
                {day.isDeparture && (
                  <div className="mt-3">
                    <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold inline-block">Departure Day</span>
                  </div>
                )}
              </div>

              {/* Right Column (Content) */}
              <div className="pl-14 md:pl-10 flex-1 md:pt-3">
                {/* City transition header */}
                {isNewCity && city && (
                  <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="mb-6 flex items-center gap-4 bg-white/60 dark:bg-d-card/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50 dark:border-white/[0.08] w-fit">
                    <div className="w-14 h-14 rounded-xl bg-white dark:bg-d-card shadow-sm overflow-hidden shrink-0 border border-ink/[0.08] dark:border-white/[0.08]">
                      <img src={city.image} className="w-full h-full object-cover scale-110" alt={city.name} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-extrabold text-brand/80 mb-0.5">Arriving in</p>
                      <h3 className="text-xl font-black text-ink dark:text-white tracking-tight leading-none mb-1.5">{city.name}</h3>
                      {day.hotel && (
                        <p className="text-xs text-ink-light dark:text-white/60 font-medium flex items-center gap-1">
                          <Hotel className="w-3.5 h-3.5 text-brand" /> {day.hotel.name}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Day Card */}
                {!day.isDeparture && (
                  <div className="bg-white dark:bg-d-card rounded-[2rem] border border-ink/[0.04] dark:border-white/[0.04] p-5 shadow-xl shadow-ink/5 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      <ShiftModule icon={Sunrise} shiftName="Morning" activity={day.shifts.morning}
                        onViewDetails={() => day.shifts.morning && setSelectedActivity(day.shifts.morning)}
                        onDelete={() => removeActivityFromDay(day.dayNum, 'morning')} />
                      <ShiftModule icon={Sun} shiftName="Afternoon" activity={day.shifts.noon}
                        onViewDetails={() => day.shifts.noon && setSelectedActivity(day.shifts.noon)}
                        onDelete={() => removeActivityFromDay(day.dayNum, 'noon')} />
                      <ShiftModule icon={Moon} shiftName="Evening" activity={day.shifts.evening}
                        onViewDetails={() => day.shifts.evening && setSelectedActivity(day.shifts.evening)}
                        onDelete={() => removeActivityFromDay(day.dayNum, 'evening')} />
                    </div>
                  </div>
                )}

                {/* Transit Animation Block */}
                {isTransit && dist && (
                  <TransitBlock city={city} nextDay={nextDay} dist={dist} vehicleCategory={vehicleCategory} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Consent Section */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mt-12 bg-white dark:bg-d-card rounded-3xl border border-gray-200 dark:border-white/[0.08] p-8 shadow-lg">
        <h3 className="font-extrabold text-xl text-ink dark:text-white mb-4">Confirm Your Plan</h3>
        <label className="flex items-start gap-3 cursor-pointer mb-6" onClick={() => setConsent(!consentGiven)}>
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
            ${consentGiven ? 'border-brand bg-brand' : 'border-gray-300 dark:border-white/20'}`}>
            {consentGiven && <Check className="w-4 h-4 text-white" />}
          </div>
          <span className="text-sm text-ink-light dark:text-white/60 font-medium">I confirm all selected customization is correct and I would like to generate my final plan.</span>
        </label>
        <div className="flex gap-3">
          <button onClick={handleDownload} disabled={!consentGiven}
            className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button className="flex items-center gap-2 bg-canvas dark:bg-d-surface text-ink dark:text-white px-6 py-3 rounded-2xl font-bold text-sm border border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer">
            <Share2 className="w-4 h-4" /> Share Plan
          </button>
        </div>
      </motion.div>

      <ActivityModal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} activity={selectedActivity} />
      <LeadGateModal isOpen={showGateModal} onClose={() => setShowGateModal(false)} onSuccess={() => setShowGateModal(false)} />
    </div>
  );
}

function ShiftModule({ icon: Icon, shiftName, activity, onViewDetails, onDelete }) {
  return (
    <motion.div whileHover={{ y: -4 }} onClick={onViewDetails}
      className={`p-5 flex flex-col rounded-[1.5rem] transition-all cursor-pointer min-h-[160px] relative overflow-hidden group
        ${activity ? 'bg-canvas dark:bg-d-canvas border border-ink/[0.04] dark:border-white/[0.04] shadow-sm hover:shadow-xl hover:border-brand/30' : 'bg-transparent border-2 border-dashed border-ink/10 dark:border-white/10 hover:bg-ink/[0.02] dark:hover:bg-white/5 hover:border-brand/30'}`}>

      {activity && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-ink/60 dark:text-white/60">{shiftName}</span>
        </div>
        {activity && onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
            title="Remove Activity">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {!activity && (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <span className="text-sm font-bold text-ink/40 dark:text-white/40 flex items-center gap-1 group-hover:text-brand transition-colors">
            <Plus className="w-4 h-4" /> Add Activity
          </span>
        </div>
      )}

      {activity && (
        <div className="flex-1 flex flex-col justify-between relative z-10">
          <h5 className="font-bold text-ink dark:text-white text-base leading-snug mb-3 group-hover:text-brand transition-colors">{activity.title || activity.name}</h5>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-light dark:text-white/50 bg-ink/5 dark:bg-white/5 px-2.5 py-1 rounded-lg">
              {activity.duration && <span>{activity.duration}</span>}
            </div>
            {activity.price !== undefined && activity.price > 0 && (
              <span className="text-brand font-black">INR {activity.price}</span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TransitBlock({ city, nextDay, dist, vehicleCategory }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end bottom", "center center"] });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const vType = vehicleCategory || 'Train';
  const IconComponent = vType === 'Car Rental' ? Car : vType === 'Flight' ? Plane : Train;

  return (
    <div ref={ref} className="mt-8 mb-6 relative pb-2 md:pr-10">
      <div className="bg-canvas/50 dark:bg-d-canvas/50 border border-ink/[0.04] dark:border-white/[0.04] rounded-[1.5rem] p-5 lg:p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">

        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 border border-brand/20">
              <IconComponent className="w-4 h-4" />
            </div>
            <span className="text-[11px] uppercase font-black tracking-widest text-brand/80">Transfer ({vType})</span>
          </div>
          <span className="text-[11px] font-bold text-ink-light dark:text-white/60 bg-white dark:bg-d-card px-2.5 py-1 rounded-lg border border-ink/[0.06] dark:border-white/[0.06] shadow-sm">
            {dist.km} km • ~{Math.round(dist.mins / 60)}h {dist.mins % 60}m
          </span>
        </div>

        <div className="flex items-center gap-4 w-full mt-2 relative z-10 px-1">
          <span className="font-extrabold text-base text-ink dark:text-white shrink-0">{city?.name}</span>

          <div className="flex-1 relative h-6 flex items-center mx-2 overflow-visible">
            {/* Background dashed line */}
            <div className="absolute left-0 right-0 h-[2px] border-t-2 border-dashed border-ink/15 dark:border-white/10" />

            {/* Animated solid progress line */}
            <motion.div style={{ width: lineWidth }} className="absolute left-0 h-[2px] bg-brand origin-left shadow-[0_0_8px_rgba(79,70,229,0.5)]" />

            {/* Animated vehicle traveling on the line */}
            <motion.div style={{ left: lineWidth }} className="absolute text-brand -translate-x-[50%] -ml-1 top-1/2 -mt-3.5 bg-white dark:bg-d-card rounded-full p-1.5 shadow-md border border-brand/20 z-20">
              <IconComponent className="w-3.5 h-3.5" />
            </motion.div>
          </div>

          <span className="font-extrabold text-base text-ink dark:text-white shrink-0">{cities.find(c => c.id === nextDay.cityId)?.name}</span>
        </div>
      </div>
    </div>
  );
}

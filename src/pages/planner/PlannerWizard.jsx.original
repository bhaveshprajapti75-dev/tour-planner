import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  CalendarRange, Users, MapPin, Hotel, Car, UserCheck, UtensilsCrossed,
  Eye, Zap, ArrowRight, ArrowLeft, Check, Plus, Minus, Train, Plane,
  Heart, Cake, Star, X, Mountain, Compass, Sparkles, CarFront, BusFront, Map, Navigation, ShieldCheck
} from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import {
  cities, hotels, transportOptions, travelTypes, mealOptions,
  dietaryPreferences, specialOccasions, sightseeings, activities
} from '../../data/mockData';

/* ─── slide animation variants ──────────────────────────────── */
const slideIn = {
  initial: { opacity: 0, y: 30, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.99 },
  transition: { duration: 0.35, ease: 'easeOut' }
};

export default function PlannerWizard() {
  const navigate = useNavigate();
  const store = usePlannerStore();
  const { currentStep } = store;
  const totalSteps = 9;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!store.category;
      case 2: return store.duration > 0;
      case 3: return store.selectedCities.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep === totalSteps) {
      store.generateItinerary();
      navigate('/planner/itinerary');
    } else {
      store.nextStep();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Thin progress bar — always visible below navbar */}
      <div className="shrink-0 w-full h-1 bg-ink/[0.06] dark:bg-white/[0.06]">
        <motion.div
          className="h-full bg-gradient-to-r from-brand via-purple-500 to-blue-500 rounded-r-full"
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step Content — only this area scrolls */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} {...slideIn}>
              {currentStep === 1 && <StepCategory />}
              {currentStep === 2 && <StepDuration />}
              {currentStep === 3 && <StepCities />}
              {currentStep === 4 && <StepHotels />}
              {currentStep === 5 && <StepTransport />}
              {currentStep === 6 && <StepGuide />}
              {currentStep === 7 && <StepMeals />}
              {currentStep === 8 && <StepSightseeing />}
              {currentStep === 9 && <StepActivities />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav — always visible at bottom */}
      <div className="shrink-0 flex justify-center px-4 py-4">
        <div className="bg-white/80 dark:bg-d-surface/80 backdrop-blur-2xl border border-ink/[0.08] dark:border-white/[0.08] shadow-[0_-4px_30px_rgba(0,0,0,0.08)] rounded-2xl p-3 flex items-center gap-3 max-w-lg w-full">
          <button
            onClick={() => store.prevStep()}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-ink/[0.04] dark:bg-white/[0.06] text-ink/60 dark:text-white/60 border border-ink/[0.08] dark:border-white/[0.08] hover:bg-ink/[0.08] dark:hover:bg-white/[0.1] hover:text-ink dark:hover:text-white transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex-1 flex justify-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === currentStep ? 'w-6 bg-brand' :
                i + 1 < currentStep ? 'w-1.5 bg-brand/50' : 'w-1.5 bg-ink/10 dark:bg-white/10'
                }`} />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white overflow-hidden transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] border border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-brand to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] mix-blend-overlay transition-opacity duration-500" />
            <span className="relative z-10 tracking-wide">{currentStep === totalSteps ? 'Generate Plan' : 'Continue'}</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP 1: DURATION
   ════════════════════════════════════════════════════════════ */
function CustomSelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label;

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl hover:bg-ink/5 dark:hover:bg-white/5 cursor-pointer flex items-center gap-1 transition-colors font-bold text-ink dark:text-white"
      >
        {selectedLabel}
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{ scrollbarWidth: 'none' }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-28 max-h-48 overflow-y-auto bg-white/95 dark:bg-d-surface/95 backdrop-blur-3xl border border-ink/[0.08] dark:border-white/[0.08] rounded-2xl shadow-xl z-50 p-1"
            >
              {options.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-3 py-2 text-sm font-bold rounded-xl cursor-pointer transition-colors ${value === opt.value ? 'bg-brand text-white shadow-md' : 'hover:bg-ink/5 dark:hover:bg-white/5 text-ink/80 dark:text-white/80'}`}
                >
                  {opt.label}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepDuration() {
  const { duration, setDuration, startDate, setStartDate } = usePlannerStore();
  return (
    <div className="space-y-8">
      <StepHeader icon={CalendarRange} title="When & How Long?" desc="Pick your start date and duration" />
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* LEFT: TRIP DURATION */}
        <div className="flex-[1.8] space-y-4 order-last md:order-first">
          <label className="block text-sm font-bold text-ink/70 dark:text-white/70">Trip Duration</label>
          <div className="flex flex-wrap gap-3">
            {[3, 4, 5, 6, 7, 8, 9, 10, 12, 14].map(d => (
              <motion.button key={d} onClick={() => setDuration(d)}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-3 px-5 min-w-[5rem] flex flex-col items-center justify-center rounded-[1.25rem] transition-all cursor-pointer border shadow-sm
                  ${duration === d
                    ? 'bg-gradient-to-br from-brand to-purple-600 text-white border-white/20 shadow-[0_8px_25px_rgba(79,70,229,0.35)] z-10'
                    : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] text-ink/70 dark:text-white/70 hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:shadow-md'
                  }`}>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black tracking-tight">{d}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${duration === d ? 'opacity-90' : 'opacity-60'}`}>days</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* RIGHT: START DATE (CALENDAR) */}
        <div className="flex-1 space-y-4">
          <label className="block text-sm font-bold text-ink/70 dark:text-white/70">Start Date (Optional)</label>
          <div className="bg-white/80 dark:bg-d-card/80 backdrop-blur-md rounded-[2rem] border border-ink/[0.04] dark:border-white/[0.04] p-4 lg:p-5 shadow-sm inline-block w-full sm:w-auto">
            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={(date) => setStartDate(date ? date.toISOString().split('T')[0] : '')}
              dateFormat="dd MMM yyyy"
              minDate={new Date()}
              inline
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex items-center justify-between px-2 mb-3">
                  <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-ink/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1 justify-center flex-1">
                    <CustomSelect
                      value={date.getMonth()}
                      options={Array.from({ length: 12 }, (_, i) => ({ value: i, label: new Date(0, i).toLocaleString('en', { month: 'short' }) }))}
                      onChange={changeMonth}
                    />
                    <CustomSelect
                      value={date.getFullYear()}
                      options={Array.from({ length: 5 }, (_, i) => ({ value: new Date().getFullYear() + i, label: new Date().getFullYear() + i }))}
                      onChange={changeYear}
                    />
                  </div>
                  <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-ink/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30 cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              calendarClassName="!border-none !bg-transparent !shadow-none !font-sans w-full min-w-[280px]"
              dayClassName={(date) => {
                const isSelected = startDate && new Date(startDate).toDateString() === date.toDateString();
                return `rounded-xl w-9 h-9 flex items-center justify-center transition-all ${isSelected ? 'bg-brand text-white shadow-md' : 'text-ink/80 dark:text-white/80 hover:bg-ink/[0.04] dark:hover:bg-white/[0.04]'} ${date < new Date(new Date().setHours(0, 0, 0, 0)) ? 'opacity-30 cursor-not-allowed' : ''}`;
              }}
              monthClassName={() => "px-2 py-1 bg-transparent"}
              className="w-full h-14 px-6 py-4 flex items-center bg-transparent border-none outline-none font-bold"
            />
          </div>
        </div>
      </div>
      {duration > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-brand/[0.06] rounded-2xl p-4 border border-brand/15">
          <p className="text-sm font-semibold text-brand flex items-center gap-2">
            <Train className="w-4 h-4" />
            {duration} days / {Math.max(duration - 1, 1)} nights across Switzerland
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP 2: CATEGORY
   ════════════════════════════════════════════════════════════ */
function StepCategory() {
  const store = usePlannerStore();
  const { category, setCategory, specialOccasion, setSpecialOccasion, soloSharing, setSoloSharing, rooms, addRoom, removeRoom, updateRoom } = store;

  const cats = [
    { id: 'couple', label: 'Couple', desc: 'Romantic getaway for two', icon: Heart },
    { id: 'family', label: 'Family / Friends', desc: 'Multi-room group trip', icon: Users },
    { id: 'solo', label: 'Solo', desc: 'Independent adventure', icon: Compass },
  ];

  return (
    <div className="space-y-8">
      <StepHeader icon={Users} title="Who's traveling?" desc="Tell us about your group" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cats.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.button key={c.id} onClick={() => setCategory(c.id)}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`text-left p-6 lg:p-8 rounded-[2rem] transition-all cursor-pointer flex flex-col items-start border shadow-sm
                ${category === c.id
                  ? 'bg-gradient-to-br from-brand to-purple-600 text-white border-white/20 shadow-[0_8px_30px_rgba(79,70,229,0.3)] z-10'
                  : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:shadow-xl'
                }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-inner
                ${category === c.id ? 'bg-white/20' : 'bg-brand/10 dark:bg-white/5 text-brand dark:text-white border border-brand/10 dark:border-white/10'}`}>
                <Icon className={`w-7 h-7 stroke-[2.5] ${category === c.id ? 'text-white' : ''}`} />
              </div>
              <div className={`font-black tracking-tight text-2xl ${category === c.id ? 'text-white' : 'text-ink dark:text-white'}`}>{c.label}</div>
              <div className={`text-sm mt-3 font-medium leading-relaxed ${category === c.id ? 'text-white/80' : 'text-ink/60 dark:text-white/50'}`}>{c.desc}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Couple: Special Occasion */}
      {category === 'couple' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h4 className="font-bold text-ink/70 dark:text-white/70">Special Occasion? (Optional)</h4>
          <div className="flex flex-wrap gap-3">
            {specialOccasions.map(o => (
              <button key={o.id} onClick={() => setSpecialOccasion(specialOccasion === o.id ? null : o.id)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2
                  ${specialOccasion === o.id
                    ? 'bg-gradient-to-br from-brand to-purple-500 text-white shadow-md shadow-brand/25 border border-white/20'
                    : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border border-ink/[0.04] dark:border-white/[0.04] text-ink/60 dark:text-white/60 hover:bg-white dark:hover:bg-d-card hover:border-brand/20 shadow-sm'
                  }`}>
                <span>{o.icon}</span> {o.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Family: Rooms */}
      {category === 'family' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-ink/70 dark:text-white/70">Room Configuration</h4>
            <button onClick={addRoom} className="flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover cursor-pointer transition-colors">
              <Plus className="w-4 h-4" /> Add Room
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
            {rooms.map((room, idx) => (
              <div key={idx} className="bg-white dark:bg-d-card p-5 rounded-2xl border border-ink/[0.08] dark:border-white/[0.08] flex flex-col gap-4 shadow-sm relative group transition-all hover:border-brand/30 hover:shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-ink/[0.04] dark:border-white/[0.04]">
                  <span className="font-extrabold text-ink dark:text-white text-base">Room {idx + 1}</span>
                  {rooms.length > 1 && (
                    <button onClick={() => removeRoom(idx)} className="text-danger bg-danger/5 hover:bg-danger transition-colors hover:text-white p-1.5 rounded-lg cursor-pointer" title="Remove Room">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 sm:gap-4">
                  <Counter label="Adults" value={room.adults} onChange={v => updateRoom(idx, 'adults', v)} min={1} />
                  <Counter label="Youth" value={room.youth} onChange={v => updateRoom(idx, 'youth', v)} />
                  <Counter label="Children" value={room.children} onChange={v => updateRoom(idx, 'children', v)} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Solo: Sharing */}
      {category === 'solo' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h4 className="font-bold text-ink/70 dark:text-white/70">Sharing Preference</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'single', label: 'Single Room', desc: 'Private room' },
              { id: 'two', label: 'Two Sharing', desc: 'Share with 1 person' },
              { id: 'three', label: 'Three Sharing', desc: 'Share with 2 persons' },
              { id: 'stranger', label: 'Shared with Stranger', desc: 'Budget option' },
            ].map(s => (
              <motion.button key={s.id} onClick={() => setSoloSharing(s.id)}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-5 rounded-2xl transition-all cursor-pointer border shadow-sm flex flex-col items-start
                  ${soloSharing === s.id
                    ? 'bg-gradient-to-br from-brand to-purple-500 text-white border-white/20 shadow-[0_8px_25px_rgba(79,70,229,0.3)]'
                    : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:-translate-y-1'
                  }`}>
                <div className={`font-bold text-sm tracking-tight ${soloSharing === s.id ? 'text-white' : 'text-ink/80 dark:text-white/80'}`}>{s.label}</div>
                <div className={`text-xs mt-1 ${soloSharing === s.id ? 'text-white/80' : 'text-ink/50 dark:text-white/50'}`}>{s.desc}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP 3: CITIES
   ════════════════════════════════════════════════════════════ */
function StepCities() {
  const { selectedCities, toggleCity, cityNights, setCityNights, duration, nights } = usePlannerStore();

  return (
    <div className="space-y-8">
      <StepHeader icon={MapPin} title="Pick your cities" desc="Choose one or more Swiss cities to visit" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cities.map((city, i) => {
          const isSelected = selectedCities.includes(city.id);
          return (
            <motion.div key={city.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCity(city.id)}
              className={`group relative h-56 lg:h-64 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300
                ${isSelected ? 'ring-4 ring-brand shadow-[0_10px_40px_-10px_rgba(79,70,229,0.6)]' : 'shadow-lg hover:shadow-2xl hover:shadow-brand/20'}`}>

              {/* Image with zoom effect */}
              <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              {isSelected && <div className="absolute inset-0 bg-brand/20 mix-blend-overlay" />}

              {/* Checkmark indicator */}
              <div className="absolute top-4 right-4 z-10">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isSelected ? 1 : 0.9,
                    backgroundColor: isSelected ? 'rgba(79, 70, 229, 1)' : 'rgba(255, 255, 255, 0.2)'
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors duration-300
                    ${isSelected ? 'border-brand shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'border-white/30'}`}>
                  <motion.div
                    initial={false}
                    animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform transition-transform duration-500 group-hover:-translate-y-1">
                <motion.h3
                  layout
                  className="text-2xl font-extrabold tracking-tight mb-1 drop-shadow-md">
                  {city.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0.7, height: 'auto' }}
                  className="text-xs text-white/80 line-clamp-2 leading-relaxed drop-shadow-sm">
                  {city.description}
                </motion.p>
              </div>

              {/* Selection glow effect */}
              {isSelected && (
                <motion.div
                  layoutId="cityGlow"
                  className="absolute inset-0 rounded-[2rem] ring-2 ring-white/50 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedCities.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white/80 dark:bg-d-card/80 backdrop-blur-xl rounded-3xl p-6 border border-ink/[0.08] dark:border-white/[0.08] space-y-4 shadow-xl shadow-brand/5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-extrabold text-ink dark:text-white text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand" />
              Nights Per City
            </h4>
            <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-bold">
              {nights} nights total
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCities.map(cId => {
              const city = cities.find(c => c.id === cId);
              return (
                <motion.div key={cId} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between bg-canvas dark:bg-d-canvas p-3 rounded-2xl border border-ink/[0.05] dark:border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <img src={city?.image} alt={city?.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    <span className="font-bold text-ink dark:text-white">{city?.name}</span>
                  </div>
                  <Counter label="" value={cityNights[cId] || 1} onChange={v => setCityNights(cId, v)} min={1} max={nights} inline />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP 4: HOTELS
   ════════════════════════════════════════════════════════════ */
function StepHotels() {
  const { hotelCategory, setHotelCategory, selectedCities, selectedHotels, setHotelForCity } = usePlannerStore();
  const cats = ['3 Star', '4 Star', '5 Star', 'none'];
  const [activeTab, setActiveTab] = useState(selectedCities[0] || null);

  useEffect(() => {
    if (!selectedCities.includes(activeTab)) setActiveTab(selectedCities[0] || null);
  }, [selectedCities, activeTab]);

  return (
    <div className="space-y-8">
      <StepHeader icon={Hotel} title="Where will you stay?" desc="Select your preferred accommodation level" />
      <div className="flex flex-wrap gap-3">
        {cats.map((cat, i) => (
          <motion.button key={cat} onClick={() => setHotelCategory(cat)}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`py-3 px-4 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border shadow-sm flex-1 min-w-[120px]
              ${hotelCategory === cat
                ? 'bg-gradient-to-br from-brand to-purple-600 text-white border-white/20 shadow-md ring-1 ring-brand/50 z-10'
                : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md text-ink/70 dark:text-white/70 border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:shadow-sm'
              }`}>
            {cat === 'none' ? <span className="text-xl">❌</span> : <span className="text-xl drop-shadow-sm">⭐</span>}
            <span className={`text-sm tracking-tight ${hotelCategory === cat ? 'text-white' : 'text-ink dark:text-white'}`}>{cat === 'none' ? 'No Accom.' : `${cat}`}</span>
          </motion.button>
        ))}
      </div>

      {hotelCategory !== 'none' && selectedCities.length > 0 && (
        <div className="bg-white/50 dark:bg-d-card/50 backdrop-blur-md rounded-[2.5rem] border border-ink/[0.04] dark:border-white/[0.04] p-5 lg:p-6 shadow-sm mt-6">
          {selectedCities.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-6 p-1 bg-white shadow-sm dark:bg-d-canvas/50 rounded-2xl w-fit border border-ink/[0.04] dark:border-white/[0.04]">
              {selectedCities.map(cId => {
                const city = cities.find(c => c.id === cId);
                return (
                  <button key={cId} onClick={() => setActiveTab(cId)}
                    className={`relative px-4 py-2 rounded-xl font-bold text-sm transition-all focus:outline-none flex-1 sm:flex-none whitespace-nowrap cursor-pointer
                      ${activeTab === cId ? 'text-white' : 'text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-ink/[0.03] dark:hover:bg-white/[0.03]'}`}>
                    {activeTab === cId && (
                      <motion.div layoutId="hotelCityTab" className="absolute inset-0 bg-gradient-to-r from-brand to-purple-500 rounded-xl z-0 shadow-sm" />
                    )}
                    <span className="relative z-10">{city?.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedCities.map(cId => {
              if (cId !== activeTab) return null;
              const city = cities.find(c => c.id === cId);
              const cityHotels = hotels.filter(h => h.cityId === cId);
              const selected = selectedHotels[cId];
              return (
                <motion.div key={cId} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                  <h5 className="font-bold text-ink dark:text-white mb-4 flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-brand" /> Exploring {city?.name}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cityHotels.map(h => (
                      <motion.div key={h.id} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setHotelForCity(cId, h.id)}
                        className={`flex flex-col overflow-hidden rounded-[1.25rem] text-left transition-all cursor-pointer border shadow-sm relative group
                          ${selected === h.id
                            ? 'bg-brand/5 dark:bg-brand/10 border-brand shadow-[0_8px_30px_rgba(79,70,229,0.2)] ring-1 ring-brand'
                            : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:border-brand/30 hover:shadow-md'
                          }`}>
                        <div className="h-32 w-full relative overflow-hidden">
                          <img src={h.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={h.name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          {selected === h.id && (
                            <div className="absolute top-2 right-2 bg-brand text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                              <Check className="w-4 h-4" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col bg-white/50 dark:bg-d-card/50 backdrop-blur-sm">
                          <div className={`font-bold text-base leading-tight mb-1 tracking-tight ${selected === h.id ? 'text-brand dark:text-brand-hover' : 'text-ink dark:text-white'}`}>{h.name}</div>
                          <div className="text-xs font-semibold opacity-70 mb-3">{h.category}</div>
                          <div className="mt-auto flex items-baseline gap-1">
                            <span className="font-bold text-lg">CHF {h.price}</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">/night</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP 5: TRANSPORT
   ════════════════════════════════════════════════════════════ */
function StepTransport() {
  const { vehicleCategory, setVehicleCategory, travelType, setTravelType } = usePlannerStore();

  const getVehicleIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'economy': return <Car className="w-8 h-8" />;
      case 'standard': return <CarFront className="w-8 h-8" />;
      case 'premium': return <ShieldCheck className="w-8 h-8" />;
      default: return <Car className="w-8 h-8" />;
    }
  };

  const getTravelIcon = (id) => {
    switch (id) {
      case 'self_drive': return <Map className="w-7 h-7" />;
      case 'seat_in_coach': return <BusFront className="w-7 h-7" />;
      case 'chauffeur': return <Navigation className="w-7 h-7" />;
      default: return <Car className="w-7 h-7" />;
    }
  };

  return (
    <div className="space-y-8">
      <StepHeader icon={Car} title="How will you travel?" desc="Choose your vehicle and travel style" />
      <div>
        <h4 className="font-bold text-ink/50 dark:text-white/50 mb-4 text-sm uppercase tracking-wider">Vehicle Class</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {transportOptions.map((t, i) => (
            <motion.button key={t.id} onClick={() => setVehicleCategory(t.type)}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-[2rem] text-left transition-all cursor-pointer relative overflow-hidden border shadow-sm group
                ${vehicleCategory === t.type
                  ? 'bg-gradient-to-br from-brand to-purple-600 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] border-white/20 z-10'
                  : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:shadow-xl text-ink dark:text-white'
                }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors shadow-inner relative z-10
                ${vehicleCategory === t.type ? 'bg-white/20' : 'bg-brand/10 dark:bg-white/5 text-brand dark:text-white border border-brand/10 dark:border-white/10 group-hover:bg-brand/20'}`}>
                {getVehicleIcon(t.type)}
              </div>
              <div className="relative z-10">
                <div className="font-black text-xl tracking-tight mb-1 capitalize">{t.type}</div>
                <div className={`text-sm font-medium mb-3 ${vehicleCategory === t.type ? 'text-white/80' : 'text-ink/60 dark:text-white/50'}`}>{t.seats} seats maximum</div>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className={`font-bold text-lg ${vehicleCategory === t.type ? 'text-white' : 'text-brand'}`}>CHF {t.pricePerKm}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${vehicleCategory === t.type ? 'text-white/60' : 'text-ink/40 dark:text-white/40'}`}>/km</span>
                </div>
              </div>
              {vehicleCategory === t.type && (
                <motion.div layoutId="vehicleGlow" className="absolute -inset-4 bg-white/20 blur-2xl rounded-[3rem] -z-0 pointer-events-none" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-bold text-ink/50 dark:text-white/50 mb-4 text-sm uppercase tracking-wider">Travel Style</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {travelTypes.map((t, i) => (
            <motion.button key={t.id} onClick={() => setTravelType(t.id)}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col gap-3 p-5 rounded-[1.5rem] text-left transition-all cursor-pointer border shadow-sm
                ${travelType === t.id
                  ? 'bg-brand/10 dark:bg-brand/20 border-brand shadow-[0_4px_20px_rgba(79,70,229,0.15)] ring-1 ring-brand text-ink dark:text-white'
                  : 'bg-white dark:bg-d-card border-ink/[0.05] dark:border-white/[0.05] hover:border-brand/30 hover:shadow-md text-ink/80 dark:text-white/80'
                }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${travelType === t.id ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-ink/5 dark:bg-white/5 text-ink/50 dark:text-white/50 group-hover:text-brand'}`}>
                {getTravelIcon(t.id)}
              </div>
              <div>
                <div className="font-bold tracking-tight mb-1">{t.label}</div>
                <div className="text-xs font-medium opacity-60 leading-relaxed">{t.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP 6: GUIDE
   ════════════════════════════════════════════════════════════ */
function StepGuide() {
  const { category, tourManagerRequired, setTourManager, localGuideRequired, setLocalGuide } = usePlannerStore();

  return (
    <div className="space-y-8">
      <StepHeader icon={UserCheck} title="Need a guide?" desc="Add a tour manager or local guide" />
      {category !== 'family' && (
        <div className="bg-brand/[0.06] p-4 rounded-2xl border border-brand/15">
          <p className="text-sm font-medium text-brand dark:text-brand">Guide options are typically used for group tours. You can skip this.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button onClick={() => setTourManager(!tourManagerRequired)}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 md:p-8 rounded-[2rem] text-left transition-all cursor-pointer relative overflow-hidden border shadow-sm group flex flex-col items-center text-center
            ${tourManagerRequired
              ? 'bg-gradient-to-br from-brand to-purple-600 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] border-white/20 z-10'
              : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:shadow-xl text-ink dark:text-white'
            }`}>
          <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-6 transition-colors shadow-inner relative z-10
            ${tourManagerRequired ? 'bg-white/20' : 'bg-brand/10 dark:bg-white/5 text-brand dark:text-white border border-brand/10 dark:border-white/10 group-hover:bg-brand/20 group-hover:scale-110 duration-300'}`}>
            <UserCheck className="w-10 h-10" />
            {tourManagerRequired && (
              <div className="absolute -top-2 -right-2 bg-white text-brand w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5" strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="relative z-10 flex flex-col items-center flex-1">
            <div className="font-black text-2xl tracking-tight mb-2">Tour Manager</div>
            <div className={`text-sm font-medium mb-6 ${tourManagerRequired ? 'text-white/80' : 'text-ink/60 dark:text-white/50'}`}>Professional tour manager for the entire trip</div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className={`font-bold text-2xl ${tourManagerRequired ? 'text-white' : 'text-brand'}`}>CHF 150</span>
              <span className={`text-xs uppercase tracking-widest font-bold ${tourManagerRequired ? 'text-white/60' : 'text-ink/40 dark:text-white/40'}`}>/day</span>
            </div>
          </div>
          {tourManagerRequired && (
            <motion.div layoutId="guideGlow1" className="absolute -inset-4 bg-white/20 blur-2xl rounded-[3rem] -z-0 pointer-events-none" />
          )}
        </motion.button>

        <motion.button onClick={() => setLocalGuide(!localGuideRequired)}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 md:p-8 rounded-[2rem] text-left transition-all cursor-pointer relative overflow-hidden border shadow-sm group flex flex-col items-center text-center
            ${localGuideRequired
              ? 'bg-gradient-to-br from-brand to-purple-600 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] border-white/20 z-10'
              : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:shadow-xl text-ink dark:text-white'
            }`}>
          <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-6 transition-colors shadow-inner relative z-10
            ${localGuideRequired ? 'bg-white/20' : 'bg-brand/10 dark:bg-white/5 text-brand dark:text-white border border-brand/10 dark:border-white/10 group-hover:bg-brand/20 group-hover:scale-110 duration-300'}`}>
            <MapPin className="w-10 h-10" />
            {localGuideRequired && (
              <div className="absolute -top-2 -right-2 bg-white text-brand w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5" strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="relative z-10 flex flex-col items-center flex-1">
            <div className="font-black text-2xl tracking-tight mb-2">Local Guide</div>
            <div className={`text-sm font-medium mb-6 ${localGuideRequired ? 'text-white/80' : 'text-ink/60 dark:text-white/50'}`}>Local expert guide at each destination city</div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className={`font-bold text-2xl ${localGuideRequired ? 'text-white' : 'text-brand'}`}>CHF 100</span>
              <span className={`text-xs uppercase tracking-widest font-bold ${localGuideRequired ? 'text-white/60' : 'text-ink/40 dark:text-white/40'}`}>/day</span>
            </div>
          </div>
          {localGuideRequired && (
            <motion.div layoutId="guideGlow2" className="absolute -inset-4 bg-white/20 blur-2xl rounded-[3rem] -z-0 pointer-events-none" />
          )}
        </motion.button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP 7: MEALS
   ════════════════════════════════════════════════════════════ */
function StepMeals() {
  const { mealPreference, setMealPreference, dietaryPreference, toggleDietary } = usePlannerStore();

  return (
    <div className="space-y-8">
      <StepHeader icon={UtensilsCrossed} title="Meal preferences" desc="Choose your meal plan and dietary needs" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {mealOptions.map(m => (
          <motion.button key={m.id} onClick={() => setMealPreference(m.id)}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-[2rem] text-center transition-all cursor-pointer
              ${mealPreference === m.id
                ? 'bg-gradient-to-br from-brand to-purple-600 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] border border-white/20'
                : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/30 text-ink/70 dark:text-white/70 shadow-sm'
              }`}>
            <div className="text-3xl mb-3">{m.icon}</div>
            <div className="font-bold text-lg">{m.label}</div>
            <div className="text-xs opacity-60 mt-1">{m.description}</div>
            {m.price > 0 && <div className={`text-sm font-bold mt-3 ${mealPreference === m.id ? 'text-white/90' : 'text-brand'}`}>CHF {m.price}/day</div>}
          </motion.button>
        ))}
      </div>

      {mealPreference !== 'no_meals' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h4 className="font-bold text-ink/50 dark:text-white/50 text-sm uppercase tracking-wider">Dietary Preferences</h4>
          <div className="flex flex-wrap gap-3">
            {dietaryPreferences.map(d => (
              <motion.button key={d.id} onClick={() => toggleDietary(d.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer
                  ${dietaryPreference.includes(d.id)
                    ? 'bg-brand text-white shadow-md shadow-brand/25 ring-2 ring-brand ring-offset-2 ring-offset-canvas'
                    : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border border-ink/[0.06] dark:border-white/[0.06] text-ink/60 dark:text-white/60 hover:bg-white dark:hover:bg-d-card hover:border-brand/20 shadow-sm'
                  }`}>
                {d.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP 8: SIGHTSEEING
   ════════════════════════════════════════════════════════════ */
function StepSightseeing() {
  const { selectedCities, includeSightseeing, setIncludeSightseeing, selectedSightseeings, toggleSightseeing } = usePlannerStore();
  const [activeTab, setActiveTab] = useState(selectedCities[0] || null);

  useEffect(() => {
    if (!selectedCities.includes(activeTab)) setActiveTab(selectedCities[0] || null);
  }, [selectedCities, activeTab]);

  return (
    <div className="space-y-8">
      <StepHeader icon={Eye} title="Sightseeing" desc="Select must-see places for your cities" />
      <ToggleOption label="Include Sightseeing" desc="Add curated sightseeing to your plan"
        value={includeSightseeing} onChange={setIncludeSightseeing} />

      {includeSightseeing && selectedCities.length > 0 && (
        <div className="bg-white/50 dark:bg-d-card/50 backdrop-blur-md rounded-[2.5rem] border border-ink/[0.04] dark:border-white/[0.04] p-5 lg:p-6 shadow-sm mt-6">
          {selectedCities.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-6 p-1 bg-white shadow-sm dark:bg-d-canvas/50 rounded-2xl w-fit border border-ink/[0.04] dark:border-white/[0.04]">
              {selectedCities.map(cId => {
                const city = cities.find(c => c.id === cId);
                return (
                  <button key={cId} onClick={() => setActiveTab(cId)}
                    className={`relative px-4 py-2 rounded-xl font-bold text-sm transition-all focus:outline-none flex-1 sm:flex-none whitespace-nowrap cursor-pointer
                      ${activeTab === cId ? 'text-white' : 'text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-ink/[0.03] dark:hover:bg-white/[0.03]'}`}>
                    {activeTab === cId && (
                      <motion.div layoutId="sightCityTab" className="absolute inset-0 bg-gradient-to-r from-brand to-purple-500 rounded-xl z-0 shadow-sm" />
                    )}
                    <span className="relative z-10">{city?.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedCities.map(cId => {
              if (cId !== activeTab) return null;
              const city = cities.find(c => c.id === cId);
              const citySights = sightseeings.filter(s => s.cityId === cId);
              if (citySights.length === 0) return (<div key={cId} className="text-ink/50 dark:text-white/50 py-4 font-medium italic">No curated sights currently available for {city?.name}.</div>);

              return (
                <motion.div key={cId} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                  <h5 className="font-bold text-ink dark:text-white mb-4 flex items-center gap-2 text-lg">
                    <Eye className="w-5 h-5 text-brand" /> Must-visit in {city?.name}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {citySights.map(s => {
                      const isSelected = selectedSightseeings.includes(s.id);
                      return (
                        <motion.div key={s.id} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => toggleSightseeing(s.id)}
                          className={`flex flex-col overflow-hidden rounded-[1.25rem] text-left transition-all cursor-pointer border shadow-sm relative group
                            ${isSelected
                              ? 'bg-brand/5 dark:bg-brand/10 border-brand shadow-[0_8px_30px_rgba(79,70,229,0.2)] ring-1 ring-brand'
                              : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:border-brand/30 hover:shadow-md'
                            }`}>
                          <div className="h-32 w-full relative overflow-hidden">
                            <img src={s.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={s.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-brand text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                                <Check className="w-4 h-4" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex-1 flex flex-col bg-white/50 dark:bg-d-card/50 backdrop-blur-sm">
                            <div className={`font-bold text-base leading-tight mb-1 tracking-tight ${isSelected ? 'text-brand dark:text-brand-hover' : 'text-ink dark:text-white'}`}>{s.name}</div>
                            <div className="text-xs font-semibold opacity-70 mb-3">{s.duration}</div>
                            <div className="mt-auto flex items-baseline gap-1">
                              {s.cost === 0 ? (
                                <span className="font-bold text-lg text-emerald-500">Free</span>
                              ) : (
                                <>
                                  <span className="font-bold text-lg">CHF {s.cost}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP 9: ACTIVITIES
   ════════════════════════════════════════════════════════════ */
function StepActivities() {
  const { selectedCities, selectedActivities, toggleActivity } = usePlannerStore();
  const [activeTab, setActiveTab] = useState(selectedCities[0] || null);

  useEffect(() => {
    if (!selectedCities.includes(activeTab)) setActiveTab(selectedCities[0] || null);
  }, [selectedCities, activeTab]);

  return (
    <div className="space-y-8">
      <StepHeader icon={Zap} title="Pick activities" desc="Choose exciting experiences for each city" />
      {selectedCities.length > 0 && (
        <div className="bg-white/50 dark:bg-d-card/50 backdrop-blur-md rounded-[2.5rem] border border-ink/[0.04] dark:border-white/[0.04] p-5 lg:p-6 shadow-sm mt-6">
          {selectedCities.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-6 p-1 bg-white shadow-sm dark:bg-d-canvas/50 rounded-2xl w-fit border border-ink/[0.04] dark:border-white/[0.04]">
              {selectedCities.map(cId => {
                const city = cities.find(c => c.id === cId);
                return (
                  <button key={cId} onClick={() => setActiveTab(cId)}
                    className={`relative px-4 py-2 rounded-xl font-bold text-sm transition-all focus:outline-none flex-1 sm:flex-none whitespace-nowrap cursor-pointer
                      ${activeTab === cId ? 'text-white' : 'text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-ink/[0.03] dark:hover:bg-white/[0.03]'}`}>
                    {activeTab === cId && (
                      <motion.div layoutId="actCityTab" className="absolute inset-0 bg-gradient-to-r from-brand to-purple-500 rounded-xl z-0 shadow-sm" />
                    )}
                    <span className="relative z-10">{city?.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedCities.map(cId => {
              if (cId !== activeTab) return null;
              const city = cities.find(c => c.id === cId);
              const cityActs = activities.filter(a => a.cityId === cId);
              if (cityActs.length === 0) return (<div key={cId} className="text-ink/50 dark:text-white/50 py-4 font-medium italic">No curated activities currently available for {city?.name}.</div>);

              return (
                <motion.div key={cId} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                  <h5 className="font-bold text-ink dark:text-white mb-4 flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-brand" /> Top Experiences in {city?.name}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cityActs.map(act => {
                      const isSelected = selectedActivities.includes(act.id);
                      return (
                        <motion.div key={act.id} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => toggleActivity(act.id)}
                          className={`flex flex-col overflow-hidden rounded-[1.25rem] text-left transition-all cursor-pointer border shadow-sm relative group
                            ${isSelected
                              ? 'bg-brand/5 dark:bg-brand/10 border-brand shadow-[0_8px_30px_rgba(79,70,229,0.2)] ring-1 ring-brand'
                              : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:border-brand/30 hover:shadow-md'
                            }`}>
                          <div className="h-32 w-full relative overflow-hidden">
                            <img src={act.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={act.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-brand text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                                <Check className="w-4 h-4" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex-1 flex flex-col bg-white/50 dark:bg-d-card/50 backdrop-blur-sm">
                            <div className={`font-bold text-base leading-tight mb-1 tracking-tight ${isSelected ? 'text-brand dark:text-brand-hover' : 'text-ink dark:text-white'}`}>{act.title}</div>
                            <div className="text-xs font-semibold opacity-70 mb-3">{act.duration} • {act.shift}</div>
                            <div className="mt-auto flex items-baseline gap-1">
                              {act.price === 0 ? (
                                <span className="font-bold text-lg text-emerald-500">Free</span>
                              ) : (
                                <>
                                  <span className="font-bold text-lg">CHF {act.price}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ════════════════════════════════════════════════════════════ */
function StepHeader({ icon: Icon, title, desc }) {
  return (
    <div className="mb-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/15 flex items-center justify-center text-brand">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-ink dark:text-white">{title}</h2>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="text-ink/45 dark:text-white/50 font-medium ml-15 text-sm">{desc}</motion.p>
    </div>
  );
}

function Counter({ label, value, onChange, min = 0, max = 20, inline }) {
  return (
    <div className={`flex items-center ${inline ? 'gap-3' : 'gap-2 flex-col'}`}>
      {label && <span className="text-xs font-bold text-ink/45">{label}</span>}
      <div className="flex items-center gap-2">
        <button onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }}
          className="w-8 h-8 rounded-lg bg-ink/[0.04] dark:bg-white/[0.06] border border-ink/[0.08] dark:border-white/[0.08] flex items-center justify-center text-ink/50 dark:text-white/50 hover:bg-ink/[0.08] dark:hover:bg-white/[0.1] hover:text-ink dark:hover:text-white cursor-pointer transition-all">
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center font-bold text-ink dark:text-white">{value}</span>
        <button onClick={(e) => { e.stopPropagation(); onChange(Math.min(max, value + 1)); }}
          className="w-8 h-8 rounded-lg bg-ink/[0.04] dark:bg-white/[0.06] border border-ink/[0.08] dark:border-white/[0.08] flex items-center justify-center text-ink/50 dark:text-white/50 hover:bg-ink/[0.08] dark:hover:bg-white/[0.1] hover:text-ink dark:hover:text-white cursor-pointer transition-all">
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function ToggleOption({ label, desc, value, onChange }) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }}
      className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all shadow-sm
        ${value ? 'bg-brand/10 dark:bg-brand/20 border-brand/50 ring-1 ring-brand/30' : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border border-ink/[0.04] dark:border-white/[0.04] hover:bg-brand/[0.03] dark:hover:bg-brand/[0.06] hover:border-brand/20'}`}
      onClick={() => onChange(!value)}>
      <div>
        <div className="font-bold text-ink dark:text-white">{label}</div>
        <div className="text-sm text-ink/40 dark:text-white/40 mt-0.5">{desc}</div>
      </div>
      <div className={`w-12 h-7 rounded-full flex items-center transition-all p-1 cursor-pointer shrink-0 ml-4
        ${value ? 'bg-brand shadow-md shadow-brand/25' : 'bg-ink/10 dark:bg-white/10'}`}>
        <motion.div layout className={`w-5 h-5 rounded-full bg-white shadow-md ${value ? 'ml-auto' : ''}`} />
      </div>
    </motion.div>
  );
}

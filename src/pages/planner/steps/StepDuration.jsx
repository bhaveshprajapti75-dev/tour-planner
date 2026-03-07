import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarRange, Crown, ChevronDown } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';

const INITIAL_DAYS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const MORE_DAYS = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const POPULAR_DAYS = new Set([4, 7, 10, 14]);
const PREMIUM_DAYS = new Set([21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);

export default function StepDuration() {
  const { totalDays, setTotalDays, startDate, setStartDate } = usePlannerStore();
  const [showMore, setShowMore] = useState(false);

  const visibleDays = showMore ? [...INITIAL_DAYS, ...MORE_DAYS] : INITIAL_DAYS;

  // Compute end-date for calendar highlight
  const startDateObj = startDate ? new Date(startDate) : null;
  const endDateObj = startDateObj && totalDays > 0
    ? new Date(new Date(startDateObj).setDate(startDateObj.getDate() + totalDays - 1))
    : null;

  const handleDateChange = (date) => {
    if (!date) { setStartDate(null); return; }
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setStartDate(`${y}-${m}-${d}`);
  };

  return (
    <div className="space-y-8">
      <StepHeader icon={CalendarRange} title="When & How Long?" desc="Enter your trip duration and choose a start date" />

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* LEFT: Duration cards */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-bold text-ink/70 dark:text-white/70 mb-4">
            Number of Days
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {visibleDays.map(d => (
              <motion.button
                key={d}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTotalDays(d)}
                className={`relative py-2 px-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border group
                  ${totalDays === d
                    ? 'bg-gradient-to-br from-brand to-purple-600 text-white border-transparent shadow-lg'
                    : 'bg-white dark:bg-d-card border-ink/[0.08] dark:border-white/[0.08] text-ink/80 dark:text-white/80 hover:border-brand/30 hover:shadow-md'
                  }`}
              >
                <div className="flex flex-col items-center">
                  {POPULAR_DAYS.has(d) && (
                    <Crown
                      size={11}
                      className={`mb-0.5 ${
                        totalDays === d ? 'text-amber-300' : 'text-amber-500'
                      }`}
                      fill="currentColor"
                    />
                  )}
                  
                  {PREMIUM_DAYS.has(d) && (
                    <Crown
                      size={11}
                      className={`mb-0.5 ${
                        totalDays === d ? 'text-amber-300' : 'text-amber-500'
                      }`}
                      fill="currentColor"
                    />
                  )}
                  
                  <span className={`text-lg font-bold leading-none ${totalDays === d ? 'text-white' : 'text-brand'}`}>
                    {d}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${totalDays === d ? 'text-white/80' : 'text-ink/50 dark:text-white/50'}`}>
                    {d === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </motion.button>
            ))}

            {!showMore && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMore(true)}
                className="py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-dashed border-brand/30 bg-brand/5 dark:bg-brand/10 text-brand hover:border-brand/40 hover:shadow-md flex flex-col items-center justify-center gap-0.5"
              >
                <span>More</span>
                <ChevronDown size={12} />
              </motion.button>
            )}
          </div>

          {totalDays > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm font-semibold text-brand"
            >
              {totalDays} day{totalDays !== 1 ? 's' : ''} / {totalDays - 1} night{totalDays - 1 !== 1 ? 's' : ''}
            </motion.p>
          )}
        </div>

        {/* RIGHT: Calendar */}
        <div className="shrink-0 flex flex-col items-center">
          <label className="block text-sm font-bold text-ink/70 dark:text-white/70 mb-3 self-start">
            Start Date <span className="text-xs font-normal opacity-50">(optional)</span>
          </label>
          <div className="planner-datepicker">
            <DatePicker
              selected={startDateObj}
              onChange={handleDateChange}
              startDate={startDateObj}
              endDate={endDateObj}
              selectsStart
              minDate={new Date()}
              monthsShown={1}
              inline
              highlightDates={
                startDateObj && endDateObj
                  ? Array.from({ length: totalDays }, (_, i) => {
                    const d = new Date(startDateObj);
                    d.setDate(d.getDate() + i);
                    return d;
                  })
                  : []
              }
            />
          </div>
          <AnimatePresence>
            {startDateObj && endDateObj && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-xs font-semibold text-brand/80"
              >
                {startDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' → '}
                {endDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

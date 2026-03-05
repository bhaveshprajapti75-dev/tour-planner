import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarRange, ArrowLeft, ArrowRight, Train } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';
import CustomSelect from '../../../components/planner/CustomSelect';

export default function StepDuration() {
  const { totalDays, setTotalDays, startDate, setStartDate, selectedCountry } = usePlannerStore();
  return (
    <div className="space-y-8">
      <StepHeader icon={CalendarRange} title="When & How Long?" desc="Pick your start date and duration" />
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* LEFT: TRIP DURATION */}
        <div className="flex-[1.8] space-y-4 order-last md:order-first">
          <label className="block text-sm font-bold text-ink/70 dark:text-white/70">Trip Duration</label>
          <div className="flex flex-wrap gap-3">
            {[3, 4, 5, 6, 7, 8, 9, 10, 12, 14].map(d => (
              <motion.button key={d} onClick={() => setTotalDays(d)}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-3 px-5 min-w-[5rem] flex flex-col items-center justify-center rounded-[1.25rem] transition-all cursor-pointer border shadow-sm
                  ${totalDays === d
                    ? 'bg-gradient-to-br from-brand to-purple-600 text-white border-white/20 shadow-[0_8px_25px_rgba(79,70,229,0.35)] z-10'
                    : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] text-ink/70 dark:text-white/70 hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:shadow-md'
                  }`}>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black tracking-tight">{d}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${totalDays === d ? 'opacity-90' : 'opacity-60'}`}>days</span>
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
      {totalDays > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-brand/[0.06] rounded-2xl p-4 border border-brand/15">
          <p className="text-sm font-semibold text-brand flex items-center gap-2">
            <Train className="w-4 h-4" />
            {totalDays} days / {Math.max(totalDays - 1, 1)} nights{selectedCountry ? ` across ${selectedCountry.name}` : ''}
          </p>
        </motion.div>
      )}
    </div>
  );
}

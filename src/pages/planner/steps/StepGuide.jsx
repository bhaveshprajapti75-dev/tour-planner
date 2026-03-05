import { motion } from 'framer-motion';
import { UserCheck, MapPin, Check } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';

export default function StepGuide() {
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

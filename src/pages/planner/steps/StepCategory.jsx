import { motion } from 'framer-motion';
import { Users, Heart, Compass } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';

const types = [
  { id: 'COUPLE', label: 'Couple', desc: 'Romantic getaway for two', icon: Heart },
  { id: 'GROUP', label: 'Group / Family', desc: 'Multi-person group trip', icon: Users },
  { id: 'SOLO', label: 'Solo', desc: 'Independent adventure', icon: Compass },
];

export default function StepCategory() {
  const { travelType, setTravelType } = usePlannerStore();

  return (
    <div className="space-y-8">
      <StepHeader icon={Users} title="Who's traveling?" desc="Select your travel type" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {types.map((c, i) => {
          const Icon = c.icon;
          const selected = travelType === c.id;
          return (
            <motion.button key={c.id} onClick={() => setTravelType(c.id)}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`text-left p-6 lg:p-8 rounded-[2rem] transition-all cursor-pointer flex flex-col items-start border shadow-sm
                ${selected
                  ? 'bg-gradient-to-br from-brand to-purple-600 text-white border-white/20 shadow-[0_8px_30px_rgba(79,70,229,0.3)] z-10'
                  : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:shadow-xl'
                }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-inner
                ${selected ? 'bg-white/20' : 'bg-brand/10 dark:bg-white/5 text-brand dark:text-white border border-brand/10 dark:border-white/10'}`}>
                <Icon className={`w-7 h-7 stroke-[2.5] ${selected ? 'text-white' : ''}`} />
              </div>
              <div className={`font-black tracking-tight text-2xl ${selected ? 'text-white' : 'text-ink dark:text-white'}`}>{c.label}</div>
              <div className={`text-sm mt-3 font-medium leading-relaxed ${selected ? 'text-white/80' : 'text-ink/60 dark:text-white/50'}`}>{c.desc}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

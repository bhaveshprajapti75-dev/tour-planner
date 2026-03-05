import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';
import { mealOptions, dietaryPreferences } from '../../../data/mockData';

export default function StepMeals() {
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

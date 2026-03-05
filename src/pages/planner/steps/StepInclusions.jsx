import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListChecks, Check, Loader2, X as XIcon } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';

export default function StepInclusions() {
  const { inclusionsData, inclusionsLoading, selectedInclusions, selectedCountry,
    fetchInclusions, toggleInclusion, initInclusionsFromTemplate } = usePlannerStore();

  useEffect(() => {
    if (selectedCountry && !inclusionsData) {
      fetchInclusions(selectedCountry.id);
    }
  }, [selectedCountry]);

  // Pre-select from template on first load
  useEffect(() => {
    if (inclusionsData && selectedInclusions.length === 0) {
      initInclusionsFromTemplate();
    }
  }, [inclusionsData]);

  if (inclusionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm font-medium text-ink/60 dark:text-white/50">Loading inclusions…</p>
      </div>
    );
  }

  if (!inclusionsData) {
    return (
      <div className="text-center py-12 text-ink/50 dark:text-white/40">
        <p className="text-lg font-semibold">No inclusions data available</p>
      </div>
    );
  }

  const renderSection = (type, icon, colorClass) => {
    const groups = inclusionsData[type];
    if (!groups || Object.keys(groups).length === 0) return null;

    return (
      <div className="space-y-5">
        <h3 className={`font-extrabold text-lg flex items-center gap-2 ${colorClass}`}>
          {icon}
          {type === 'INCLUSION' ? 'Inclusions' : 'Exclusions'}
        </h3>
        {Object.entries(groups).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-bold text-ink/60 dark:text-white/50 uppercase tracking-wider">{category}</h4>
            <div className="space-y-2">
              {items.map((item) => {
                const isSelected = selectedInclusions.includes(item.id);
                return (
                  <motion.button key={item.id}
                    onClick={() => toggleInclusion(item.id)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer border
                      ${isSelected
                        ? 'bg-brand/5 border-brand/20 shadow-sm'
                        : 'bg-white/60 dark:bg-d-card/60 border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/15'
                      }`}>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border-2 transition-all
                      ${isSelected ? 'bg-brand border-brand' : 'border-ink/20 dark:border-white/20'}`}>
                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${isSelected ? 'text-ink dark:text-white' : 'text-ink/70 dark:text-white/60'}`}>
                        {item.service}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-ink/40 dark:text-white/30 mt-0.5 line-clamp-1">{item.notes}</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <StepHeader icon={ListChecks} title="Inclusions & Exclusions" desc="Review and customize what's included in your plan" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inclusions */}
        <div className="bg-white/80 dark:bg-d-card/80 backdrop-blur-md rounded-[2rem] p-6 border border-ink/[0.04] dark:border-white/[0.04] shadow-sm">
          {renderSection('INCLUSION',
            <Check className="w-5 h-5" />,
            'text-green-600 dark:text-green-400'
          )}
        </div>

        {/* Exclusions */}
        <div className="bg-white/80 dark:bg-d-card/80 backdrop-blur-md rounded-[2rem] p-6 border border-ink/[0.04] dark:border-white/[0.04] shadow-sm">
          {renderSection('EXCLUSION',
            <XIcon className="w-5 h-5" />,
            'text-red-500 dark:text-red-400'
          )}
        </div>
      </div>

      {selectedInclusions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-brand/[0.06] rounded-2xl p-4 border border-brand/15">
          <p className="text-sm font-semibold text-brand flex items-center gap-2">
            <ListChecks className="w-4 h-4" />
            {selectedInclusions.length} item{selectedInclusions.length > 1 ? 's' : ''} selected
          </p>
        </motion.div>
      )}
    </div>
  );
}

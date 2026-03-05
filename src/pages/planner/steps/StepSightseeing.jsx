import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';
import ToggleOption from '../../../components/planner/ToggleOption';
import { cities, sightseeings } from '../../../data/mockData';

export default function StepSightseeing() {
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

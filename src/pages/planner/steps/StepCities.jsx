import { motion } from 'framer-motion';
import { MapPin, Check } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';
import Counter from '../../../components/planner/Counter';
import { cities } from '../../../data/mockData';

export default function StepCities() {
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

              <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              {isSelected && <div className="absolute inset-0 bg-brand/20 mix-blend-overlay" />}

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

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform transition-transform duration-500 group-hover:-translate-y-1">
                <motion.h3 layout className="text-2xl font-extrabold tracking-tight mb-1 drop-shadow-md">
                  {city.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0.7, height: 'auto' }}
                  className="text-xs text-white/80 line-clamp-2 leading-relaxed drop-shadow-sm">
                  {city.description}
                </motion.p>
              </div>

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

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Check, Loader2 } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

function getRegionImage(region) {
  if (region.region_images?.length > 0) {
    const img = region.region_images[0].image;
    if (img.startsWith('http')) return img;
    return `${API_BASE.replace('/api/v1', '')}${img}`;
  }
  return `https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=400&h=300&fit=crop&q=80`;
}

export default function StepRegions() {
  const {
    regions, regionsLoading, selectedRegions, selectedCountry,
    fetchRegions, toggleRegion, totalDays,
  } = usePlannerStore();

  useEffect(() => {
    if (selectedCountry && regions.length === 0) {
      fetchRegions(selectedCountry.id);
    }
  }, [selectedCountry]); // eslint-disable-line react-hooks/exhaustive-deps

  const isSelected = (region) => selectedRegions.some(r => r.id === region.id);

  // Can't select more cities than days
  const atLimit = selectedRegions.length >= totalDays;

  if (regionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm font-medium text-ink/60 dark:text-white/50">Loading cities…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StepHeader
        icon={MapPin}
        title="Select Cities to Visit"
        desc={`Choose cities in ${selectedCountry?.name || 'your destination'}. Max ${totalDays} cities (one per day minimum).`}
      />

      {/* Constraint hint */}
      <div className="flex items-center justify-between bg-brand/[0.06] border border-brand/15 rounded-2xl px-4 py-3">
        <p className="text-sm font-semibold text-brand">
          {selectedRegions.length} of {totalDays} cities selected
        </p>
        <p className="text-xs text-ink/50 dark:text-white/40">
          Each city gets ≥1 day
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {regions.map((region, i) => {
          const selected = isSelected(region);
          const disabled = !selected && atLimit;
          return (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={disabled ? {} : { y: -8, scale: 1.03 }}
              whileTap={disabled ? {} : { scale: 0.95 }}
              onClick={() => !disabled && toggleRegion(region)}
              className={`group relative h-48 lg:h-56 rounded-[2rem] overflow-hidden transition-all duration-300
                ${selected ? 'ring-4 ring-brand shadow-[0_10px_40px_-10px_rgba(79,70,229,0.6)] cursor-pointer' :
                  disabled ? 'opacity-40 cursor-not-allowed' : 'shadow-lg hover:shadow-2xl hover:shadow-brand/20 cursor-pointer'}`}
            >
              <img src={getRegionImage(region)} alt={region.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              {selected && <div className="absolute inset-0 bg-brand/20 mix-blend-overlay" />}

              <div className="absolute top-4 right-4 z-10">
                <motion.div
                  animate={{
                    scale: selected ? 1 : 0.9,
                    backgroundColor: selected ? 'rgba(79, 70, 229, 1)' : 'rgba(255,255,255,0.2)'
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border
                    ${selected ? 'border-brand shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'border-white/30'}`}
                >
                  <motion.div animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}>
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className="text-lg font-extrabold tracking-tight mb-0.5 drop-shadow-md">{region.name}</h3>
                {region.description && (
                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed drop-shadow-sm">{region.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {regions.length === 0 && !regionsLoading && (
        <div className="text-center py-12 text-ink/50 dark:text-white/40">
          <p className="text-lg font-semibold">No cities available</p>
          <p className="text-sm mt-1">Please select a country first</p>
        </div>
      )}
    </div>
  );
}

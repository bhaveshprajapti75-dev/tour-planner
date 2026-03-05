import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Check, Loader2 } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

function getCountryImage(country) {
  if (country.country_images?.length > 0) {
    const img = country.country_images[0].image;
    if (img.startsWith('http')) return img;
    return `${API_BASE.replace('/api/v1', '')}${img}`;
  }
  return `https://flagcdn.com/w640/${(country.code || country.iso_code || 'ch').toLowerCase()}.png`;
}

export default function StepCountry() {
  const { countries, countriesLoading, selectedCountry, setSelectedCountry, fetchCountries } = usePlannerStore();

  useEffect(() => {
    if (countries.length === 0) fetchCountries();
  }, []);

  if (countriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm font-medium text-ink/60 dark:text-white/50">Loading countries…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StepHeader icon={Globe} title="Where do you want to go?" desc="Select a country for your dream tour" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {countries.map((country, i) => {
          const isSelected = selectedCountry?.id === country.id;
          return (
            <motion.div key={country.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCountry(country)}
              className={`group relative h-48 lg:h-56 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300
                ${isSelected ? 'ring-4 ring-brand shadow-[0_10px_40px_-10px_rgba(79,70,229,0.6)]' : 'shadow-lg hover:shadow-2xl hover:shadow-brand/20'}`}>

              <img src={getCountryImage(country)} alt={country.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
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
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className="text-xl font-extrabold tracking-tight mb-1 drop-shadow-md">{country.name}</h3>
                <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">{country.code}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {countries.length === 0 && !countriesLoading && (
        <div className="text-center py-12 text-ink/50 dark:text-white/40">
          <p className="text-lg font-semibold">No countries available yet</p>
          <p className="text-sm mt-1">Please check back later</p>
        </div>
      )}
    </div>
  );
}

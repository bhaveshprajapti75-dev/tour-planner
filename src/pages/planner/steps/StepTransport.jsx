import { motion } from 'framer-motion';
import { Car, CarFront, BusFront, Map, Navigation, ShieldCheck } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';
import { transportOptions, travelTypes } from '../../../data/mockData';

export default function StepTransport() {
  const { vehicleCategory, setVehicleCategory, travelType, setTravelType } = usePlannerStore();

  const getVehicleIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'economy': return <Car className="w-8 h-8" />;
      case 'standard': return <CarFront className="w-8 h-8" />;
      case 'premium': return <ShieldCheck className="w-8 h-8" />;
      default: return <Car className="w-8 h-8" />;
    }
  };

  const getTravelIcon = (id) => {
    switch (id) {
      case 'self_drive': return <Map className="w-7 h-7" />;
      case 'seat_in_coach': return <BusFront className="w-7 h-7" />;
      case 'chauffeur': return <Navigation className="w-7 h-7" />;
      default: return <Car className="w-7 h-7" />;
    }
  };

  return (
    <div className="space-y-8">
      <StepHeader icon={Car} title="How will you travel?" desc="Choose your vehicle and travel style" />
      <div>
        <h4 className="font-bold text-ink/50 dark:text-white/50 mb-4 text-sm uppercase tracking-wider">Vehicle Class</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {transportOptions.map((t, i) => (
            <motion.button key={t.id} onClick={() => setVehicleCategory(t.type)}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-[2rem] text-left transition-all cursor-pointer relative overflow-hidden border shadow-sm group
                ${vehicleCategory === t.type
                  ? 'bg-gradient-to-br from-brand to-purple-600 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] border-white/20 z-10'
                  : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border-ink/[0.04] dark:border-white/[0.04] hover:bg-white dark:hover:bg-d-card hover:border-brand/30 hover:shadow-xl text-ink dark:text-white'
                }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors shadow-inner relative z-10
                ${vehicleCategory === t.type ? 'bg-white/20' : 'bg-brand/10 dark:bg-white/5 text-brand dark:text-white border border-brand/10 dark:border-white/10 group-hover:bg-brand/20'}`}>
                {getVehicleIcon(t.type)}
              </div>
              <div className="relative z-10">
                <div className="font-black text-xl tracking-tight mb-1 capitalize">{t.type}</div>
                <div className={`text-sm font-medium mb-3 ${vehicleCategory === t.type ? 'text-white/80' : 'text-ink/60 dark:text-white/50'}`}>{t.seats} seats maximum</div>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className={`font-bold text-lg ${vehicleCategory === t.type ? 'text-white' : 'text-brand'}`}>CHF {t.pricePerKm}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${vehicleCategory === t.type ? 'text-white/60' : 'text-ink/40 dark:text-white/40'}`}>/km</span>
                </div>
              </div>
              {vehicleCategory === t.type && (
                <motion.div layoutId="vehicleGlow" className="absolute -inset-4 bg-white/20 blur-2xl rounded-[3rem] -z-0 pointer-events-none" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-bold text-ink/50 dark:text-white/50 mb-4 text-sm uppercase tracking-wider">Travel Style</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {travelTypes.map((t, i) => (
            <motion.button key={t.id} onClick={() => setTravelType(t.id)}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col gap-3 p-5 rounded-[1.5rem] text-left transition-all cursor-pointer border shadow-sm
                ${travelType === t.id
                  ? 'bg-brand/10 dark:bg-brand/20 border-brand shadow-[0_4px_20px_rgba(79,70,229,0.15)] ring-1 ring-brand text-ink dark:text-white'
                  : 'bg-white dark:bg-d-card border-ink/[0.05] dark:border-white/[0.05] hover:border-brand/30 hover:shadow-md text-ink/80 dark:text-white/80'
                }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${travelType === t.id ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-ink/5 dark:bg-white/5 text-ink/50 dark:text-white/50 group-hover:text-brand'}`}>
                {getTravelIcon(t.id)}
              </div>
              <div>
                <div className="font-bold tracking-tight mb-1">{t.label}</div>
                <div className="text-xs font-medium opacity-60 leading-relaxed">{t.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

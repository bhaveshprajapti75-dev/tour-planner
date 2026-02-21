import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, MapPin, ArrowRight } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import { cities } from '../../data/mockData';

export default function DestinationsStep() {
    const navigate = useNavigate();
    const { selectedCities, toggleCity, duration } = usePlannerStore();

    const avgNights = selectedCities.length > 0 ? Math.floor(duration / selectedCities.length) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-32 pt-10 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto"
        >
            <div className="mb-14 text-center max-w-2xl mx-auto">
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink dark:text-white mb-4">Choose Your Canvas</h2>
                <p className="text-lg text-ink-light dark:text-white/60 font-medium">
                    Select key waypoints for your {duration}-day journey. Our engine will handle geographic distribution and transitions.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                {cities.map((city) => {
                    const isSelected = selectedCities.includes(city.id);

                    return (
                        <motion.div
                            key={city.id}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => toggleCity(city.id)}
                            className={`group relative h-[450px] w-full bg-white dark:bg-d-card text-left cursor-pointer transition-all rounded-[2.5rem] overflow-hidden shadow-xl
                ${isSelected ? 'ring-4 ring-brand shadow-brand/20' : 'shadow-ink/5 dark:shadow-black/20 hover:shadow-2xl hover:shadow-ink/10 dark:hover:shadow-black/30'}
              `}
                        >
                            <img
                                src={city.image}
                                alt={city.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                            {/* Selection Checkbox (Soft floating icon) */}
                            <div className="absolute top-6 right-6 z-10 transition-transform duration-300">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg
                  ${isSelected ? 'bg-brand text-white scale-110' : 'bg-white/20 backdrop-blur-md text-white/50 border border-white/20 hover:bg-white/40 group-hover:scale-110'}
                `}>
                                    <Check className="w-5 h-5" strokeWidth={isSelected ? 3 : 2} />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-white">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-1 bg-brand rounded-full"></div>
                                    <span className="text-brand font-bold text-sm uppercase tracking-wider">{city.id}</span>
                                </div>
                                <h3 className="text-4xl font-bold tracking-tight mb-3 group-hover:text-brand-100 transition-colors">{city.name}</h3>
                                <p className="text-sm text-white/80 line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {city.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Floating Action Pill (Glassmorphism) */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="fixed bottom-8 left-0 right-0 z-50 pointer-events-none flex justify-center px-4"
            >
                <div className="glass rounded-full p-3 pl-6 flex items-center justify-between pointer-events-auto shadow-2xl shadow-ink/10 max-w-2xl w-full">

                    <div className="flex items-center gap-5">
                        <div className="flex -space-x-3">
                            {selectedCities.length === 0 ? (
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-d-card flex items-center justify-center text-ink-light dark:text-white/50 shadow-inner border border-gray-100 dark:border-white/10">
                                    <MapPin className="w-5 h-5" />
                                </div>
                            ) : (
                                selectedCities.slice(0, 4).map((id, i) => {
                                    const city = cities.find(c => c.id === id);
                                    return (
                                        <img
                                            key={id}
                                            src={city.image}
                                            className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md"
                                            style={{ zIndex: 10 - i }}
                                        />
                                    )
                                })
                            )}
                        </div>

                        <div>
                            <div className="font-extrabold text-ink dark:text-white tracking-tight">
                                {selectedCities.length} Locations Selected
                            </div>
                            <div className="text-xs font-semibold text-ink-light dark:text-white/50">
                                {selectedCities.length > 0 ? `Avg. ${avgNights} nights per hub` : 'Awaiting points of interest'}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/planner/itinerary')}
                        disabled={selectedCities.length === 0}
                        className="flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-brand-hover hover:scale-105 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-brand/20 ml-4"
                    >
                        Compute Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

import { motion } from 'framer-motion';
import { MapPin, Plus, Minus, X, Info } from 'lucide-react';
import usePlannerStore from '../../../store/plannerStore';
import StepHeader from '../../../components/planner/StepHeader';

export default function StepCityDays() {
    const {
        cityAllocations, setCityDays, removeCity,
        totalDays, selectedRegions,
    } = usePlannerStore();

    const allocatedTotal = cityAllocations.reduce((s, a) => s + a.days, 0);
    const remaining = totalDays - allocatedTotal;

    return (
        <div className="space-y-8">
            <StepHeader
                icon={MapPin}
                title="Adjust Days per City"
                desc="Fine-tune how many days you spend in each city. The total must equal your trip duration."
            />

            {/* Total tracker */}
            <div className={`flex items-center justify-between rounded-2xl px-4 py-3 border transition-colors
        ${remaining === 0 ? 'bg-green-500/[0.06] border-green-500/20' : 'bg-warning/[0.06] border-warning/20'}`}>
                <p className={`text-sm font-bold ${remaining === 0 ? 'text-green-600 dark:text-green-400' : 'text-warning'}`}>
                    {allocatedTotal} / {totalDays} days allocated
                </p>
                {remaining !== 0 && (
                    <p className="text-xs font-semibold text-warning flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        {remaining > 0 ? `${remaining} day${remaining > 1 ? 's' : ''} left to assign` : `${Math.abs(remaining)} day${Math.abs(remaining) > 1 ? 's' : ''} over budget`}
                    </p>
                )}
                {remaining === 0 && (
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400">✓ All days distributed</p>
                )}
            </div>

            {/* City cards */}
            <div className="space-y-3">
                {cityAllocations.map((alloc, i) => (
                    <motion.div
                        key={alloc.region.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white/80 dark:bg-d-card/80 backdrop-blur-md border border-ink/[0.07] dark:border-white/[0.07] rounded-2xl p-4 flex items-center gap-4"
                    >
                        {/* City number badge */}
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-extrabold text-brand">{i + 1}</span>
                        </div>

                        {/* City name */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-extrabold text-ink dark:text-white truncate">{alloc.region.name}</p>
                            <p className="text-xs text-ink/50 dark:text-white/40">
                                {alloc.days} day{alloc.days !== 1 ? 's' : ''} allocated
                            </p>
                        </div>

                        {/* Day controls */}
                        <div className="flex items-center gap-2 shrink-0">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setCityDays(alloc.region.id, alloc.days - 1)}
                                disabled={alloc.days <= 1}
                                className="w-9 h-9 rounded-xl border border-ink/[0.08] dark:border-white/[0.08] bg-ink/[0.03] dark:bg-white/[0.04] flex items-center justify-center text-ink/60 dark:text-white/60 hover:border-brand/30 hover:text-brand transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                                <Minus className="w-4 h-4" />
                            </motion.button>

                            <div className="w-12 h-9 rounded-xl bg-brand/[0.08] flex items-center justify-center">
                                <span className="text-sm font-extrabold text-brand">{alloc.days}</span>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setCityDays(alloc.region.id, alloc.days + 1)}
                                disabled={remaining <= 0}
                                className="w-9 h-9 rounded-xl border border-ink/[0.08] dark:border-white/[0.08] bg-ink/[0.03] dark:bg-white/[0.04] flex items-center justify-center text-ink/60 dark:text-white/60 hover:border-brand/30 hover:text-brand transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Remove city */}
                        {selectedRegions.length > 1 && (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeCity(alloc.region.id)}
                                className="w-9 h-9 rounded-xl border border-red-200 dark:border-red-900/50 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Trip summary bar */}
            {cityAllocations.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/50 dark:bg-d-card/50 border border-ink/[0.06] dark:border-white/[0.06] rounded-2xl p-4"
                >
                    <p className="text-xs font-bold text-ink/40 dark:text-white/30 uppercase tracking-wider mb-3">Trip Timeline</p>
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                        {cityAllocations.map((alloc, i) => {
                            const pct = (alloc.days / totalDays) * 100;
                            const colors = ['bg-brand', 'bg-purple-500', 'bg-pink-500', 'bg-orange-400', 'bg-cyan-500', 'bg-emerald-500'];
                            return (
                                <div
                                    key={alloc.region.id}
                                    className={`${colors[i % colors.length]} rounded-full transition-all duration-300 first:rounded-l-full last:rounded-r-full`}
                                    style={{ width: `${pct}%` }}
                                    title={`${alloc.region.name}: ${alloc.days} days`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                        {cityAllocations.map((alloc, i) => {
                            const colors = ['text-brand', 'text-purple-500', 'text-pink-500', 'text-orange-400', 'text-cyan-500', 'text-emerald-500'];
                            return (
                                <span key={alloc.region.id} className="flex items-center gap-1.5 text-xs font-semibold text-ink/60 dark:text-white/50">
                                    <span className={`w-2 h-2 rounded-full ${['bg-brand', 'bg-purple-500', 'bg-pink-500', 'bg-orange-400', 'bg-cyan-500', 'bg-emerald-500'][i % 6]}`} />
                                    {alloc.region.name} · {alloc.days}d
                                </span>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Tag, Check, LayoutGrid } from 'lucide-react';

export default function ActivityModal({ isOpen, onClose, activity }) {
    if (!isOpen || !activity) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/20 dark:bg-ink/60 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    className="bg-white dark:bg-d-card w-full max-w-4xl rounded-[2.5rem] relative shadow-2xl shadow-ink/20 dark:shadow-black/40 border border-white dark:border-white/[0.08] flex flex-col md:flex-row overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/50 dark:bg-d-surface/50 hover:bg-white dark:hover:bg-d-surface backdrop-blur-md rounded-full shadow-lg border border-white dark:border-white/10 flex items-center justify-center text-ink dark:text-white transition-all cursor-pointer hover:rotate-90"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Left Side Image Panel */}
                    <div className="md:w-1/2 relative min-h-[350px]">
                        <img
                            src={activity.image}
                            alt={activity.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Soft Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-brand text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {activity.shift} Slot
                                </span>
                                <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {activity.cityId}
                                </span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">{activity.title}</h2>
                        </div>
                    </div>

                    {/* Right Side Info Panel */}
                    <div className="md:w-1/2 p-8 lg:p-12 bg-white dark:bg-d-card flex flex-col h-full">

                        <div className="flex-1">
                            <h3 className="text-xs uppercase font-extrabold tracking-widest text-brand mb-3">Overview</h3>
                            <p className="text-ink-light dark:text-white/60 leading-relaxed font-medium mb-8 text-[15px]">
                                {activity.description}
                            </p>

                            {activity.inclusions && activity.inclusions.length > 0 && (
                                <div className="mb-10 bg-canvas dark:bg-d-surface p-6 rounded-3xl border border-gray-100 dark:border-white/[0.08]">
                                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-ink dark:text-white mb-4 flex items-center gap-2">
                                        <LayoutGrid className="w-4 h-4 text-brand" /> What's Included
                                    </h3>
                                    <ul className="space-y-3">
                                        {activity.inclusions.map((inc, i) => (
                                            <li key={i} className="flex items-start gap-3 text-ink dark:text-white text-sm font-medium border-b border-gray-200/60 dark:border-white/[0.06] pb-2 last:border-0 last:pb-0">
                                                <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                {inc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Bottom Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-auto">
                            <div className="bg-canvas dark:bg-d-surface p-5 rounded-2xl border border-gray-100 dark:border-white/[0.08]">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-light dark:text-white/50 mb-2">Duration</div>
                                <div className="font-bold text-ink dark:text-white flex items-center gap-2"><Clock className="w-5 h-5 text-brand" /> {activity.duration}</div>
                            </div>

                            <div className="bg-canvas dark:bg-d-surface p-5 rounded-2xl border border-gray-100 dark:border-white/[0.08]">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-light dark:text-white/50 mb-2">Pricing</div>
                                <div className="font-bold text-ink dark:text-white flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-brand" />
                                    {activity.price === 0 ? 'Integrated' : `INR ${activity.price}`}
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

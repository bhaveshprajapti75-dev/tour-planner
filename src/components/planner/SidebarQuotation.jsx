import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Receipt, MapPin, Route, ChevronDown, ChevronUp, Hotel } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';

export default function SidebarQuotation() {
    const store = usePlannerStore();
    const { totalDays, totalNights, travelType, selectedCountry,
        itinerary, editableItinerary, draftPlan } = store;
    const [activeTab, setActiveTab] = useState('summary');
    const [showAllIncl, setShowAllIncl] = useState(false);
    const [showAllExcl, setShowAllExcl] = useState(false);

    // Use editableItinerary (from draft plan) with fallback to legacy itinerary
    const days = editableItinerary.length > 0 ? editableItinerary : itinerary;

    // Calculate total from day tour prices
    const dayTourTotal = days.reduce((sum, day) => {
        const price = day.dayTour?.price ? Number(day.dayTour.price) : 0;
        return sum + price;
    }, 0);

    // Calculate hotel total
    const hotelTotal = days.reduce((sum, day) => sum + (day.hotelPricePerNight || 0), 0);
    const grandTotal = dayTourTotal + hotelTotal;

    // Gather inclusions/exclusions from the draft plan's incl_excl
    const planInclExcl = draftPlan?.incl_excl || [];
    const selectedItems = planInclExcl.filter(ie => ie.type === 'INCLUSION');
    const excludedItems = planInclExcl.filter(ie => ie.type === 'EXCLUSION');

    // Gather hotel assignments grouped by city
    const hotelsByCity = useMemo(() => {
        const map = {};
        for (const day of days) {
            if (day.hotelName && day.regionName) {
                if (!map[day.regionName]) map[day.regionName] = { hotelName: day.hotelName, stars: day.hotelStarRating, pricePerNight: day.hotelPricePerNight || 0, nights: 0 };
                map[day.regionName].nights++;
            }
        }
        return Object.entries(map);
    }, [days]);

    return (
        <div className="bg-white dark:bg-d-card rounded-[2.5rem] shadow-xl shadow-ink/5 dark:shadow-black/20 border border-gray-100 dark:border-white/[0.08] flex flex-col max-h-[calc(100vh-8rem)] overflow-hidden">

            {/* Header */}
            <div className="p-8 pb-6 bg-gradient-to-br from-canvas dark:from-d-surface to-white dark:to-d-card">
                <h3 className="font-extrabold text-2xl tracking-tight text-ink dark:text-white mb-4">Quotation</h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-d-surface p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.08] text-center">
                        <div className="text-[10px] uppercase font-bold text-ink-light dark:text-white/50 tracking-wider">Days</div>
                        <div className="font-bold text-ink dark:text-white text-lg">{totalDays}</div>
                    </div>
                    <div className="bg-white dark:bg-d-surface p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.08] text-center">
                        <div className="text-[10px] uppercase font-bold text-ink-light dark:text-white/50 tracking-wider">Nights</div>
                        <div className="font-bold text-ink dark:text-white text-lg">{totalNights}</div>
                    </div>
                    <div className="bg-white dark:bg-d-surface p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.08] text-center">
                        <div className="text-[10px] uppercase font-bold text-ink-light dark:text-white/50 tracking-wider">Type</div>
                        <div className="font-bold text-ink dark:text-white text-sm">{travelType || '—'}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-8 pb-4">
                <div className="flex bg-canvas dark:bg-d-surface p-1.5 rounded-full border border-gray-200/60 dark:border-white/[0.08] shadow-inner">
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`flex-1 py-2.5 rounded-full text-xs tracking-wide font-bold transition-all cursor-pointer ${activeTab === 'summary' ? 'text-white bg-brand shadow-md shadow-brand/20' : 'text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
                    >
                        Summary
                    </button>
                    <button
                        onClick={() => setActiveTab('includes')}
                        className={`flex-1 py-2.5 rounded-full text-xs tracking-wide font-bold transition-all cursor-pointer ${activeTab === 'includes' ? 'text-white bg-brand shadow-md shadow-brand/20' : 'text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
                    >
                        Includes
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-6 hide-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'summary' && (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            {/* Route Summary with scrollable day list */}
                            <div className="space-y-3 text-sm bg-gray-50/50 dark:bg-d-surface/50 p-5 rounded-3xl border border-gray-100 dark:border-white/[0.08]">
                                <div className="text-xs uppercase tracking-widest font-extrabold text-ink/40 dark:text-white/30 mb-3 flex items-center gap-1.5">
                                    <Route className="w-3.5 h-3.5" /> Day-by-Day
                                </div>
                                <div className="max-h-[280px] overflow-y-auto hide-scrollbar space-y-0">
                                    {days.map((day) => (
                                        <div key={day.dayNumber} className={`flex justify-between items-center py-2 ${day.dayNumber < days.length ? 'border-b border-gray-200/60 dark:border-white/[0.06] pb-3' : ''}`}>
                                            <div className="flex items-center gap-2 text-ink/70 dark:text-white/60 font-medium">
                                                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0">{day.dayNumber}</span>
                                                <span className="line-clamp-1 text-xs">{day.dayTour?.activity_combination || (day.isDeparture ? 'Departure' : 'Free Day')}</span>
                                            </div>
                                            {day.dayTour?.price && Number(day.dayTour.price) > 0 && (
                                                <div className="font-bold text-ink dark:text-white shrink-0 ml-2 text-xs">INR {Number(day.dayTour.price).toLocaleString()}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Total at bottom of day list */}
                                {grandTotal > 0 && (
                                    <div className="pt-4 mt-3 border-t-2 border-brand/20 space-y-2">
                                        {dayTourTotal > 0 && hotelTotal > 0 && (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-semibold text-ink/50 dark:text-white/40">Day Tours</span>
                                                    <span className="text-xs font-bold text-ink dark:text-white">INR {dayTourTotal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-semibold text-ink/50 dark:text-white/40">Hotels</span>
                                                    <span className="text-xs font-bold text-ink dark:text-white">INR {hotelTotal.toLocaleString()}</span>
                                                </div>
                                            </>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-ink dark:text-white uppercase tracking-wide">Total</span>
                                            <span className="text-2xl font-black text-brand">INR {grandTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Country */}
                            <div className="space-y-2 text-sm bg-gray-50/50 dark:bg-d-surface/50 p-5 rounded-3xl border border-gray-100 dark:border-white/[0.08]">
                                {selectedCountry && (
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-ink-light dark:text-white/60 font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand" /> Country</span>
                                        <span className="font-bold text-ink dark:text-white">{selectedCountry.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Hotels */}
                            {hotelsByCity.length > 0 && (
                                <div className="space-y-3 text-sm bg-purple-50/50 dark:bg-purple-950/20 p-5 rounded-3xl border border-purple-100/50 dark:border-purple-500/10">
                                    <div className="text-xs uppercase tracking-widest font-extrabold text-purple-500/60 dark:text-purple-400/50 flex items-center gap-1.5">
                                        <Hotel className="w-3.5 h-3.5" /> Hotels
                                    </div>
                                    {hotelsByCity.map(([city, info]) => (
                                        <div key={city} className="flex justify-between items-center py-1">
                                            <div>
                                                <span className="font-bold text-ink dark:text-white text-xs">{info.hotelName}</span>
                                                {info.stars && <span className="text-[10px] text-amber-500 ml-1.5">{'★'.repeat(info.stars)}</span>}
                                            </div>
                                            <div className="text-right">
                                                {info.pricePerNight > 0 && (
                                                    <div className="text-xs font-bold text-purple-600 dark:text-purple-300">INR {(info.pricePerNight * info.nights).toLocaleString()}</div>
                                                )}
                                                <span className="text-[10px] font-bold text-ink/40 dark:text-white/30">{city} · {info.nights}N</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'includes' && (
                        <motion.div
                            key="includes"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            {/* Inclusions */}
                            <div className="bg-gray-50/50 dark:bg-d-surface/50 p-5 rounded-3xl border border-gray-100 dark:border-white/[0.08]">
                                <h4 className="font-bold text-ink dark:text-white uppercase text-xs mb-4">Included</h4>
                                <ul className="space-y-3">
                                    {selectedItems.length === 0 && (
                                        <li className="text-sm text-ink-light dark:text-white/40 font-medium">No inclusions selected</li>
                                    )}
                                    {(showAllIncl ? selectedItems : selectedItems.slice(0, 3)).map(item => (
                                        <li key={item.id} className="flex items-start gap-3 text-sm text-ink-light">
                                            <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" strokeWidth={3} /></div>
                                            <span className="font-medium">{item.item_text}</span>
                                        </li>
                                    ))}
                                </ul>
                                {selectedItems.length > 3 && (
                                    <button onClick={() => setShowAllIncl(!showAllIncl)} className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand/80 transition-colors">
                                        {showAllIncl ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> +{selectedItems.length - 3} more</>}
                                    </button>
                                )}
                            </div>

                            {/* Exclusions */}
                            <div className="bg-red-50/50 dark:bg-red-950/20 p-5 rounded-3xl border border-red-100/50 dark:border-red-500/10">
                                <h4 className="font-bold text-ink dark:text-white uppercase text-xs mb-4">Not Included</h4>
                                <ul className="space-y-3">
                                    {excludedItems.length === 0 && (
                                        <li className="text-sm text-ink-light dark:text-white/40 font-medium">No exclusions selected</li>
                                    )}
                                    {(showAllExcl ? excludedItems : excludedItems.slice(0, 3)).map(item => (
                                        <li key={item.id} className="flex items-start gap-3 text-sm text-ink-light">
                                            <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3 h-3" strokeWidth={3} /></div>
                                            <span className="font-medium">{item.item_text}</span>
                                        </li>
                                    ))}
                                </ul>
                                {excludedItems.length > 3 && (
                                    <button onClick={() => setShowAllExcl(!showAllExcl)} className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">
                                        {showAllExcl ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> +{excludedItems.length - 3} more</>}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}

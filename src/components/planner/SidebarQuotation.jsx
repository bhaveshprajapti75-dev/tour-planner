 import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Users, Check, X, Share2, Download, Receipt, Hotel, Car, Utensils, Eye, UserCheck, Footprints } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import { cities, hotels } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function SidebarQuotation() {
    const store = usePlannerStore();
    const { duration, category, selectedCities, selectedHotels, vehicleCategory, travelType,
        tourManagerRequired, localGuideRequired, mealPreference, selectedActivities,
        selectedSightseeings, cityNights, rooms } = store;
    const [activeTab, setActiveTab] = useState('pricing');

    const q = store.getQuotation();

    const handleDownloadPDF = useCallback(() => {
        window.dispatchEvent(new CustomEvent('download-pdf'));
        toast.success('Generating PDF...');
    }, []);

    const handleShareLink = useCallback(() => {
        navigator.clipboard?.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    }, []);

    const lineItems = [
        { label: 'Hotels', value: q.hotelCost, icon: Hotel, show: q.hotelCost > 0 },
        { label: 'Transport', value: q.transportCost, icon: Car, show: q.transportCost > 0 },
        { label: 'Sightseeing', value: q.sightseeingCost, icon: Eye, show: q.sightseeingCost > 0 },
        { label: 'Activities', value: q.activityCost, icon: Footprints, show: q.activityCost > 0 },
        { label: 'Guide / Manager', value: q.guideCost, icon: UserCheck, show: q.guideCost > 0 },
        { label: 'Meals', value: q.mealCost, icon: Utensils, show: q.mealCost > 0 },
    ].filter(i => i.show);

    return (
        <div className="bg-white dark:bg-d-card rounded-[2.5rem] shadow-xl shadow-ink/5 dark:shadow-black/20 border border-gray-100 dark:border-white/[0.08] flex flex-col max-h-[calc(100vh-8rem)] overflow-hidden">

            {/* Header */}
            <div className="p-8 pb-6 bg-gradient-to-br from-canvas dark:from-d-surface to-white dark:to-d-card">
                <h3 className="font-extrabold text-2xl tracking-tight text-ink dark:text-white mb-4">Quotation</h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-d-surface p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.08] text-center">
                        <div className="text-[10px] uppercase font-bold text-ink-light dark:text-white/50 tracking-wider">Days</div>
                        <div className="font-bold text-ink dark:text-white text-lg">{duration}</div>
                    </div>
                    <div className="bg-white dark:bg-d-surface p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.08] text-center">
                        <div className="text-[10px] uppercase font-bold text-ink-light dark:text-white/50 tracking-wider">Pax</div>
                        <div className="font-bold text-ink dark:text-white text-lg">{q.totalPax}</div>
                    </div>
                    <div className="bg-white dark:bg-d-surface p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.08] text-center">
                        <div className="text-[10px] uppercase font-bold text-ink-light dark:text-white/50 tracking-wider">Rooms</div>
                        <div className="font-bold text-ink dark:text-white text-lg">{q.totalRooms}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-8 pb-4">
                <div className="flex bg-canvas dark:bg-d-surface p-1.5 rounded-full border border-gray-200/60 dark:border-white/[0.08] shadow-inner">
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`flex-1 py-2.5 rounded-full text-xs tracking-wide font-bold transition-all cursor-pointer ${activeTab === 'pricing' ? 'text-white bg-brand shadow-md shadow-brand/20' : 'text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
                    >
                        Pricing
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
            <div className="flex-1 overflow-y-auto px-8 pb-8 hide-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'pricing' && (
                        <motion.div
                            key="pricing"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            {/* Grand Total */}
                            <div className="bg-gradient-to-br from-brand to-brand-hover p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-brand/30 text-white">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <Receipt className="w-6 h-6 text-brand-100" />
                                        <div className="text-[10px] font-bold text-brand-100 uppercase tracking-widest text-right">Total Quote</div>
                                    </div>
                                    <div className="text-4xl font-bold tracking-tighter">
                                        INR {q.total.toLocaleString()}
                                    </div>
                                    {q.totalPax > 1 && (
                                        <div className="text-sm text-brand-100 mt-2 font-medium">
                                            INR {q.perPerson.toLocaleString()} per person
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="space-y-3 text-sm bg-gray-50/50 dark:bg-d-surface/50 p-5 rounded-3xl border border-gray-100 dark:border-white/[0.08]">
                                {lineItems.map((item, i) => (
                                    <div key={item.label} className={`flex justify-between items-center py-2 ${i < lineItems.length - 1 ? 'border-b border-gray-200/60 dark:border-white/[0.06] pb-3' : ''}`}>
                                        <div className="flex items-center gap-2 text-ink-light dark:text-white/60 font-medium">
                                            <item.icon className="w-4 h-4 text-brand" />
                                            {item.label}
                                        </div>
                                        <div className="font-bold text-ink dark:text-white">INR {item.value.toLocaleString()}</div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-300/60 dark:border-white/10">
                                    <div className="text-ink dark:text-white font-bold">Subtotal</div>
                                    <div className="font-bold text-ink dark:text-white">INR {q.subTotal.toLocaleString()}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-ink-light dark:text-white/60 font-medium">GST (5%)</div>
                                    <div className="font-bold text-ink dark:text-white">INR {q.gst.toLocaleString()}</div>
                                </div>
                            </div>
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
                            <div className="bg-gray-50/50 dark:bg-d-surface/50 p-5 rounded-3xl border border-gray-100 dark:border-white/[0.08]">
                                <h4 className="font-bold text-ink dark:text-white uppercase text-xs mb-4">Included</h4>
                                <ul className="space-y-3">
                                    {selectedCities.map(id => {
                                        const city = cities.find(c => c.id === id);
                                        const hotel = hotels.find(h => h.id === selectedHotels[id]);
                                        return (
                                            <li key={`inc-${id}`} className="flex items-start gap-3 text-sm text-ink-light">
                                                <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" strokeWidth={3} /></div>
                                                <span className="font-medium">{city?.name}: {hotel?.name || 'Hotel'} ({cityNights[id]}N)</span>
                                            </li>
                                        );
                                    })}
                                    {vehicleCategory && (
                                        <li className="flex items-start gap-3 text-sm text-ink-light">
                                            <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" strokeWidth={3} /></div>
                                            <span className="font-medium">{vehicleCategory} Vehicle ({travelType})</span>
                                        </li>
                                    )}
                                    {tourManagerRequired && (
                                        <li className="flex items-start gap-3 text-sm text-ink-light">
                                            <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" strokeWidth={3} /></div>
                                            <span className="font-medium">Tour Manager</span>
                                        </li>
                                    )}
                                    {mealPreference !== 'no_meals' && (
                                        <li className="flex items-start gap-3 text-sm text-ink-light">
                                            <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" strokeWidth={3} /></div>
                                            <span className="font-medium">Meals ({mealPreference === 'chef' ? 'Private Chef' : 'Local Restaurants'})</span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="bg-red-50/50 dark:bg-red-950/20 p-5 rounded-3xl border border-red-100/50 dark:border-red-500/10">
                                <h4 className="font-bold text-ink dark:text-white uppercase text-xs mb-4">Not Included</h4>
                                <ul className="space-y-3">
                                    {['International flights', 'Travel insurance', 'Personal expenses', 'Tips & gratuities'].map(item => (
                                        <li key={item} className="flex items-start gap-3 text-sm text-ink-light">
                                            <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3 h-3" strokeWidth={3} /></div>
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-white dark:bg-d-card border-t border-gray-100 dark:border-white/[0.08] flex gap-3">
                <button onClick={handleShareLink} className="flex-1 flex justify-center items-center gap-2 bg-canvas dark:bg-d-surface text-ink dark:text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all cursor-pointer">
                    <Share2 className="w-4 h-4" /> Share
                </button>
                <button onClick={handleDownloadPDF} className="flex-1 flex justify-center items-center gap-2 bg-brand text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 cursor-pointer">
                    <Download className="w-4 h-4" /> PDF
                </button>
            </div>
        </div>
    );
}

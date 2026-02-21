import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Users, Check, X, Share2, Download, Receipt } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import { cities } from '../../data/mockData';

export default function SidebarQuotation() {
    const { duration, passengers, category, selectedCities } = usePlannerStore();
    const [activeTab, setActiveTab] = useState('pricing'); // pricing, includes

    const basePricePerNight = category === '5 Star' ? 300 : category === '4 Star' ? 150 : 100;
    const hotelTotal = duration * basePricePerNight;
    const transportTotal = selectedCities.length * 120;
    const swissPassTotal = 400;
    const activitiesTotal = selectedCities.length * 150;
    const subTotal = (hotelTotal + transportTotal + swissPassTotal + activitiesTotal);
    const totalWithTax = Math.floor(subTotal * 1.05);

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-ink/5 border border-gray-100 flex flex-col h-[650px] overflow-hidden">

            {/* Header Profile Summary (Soft, Modern) */}
            <div className="p-8 pb-6 bg-gradient-to-br from-canvas to-white">
                <h3 className="font-extrabold text-2xl tracking-tight text-ink mb-4">Financial Overview</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/5 flex items-center justify-center text-brand">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-ink-light tracking-wider">Duration</div>
                            <div className="font-bold text-ink text-sm">{duration} Days</div>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/5 flex items-center justify-center text-brand">
                            <Users className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-ink-light tracking-wider">Entity</div>
                            <div className="font-bold text-ink text-sm">{passengers.adults} Adults</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Pill Tabs */}
            <div className="px-8 pb-4">
                <div className="flex bg-canvas p-1.5 rounded-full border border-gray-200/60 shadow-inner">
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`flex-1 py-2.5 rounded-full text-xs tracking-wide font-bold transition-all cursor-pointer ${activeTab === 'pricing' ? 'text-white bg-brand shadow-md shadow-brand/20' : 'text-ink-light hover:text-ink hover:bg-white/50'}`}
                    >
                        Estimation
                    </button>
                    <button
                        onClick={() => setActiveTab('includes')}
                        className={`flex-1 py-2.5 rounded-full text-xs tracking-wide font-bold transition-all cursor-pointer ${activeTab === 'includes' ? 'text-white bg-brand shadow-md shadow-brand/20' : 'text-ink-light hover:text-ink hover:bg-white/50'}`}
                    >
                        Manifest
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
                            {/* Grand Total (Soft Glass Card) */}
                            <div className="bg-gradient-to-br from-brand to-brand-hover p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-brand/30 text-white">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl" />
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <Receipt className="w-6 h-6 text-brand-100" />
                                        <div className="text-[10px] font-bold text-brand-100 uppercase tracking-widest text-right">Net Quote<br />Per Traveler</div>
                                    </div>
                                    <div className="text-4xl lg:text-5xl font-bold tracking-tighter">
                                        CHF {totalWithTax.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Line Items - Soft Dividers */}
                            <div className="space-y-4 text-sm bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
                                    <div className="text-ink-light font-medium">Base Hotels</div>
                                    <div className="font-bold text-ink">CHF {hotelTotal.toLocaleString()}</div>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
                                    <div className="text-ink-light font-medium">Mobility Network</div>
                                    <div className="font-bold text-ink">CHF {(transportTotal + swissPassTotal).toLocaleString()}</div>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
                                    <div className="text-ink-light font-medium">Curated Experiences</div>
                                    <div className="font-bold text-ink">CHF {activitiesTotal.toLocaleString()}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-ink-light font-medium">Tax & Compliance</div>
                                    <div className="font-bold text-ink">CHF {(totalWithTax - subTotal).toLocaleString()}</div>
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
                            className="space-y-8"
                        >
                            <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                                <h4 className="font-bold text-ink uppercase text-xs mb-4">Active Manifest</h4>
                                <ul className="space-y-4">
                                    {selectedCities.map(id => {
                                        const city = cities.find(c => c.id === id);
                                        return (
                                            <li key={`inc-${id}`} className="flex items-start gap-3 text-sm text-ink-light">
                                                <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" strokeWidth={3} /></div>
                                                <span className="font-medium">Accommodation: {city?.name} sector</span>
                                            </li>
                                        )
                                    })}
                                    <li className="flex items-start gap-3 text-sm text-ink-light">
                                        <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" strokeWidth={3} /></div>
                                        <span className="font-medium">Swiss Travel System Network Pass</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-red-50/50 p-5 rounded-3xl border border-red-100/50">
                                <h4 className="font-bold text-ink uppercase text-xs mb-4">Omissions</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-sm text-ink-light">
                                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3 h-3" strokeWidth={3} /></div>
                                        <span className="font-medium">Long-haul Aviation</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-ink-light">
                                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3 h-3" strokeWidth={3} /></div>
                                        <span className="font-medium">Risk Management (Insurance)</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
                <button className="flex-1 flex justify-center items-center gap-2 bg-canvas text-ink py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer">
                    <Share2 className="w-4 h-4" /> Link
                </button>
                <button className="flex-1 flex justify-center items-center gap-2 bg-brand text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 cursor-pointer">
                    <Download className="w-4 h-4" /> Export
                </button>
            </div>
        </div>
    );
}

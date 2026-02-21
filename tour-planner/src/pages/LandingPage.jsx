import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, CalendarRange, UserCheck, ShieldCheck } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import usePlannerStore from '../store/plannerStore';

export default function LandingPage() {
    const navigate = useNavigate();
    const setTripDetails = usePlannerStore(state => state.setTripDetails);

    const [activeStep, setActiveStep] = useState(1);
    const [duration, setDuration] = useState(7);
    const [category, setCategory] = useState(null);

    const startPlanning = () => {
        if (!category) return;
        setTripDetails({ duration, category });
        navigate('/planner/destinations');
    };

    return (
        <div className="min-h-screen bg-canvas flex flex-col font-sans relative">
            <Navbar />

            <main className="flex-1 flex flex-col lg:flex-row pt-24 pb-12 px-4 sm:px-6 lg:px-12 max-w-[1600px] w-full mx-auto gap-8">

                {/* Left Side - Visual Story */}
                <div className="hidden lg:flex lg:w-[55%] relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand/10 border border-white/50">
                    <motion.img
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=1600"
                        alt="Swiss Alps Sunrise"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

                    <div className="relative z-10 p-16 flex flex-col justify-end h-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass text-white font-bold text-sm tracking-wide mb-6 border border-white/20 shadow-lg">
                                <Compass className="w-4 h-4" /> Discover Switzerland Your Way
                            </div>
                            <h1 className="text-5xl xl:text-7xl font-semibold text-white leading-tight mb-6">
                                Curate Your <br />
                                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#93C5FD] to-[#E0E7FF]">Swiss Legend.</span>
                            </h1>
                            <p className="text-xl text-white/80 font-medium max-w-md leading-relaxed">
                                Design an atomic, hour-by-hour mastermind plan tailored explicitly to your desires.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Functional Form (Modern Glass) */}
                <div className="w-full lg:w-[45%] flex items-center justify-center py-6">
                    <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl shadow-ink/5 border border-gray-100">

                        <div className="mb-10 text-center">
                            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink mb-3">Begin Journey</h2>
                            <p className="text-ink-light font-medium">Set your basic parameters to initialize.</p>
                        </div>

                        {/* Step Progress Pills */}
                        <div className="flex items-center gap-3 mb-10 w-full max-w-xs mx-auto bg-canvas p-1.5 rounded-full border border-gray-200 shadow-inner">
                            <div className={`flex-1 h-3 rounded-full ${activeStep >= 1 ? 'bg-brand shadow-sm shadow-brand/40' : 'bg-transparent'} transition-all duration-500`} />
                            <div className={`flex-1 h-3 rounded-full ${activeStep >= 2 ? 'bg-brand shadow-sm shadow-brand/40' : 'bg-transparent'} transition-all duration-500`} />
                        </div>

                        <AnimatePresence mode="wait">
                            {activeStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-3 text-xl font-bold text-ink justify-center mb-6">
                                        <CalendarRange className="w-6 h-6 text-brand" />
                                        Trip Duration
                                    </div>

                                    <div className="grid grid-cols-4 gap-3 lg:gap-4">
                                        {[5, 6, 7, 8, 9, 10, 12, 14].map(days => (
                                            <button
                                                key={days}
                                                onClick={() => setDuration(days)}
                                                className={`h-20 flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer font-semibold
                          ${duration === days
                                                        ? 'bg-brand text-white shadow-lg shadow-brand/25 scale-105 border border-brand'
                                                        : 'bg-canvas text-ink-light hover:bg-gray-100 hover:text-ink hover:scale-105 border border-transparent'
                                                    }
                        `}
                                            >
                                                <span className="text-2xl font-bold">{days}</span>
                                                <span className="text-xs uppercase tracking-wider opacity-80 mt-0.5">Days</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-8">
                                        <button
                                            onClick={() => setActiveStep(2)}
                                            className="w-full flex items-center justify-center gap-3 bg-ink text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-black hover:shadow-xl hover:shadow-ink/20 transition-all cursor-pointer group"
                                        >
                                            <span>Continue Setup</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-3 text-xl font-bold text-ink justify-center mb-6">
                                        <UserCheck className="w-6 h-6 text-brand" />
                                        Travel Group Size
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { id: 'solo', label: 'Solo Adventurer', desc: '1 Traveler, 1 Master Suite' },
                                            { id: 'couple', label: 'Couple / Duo', desc: '2 Travelers, 1 Shared Suite' },
                                            { id: 'family', label: 'Family / Group', desc: '4+ Travelers, Multi-room setup' },
                                        ].map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setCategory(cat.id)}
                                                className={`w-full text-left p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center justify-between
                          ${category === cat.id
                                                        ? 'border-brand bg-brand/5 shadow-md shadow-brand/10'
                                                        : 'border-gray-100 bg-canvas hover:border-gray-300 hover:bg-gray-50'
                                                    }
                        `}
                                            >
                                                <div>
                                                    <div className={`font-bold text-xl ${category === cat.id ? 'text-brand' : 'text-ink'}`}>{cat.label}</div>
                                                    <div className="text-sm font-medium text-ink-light mt-1.5">{cat.desc}</div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                          ${category === cat.id ? 'border-brand' : 'border-gray-300'}
                        `}>
                                                    {category === cat.id && <div className="w-3 h-3 bg-brand rounded-full" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-8 flex gap-4">
                                        <button
                                            onClick={() => setActiveStep(1)}
                                            className="px-6 py-5 rounded-2xl font-bold border-2 border-gray-200 text-ink hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={startPlanning}
                                            disabled={!category}
                                            className="flex-1 flex items-center justify-center gap-3 bg-brand text-white px-6 py-5 rounded-2xl font-bold text-lg hover:bg-brand-hover transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-brand/20 hover:shadow-xl hover:-translate-y-0.5"
                                        >
                                            <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                                            Engage Planner
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-ink-light">
                            <ShieldCheck className="w-4 h-4 text-brand" /> Protected & Secure Process
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

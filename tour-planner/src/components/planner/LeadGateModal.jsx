import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Phone, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LeadGateModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSuccess();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/30 backdrop-blur-xl">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-ink/10 relative overflow-hidden border border-white/50"
                >
                    {/* Header Banner */}
                    <div className="bg-gradient-to-br from-brand/5 to-brand/10 p-10 text-center relative">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-6 text-brand">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-extrabold tracking-tight text-ink mb-2">Unlock Your Quote</h3>
                        <p className="text-ink-light text-sm font-medium">
                            Save your progress and view your exact personalized investment.
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-xs font-bold text-ink mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Jane Doe"
                                        className="w-full pl-12 pr-4 py-4 bg-canvas rounded-2xl border border-transparent focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-gray-400 font-medium text-ink"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-ink mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="jane@example.com"
                                        className="w-full pl-12 pr-4 py-4 bg-canvas rounded-2xl border border-transparent focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-gray-400 font-medium text-ink"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-brand text-white py-4 rounded-2xl font-bold hover:bg-brand-hover hover:-translate-y-0.5 shadow-lg shadow-brand/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                                >
                                    View Quotation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-ink-light pt-4 border-t border-gray-100">
                                <ShieldCheck className="w-4 h-4 text-brand" /> Your data is completely secure
                            </div>

                        </form>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}

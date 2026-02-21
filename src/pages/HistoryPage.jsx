import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Copy, Download, Edit3, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import usePlannerStore from '../store/plannerStore';
import { savedPlans } from '../data/mockData';
import { cities } from '../data/mockData';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { planHistory } = usePlannerStore();
  const allPlans = [...savedPlans, ...planHistory];

  return (
    <div className="min-h-screen bg-canvas dark:bg-d-canvas flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink dark:text-white mb-2">Plan History</h1>
            <p className="text-ink-light dark:text-white/60 font-medium">Your saved tour plans and drafts</p>
          </div>
          <button onClick={() => navigate('/planner/wizard')}
            className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> New Plan
          </button>
        </div>

        <div className="grid gap-6">
          {allPlans.map((plan, i) => (
            <motion.div key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] p-6 shadow-lg shadow-ink/5 dark:shadow-black/20 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex -space-x-2">
                    {(plan.cities || []).slice(0, 3).map(cId => {
                      const city = cities.find(c => c.id === cId);
                      return city ? (
                        <img key={cId} src={city.image} className="w-12 h-12 rounded-full border-2 border-white object-cover shadow" alt={city.name} />
                      ) : null;
                    })}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-ink dark:text-white">{plan.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-ink-light dark:text-white/50 font-medium mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {plan.duration} days</span>
                      <span>•</span>
                      <span>{plan.createdAt}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${plan.status === 'confirmed' ? 'bg-accent/10 text-accent' : plan.status === 'draft' ? 'bg-warning/10 text-warning' : 'bg-gray-100 text-ink-light'}`}>
                        {plan.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <div className="text-sm text-ink-light dark:text-white/50 font-medium">Total</div>
                    <div className="text-xl font-bold text-ink dark:text-white">INR {(plan.totalAmount || 0).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <ActionBtn icon={Copy} label="Duplicate" />
                    <ActionBtn icon={Edit3} label="Edit" />
                    <ActionBtn icon={Download} label="PDF" />
                    <ActionBtn icon={Trash2} label="Delete" danger />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, danger }) {
  return (
    <button title={label}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border
        ${danger ? 'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20' : 'bg-canvas dark:bg-d-surface text-ink-light dark:text-white/50 border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white'}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

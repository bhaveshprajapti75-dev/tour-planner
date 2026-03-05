import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, Download, Trash2, Plus, MapPin, CalendarDays, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import usePlannerStore from '../store/plannerStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { userPlans, userPlansLoading, fetchUserPlans, deletePlan, clonePlan } = usePlannerStore();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserPlans();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      toast.success('Plan deleted');
    } catch {
      toast.error('Failed to delete plan');
    }
  };

  const handleClone = async (id) => {
    try {
      await clonePlan(id);
      toast.success('Plan duplicated');
    } catch {
      toast.error('Failed to duplicate plan');
    }
  };

  const handleDownloadPdf = () => {
    // Trigger the global PDF download event (PdfGenerator listens for it)
    window.dispatchEvent(new CustomEvent('download-pdf'));
    toast.success('Generating PDF...');
  };

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

        {!isAuthenticated && (
          <div className="text-center py-20 text-ink/50 dark:text-white/40">
            <p className="text-lg font-semibold mb-4">Please log in to view your saved plans</p>
            <button onClick={() => navigate('/auth?redirect=/history')}
              className="bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-hover transition-all cursor-pointer">
              Log In
            </button>
          </div>
        )}

        {isAuthenticated && userPlansLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
            <p className="text-sm font-medium text-ink/60 dark:text-white/50">Loading your plans…</p>
          </div>
        )}

        {isAuthenticated && !userPlansLoading && userPlans.length === 0 && (
          <div className="text-center py-20 text-ink/50 dark:text-white/40">
            <p className="text-lg font-semibold">No plans saved yet</p>
            <p className="text-sm mt-2">Create your first plan with the wizard!</p>
          </div>
        )}

        <div className="grid gap-6">
          {userPlans.map((plan, i) => (
            <motion.div key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] p-6 shadow-lg shadow-ink/5 dark:shadow-black/20 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-ink dark:text-white">{plan.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-ink-light dark:text-white/50 font-medium mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {plan.total_days}D / {plan.total_nights}N</span>
                      {plan.country_name && <><span>•</span><span>{plan.country_name}</span></>}
                      {plan.start_date && <><span>•</span><span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {plan.start_date}</span></>}
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                        plan.status === 'CONFIRMED' ? 'bg-accent/10 text-accent' :
                        plan.status === 'DRAFT' ? 'bg-warning/10 text-warning' :
                        plan.status === 'SHARED' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-ink-light'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ActionBtn icon={Copy} label="Duplicate" onClick={() => handleClone(plan.id)} />
                  <ActionBtn icon={Download} label="PDF" onClick={handleDownloadPdf} />
                  <ActionBtn icon={Trash2} label="Delete" danger onClick={() => handleDelete(plan.id)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, danger, onClick }) {
  return (
    <button title={label} onClick={onClick}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border
        ${danger ? 'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20' : 'bg-canvas dark:bg-d-surface text-ink-light dark:text-white/50 border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white'}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

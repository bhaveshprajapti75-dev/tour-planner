import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import useAuthStore from '../../store/authStore';

import StepCountry from './steps/StepCountry';
import StepCategory from './steps/StepCategory';
import StepDuration from './steps/StepDuration';
import StepRegions from './steps/StepRegions';
import StepTemplates from './steps/StepTemplates';

/* ─── slide animation variants ──────────────────────────────── */
const slideIn = {
  initial: { opacity: 0, y: 30, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.99 },
  transition: { duration: 0.35, ease: 'easeOut' }
};

/*
  Wizard flow:
    Step 1 — Country
    Step 2 — Travel Type (Group / Solo / Couple)
    Step 3 — Duration + Start Date
    ── LOGIN GATE (after step 3, before step 4) ──
    Step 4 — Regions
    Step 5 — Templates (itinerary + inclusions)
    → Navigate to /planner/itinerary
*/
const TOTAL_STEPS = 5;

export default function PlannerWizard() {
  const navigate = useNavigate();
  const store = usePlannerStore();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { currentStep, savedPlan, resetPlanner } = store;

  // If a plan was already created, reset the wizard for a fresh start
  useEffect(() => {
    if (savedPlan) {
      resetPlanner();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!store.selectedCountry;
      case 2: return !!store.travelType;
      case 3: return store.totalDays > 0;
      case 4: return store.selectedRegions.length > 0;
      case 5: return !!store.selectedTemplate;
      default: return true;
    }
  };

  const handleNext = () => {
    // Login gate: after step 3, redirect to auth if not logged in
    if (currentStep === 3 && !isAuthenticated) {
      navigate('/auth?redirect=/planner/wizard');
      return;
    }

    if (currentStep === TOTAL_STEPS) {
      // Build itinerary and go to itinerary view
      store.buildItinerary();
      navigate('/planner/itinerary');
    } else {
      store.nextStep();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Thin progress bar — always visible below navbar */}
      <div className="shrink-0 w-full h-1 bg-ink/[0.06] dark:bg-white/[0.06]">
        <motion.div
          className="h-full bg-gradient-to-r from-brand via-purple-500 to-blue-500 rounded-r-full"
          animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step Content — only this area scrolls */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} {...slideIn}>
              {currentStep === 1 && <StepCountry />}
              {currentStep === 2 && <StepCategory />}
              {currentStep === 3 && <StepDuration />}
              {currentStep === 4 && <StepRegions />}
              {currentStep === 5 && <StepTemplates />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav — always visible at bottom */}
      <div className="shrink-0 flex justify-center px-4 py-4">
        <div className="bg-white/80 dark:bg-d-surface/80 backdrop-blur-2xl border border-ink/[0.08] dark:border-white/[0.08] shadow-[0_-4px_30px_rgba(0,0,0,0.08)] rounded-2xl p-3 flex items-center gap-3 max-w-lg w-full">
          <button
            onClick={() => store.prevStep()}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-ink/[0.04] dark:bg-white/[0.06] text-ink/60 dark:text-white/60 border border-ink/[0.08] dark:border-white/[0.08] hover:bg-ink/[0.08] dark:hover:bg-white/[0.1] hover:text-ink dark:hover:text-white transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex-1 flex justify-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === currentStep ? 'w-6 bg-brand' :
                i + 1 < currentStep ? 'w-1.5 bg-brand/50' : 'w-1.5 bg-ink/10 dark:bg-white/10'
                }`} />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white overflow-hidden transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] border border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-brand to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] mix-blend-overlay transition-opacity duration-500" />
            <span className="relative z-10 tracking-wide">{currentStep === TOTAL_STEPS ? 'View Itinerary' : 'Continue'}</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

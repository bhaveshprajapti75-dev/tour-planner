import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import PlannerWizard from './planner/PlannerWizard';
import ItineraryStep from './planner/ItineraryStep';
import SidebarQuotation from '../components/planner/SidebarQuotation';
import PdfGenerator from '../components/planner/PdfGenerator';
import usePlannerStore from '../store/plannerStore';

export default function PlannerPage() {
  const currentStep = usePlannerStore(s => s.currentStep);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-canvas dark:bg-d-canvas transition-colors duration-300">
      <Navbar />
      <PdfGenerator />
      <main className="flex-1 w-full mx-auto pt-24 overflow-hidden flex flex-col">
        <Routes>
          <Route path="wizard" element={<PlannerWizard />} />
          <Route path="itinerary" element={
            <div className="h-full overflow-y-auto">
              <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex gap-8 relative items-start">
                <div className="flex-1 max-w-4xl pr-2">
                  <ItineraryStep />
                </div>
                <div className="hidden lg:block w-[380px] sticky top-0">
                  <SidebarQuotation />
                </div>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="wizard" replace />} />
        </Routes>
      </main>
    </div>
  );
}


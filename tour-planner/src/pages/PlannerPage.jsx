import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import DestinationsStep from './planner/DestinationsStep';
import ItineraryStep from './planner/ItineraryStep';
import SidebarQuotation from '../components/planner/SidebarQuotation';

export default function PlannerPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <Navbar />

            <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 flex gap-8">

                {/* Main Content Area */}
                <div className="flex-1 w-full max-w-4xl max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 hide-scrollbar">
                    <Routes>
                        <Route path="destinations" element={<DestinationsStep />} />
                        <Route path="itinerary" element={<ItineraryStep />} />
                    </Routes>
                </div>

                {/* Sticky Pricing Sidebar */}
                <div className="hidden lg:block w-[400px]">
                    <div className="sticky top-28">
                        <SidebarQuotation />
                    </div>
                </div>

            </main>
        </div>
    );
}

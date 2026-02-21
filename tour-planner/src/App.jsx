import { Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import PlannerPage from './pages/PlannerPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-swissGray font-sans">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/planner/*" element={<PlannerPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

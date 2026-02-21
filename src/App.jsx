import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import PlannerPage from './pages/PlannerPage';
import AdminDashboard from './pages/AdminDashboard';
import HistoryPage from './pages/HistoryPage';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import useThemeStore from './store/themeStore';

function App() {
  const initTheme = useThemeStore(s => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <div className="min-h-screen flex flex-col w-full bg-canvas dark:bg-d-canvas font-sans transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '1rem', padding: '16px', fontWeight: 600 } }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/planner/*" element={<PlannerPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

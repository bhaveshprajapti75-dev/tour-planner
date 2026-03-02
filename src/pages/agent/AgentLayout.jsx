import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, FileText, Users, Sparkles,
  ChevronLeft, LogOut, Menu, X, Sun, Moon,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import AgentDashboardPage from './AgentDashboardPage';
import UsersPage from '../admin/UsersPage';
import DayToursPage from '../admin/DayToursPage';
import TemplatesPage from '../admin/TemplatesPage';

const sidebarItems = [
  { path: '', label: 'Dashboard', icon: LayoutDashboard },
  { path: 'users', label: 'My Users', icon: Users },
  { path: 'day-tours', label: 'Day Tours', icon: Calendar },
  { path: 'templates', label: 'Templates', icon: FileText },
];

export default function AgentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAgent, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/agent');
    } else if (!isAgent()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, isAgent]);

  if (!isAuthenticated || !isAgent()) return null;

  const currentPath = location.pathname.replace('/agent/', '').replace('/agent', '');

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-canvas dark:bg-d-canvas flex font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-72 h-full bg-white dark:bg-d-card text-ink dark:text-white flex-col border-r border-gray-100 dark:border-white/[0.08] shadow-xl shadow-ink/5 dark:shadow-black/20 z-30 shrink-0
        ${sidebarOpen ? 'fixed inset-y-0 left-0 flex' : 'hidden md:flex'}`}>

        <div className="p-8 pb-6">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand text-white rounded-xl shadow-md flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Digi<span className="text-brand">Wave</span></h2>
          </Link>
          <p className="text-emerald-600 text-[10px] tracking-widest uppercase font-bold bg-emerald-500/10 inline-block px-3 py-1 rounded-lg">Agent Panel</p>
        </div>

        <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto hide-scrollbar">
          {sidebarItems.map(item => {
            const isActive = currentPath === item.path || (item.path === '' && currentPath === '');
            return (
              <Link
                key={item.path}
                to={`/agent/${item.path}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all text-sm font-bold
                  ${isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-ink-light dark:text-white/50 hover:bg-canvas dark:hover:bg-d-surface hover:text-ink dark:hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-white/[0.08] shrink-0 space-y-2">
          <Link to="/" className="flex items-center gap-3 text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white p-3 rounded-2xl transition-all w-full text-sm font-bold">
            <ChevronLeft className="w-5 h-5" /> Back to Site
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 text-ink-light dark:text-white/50 hover:text-red-500 p-3 rounded-2xl transition-all w-full text-sm font-bold cursor-pointer">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative w-full">
        <header className="bg-white/80 dark:bg-d-card/80 backdrop-blur-xl h-20 shrink-0 flex items-center justify-between px-6 lg:px-12 border-b border-gray-100 dark:border-white/[0.08] z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface rounded-xl cursor-pointer">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold tracking-tight text-ink dark:text-white capitalize">
              {sidebarItems.find(s => s.path === currentPath)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-canvas dark:bg-d-surface text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white transition-all cursor-pointer">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20 shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-ink dark:text-white">{user?.name || 'Agent'}</p>
                <p className="text-xs text-ink-light dark:text-white/50">Agent</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar scroll-smooth">
          <Routes>
            <Route index element={<AgentDashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="day-tours" element={<DayToursPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="*" element={<Navigate to="/agent" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

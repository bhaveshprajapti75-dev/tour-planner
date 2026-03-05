import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
// page transitions removed — they caused unmount/remount blinking on every navigation
import {
  LayoutDashboard, Globe, MapPin, Mountain, Calendar, Hotel, ListChecks,
  FileText, Users, ClipboardList, Clipboard, Sparkles, ChevronLeft, LogOut, Menu, X,
  Sun, Moon
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import DashboardPage from './DashboardPage';
import CountriesPage from './CountriesPage';
import RegionsPage from './RegionsPage';
import AttractionsPage from './AttractionsPage';
import DayToursPage from './DayToursPage';
import HotelsPage from './HotelsPage';
import InclusionsPage from './InclusionsPage';
import TemplatesPage from './TemplatesPage';
import UsersPage from './UsersPage';
import UserPlansPage from './UserPlansPage';
import AuditPage from './AuditPage';

const sidebarItems = [
  { path: '', label: 'Dashboard', icon: LayoutDashboard },
  { path: 'countries', label: 'Countries', icon: Globe },
  { path: 'regions', label: 'Regions', icon: MapPin },
  { path: 'attractions', label: 'Attractions', icon: Mountain },
  { path: 'day-tours', label: 'Day Tours', icon: Calendar },
  { path: 'hotels', label: 'Hotels', icon: Hotel },
  { path: 'inclusions', label: 'Inclusions', icon: ListChecks },
  { path: 'templates', label: 'Templates', icon: FileText },
  { path: 'plans', label: 'User Plans', icon: Clipboard },
  { path: 'users', label: 'Users', icon: Users },
  { path: 'audit', label: 'Audit Logs', icon: ClipboardList },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Redirect if not authenticated or not admin/superadmin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/admin');
    } else if (!isAdmin()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, isAdmin]);

  if (!isAuthenticated || !isAdmin()) return null;

  const currentPath = location.pathname.replace('/admin/', '').replace('/admin', '');

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-canvas dark:bg-d-canvas flex font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`h-full bg-white dark:bg-d-card text-ink dark:text-white flex-col border-r border-gray-100 dark:border-white/[0.08] shadow-xl shadow-ink/5 dark:shadow-black/20 z-30 shrink-0 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'fixed inset-y-0 left-0 flex w-72' : 'hidden md:flex'}
        ${!sidebarOpen && isCollapsed ? 'md:w-24' : 'md:w-72'}`}>

        <div className={`flex flex-col ${isCollapsed ? 'p-6 items-center' : 'p-8 pb-6'} transition-all duration-300`}>
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 bg-brand text-white rounded-xl shadow-md flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              {!isCollapsed && <h2 className="text-xl font-extrabold tracking-tight whitespace-nowrap">Digi<span className="text-brand">Wave</span></h2>}
            </Link>
          </div>
          {!isCollapsed && <p className="text-brand text-[10px] tracking-widest uppercase font-bold bg-brand/10 inline-block px-3 py-1 rounded-lg self-start mt-8 whitespace-nowrap">Admin Panel</p>}
        </div>

        <nav className={`flex-1 space-y-1.5 overflow-y-auto hide-scrollbar ${isCollapsed ? 'px-4' : 'px-6'}`}>
          {sidebarItems.map(item => {
            const isActive = currentPath === item.path || (item.path === '' && currentPath === '');
            return (
              <Link
                key={item.path}
                to={`/admin/${item.path}`}
                title={isCollapsed ? item.label : undefined}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center w-full rounded-2xl transition-all text-sm font-bold
                  ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
                  ${isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-ink-light dark:text-white/50 hover:bg-canvas dark:hover:bg-d-surface hover:text-ink dark:hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`p-6 border-t border-gray-100 dark:border-white/[0.08] shrink-0 space-y-2 ${isCollapsed ? 'px-4 flex flex-col items-center' : ''}`}>
          <Link to="/" title={isCollapsed ? "Back to Site" : undefined} className={`flex items-center text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white rounded-2xl transition-all font-bold cursor-pointer ${isCollapsed ? 'p-3 justify-center' : 'gap-3 p-3 w-full text-sm'}`}>
            <ChevronLeft className="w-5 h-5 shrink-0" /> {!isCollapsed && <span className="truncate">Back to Site</span>}
          </Link>
          <button onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`flex items-center text-ink-light dark:text-white/50 hover:text-red-500 rounded-2xl transition-all font-bold cursor-pointer ${isCollapsed ? 'p-3 justify-center' : 'gap-3 p-3 w-full text-sm'}`}>
            <LogOut className="w-5 h-5 shrink-0" /> {!isCollapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative w-full transition-all duration-300">
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-d-card/80 backdrop-blur-xl h-20 shrink-0 flex items-center justify-between px-6 lg:px-12 border-b border-gray-100 dark:border-white/[0.08] z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface rounded-xl cursor-pointer">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:block p-2 text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface rounded-xl cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-ink dark:text-white capitalize truncate max-w-[200px] sm:max-w-md">
              {sidebarItems.find(s => s.path === currentPath)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-canvas dark:bg-d-surface text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white transition-all cursor-pointer">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-hover rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand/20 shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-ink dark:text-white">{user?.name || 'Admin'}</p>
                <p className="text-xs text-ink-light dark:text-white/50">{user?.role || 'admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar scroll-smooth">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="countries" element={<CountriesPage />} />
            <Route path="regions" element={<RegionsPage />} />
            <Route path="attractions" element={<AttractionsPage />} />
            <Route path="day-tours" element={<DayToursPage />} />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="inclusions" element={<InclusionsPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="plans" element={<UserPlansPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

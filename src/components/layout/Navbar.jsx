import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Menu, X, History, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import usePlannerStore from '../../store/plannerStore';
import useThemeStore from '../../store/themeStore';

export default function Navbar() {
    const { isLoggedIn, currentUser, logout } = usePlannerStore();
    const { theme, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    const navLinks = [
        { to: '/planner/wizard', label: 'Plan Trip', show: true },
        { to: '/history', label: 'My Plans', show: isLoggedIn, icon: History },
        { to: '/admin', label: 'Admin', show: true, icon: LayoutDashboard },
    ];

    return (
        <nav className="fixed w-full z-50 top-0 pt-4 px-4 sm:px-6 lg:px-12 transition-all duration-300 pointer-events-none">
            <div className="max-w-[1400px] mx-auto pointer-events-auto">
                <div className="glass rounded-[2rem] px-6 lg:px-8 py-4 flex justify-between items-center shadow-sm">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-brand text-white rounded-xl shadow-md shadow-brand/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Compass className="w-6 h-6" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-ink dark:text-white">
                            Digi<span className="text-brand">Wave</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.filter(l => l.show).map(link => (
                            <Link key={link.to} to={link.to} className="text-sm font-bold text-ink-light dark:text-white/60 hover:text-brand dark:hover:text-brand transition-colors cursor-pointer">
                                {link.label}
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer bg-canvas dark:bg-white/10 text-ink-light dark:text-white/70 hover:text-brand dark:hover:text-brand border border-gray-200 dark:border-white/10 hover:border-brand/30 dark:hover:border-brand/30"
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>

                        {isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-canvas dark:bg-white/10 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10">
                                    <div className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
                                        {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold text-ink dark:text-white max-w-[100px] truncate">{currentUser?.name || 'User'}</span>
                                </div>
                                <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer p-2">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/auth" className="flex items-center gap-2 bg-ink dark:bg-white text-white dark:text-ink px-6 py-3 rounded-2xl font-bold text-sm hover:bg-black dark:hover:bg-gray-100 transition-colors shadow-lg shadow-ink/10 dark:shadow-white/5 cursor-pointer">
                                <User className="w-4 h-4" />
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer bg-canvas dark:bg-white/10 text-ink-light dark:text-white/70 border border-gray-200 dark:border-white/10"
                        >
                            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-ink dark:text-white hover:text-brand p-2 cursor-pointer transition-colors bg-white dark:bg-white/10 rounded-full shadow-sm">
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="md:hidden mt-2 glass rounded-3xl p-6 space-y-3 border border-white/20"
                        >
                            {navLinks.filter(l => l.show).map(link => (
                                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block text-sm font-bold text-ink dark:text-white hover:text-brand py-2 transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                            {isLoggedIn ? (
                                <button onClick={handleLogout} className="w-full text-left text-sm font-bold text-red-500 py-2">Logout</button>
                            ) : (
                                <Link to="/auth" onClick={() => setMobileOpen(false)} className="block text-sm font-bold text-brand py-2">Sign In</Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

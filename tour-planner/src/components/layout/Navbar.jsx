import { Link } from 'react-router-dom';
import { Compass, User, Menu } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed w-full z-50 top-0 pt-4 px-4 sm:px-6 lg:px-12 transition-all duration-300 pointer-events-none">
            <div className="max-w-[1400px] mx-auto pointer-events-auto">
                <div className="glass rounded-[2rem] px-6 lg:px-8 py-4 flex justify-between items-center shadow-sm">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-brand text-white rounded-xl shadow-md shadow-brand/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Compass className="w-6 h-6" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-ink">
                            Digi<span className="text-brand">Wave</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/admin" className="text-sm font-bold text-ink-light hover:text-brand transition-colors cursor-pointer">
                            Admin Portal
                        </Link>

                        <div className="flex items-center gap-4">
                            <button className="text-sm font-bold text-ink-light hover:text-ink transition-colors cursor-pointer px-4 py-2">
                                Agent Login
                            </button>
                            <button className="flex items-center gap-2 bg-ink text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-black transition-colors shadow-lg shadow-ink/10 cursor-pointer">
                                <User className="w-4 h-4" />
                                Sign In
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button className="text-ink hover:text-brand p-2 cursor-pointer transition-colors bg-white rounded-full shadow-sm">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}

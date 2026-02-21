import { Link } from 'react-router-dom';
import { Mountain } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-canvas dark:bg-d-canvas transition-colors duration-300">
            <Mountain className="w-20 h-20 text-brand mb-6 opacity-30" />
            <h1 className="text-7xl font-extrabold text-ink dark:text-white mb-4">404</h1>
            <p className="text-xl text-ink-light dark:text-white/60 mb-8 font-medium">Oops! This page got lost in the Alps.</p>
            <Link
                to="/"
                className="px-8 py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 hover:-translate-y-0.5"
            >
                Return to Basecamp
            </Link>
        </div>
    );
}

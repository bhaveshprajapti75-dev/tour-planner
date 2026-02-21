import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <h1 className="text-6xl font-bold text-swissDark mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Oops! This page got lost in the Alps.</p>
            <Link
                to="/"
                className="px-6 py-3 bg-swissRed text-white rounded-full font-medium hover:bg-swissAccent transition-colors shadow-lg shadow-red-500/30"
            >
                Return to Basecamp
            </Link>
        </div>
    );
}

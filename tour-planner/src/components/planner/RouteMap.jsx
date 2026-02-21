import { MapPin } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import { cities } from '../../data/mockData';

export default function RouteMap() {
    const { selectedCities } = usePlannerStore();

    if (selectedCities.length === 0) return null;

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 mb-12 p-10 relative shadow-xl shadow-ink/5 overflow-hidden">
            {/* Soft grid background */}
            <div className="absolute inset-0 bg-canvas opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-ink-light) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.1 }} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shadow-md shadow-brand/5">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-2xl tracking-tight text-ink">Trajectory Map</h3>
                            <p className="text-ink-light text-sm font-medium mt-1">Geographical progression mapped end-to-end.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-8 pb-8 relative">
                    {/* Connecting Soft Line */}
                    <div className="absolute top-[30px] left-16 right-16 h-[4px] bg-canvas rounded-full -translate-y-1/2 overflow-hidden shadow-inner">
                        <div className="h-full bg-brand w-full origin-left transition-transform duration-1000 brightness-110" />
                    </div>

                    {selectedCities.map((id, index) => {
                        const city = cities.find(c => c.id === id);
                        return (
                            <div key={`map-${id}-${index}`} className="relative group flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-2">
                                {/* Rounded Profile Image Map Node */}
                                <div className="w-16 h-16 rounded-full bg-white border-[3px] border-brand z-10 overflow-hidden relative shadow-lg shadow-brand/20 group-hover:ring-4 ring-brand/30 transition-all">
                                    <img src={city?.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute top-20 text-center w-32 -ml-8">
                                    <div className="font-bold text-sm text-ink">{city?.name}</div>
                                    <div className="text-xs font-semibold text-ink-light">Sector 0{index + 1}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

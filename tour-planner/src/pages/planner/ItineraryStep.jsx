import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sun, Sunrise, Moon, SquareArrowOutUpRight, Replace, Trash2, Train, Hotel, Info } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import { cities, activities, hotels } from '../../data/mockData';
import ActivityModal from '../../components/planner/ActivityModal';
import RouteMap from '../../components/planner/RouteMap';

export default function ItineraryStep() {
    const { selectedCities, duration } = usePlannerStore();
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [days, setDays] = useState([]);

    useEffect(() => {
        if (selectedCities.length === 0) return;
        let currentCityIndex = 0;
        const daysPerCity = Math.max(1, Math.floor(duration / selectedCities.length));

        const mockDays = Array.from({ length: duration }).map((_, i) => {
            if (i > 0 && i % daysPerCity === 0 && currentCityIndex < selectedCities.length - 1) {
                currentCityIndex++;
            }
            const cId = selectedCities[currentCityIndex];
            const city = cities.find(c => c.id === cId);
            const cityActs = activities.filter(a => a.cityId === cId);

            return {
                dayNum: i + 1,
                city: city,
                hotel: hotels.find(h => h.cityId === cId),
                shifts: {
                    morning: cityActs.find(a => a.shift === 'Morning') || null,
                    noon: cityActs.find(a => a.shift === 'Noon') || null,
                    evening: cityActs.find(a => a.shift === 'Evening') || null,
                }
            };
        });
        setDays(mockDays);
    }, [selectedCities, duration]);

    if (selectedCities.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-ink-light font-bold text-lg">
                Awaiting Parameters
            </div>
        );
    }

    return (
        <div className="pb-32 pt-10">
            <div className="mb-14 px-4 sm:px-0">
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink mb-3">Master Plan</h2>
                <p className="text-lg text-ink-light font-medium max-w-lg">
                    Hour-by-hour operational matrix. Configure modular blocks as needed.
                </p>
            </div>

            <RouteMap />

            {/* Soft Bubbling Timeline */}
            <div className="space-y-0 relative border-l-4 border-dashed border-gray-200 ml-8 md:ml-16 mr-4 sm:mr-0">

                {days.map((day, dIdx) => {
                    const isNewCity = dIdx === 0 || day.city?.id !== days[dIdx - 1].city?.id;

                    return (
                        <div key={day.dayNum} className="relative z-10 pl-8 lg:pl-16 pb-16">

                            {/* Timeline Bubble Node */}
                            <div className="absolute -left-[14px] top-6 w-6 h-6 rounded-full bg-brand shadow-lg shadow-brand/40 border-4 border-white" />

                            {/* Soft City Transition Header */}
                            {isNewCity && day.city && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-8 flex items-center gap-5 -ml-4 lg:-ml-12"
                                >
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white border-4 border-white shadow-xl shadow-ink/10 overflow-hidden shrink-0 z-20">
                                        <img src={day.city.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-white px-6 py-4 rounded-3xl shadow-lg shadow-ink/5 border border-gray-100 flex-1 lg:flex-none">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">Sector Entry</p>
                                        <h3 className="text-2xl font-bold tracking-tight text-ink">{day.city.name} Command</h3>
                                        {day.hotel && (
                                            <p className="text-sm text-ink-light font-medium flex items-center gap-2 mt-1.5">
                                                <Hotel className="w-4 h-4 text-brand" />
                                                Basecamp: {day.hotel.name}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Operational Day Block (Modern Rounded Container) */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-ink/5 hover:shadow-2xl hover:shadow-brand/5 transition-all">

                                <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-brand mb-1 block">T - {duration - day.dayNum}</span>
                                        <h4 className="font-extrabold text-3xl text-ink tracking-tight">Day {String(day.dayNum).padStart(2, '0')}</h4>
                                    </div>
                                </div>

                                {/* Shift Grid (Soft Bubble Modules) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <ShiftModule
                                        icon={Sunrise}
                                        shiftName="Morning"
                                        activity={day.shifts.morning}
                                        onViewDetails={() => setSelectedActivity(day.shifts.morning)}
                                    />
                                    <ShiftModule
                                        icon={Sun}
                                        shiftName="Noon"
                                        activity={day.shifts.noon}
                                        onViewDetails={() => setSelectedActivity(day.shifts.noon)}
                                    />
                                    <ShiftModule
                                        icon={Moon}
                                        shiftName="EV"
                                        activity={day.shifts.evening}
                                        onViewDetails={() => setSelectedActivity(day.shifts.evening)}
                                    />
                                </div>
                            </div>

                            {/* Transit Node */}
                            {dIdx < days.length - 1 && days[dIdx + 1].city?.id !== day.city?.id && (
                                <div className="mt-12 mb-2 relative z-20 flex justify-center lg:justify-start lg:-ml-6">
                                    <div className="bg-white border border-gray-100 rounded-[2rem] p-3 pr-6 flex items-center gap-4 shadow-lg shadow-ink/5 hover:scale-105 transition-transform cursor-default">
                                        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0"><Train className="w-5 h-5" /></div>
                                        <div>
                                            <div className="text-[10px] uppercase font-bold tracking-widest text-ink-light">Transit Vector</div>
                                            <div className="font-bold text-sm text-ink group-hover:text-brand transition-colors">
                                                Rail Transfer &rarr; {days[dIdx + 1].city?.name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )
                })}
            </div>

            <ActivityModal
                isOpen={!!selectedActivity}
                onClose={() => setSelectedActivity(null)}
                activity={selectedActivity}
            />
        </div>
    );
}

function ShiftModule({ icon: Icon, shiftName, activity, onViewDetails }) {
    return (
        <div className={`p-6 flex flex-col justify-between rounded-3xl transition-all cursor-pointer ${activity ? 'bg-canvas border border-gray-200' : 'bg-white border-2 border-dashed border-gray-200 hover:bg-gray-50'}`}>
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-brand" />
                    <div className="text-xs uppercase tracking-widest font-bold text-ink">
                        {shiftName}
                    </div>
                </div>
                {!activity && <div className="text-sm font-medium text-ink-light mt-4">Open slot for freestyle exploration.</div>}
            </div>

            {activity && (
                <div className="flex-1 flex flex-col justify-end mt-4">
                    <h5 className="font-bold text-ink leading-tight mb-4 text-lg border-l-4 border-brand pl-3 rounded-sm">{activity.title}</h5>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                            onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                            className="col-span-2 bg-white text-ink shadow-sm border border-gray-200 text-xs font-bold rounded-2xl py-3 hover:bg-brand hover:text-white hover:border-brand transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Info className="w-4 h-4" /> Specs
                        </button>
                        <button className="bg-white shadow-sm border border-gray-200 text-ink text-xs font-bold rounded-2xl py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer">
                            <Replace className="w-4 h-4" />
                        </button>
                        <button className="bg-white shadow-sm border border-gray-200 text-red-500 py-2.5 rounded-2xl hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

import { useState } from 'react';
import { LayoutDashboard, Users, FileText, Settings, LogOut, CheckCircle2, Clock, Search, Filter, Sparkles } from 'lucide-react';
import { projectsData } from '../data/mockData';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('projects');

    return (
        <div className="min-h-screen bg-canvas flex font-sans">

            {/* Sidebar - Soft Modern */}
            <aside className="w-72 bg-white text-ink flex flex-col hidden md:flex border-r border-gray-100 shadow-xl shadow-ink/5 z-20">
                <div className="p-8 pb-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand text-white rounded-xl shadow-md flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight">Digi<span className="text-brand">Wave</span></h2>
                    </div>
                    <p className="text-brand text-[10px] tracking-widest uppercase font-bold bg-brand/10 inline-block px-3 py-1 rounded-lg">Admin Access</p>
                </div>

                <nav className="flex-1 px-6 space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
                    <SidebarItem icon={FileText} label="Projects" />
                    <SidebarItem icon={Users} label="Clients" />
                    <SidebarItem icon={Settings} label="Settings" />
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <button className="flex items-center gap-3 text-red-500 hover:bg-red-50 p-3 rounded-2xl transition-all w-full text-sm font-bold cursor-pointer">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col relative">

                {/* Top Header */}
                <header className="bg-white/80 backdrop-blur-xl h-24 flex items-center justify-between px-12 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                    <h1 className="text-2xl font-bold tracking-tight text-ink">Overview</h1>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="pl-12 pr-4 py-3 bg-canvas border border-transparent rounded-[1rem] text-sm font-medium focus:bg-white focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 w-72 transition-all"
                            />
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-hover rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand/20 cursor-pointer hover:-translate-y-0.5 transition-transform">
                            SA
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-12">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <StatCard title="Total Quotes" value="842" trend="+12% this month" />
                        <StatCard title="Active Trips" value="45" />
                        <StatCard title="Won Contracts" value="128" trend="+5% this week" />
                        <StatCard title="Total Revenue" value="CHF 1.2M" />
                    </div>

                    {/* CRM Table */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-ink/5 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="font-extrabold text-xl text-ink">Recent Projects</h3>
                            <button className="flex items-center gap-2 text-sm font-bold text-ink bg-canvas border border-gray-200 rounded-2xl px-5 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer">
                                <Filter className="w-4 h-4" /> Filter
                            </button>
                        </div>

                        <div className="overflow-x-auto p-4">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-ink-light text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-bold">Project ID</th>
                                        <th className="px-6 py-4 font-bold">Client & Trip</th>
                                        <th className="px-6 py-4 font-bold">Date</th>
                                        <th className="px-6 py-4 font-bold">Quote Status</th>
                                        <th className="px-6 py-4 font-bold">Value (CHF)</th>
                                        <th className="px-6 py-4 font-bold">State</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {projectsData.map((project) => (
                                        <tr key={project.id} className="hover:bg-canvas transition-colors cursor-pointer group rounded-2xl">
                                            <td className="px-6 py-5 text-sm font-bold text-brand w-32 border-b border-gray-50 group-hover:border-transparent">#{project.id}</td>
                                            <td className="px-6 py-5 border-b border-gray-50 group-hover:border-transparent">
                                                <div className="font-bold text-ink text-base mb-1">{project.name}</div>
                                                <div className="text-sm text-ink-light font-medium">{project.client}</div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-ink-light font-medium border-b border-gray-50 group-hover:border-transparent">{project.date}</td>
                                            <td className="px-6 py-5 border-b border-gray-50 group-hover:border-transparent">
                                                {project.quoted === 'Yes'
                                                    ? <span className="inline-flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-xl"><CheckCircle2 className="w-4 h-4" /> Sent</span>
                                                    : <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-xl"><Clock className="w-4 h-4" /> Pending</span>
                                                }
                                            </td>
                                            <td className="px-6 py-5 text-base font-bold text-ink border-b border-gray-50 group-hover:border-transparent">{project.amount}</td>
                                            <td className="px-6 py-5 border-b border-gray-50 group-hover:border-transparent">
                                                <span className="inline-flex items-center px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-ink text-white rounded-full">
                                                    {project.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, active }) {
    return (
        <button className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all text-sm font-bold cursor-pointer
      ${active ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-ink-light hover:bg-canvas hover:text-ink'}
    `}>
            <Icon className="w-5 h-5" />
            {label}
        </button>
    )
}

function StatCard({ title, value, trend }) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-ink/5 hover:shadow-2xl hover:shadow-brand/5 hover:-translate-y-1 transition-all cursor-default">
            <h4 className="text-sm font-bold text-ink-light mb-4">{title}</h4>
            <div className="text-4xl font-extrabold tracking-tight text-ink">{value}</div>
            {trend && <div className="text-sm font-bold text-brand mt-4 bg-brand/5 inline-block px-3 py-1 rounded-xl">{trend}</div>}
        </div>
    )
}

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Settings, LogOut, CheckCircle2, Clock,
  Search, Filter, Sparkles, MapPin, Hotel, Eye, Footprints, Car, Plus,
  Edit3, Trash2, X, Save, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  projectsData, cities as citiesData, hotels as hotelsData,
  sightseeings as sightsData, activities as actsData, transportOptions
} from '../data/mockData';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FileText },
  { id: 'cities', label: 'Cities', icon: MapPin },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'sightseeing', label: 'Sightseeing', icon: Eye },
  { id: 'activities', label: 'Activities', icon: Footprints },
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'clients', label: 'Clients', icon: Users },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden bg-canvas dark:bg-d-canvas flex font-sans">
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
          <p className="text-brand text-[10px] tracking-widest uppercase font-bold bg-brand/10 inline-block px-3 py-1 rounded-lg">Admin Panel</p>
        </div>
        <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all text-sm font-bold cursor-pointer
                ${activeTab === tab.id ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-ink-light dark:text-white/50 hover:bg-canvas dark:hover:bg-d-surface hover:text-ink dark:hover:text-white'}`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-100 dark:border-white/[0.08] shrink-0">
          <Link to="/" className="flex items-center gap-3 text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white p-3 rounded-2xl transition-all w-full text-sm font-bold">
            <ChevronLeft className="w-5 h-5" /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative w-full">
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-d-card/80 backdrop-blur-xl h-20 shrink-0 flex items-center justify-between px-6 lg:px-12 border-b border-gray-100 dark:border-white/[0.08] z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface rounded-xl">
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-ink dark:text-white capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Search..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-canvas dark:bg-d-surface border border-transparent rounded-xl text-sm font-medium text-ink dark:text-white focus:bg-white dark:focus:bg-d-card focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 w-60 transition-all"
              />
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-hover rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand/20 shrink-0">
              SA
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'projects' && <ProjectsTab search={searchQuery} />}
              {activeTab === 'cities' && <CrudTable title="Cities" data={citiesData} columns={['name', 'country']} imageKey="image" search={searchQuery} />}
              {activeTab === 'hotels' && <HotelsTab search={searchQuery} />}
              {activeTab === 'sightseeing' && <CrudTable title="Sightseeing" data={sightsData} columns={['name', 'cityId', 'duration', 'cost']} imageKey="image" search={searchQuery} />}
              {activeTab === 'activities' && <CrudTable title="Activities" data={actsData} columns={['title', 'cityId', 'shift', 'price', 'duration']} imageKey="image" search={searchQuery} />}
              {activeTab === 'transport' && <TransportTab />}
              {activeTab === 'clients' && <ClientsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ======================== DASHBOARD TAB ======================== */
function DashboardTab() {
  const stats = [
    { title: 'Total Enquiries', value: projectsData.length.toString(), trend: '+12% this month' },
    { title: 'Active Trips', value: '45' },
    { title: 'Quotations Sent', value: projectsData.filter(p => p.quoted === 'Yes').length.toString(), trend: '+5%' },
    { title: 'Total Revenue', value: 'INR 1.2M' },
    { title: 'Cities Available', value: citiesData.length.toString() },
    { title: 'Hotels Listed', value: hotelsData.length.toString() },
    { title: 'Activities', value: actsData.length.toString() },
    { title: 'Sightseeing Spots', value: sightsData.length.toString() },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.title} className="bg-white dark:bg-d-card p-6 rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <h4 className="text-xs font-bold text-ink-light dark:text-white/50 mb-3">{s.title}</h4>
            <div className="text-3xl font-extrabold tracking-tight text-ink dark:text-white">{s.value}</div>
            {s.trend && <div className="text-xs font-bold text-brand mt-2 bg-brand/5 inline-block px-2 py-0.5 rounded-lg">{s.trend}</div>}
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/[0.08]">
          <h3 className="font-bold text-lg text-ink dark:text-white">Recent Enquiries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="text-ink-light dark:text-white/50 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08]">
              <th className="px-6 py-3 font-bold">ID</th>
              <th className="px-6 py-3 font-bold">Client</th>
              <th className="px-6 py-3 font-bold">Date</th>
              <th className="px-6 py-3 font-bold">Status</th>
              <th className="px-6 py-3 font-bold">Amount</th>
            </tr></thead>
            <tbody>
              {projectsData.slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-canvas dark:hover:bg-d-surface transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                  <td className="px-6 py-4 text-sm font-bold text-brand">#{p.id}</td>
                  <td className="px-6 py-4"><div className="font-bold text-sm text-ink dark:text-white">{p.client}</div><div className="text-xs text-ink-light dark:text-white/50">{p.name}</div></td>
                  <td className="px-6 py-4 text-sm text-ink-light dark:text-white/50">{p.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${p.status === 'Completed' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                        p.status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                          'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-ink dark:text-white">{p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ======================== PROJECTS TAB ======================== */
function ProjectsTab({ search }) {
  const filtered = useMemo(() => {
    if (!search) return projectsData;
    const q = search.toLowerCase();
    return projectsData.filter(p =>
      p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.status.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.08] flex justify-between items-center">
        <h3 className="font-bold text-lg text-ink dark:text-white">All Projects ({filtered.length})</h3>
        <button className="flex items-center gap-2 text-sm font-bold bg-brand text-white px-5 py-2.5 rounded-2xl hover:bg-brand-hover transition-all shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="text-ink-light dark:text-white/50 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08]">
            <th className="px-6 py-3 font-bold">ID</th>
            <th className="px-6 py-3 font-bold">Client & Trip</th>
            <th className="px-6 py-3 font-bold">Date</th>
            <th className="px-6 py-3 font-bold">Quoted</th>
            <th className="px-6 py-3 font-bold">Amount</th>
            <th className="px-6 py-3 font-bold">Status</th>
            <th className="px-6 py-3 font-bold">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-canvas dark:hover:bg-d-surface transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                <td className="px-6 py-4 text-sm font-bold text-brand">#{p.id}</td>
                <td className="px-6 py-4"><div className="font-bold text-sm text-ink dark:text-white">{p.name}</div><div className="text-xs text-ink-light dark:text-white/50">{p.client}</div></td>
                <td className="px-6 py-4 text-sm text-ink-light dark:text-white/50">{p.date}</td>
                <td className="px-6 py-4">
                  {p.quoted === 'Yes'
                    ? <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-lg"><CheckCircle2 className="w-3.5 h-3.5" /> Sent</span>
                    : <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded-lg"><Clock className="w-3.5 h-3.5" /> Pending</span>
                  }</td>
                <td className="px-6 py-4 text-sm font-bold text-ink dark:text-white">{p.amount}</td>
                <td className="px-6 py-4"><span className={`text-xs font-bold px-3 py-1 rounded-full ${p.status === 'Completed' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                    p.status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-ink text-white'
                  }`}>{p.status}</span></td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 text-ink-light dark:text-white/50 hover:text-brand hover:bg-brand/5 rounded-lg transition-all cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-ink-light dark:text-white/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================== GENERIC CRUD TABLE ======================== */
function CrudTable({ title, data, columns, imageKey, search }) {
  const [editingId, setEditingId] = useState(null);

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(item =>
      columns.some(col => String(item[col] || '').toLowerCase().includes(q))
    );
  }, [data, columns, search]);

  return (
    <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.08] flex justify-between items-center">
        <h3 className="font-bold text-lg text-ink dark:text-white">{title} ({filtered.length})</h3>
        <button className="flex items-center gap-2 text-sm font-bold bg-brand text-white px-5 py-2.5 rounded-2xl hover:bg-brand-hover transition-all shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" /> Add {title.replace(/s$/, '')}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="text-ink-light dark:text-white/50 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08]">
            {imageKey && <th className="px-6 py-3 font-bold w-16">Image</th>}
            <th className="px-6 py-3 font-bold">#</th>
            {columns.map(col => <th key={col} className="px-6 py-3 font-bold">{col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</th>)}
            <th className="px-6 py-3 font-bold">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-canvas dark:hover:bg-d-surface transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                {imageKey && item[imageKey] && (
                  <td className="px-6 py-3"><img src={item[imageKey]} className="w-12 h-12 rounded-xl object-cover" alt="" /></td>
                )}
                {imageKey && !item[imageKey] && <td className="px-6 py-3"><div className="w-12 h-12 rounded-xl bg-canvas dark:bg-d-surface" /></td>}
                <td className="px-6 py-3 text-sm font-bold text-brand">{idx + 1}</td>
                {columns.map(col => (
                  <td key={col} className="px-6 py-3 text-sm font-medium text-ink dark:text-white">{String(item[col] ?? '-')}</td>
                ))}
                <td className="px-6 py-3 flex gap-2">
                  <button className="p-2 text-ink-light dark:text-white/50 hover:text-brand hover:bg-brand/5 rounded-lg transition-all cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-ink-light dark:text-white/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================== HOTELS TAB ======================== */
function HotelsTab({ search }) {
  const filtered = useMemo(() => {
    if (!search) return hotelsData;
    const q = search.toLowerCase();
    return hotelsData.filter(h => h.name.toLowerCase().includes(q) || h.cityId.toLowerCase().includes(q) || h.category.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.08] flex justify-between items-center">
        <h3 className="font-bold text-lg text-ink dark:text-white">Hotels ({filtered.length})</h3>
        <button className="flex items-center gap-2 text-sm font-bold bg-brand text-white px-5 py-2.5 rounded-2xl hover:bg-brand-hover transition-all shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" /> Add Hotel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="text-ink-light dark:text-white/50 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08]">
            <th className="px-6 py-3 font-bold w-16">Image</th>
            <th className="px-6 py-3 font-bold">#</th>
            <th className="px-6 py-3 font-bold">Hotel</th>
            <th className="px-6 py-3 font-bold">City</th>
            <th className="px-6 py-3 font-bold">Category</th>
            <th className="px-6 py-3 font-bold">Price/Night</th>
            <th className="px-6 py-3 font-bold">Amenities</th>
            <th className="px-6 py-3 font-bold">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((h, i) => (
              <tr key={h.id} className="hover:bg-canvas dark:hover:bg-d-surface transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                <td className="px-6 py-3"><img src={h.image} className="w-12 h-12 rounded-xl object-cover" alt={h.name} /></td>
                <td className="px-6 py-3 text-sm font-bold text-brand">{i + 1}</td>
                <td className="px-6 py-3 text-sm font-bold text-ink dark:text-white">{h.name}</td>
                <td className="px-6 py-3 text-sm text-ink-light dark:text-white/50 capitalize">{h.cityId}</td>
                <td className="px-6 py-3"><span className="text-xs font-bold bg-brand/5 text-brand px-3 py-1 rounded-lg">{h.category}</span></td>
                <td className="px-6 py-3 text-sm font-bold text-ink dark:text-white">INR {h.price}</td>
                <td className="px-6 py-3">
                  <div className="flex flex-wrap gap-1">{(h.amenities || []).slice(0, 3).map(a => <span key={a} className="text-[10px] bg-canvas dark:bg-d-surface px-2 py-0.5 rounded-md font-medium text-ink-light dark:text-white/50">{a}</span>)}</div>
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <button className="p-2 text-ink-light dark:text-white/50 hover:text-brand hover:bg-brand/5 rounded-lg transition-all cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-ink-light dark:text-white/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================== TRANSPORT TAB ======================== */
function TransportTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 p-6">
        <h3 className="font-bold text-lg text-ink dark:text-white mb-6">Vehicle Categories & Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {transportOptions.map(t => (
            <div key={t.id} className="bg-canvas dark:bg-d-surface rounded-2xl border border-gray-200 dark:border-white/[0.08] p-6 hover:border-brand/30 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-ink dark:text-white text-lg">{t.label}</h4>
                <button className="p-2 text-ink-light dark:text-white/50 hover:text-brand hover:bg-brand/5 rounded-lg transition-all cursor-pointer"><Edit3 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-ink-light dark:text-white/50">Price per KM</span><span className="font-bold text-ink dark:text-white">INR {t.pricePerKm}</span></div>
                <div className="flex justify-between"><span className="text-sm text-ink-light dark:text-white/50">Capacity</span><span className="font-bold text-ink dark:text-white">{t.id === 'economy' ? '4 Pax' : t.id === 'standard' ? '6 Pax' : '8 Pax'}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 p-6">
        <h3 className="font-bold text-lg text-ink dark:text-white mb-4">Travel Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Self Drive', 'Seat in Coach', 'Chauffeur Driven'].map(type => (
            <div key={type} className="bg-canvas dark:bg-d-surface rounded-2xl border border-gray-200 dark:border-white/[0.08] p-5 flex justify-between items-center">
              <span className="font-bold text-ink dark:text-white">{type}</span>
              <span className="text-xs font-bold text-brand bg-brand/5 px-3 py-1 rounded-lg">Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======================== CLIENTS TAB ======================== */
function ClientsTab() {
  const clients = [
    { name: 'Rajesh Patel', email: 'rajesh@example.com', type: 'B2C', plans: 3, lastActive: '2024-01-15' },
    { name: 'SwissTravel Agency', email: 'info@swisstravel.com', type: 'Agent', plans: 12, lastActive: '2024-01-18' },
    { name: 'Priya Sharma', email: 'priya@example.com', type: 'B2C', plans: 1, lastActive: '2024-01-10' },
    { name: 'EuroTrips LLP', email: 'contact@eurotrips.com', type: 'Agent', plans: 8, lastActive: '2024-01-20' },
    { name: 'Amit Verma', email: 'amit@example.com', type: 'B2C', plans: 2, lastActive: '2024-01-12' },
  ];

  return (
    <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.08] flex justify-between items-center">
        <h3 className="font-bold text-lg text-ink dark:text-white">Clients ({clients.length})</h3>
        <button className="flex items-center gap-2 text-sm font-bold bg-brand text-white px-5 py-2.5 rounded-2xl hover:bg-brand-hover transition-all shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="text-ink-light dark:text-white/50 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08]">
            <th className="px-6 py-3 font-bold">#</th>
            <th className="px-6 py-3 font-bold">Name</th>
            <th className="px-6 py-3 font-bold">Email</th>
            <th className="px-6 py-3 font-bold">Type</th>
            <th className="px-6 py-3 font-bold">Plans</th>
            <th className="px-6 py-3 font-bold">Last Active</th>
            <th className="px-6 py-3 font-bold">Actions</th>
          </tr></thead>
          <tbody>
            {clients.map((c, i) => (
              <tr key={c.email} className="hover:bg-canvas dark:hover:bg-d-surface transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                <td className="px-6 py-4 text-sm font-bold text-brand">{i + 1}</td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">{c.name.charAt(0)}</div>
                  <span className="font-bold text-sm text-ink dark:text-white">{c.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-ink-light dark:text-white/50">{c.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.type === 'Agent' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>{c.type}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-ink dark:text-white">{c.plans}</td>
                <td className="px-6 py-4 text-sm text-ink-light dark:text-white/50">{c.lastActive}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 text-ink-light dark:text-white/50 hover:text-brand hover:bg-brand/5 rounded-lg transition-all cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-ink-light dark:text-white/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

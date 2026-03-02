import { useState, useEffect } from 'react';
import { Users, Calendar, FileText, Loader2 } from 'lucide-react';
import { usersAPI, dayToursAPI, templatesAPI } from '../../services/api';

export default function AgentDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [usersRes, toursRes, templatesRes] = await Promise.allSettled([
        usersAPI.getUsers({ page_size: 1 }),
        dayToursAPI.getDayTours({ page_size: 1 }),
        templatesAPI.getTemplates({ page_size: 1 }),
      ]);
      setStats({
        users: usersRes.status === 'fulfilled' ? (usersRes.value.data.count ?? usersRes.value.data.results?.length ?? 0) : 0,
        dayTours: toursRes.status === 'fulfilled' ? (toursRes.value.data.count ?? toursRes.value.data.results?.length ?? 0) : 0,
        templates: templatesRes.status === 'fulfilled' ? (templatesRes.value.data.count ?? templatesRes.value.data.results?.length ?? 0) : 0,
      });
    } catch {
      setStats({ users: 0, dayTours: 0, templates: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const cards = [
    { title: 'My Users', value: stats?.users || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: 'Day Tours', value: stats?.dayTours || 0, icon: Calendar, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10' },
    { title: 'Templates', value: stats?.templates || 0, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20">
        <h2 className="text-2xl font-extrabold mb-2">Welcome to Agent Panel</h2>
        <p className="text-emerald-100 text-sm">Manage your users, day tours, and itinerary templates from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(s => (
          <div key={s.title} className="bg-white dark:bg-d-card p-6 rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-ink dark:text-white mb-1">{s.value}</div>
            <p className="text-xs font-bold text-ink-light dark:text-white/50 uppercase tracking-wider">{s.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

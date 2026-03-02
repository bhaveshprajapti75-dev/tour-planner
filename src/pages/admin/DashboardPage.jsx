import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { Users, Globe, MapPin, Mountain, Calendar, Hotel, ListChecks, FileText, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const { data } = await dashboardAPI.getStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard stats');
      console.error(err);
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

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
        <button onClick={loadStats} className="mt-3 text-sm font-bold text-brand hover:underline cursor-pointer">Retry</button>
      </div>
    );
  }

  const statCards = [
    { title: 'Users', value: stats?.user_count || 0, icon: Users, color: 'text-blue-500' },
    { title: 'Countries', value: stats?.country_count || 0, icon: Globe, color: 'text-green-500' },
    { title: 'Regions', value: stats?.region_count || 0, icon: MapPin, color: 'text-purple-500' },
    { title: 'Attractions', value: stats?.attraction_count || 0, icon: Mountain, color: 'text-orange-500' },
    { title: 'Day Tours', value: stats?.day_tour_count || 0, icon: Calendar, color: 'text-pink-500' },
    { title: 'User Plans', value: stats?.plan_count || 0, icon: FileText, color: 'text-indigo-500' },
    { title: 'Inclusions', value: stats?.inclusion_count || 0, icon: ListChecks, color: 'text-teal-500' },
    { title: 'Templates', value: stats?.template_count || 0, icon: FileText, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.title} className="bg-white dark:bg-d-card p-6 rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-ink-light dark:text-white/50">{s.title}</h4>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-ink dark:text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      {stats?.recent_users?.length > 0 && (
        <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-white/[0.08]">
            <h3 className="font-bold text-lg text-ink dark:text-white">Recent Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-ink-light dark:text-white/50 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08]">
                  <th className="px-6 py-3 font-bold">Name</th>
                  <th className="px-6 py-3 font-bold">Email</th>
                  <th className="px-6 py-3 font-bold">Role</th>
                  <th className="px-6 py-3 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_users.map(u => (
                  <tr key={u.id} className="hover:bg-canvas dark:hover:bg-d-surface transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-bold text-sm text-ink dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-light dark:text-white/50">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${u.role === 'SUPER_ADMIN' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        u.role === 'AGENT' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400'}`}>
                        {u.role === 'SUPER_ADMIN' ? 'Super Admin' : u.role === 'AGENT' ? 'Agent' : u.role === 'USER' ? 'User' : u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-light dark:text-white/50">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Audit Logs */}
      {stats?.recent_audit_logs?.length > 0 && (
        <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-white/[0.08]">
            <h3 className="font-bold text-lg text-ink dark:text-white">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-ink-light dark:text-white/50 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08]">
                  <th className="px-6 py-3 font-bold">User</th>
                  <th className="px-6 py-3 font-bold">Action</th>
                  <th className="px-6 py-3 font-bold">Entity</th>
                  <th className="px-6 py-3 font-bold">Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_audit_logs.map(log => (
                  <tr key={log.id} className="hover:bg-canvas dark:hover:bg-d-surface transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                    <td className="px-6 py-4 text-sm font-bold text-ink dark:text-white">{log.user_email || 'System'}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold bg-brand/5 text-brand px-3 py-1 rounded-lg">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-light dark:text-white/50">{log.entity_type} #{log.entity_id}</td>
                    <td className="px-6 py-4 text-sm text-ink-light dark:text-white/50">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

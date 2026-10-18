import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { LoadingState } from '../components/common/LoadingState';
import { issueService } from '../services/issueService';
import { analyticsService } from '../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BarChart3, Map, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

// DivIcon generator to avoid default leaflet asset hashing errors
const createMarkerIcon = (status) => {
  const colors = {
    Created: 'bg-slate-500',
    Verification: 'bg-amber-500',
    Assigned: 'bg-blue-500',
    Working: 'bg-indigo-500',
    Completed: 'bg-emerald-500',
    'Citizen Feedback': 'bg-pink-500'
  };
  const color = colors[status] || 'bg-slate-400';

  return L.divIcon({
    html: `<span class="relative flex h-5 w-5">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75"></span>
      <span class="relative inline-flex rounded-full h-5 w-5 ${color} border-2 border-white dark:border-slate-900 shadow-md"></span>
    </span>`,
    className: 'custom-marker-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export const Transparency = () => {
  const [issues, setIssues] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const issuesList = await issueService.getIssues();
        const met = await analyticsService.getAdminMetrics();
        const charts = await analyticsService.getAnalyticsData();
        
        setIssues(issuesList);
        setMetrics(met);
        setChartData(charts);
      } catch (err) {
        console.error('Error loading transparency data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const COLORS = ['#0ea5e9', '#8b5cf6', '#6366f1', '#d946ef', '#f43f5e', '#f59e0b', '#10b981', '#14b8a6'];

  if (loading) {
    return <LoadingState message="Loading Public Transparency portal..." />;
  }

  // Filter recent solved reports
  const solvedIssues = issues
    .filter(i => i.status === 'Completed' || i.status === 'Citizen Feedback')
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-10 text-left">
      <PageHeader
        title="Public Transparency Dashboard"
        subtitle="Live open data monitoring of Colombo municipal performance metrics and active ticket tracking."
        breadcrumbs={[{ label: 'Transparency', link: '/transparency' }]}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Reported" value={metrics?.totalReports || 0} icon={BarChart3} color="blue" />
        <StatCard title="Issues Resolved" value={issues.filter(i => i.status === 'Completed' || i.status === 'Citizen Feedback').length} icon={CheckCircle} color="green" />
        <StatCard title="Resolution Rate" value={metrics?.resolutionRate || '86%'} icon={TrendingUp} color="purple" />
        <StatCard title="Avg Resolution Time" value={metrics?.avgResolutionTime || '3.2 days'} icon={Clock} color="indigo" />
      </div>

      {/* Map Section */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Map className="w-5 h-5 text-brand-blue" />
          Public Issue Tracker Map
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
          Click any active marker to inspect the Ticket ID, category, and current workflow status. Public mapping hides private reporter profiles.
        </p>

        <div className="w-full h-96 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 relative shadow-sm">
          <MapContainer 
            center={[6.9271, 79.8612]} 
            zoom={13} 
            className="w-full h-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {issues.map(issue => (
              <Marker 
                key={issue.id} 
                position={[issue.latitude, issue.longitude]}
                icon={createMarkerIcon(issue.status)}
              >
                <Popup>
                  <div className="flex flex-col gap-1.5 p-1 select-none text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase">
                      {issue.ticketId}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-none">
                      Category: {issue.category}
                    </span>
                    <div className="mt-1 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {issue.status}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-400">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Issues by Category */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Reports by Category
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData?.issuesByCategory || []}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <ChartTooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="url(#brandGrad)" radius={[4, 4, 0, 0]}>
                  {chartData?.issuesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Trends over time */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Monthly Report Volume vs. Resolved
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData?.issuesOverTime || []}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <ChartTooltip
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="reported" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* Recent solved reports list */}
      <section className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Recently Resolved Issues</h3>
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm">
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {solvedIssues.map(issue => (
              <div key={issue.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">{issue.ticketId}</span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">|</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{issue.category}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-white">{issue.title}</h5>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">Resolved on {new Date(issue.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <StatusBadge status={issue.status} />
                  {issue.feedback && (
                    <span className="text-xs text-amber-500 font-bold">
                      {'★'.repeat(issue.feedback.rating)}{'☆'.repeat(5 - issue.feedback.rating)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {solvedIssues.length === 0 && (
              <p className="p-6 text-xs text-slate-400 font-semibold italic text-center">No resolved issues listed yet.</p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
export default Transparency;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { analyticsService } from '../../services/analyticsService';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingState } from '../../components/common/LoadingState';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, Sliders } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const colomboPinIcon = L.divIcon({
  html: `<span class="relative flex h-5 w-5">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
    <span class="relative inline-flex rounded-full h-5 w-5 bg-brand-blue border-2 border-white dark:border-slate-900 shadow-md"></span>
  </span>`,
  className: 'custom-colombo-pin',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export const Overview = () => {
  const navigate = useNavigate();
  const { issues, loading: issuesLoading } = useIssues();
  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const m = await analyticsService.getAdminMetrics(issues);
        const c = await analyticsService.getAnalyticsData(issues);
        setMetrics(m);
        setCharts(c);
      } catch (err) {
        console.error('Error loading admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [issues]);

  if (loading || issuesLoading) {
    return <LoadingState message="Loading administrative overview panels..." />;
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center select-none">
        <PageHeader
          title="Administrative Dashboard"
          subtitle="Global executive metrics, resolution satisfaction ratings, and active escalations."
          breadcrumbs={[{ label: 'System Overview', link: '/admin/dashboard' }]}
        />
        {/* Floating Filters in the header to match the design */}
        <div className="hidden md:flex items-center gap-2">
          <select className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none">
            <option>All Clients</option>
            <option>Colombo Corporate</option>
            <option>Public Citizens</option>
          </select>
          <select className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none">
            <option>All Categories</option>
            <option>Roads & Highways</option>
            <option>Waste Management</option>
            <option>Electricity & Power</option>
          </select>
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold px-3 py-2 rounded-2xl text-xs transition-colors shadow-sm">
            <Sliders className="w-3.5 h-3.5" />
            Edit Modules
          </button>
        </div>
      </div>

      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: "Total Tickets", value: metrics?.totalReports || 124, trend: "3.4% This Week", trendType: "up", color: "blue" },
          { title: "Resolution Rate", value: metrics?.resolutionRate || "86%", trend: "1.2% This Month", trendType: "up", color: "green" },
          { title: "Active Issues", value: metrics?.activeIssues || 42, trend: "-5.8% Since Yesterday", trendType: "down", color: "amber" },
          { title: "Avg Resolution", value: metrics?.avgResolutionTime || "3.2 days", trend: "-8.2% Response Time", trendType: "down", color: "indigo" },
          { title: "Satisfaction", value: metrics?.citizenSatisfaction || "4.5 / 5", trend: "0.4% From Last Week", trendType: "up", color: "pink" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all select-none">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none block mb-3">
              {item.title}
            </span>
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none tracking-tight">
                {item.value}
              </span>
              <span className={`text-[10px] font-bold flex items-center gap-1 mt-1.5 ${item.trendType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {item.trendType === 'up' ? '↑' : '↓'} {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Summary Compliance Chart */}
        <div className="lg:col-span-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col justify-between shadow-sm">
          <div className="pb-4 border-b border-slate-200/40 dark:border-slate-800/40 mb-5 select-none flex justify-between items-start">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white tracking-tight">
                Resolution Compliance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Overall resolution compliance rates have increased by 4.2% this quarter.
              </p>
            </div>
            <Button variant="text" size="sm" onClick={() => navigate('/admin/analytics')} icon={ArrowRight}>
              Analytics
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Metrics */}
            <div className="md:col-span-4 flex flex-col gap-4 text-left select-none">
              {[
                { period: "Last Month", rate: "92% SLA", change: "+2.4%", trend: "up" },
                { period: "Last Quarter", rate: "88% SLA", change: "+1.8%", trend: "up" },
                { period: "All Time Avg", rate: "86% SLA", change: "+0.6%", trend: "up" }
              ].map((m, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 border-b border-slate-100 dark:border-slate-800/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{m.period}</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-extrabold text-slate-800 dark:text-white">{m.rate}</span>
                    <span className="text-[10px] font-extrabold text-emerald-500">{m.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Chart */}
            <div className="md:col-span-8 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts?.departmentPerformance || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} contentStyle={{ borderRadius: 12, border: '1px solid rgba(226, 232, 240, 0.5)', fontSize: 11 }} />
                  <Bar dataKey="compliance" fill="url(#colorCompliance)" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Side: Colombo Operations Map */}
        <div className="lg:col-span-4 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden h-[380px] lg:h-auto">
          <div className="pb-4 border-b border-slate-200/40 dark:border-slate-800/40 mb-4 select-none flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white tracking-tight">
              Operations Map
            </h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-ping" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Dispatch</span>
            </div>
          </div>

          <div className="flex-1 w-full rounded-2xl overflow-hidden relative z-10 border border-slate-200/30 dark:border-slate-800/30 h-64 lg:h-auto">
            {/* Search Input floating over map */}
            <div className="absolute top-3 left-3 right-3 z-[1000] shadow-lg">
              <div className="relative flex items-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-xl border border-slate-200/50 dark:border-slate-800/50 px-3 py-1.5 text-[10px] text-slate-500">
                <input 
                  type="text" 
                  placeholder="Search Address..." 
                  className="w-full bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 font-semibold"
                  defaultValue="Colombo Municipal Council, Sri Lanka"
                  readOnly
                />
                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <MapContainer 
              center={[6.9271, 79.8612]} 
              zoom={13} 
              className="w-full h-full"
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[6.9271, 79.8612]} icon={colomboPinIcon}>
                <Popup>Colombo City Hall</Popup>
              </Marker>
              <Marker position={[6.9064, 79.8612]} icon={colomboPinIcon}>
                <Popup>Galle Face Promenade</Popup>
              </Marker>
            </MapContainer>

            {/* Floating details card overlay */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3 z-[1000] shadow-md">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1594913785162-e6786b42dea5?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Hotspot thumbnail" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">Galle Face Promenade</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5">Waste Management • Colombo 3</span>
                <span className="text-[9px] font-extrabold text-brand-blue dark:text-brand-purple mt-1 uppercase tracking-wide">32 unresolved reports</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3-Column Detail Cards Grid (Bottom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Critical SLA Breaches */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col shadow-sm select-none">
          <div className="pb-3 border-b border-slate-200/40 dark:border-slate-800/40 mb-4 text-left">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Critical SLA Breaches
            </h4>
          </div>
          <div className="flex flex-col gap-3.5 flex-grow">
            {[
              { title: "Sewage overflow at Kollupitiya", dept: "Drainage", time: "Breached 4h ago", alert: "red" },
              { title: "Broken streetlight in Cinnamon Gardens", dept: "Electricity", time: "Breached 2h ago", alert: "red" },
              { title: "Garbage pile-up at Slave Island", dept: "Waste Mgmt", time: "15 min remaining", alert: "amber" }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center gap-3 border-b border-slate-100 dark:border-slate-800/30 pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{item.dept} Department</span>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    item.alert === 'red' 
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' 
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                  }`}>
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Civic Hotspots */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col shadow-sm select-none">
          <div className="pb-3 border-b border-slate-200/40 dark:border-slate-800/40 mb-4 text-left">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Civic Hotspots
            </h4>
          </div>
          <div className="flex flex-col gap-3.5 flex-grow">
            {[
              { name: "Duplication Road Crossing", zone: "Colombo 3", count: "48 Reports", img: "https://images.unsplash.com/photo-1594913785162-e6786b42dea5?auto=format&fit=crop&w=120&h=120&q=80" },
              { name: "Viharamahadevi Park Entrance", zone: "Colombo 7", count: "24 Reports", img: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&w=120&h=120&q=80" },
              { name: "Central Railway Approach", zone: "Colombo 10", count: "18 Reports", img: "https://images.unsplash.com/photo-1594913785162-e6786b42dea5?auto=format&fit=crop&w=120&h=120&q=80" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/30 pb-3 last:border-0 last:pb-0">
                <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800" />
                <div className="flex flex-col text-left overflow-hidden flex-grow">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{item.zone} Zone</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-extrabold text-brand-blue dark:text-brand-purple">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Escalation Activity Log */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col shadow-sm select-none">
          <div className="pb-3 border-b border-slate-200/40 dark:border-slate-800/40 mb-4 text-left">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Escalation Activity Log
            </h4>
          </div>
          <div className="flex flex-col gap-3.5 flex-grow">
            {[
              { msg: "Pothole report #CM-320 escalated to Level 2", time: "May 30", cost: "Roads" },
              { msg: "Sewage overflow #CM-118 dispatch sent to crew", time: "May 29", cost: "Drainage" },
              { msg: "Streetlight #CM-491 marked as Completed", time: "May 28", cost: "Electricity" }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center gap-3 border-b border-slate-100 dark:border-slate-800/30 pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{item.msg}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">{item.time}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                    {item.cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;

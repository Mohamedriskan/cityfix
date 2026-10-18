import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PlusCircle, Search, FileText, ArrowRight, ShieldCheck, MapPin, Check } from 'lucide-react';

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
    html: `<span class="relative flex h-5.5 w-5.5">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75"></span>
      <span class="relative inline-flex rounded-full h-5.5 w-5.5 ${color} border-2 border-white dark:border-slate-900 shadow-md"></span>
    </span>`,
    className: 'custom-marker-icon',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const { issues, loading } = useIssues();
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 12 && hours < 17) {
      setGreeting('Good afternoon');
    } else if (hours >= 17) {
      setGreeting('Good evening');
    } else {
      setGreeting('Good morning');
    }
  }, []);

  if (loading) {
    return <LoadingState message="Loading your civic dashboard..." />;
  }

  // Filter issues created by this citizen
  const citizenIssues = issues.filter(i => i.citizen.id === currentUser?.id);
  const totalReports = citizenIssues.length;
  const activeIssues = citizenIssues.filter(i => i.status !== 'Completed' && i.status !== 'Citizen Feedback').length;
  const resolvedIssues = citizenIssues.filter(i => i.status === 'Completed' || i.status === 'Citizen Feedback').length;
  const pendingIssues = citizenIssues.filter(i => i.status === 'Created' || i.status === 'Verification').length;

  const recentIssues = citizenIssues.slice(0, 3);

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Dynamic greeting header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {greeting}, {currentUser?.name.split(' ')[0]}
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Here is a summary of your civic activity.
          </p>
        </div>
        
        {/* Quick action button */}
        <Button
          variant="gradient"
          onClick={() => navigate('/citizen/report')}
          icon={PlusCircle}
        >
          Report New Issue
        </Button>
      </div>

      {/* KPI statistics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reports" value={totalReports} color="blue" />
        <StatCard title="Active" value={activeIssues} color="amber" />
        <StatCard title="Resolved" value={resolvedIssues} color="green" />
        <StatCard title="Pending" value={pendingIssues} color="indigo" />
      </div>

      {/* Action links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('/citizen/report')}
          className="glass-card rounded-2xl p-5 border border-white/50 dark:border-slate-800/50 shadow flex items-center justify-between cursor-pointer hover:shadow-glass-hover hover:border-brand-blue/30 group transition-all"
        >
          <div className="flex flex-col gap-1 text-left">
            <h4 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              Report New Issue
              <ArrowRight className="w-4 h-4 text-brand-blue dark:text-brand-purple group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Potholes, garbage leaks, flickering streetlights, flooding.
            </p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/citizen/reports')}
          className="glass-card rounded-2xl p-5 border border-white/50 dark:border-slate-800/50 shadow flex items-center justify-between cursor-pointer hover:shadow-glass-hover hover:border-brand-purple/30 group transition-all"
        >
          <div className="flex flex-col gap-1 text-left">
            <h4 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              Track My Reports
              <ArrowRight className="w-4 h-4 text-brand-purple group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              View SLA timelines, chat logs, and submit satisfaction feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Main layout split: Recent list + map tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Recent Reports list */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-5 flex flex-col justify-between shadow h-full">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3 mb-4 select-none">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recent Reports
            </h3>
            <Link to="/citizen/reports" className="text-xs font-bold text-brand-blue dark:text-brand-purple hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {recentIssues.map((issue) => (
              <div 
                key={issue.id}
                onClick={() => navigate(`/citizen/reports/${issue.id}`)}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 cursor-pointer flex flex-col gap-2 transition-colors text-left"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-300 uppercase">
                    {issue.ticketId}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">
                  {issue.title}
                </h4>
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                  <span>{issue.category}</span>
                  <div className="flex gap-2">
                    <PriorityBadge priority={issue.priority} />
                    <StatusBadge status={issue.status} />
                  </div>
                </div>
              </div>
            ))}

            {recentIssues.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center py-10 text-center gap-2">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 animate-pulse" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No reports logged yet.</p>
                <p className="text-[11px] text-slate-400">Your reported civic concerns will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Glass Map Preview */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-5 flex flex-col gap-4 shadow h-full min-h-[300px]">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
            Nearby Issues Map
          </h3>
          
          <div className="w-full flex-1 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-inner relative min-h-[220px]">
            <MapContainer
              center={[6.9271, 79.8612]}
              zoom={13}
              className="w-full h-full"
              zoomControl={false}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {citizenIssues.map(issue => (
                <Marker
                  key={issue.id}
                  position={[issue.latitude, issue.longitude]}
                  icon={createMarkerIcon(issue.status)}
                >
                  <Popup>
                    <div className="text-left text-xs p-0.5 select-none">
                      <p className="font-bold text-slate-800 dark:text-white uppercase leading-none">{issue.ticketId}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">{issue.title}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
export default Dashboard;

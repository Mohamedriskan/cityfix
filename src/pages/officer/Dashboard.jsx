import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, ArrowRight, CheckCircle2, Play, Users, Clock, ShieldCheck } from 'lucide-react';

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

export const Dashboard = () => {
  const navigate = useNavigate();
  const { issues, loading } = useIssues();

  if (loading) {
    return <LoadingState message="Loading Municipal Operations panel..." />;
  }

  // Calculate officer stats
  const total = issues.length;
  const pendingVerification = issues.filter(i => i.status === 'Created' || i.status === 'Verification').length;
  const assigned = issues.filter(i => i.status === 'Assigned').length;
  const inProgress = issues.filter(i => i.status === 'Working').length;
  const completed = issues.filter(i => i.status === 'Completed' || i.status === 'Citizen Feedback').length;
  
  // Overdue (SLA) based on elapsed time vs priority limits
  const overdue = issues.filter(i => i.status !== 'Completed' && i.status !== 'Citizen Feedback').filter((i) => {
    const slaLimit = i.priority === 'Critical' ? 12 : i.priority === 'High' ? 24 : i.priority === 'Medium' ? 72 : 120;
    const createdDate = new Date(i.createdAt);
    if (isNaN(createdDate.getTime())) return false;
    const elapsedHrs = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60);
    return elapsedHrs > slaLimit;
  }).length;

  const incomingIssues = issues.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-200/50 dark:border-slate-800/50 pb-5 mb-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Municipal Operations Dashboard
        </h1>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Monitor incoming citizen reports, dispatch field crews, and review SLA timers.
        </p>
      </div>

      {/* KPI statistics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Total Tickets" value={total} color="blue" />
        <StatCard title="Verification" value={pendingVerification} color="amber" icon={AlertCircle} />
        <StatCard title="Assigned" value={assigned} color="blue" icon={Users} />
        <StatCard title="In Progress" value={inProgress} color="indigo" icon={Play} />
        <StatCard title="Completed" value={completed} color="green" icon={CheckCircle2} />
        <StatCard title="Overdue (SLA)" value={overdue} color="red" icon={Clock} />
      </div>

      {/* Split layout: incoming grid + map widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Table panel of incoming issues */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-5 flex flex-col justify-between shadow">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200/50 dark:border-slate-800/50 mb-4 select-none">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Incoming Reports Queue
            </h3>
            <Button variant="text" size="sm" onClick={() => navigate('/officer/issues')} icon={ArrowRight}>
              Manage Queue
            </Button>
          </div>

          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 select-none">
                  <th className="pb-3 pr-4">Ticket ID</th>
                  <th className="pb-3 pr-4">Issue Details</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Priority</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {incomingIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="py-3 font-bold uppercase text-slate-800 dark:text-white pr-4">
                      {issue.ticketId}
                    </td>
                    <td className="py-3 pr-4 max-w-xs truncate flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{issue.title}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{issue.category}</span>
                    </td>
                    <td className="py-3 text-[10px] text-slate-400 uppercase pr-4">
                      {issue.department || 'Unassigned'}
                    </td>
                    <td className="py-3 pr-4">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-3 text-right">
                      <Button 
                        variant="glass" 
                        size="sm" 
                        onClick={() => navigate(`/officer/issues/${issue.id}`)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mini heat map */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-5 flex flex-col gap-4 shadow h-full min-h-[320px]">
          <div className="flex justify-between items-center select-none pb-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Operations Map
            </h3>
            <Button variant="text" size="sm" onClick={() => navigate('/officer/map')} className="text-[11px]">
              Expand Map
            </Button>
          </div>

          <div className="w-full flex-1 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-inner relative min-h-[220px]">
            <MapContainer 
              center={[6.9271, 79.8612]} 
              zoom={12} 
              className="w-full h-full"
              zoomControl={false}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {issues.map(issue => (
                <Marker
                  key={issue.id}
                  position={[issue.latitude, issue.longitude]}
                  icon={createMarkerIcon(issue.status)}
                >
                  <Popup>
                    <div className="text-left text-xs p-0.5 select-none">
                      <p className="font-bold text-slate-800 dark:text-white uppercase leading-none">{issue.ticketId}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Status: {issue.status}</p>
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

import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Select } from '../../components/common/Select';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Flame, Filter, MapPin, Building, Activity } from 'lucide-react';

const createHeatMarker = (priority) => {
  // Density gradient colors based on priority
  const colors = {
    Critical: 'bg-red-600',
    High: 'bg-orange-500',
    Medium: 'bg-amber-400',
    Low: 'bg-blue-400'
  };
  const color = colors[priority] || 'bg-slate-400';

  return L.divIcon({
    html: `<span class="relative flex h-8 w-8 items-center justify-center">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-40"></span>
      <span class="relative inline-flex rounded-full h-4 w-4 ${color} border border-white shadow"></span>
    </span>`,
    className: 'custom-heat-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export const HeatMap = () => {
  const { issues, loading } = useIssues();

  // Filters state
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const categoriesList = [
    'Garbage & Waste', 'Road & Potholes', 'Streetlight Failures', 'Water Supply Disruptions',
    'Drainage & Flooding', 'Electricity Failures', 'Flood Alerts', 'Sewage & Sanitation',
    'Parks & Public Spaces', 'General Safety Hazards'
  ];

  const statusesList = ['Created', 'Verification', 'Assigned', 'Working', 'Completed', 'Citizen Feedback'];
  const prioritiesList = ['Low', 'Medium', 'High', 'Critical'];
  const deptsList = [
    'Roads Department', 'Waste Management', 'Water Supply', 'Electricity',
    'Drainage', 'Public Safety', 'Parks & Recreation', 'Sanitation'
  ];

  // Filter local tickets
  const filtered = issues.filter(issue => {
    const matchesStatus = statusFilter === '' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === '' || issue.category === categoryFilter;
    const matchesPriority = priorityFilter === '' || issue.priority === priorityFilter;
    const matchesDept = deptFilter === '' || issue.department === deptFilter;
    return matchesStatus && matchesCategory && matchesPriority && matchesDept;
  });

  return (
    <div className="flex flex-col gap-6 text-left h-[82vh]">
      <PageHeader
        title="Density Heatmap Dashboard"
        subtitle="Geographic cluster analysis to identify urban hazard hotspots."
        breadcrumbs={[
          { label: 'Overview', link: '/admin/dashboard' },
          { label: 'Heatmap Analysis', link: '/admin/heatmap' }
        ]}
        className="mb-0 border-none pb-0"
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none">
        
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 shadow-sm border border-l-4 border-l-red-500">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-red-500">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Highest Issue Area</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Bambalapitiya, Colombo 04</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 shadow-sm border border-l-4 border-l-amber-500">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-amber-500">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Most Reported Category</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Road & Potholes</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 shadow-sm border border-l-4 border-l-brand-purple">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-brand-purple">
            <Building className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Most Active Department</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Waste Management</span>
          </div>
        </div>

      </div>

      <div className="relative flex-1 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex flex-col">
        {/* Leaflet map */}
        <div className="w-full flex-1 relative z-10">
          <MapContainer 
            center={[6.9271, 79.8612]} 
            zoom={13} 
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filtered.map(issue => (
              <Marker 
                key={issue.id} 
                position={[issue.latitude, issue.longitude]}
                icon={createHeatMarker(issue.priority)}
              >
                <Popup>
                  <div className="text-left text-xs p-1 select-none flex flex-col gap-1">
                    <span className="font-extrabold text-red-500 uppercase">
                      {issue.ticketId}
                    </span>
                    <p className="font-bold text-slate-800 dark:text-white leading-none">{issue.title}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Priority: {issue.priority}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Floating Glass Filters */}
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[320px] z-20 glass-panel rounded-2xl p-4 shadow-2xl border border-white/50 dark:border-slate-800/50 flex flex-col gap-3 select-none">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase pb-1.5 border-b border-slate-200/30 dark:border-slate-800/30">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Heatmap Cluster Filters
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            <Select
              placeholder="Filter Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusesList}
              className="text-[10px] py-1.5 px-3 rounded-lg"
            />
            
            <Select
              placeholder="Filter Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoriesList}
              className="text-[10px] py-1.5 px-3 rounded-lg"
            />

            <Select
              placeholder="Filter Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={prioritiesList}
              className="text-[10px] py-1.5 px-3 rounded-lg"
            />

            <Select
              placeholder="Filter Department"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              options={deptsList}
              className="text-[10px] py-1.5 px-3 rounded-lg"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
export default HeatMap;

import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Select } from '../../components/common/Select';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, Filter, Layers } from 'lucide-react';

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
    html: `<span class="relative flex h-5.5 w-5.5 animate-pulse">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75"></span>
      <span class="relative inline-flex rounded-full h-5.5 w-5.5 ${color} border-2 border-white dark:border-slate-900 shadow-md"></span>
    </span>`,
    className: 'custom-marker-icon',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export const OfficerMap = () => {
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
        title="Full-Screen Operations Map"
        subtitle="Live geographic coordinates map of all reported civic events in Colombo."
        breadcrumbs={[{ label: 'Operations Map', link: '/officer/map' }]}
        className="mb-0 border-none pb-0"
      />

      <div className="relative flex-1 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex flex-col">
        {/* Leaflet Map Frame */}
        <div className="w-full flex-1 relative z-10">
          <MapContainer 
            center={[6.9271, 79.8612]} 
            zoom={13} 
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(issue => (
              <Marker 
                key={issue.id} 
                position={[issue.latitude, issue.longitude]}
                icon={createMarkerIcon(issue.status)}
              >
                <Popup>
                  <div className="text-left text-xs p-1 select-none flex flex-col gap-1.5 min-w-[150px]">
                    <span className="font-extrabold text-slate-800 dark:text-white uppercase">
                      {issue.ticketId}
                    </span>
                    <p className="font-bold text-slate-700 dark:text-slate-200 leading-none">{issue.title}</p>
                    <div className="flex flex-col gap-0.5 text-[10px] text-slate-400 font-semibold mt-1">
                      <span>Category: {issue.category}</span>
                      <span>Priority: {issue.priority}</span>
                      <span>Status: {issue.status}</span>
                      <span>Department: {issue.department || 'None'}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Floating Glass Filters Console */}
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[320px] z-20 glass-panel rounded-2xl p-4 shadow-2xl border border-white/50 dark:border-slate-800/50 flex flex-col gap-3 select-none">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase pb-1.5 border-b border-slate-200/30 dark:border-slate-800/30">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Live Map Filters
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
            <Select
              placeholder="All Statuses"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusesList}
              className="text-[10px] py-1.5 px-3 rounded-lg"
            />
            
            <Select
              placeholder="All Categories"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoriesList}
              className="text-[10px] py-1.5 px-3 rounded-lg"
            />

            <Select
              placeholder="All Priorities"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={prioritiesList}
              className="text-[10px] py-1.5 px-3 rounded-lg"
            />

            <Select
              placeholder="All Departments"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              options={deptsList}
              className="text-[10px] py-1.5 px-3 rounded-lg"
            />
          </div>

          <div className="text-[9px] text-slate-400 font-bold border-t border-slate-200/20 pt-2 flex justify-between items-center">
            <span>Filtered Markers: {filtered.length}</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              SLA Tracks Enabled
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
export default OfficerMap;

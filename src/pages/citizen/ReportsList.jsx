import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { Search, Eye, Filter, Calendar } from 'lucide-react';

export const ReportsList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { issues, loading } = useIssues();

  // Local filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  if (loading) {
    return <LoadingState message="Loading your issues register..." />;
  }

  // 1. Get issues created by this citizen
  const citizenIssues = issues.filter(i => i.citizen.id === currentUser?.id);

  // 2. Apply filters locally
  const filteredIssues = citizenIssues.filter(issue => {
    const matchesSearch = searchQuery === '' || 
      issue.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === '' || issue.category === categoryFilter;
    const matchesPriority = priorityFilter === '' || issue.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const categoriesList = [
    'Garbage & Waste', 'Road & Potholes', 'Streetlight Failures', 'Water Supply Disruptions',
    'Drainage & Flooding', 'Electricity Failures', 'Flood Alerts', 'Sewage & Sanitation',
    'Parks & Public Spaces', 'General Safety Hazards'
  ];

  const statusesList = ['Created', 'Verification', 'Assigned', 'Working', 'Completed', 'Citizen Feedback'];
  const prioritiesList = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="flex flex-col gap-6 text-left">
      <PageHeader
        title="My Filed Reports"
        subtitle="Manage, track, and provide feedback on your reported civic issues."
        breadcrumbs={[{ label: 'My Reports', link: '/citizen/reports' }]}
        actions={
          <Button variant="gradient" onClick={() => navigate('/citizen/report')}>
            Report New Issue
          </Button>
        }
      />

      {/* Advanced Filters Panel */}
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-slate-200/50 dark:border-slate-800/50 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase pb-1 border-b border-slate-200/40 dark:border-slate-800/40">
          <Filter className="w-4 h-4 text-slate-400" />
          Filter Settings
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search ticket ID or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs"
          />

          <Select
            placeholder="Filter Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusesList}
            className="text-xs"
          />

          <Select
            placeholder="Filter Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categoriesList}
            className="text-xs"
          />

          <Select
            placeholder="Filter Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={prioritiesList}
            className="text-xs"
          />
        </div>
      </div>

      {/* DESKTOP VIEW: Table Grid */}
      <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
              <th className="px-6 py-4">Ticket ID</th>
              <th className="px-6 py-4">Issue Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date Filed</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300">
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white uppercase">
                  {issue.ticketId}
                </td>
                <td className="px-6 py-4 max-w-xs truncate">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{issue.title}</span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-500">
                  {issue.category}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <PriorityBadge priority={issue.priority} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={issue.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="glass" 
                    size="sm" 
                    onClick={() => navigate(`/citizen/reports/${issue.id}`)}
                    icon={Eye}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredIssues.length === 0 && (
          <div className="p-8">
            <EmptyState
              title="No reports matched filters"
              description="Adjust your filters or query to locate a specific issue."
            />
          </div>
        )}
      </div>

      {/* MOBILE VIEW: Stack of Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredIssues.map((issue) => (
          <div 
            key={issue.id}
            onClick={() => navigate(`/citizen/reports/${issue.id}`)}
            className="glass-card rounded-2xl p-4 flex flex-col gap-3 shadow hover:shadow-glass-hover transition-all text-left"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-800 dark:text-white uppercase">
                {issue.ticketId}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(issue.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">
                {issue.title}
              </h4>
              <span className="text-[11px] font-bold text-slate-400">{issue.category}</span>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/50 pt-3 mt-1">
              <div className="flex gap-2">
                <PriorityBadge priority={issue.priority} />
                <StatusBadge status={issue.status} />
              </div>
              
              <Button variant="text" size="sm" icon={Eye}>
                Inspect
              </Button>
            </div>
          </div>
        ))}

        {filteredIssues.length === 0 && (
          <EmptyState
            title="No reports matched filters"
            description="Adjust your filters or query to locate a specific issue."
          />
        )}
      </div>

    </div>
  );
};
export default ReportsList;

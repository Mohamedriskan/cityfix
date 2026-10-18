import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { DataTable } from '../../components/common/DataTable';
import { Eye, Filter, ArrowUpDown } from 'lucide-react';

export const IssuesList = () => {
  const navigate = useNavigate();
  const { issues, loading } = useIssues();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-asc', 'date-desc', 'priority-desc'

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

  // Apply filters
  const filtered = issues.filter(issue => {
    const matchesSearch = searchQuery === '' ||
      issue.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.citizen.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === '' || issue.category === categoryFilter;
    const matchesPriority = priorityFilter === '' || issue.priority === priorityFilter;
    const matchesDept = deptFilter === '' || issue.department === deptFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesDept;
  });

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'date-asc') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'priority-desc') {
      const weight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return (weight[b.priority] || 0) - (weight[a.priority] || 0);
    }
    return 0;
  });

  const columns = [
    {
      header: 'Ticket ID',
      accessor: 'ticketId',
      render: (row) => (
        <span className="font-extrabold text-slate-800 dark:text-white uppercase">
          {row.ticketId}
        </span>
      )
    },
    {
      header: 'Reporter',
      accessor: 'citizen',
      render: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-slate-800 dark:text-slate-200">{row.citizen.name}</span>
          <span className="text-[10px] text-slate-400 font-semibold">{row.citizen.phone}</span>
        </div>
      )
    },
    {
      header: 'Issue Details',
      accessor: 'title',
      render: (row) => (
        <div className="flex flex-col text-left max-w-xs truncate">
          <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{row.title}</span>
          <span className="text-[10px] text-slate-400 font-semibold">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Assigned Dept',
      accessor: 'department',
      render: (row) => (
        <span className="text-xs text-slate-500 font-semibold">
          {row.department || 'Awaiting Routing'}
        </span>
      )
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => <PriorityBadge priority={row.priority} />
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Action',
      render: (row) => (
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => navigate(`/officer/issues/${row.id}`)}
          icon={Eye}
        >
          Review
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <PageHeader
        title="Incident Operations Queue"
        subtitle="Verification checklist and workflow assigner for all reported civic tickets."
        breadcrumbs={[{ label: 'Operations Queue', link: '/officer/issues' }]}
      />

      {/* Filter console panel */}
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-slate-200/50 dark:border-slate-800/50 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase pb-1 border-b border-slate-200/40 dark:border-slate-800/40">
          <Filter className="w-4 h-4 text-slate-400" />
          Filter Settings
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search ticket, citizen or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs"
            />
          </div>

          <Select
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusesList}
            className="text-xs"
          />

          <Select
            placeholder="All Categories"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categoriesList}
            className="text-xs"
          />

          <Select
            placeholder="All Priorities"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={prioritiesList}
            className="text-xs"
          />

          <Select
            placeholder="All Departments"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            options={deptsList}
            className="text-xs"
          />
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/50 mt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort Options:
          </span>
          <div className="flex gap-2">
            {[
              { label: 'Newest First', value: 'date-desc' },
              { label: 'Oldest First', value: 'date-asc' },
              { label: 'Critical Priority', value: 'priority-desc' }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  sortBy === opt.value
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main DataTable list */}
      <div className="glass-card rounded-2xl p-4 shadow-sm border border-slate-200/50">
        <DataTable
          columns={columns}
          data={sorted}
          loading={loading}
          pageSize={10}
          emptyTitle="No issues queued"
          emptyDescription="Try clearing or adjusting filters."
        />
      </div>

    </div>
  );
};
export default IssuesList;

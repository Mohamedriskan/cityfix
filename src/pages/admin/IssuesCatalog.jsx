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
import { Toast } from '../../components/common/Toast';
import { Eye, Filter, Save } from 'lucide-react';

export const IssuesCatalog = () => {
  const navigate = useNavigate();
  const { issues, loading, updateIssueStatus } = useIssues();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [pendingStatus, setPendingStatus] = useState({});
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const statusesList = ['Created', 'Verification', 'Assigned', 'Working', 'Completed', 'Citizen Feedback'];

  const handleStatusChange = async (row) => {
    const nextStatus = pendingStatus[row.id];
    if (!nextStatus) return;
    try {
      await updateIssueStatus(row.id, nextStatus);
      setToastType('success');
      setToastMsg(`Ticket ${row.ticketId} status updated to "${nextStatus}"`);
      setPendingStatus(prev => ({ ...prev, [row.id]: '' }));
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to update status');
    }
  };

  const filtered = issues.filter(issue => {
    const matchesSearch = searchQuery === '' ||
      issue.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === '' || issue.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const columns = [
    { header: 'Ticket ID', accessor: 'ticketId', render: (row) => <span className="font-extrabold text-slate-800 dark:text-white uppercase">{row.ticketId}</span> },
    { header: 'Reporter', render: (row) => <span className="font-semibold">{row.citizen.name}</span> },
    { header: 'Title', accessor: 'title', render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.title}</span> },
    { header: 'Priority', render: (row) => <PriorityBadge priority={row.priority} /> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Department', accessor: 'department' },
    {
      header: 'Update Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Select
            value={pendingStatus[row.id] || ''}
            onChange={(e) => setPendingStatus(prev => ({ ...prev, [row.id]: e.target.value }))}
            options={statusesList}
            placeholder="Select status"
            className="text-xs font-semibold min-w-[150px]"
          />
          <Button
            variant="glass"
            size="sm"
            onClick={() => handleStatusChange(row)}
            icon={Save}
            disabled={!pendingStatus[row.id]}
          >
            Apply
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}
      <PageHeader
        title="Administrative Issue Catalog"
        subtitle="Search, audit, and inspect all reported citizen hazards."
        breadcrumbs={[
          { label: 'Overview', link: '/admin/dashboard' },
          { label: 'Issues Catalog', link: '/admin/issues' }
        ]}
      />

      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-slate-200/50 dark:border-slate-800/50 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase pb-1 border-b border-slate-200/40 dark:border-slate-800/40">
          <Filter className="w-4 h-4 text-slate-400" />
          Filter Settings
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Search ticket ID or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs"
          />

          <Select
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={['Created', 'Verification', 'Assigned', 'Working', 'Completed', 'Citizen Feedback']}
            className="text-xs"
          />

          <Select
            placeholder="All Priorities"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={['Low', 'Medium', 'High', 'Critical']}
            className="text-xs"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 shadow-sm border border-slate-200/50 bg-white dark:bg-slate-950/20">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          pageSize={10}
          emptyTitle="No issues match criteria"
          emptyDescription="Modify search parameters."
        />
      </div>
    </div>
  );
};
export default IssuesCatalog;

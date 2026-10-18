import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Select } from '../../components/common/Select';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { Clock, Save } from 'lucide-react';

const getSlaInfo = (row) => {
  const slaLimit = row.priority === 'Critical' ? 12 : row.priority === 'High' ? 24 : row.priority === 'Medium' ? 72 : 120;
  const createdDate = new Date(row.createdAt);
  const now = new Date();
  if (isNaN(createdDate.getTime())) {
    return { timeLeft: slaLimit, text: `${slaLimit}h remaining`, color: 'green' };
  }
  const elapsedHrs = Math.floor((now - createdDate) / (1000 * 60 * 60));
  const timeLeft = slaLimit - elapsedHrs;

  if (timeLeft <= 0) {
    return { timeLeft, text: `BREACH: Overdue by ${Math.abs(timeLeft)}h`, color: 'red' };
  }
  if (timeLeft <= 6) {
    return { timeLeft, text: `${timeLeft}h remaining (Near Breach)`, color: 'orange' };
  }
  return { timeLeft, text: `${timeLeft}h remaining`, color: 'green' };
};

export const SlaEscalation = () => {
  const { issues, loading, updateIssueStatus } = useIssues();
  const [priorityFilter, setPriorityFilter] = useState('');
  const [pendingStatus, setPendingStatus] = useState({});
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const activeIssues = issues.filter(i => i.status !== 'Completed' && i.status !== 'Citizen Feedback');
  const filtered = activeIssues.filter(i => priorityFilter === '' || i.priority === priorityFilter);

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

  const statusesList = ['Created', 'Verification', 'Assigned', 'Working', 'Completed', 'Citizen Feedback'];

  const columns = [
    { header: 'Ticket ID', accessor: 'ticketId', render: (row) => <span className="font-extrabold text-slate-800 dark:text-white uppercase">{row.ticketId}</span> },
    { header: 'Department', accessor: 'department' },
    { header: 'Priority', accessor: 'priority' },
    {
      header: 'Escalation Status',
      render: (row) => {
        const info = getSlaInfo(row);
        return <Badge color={info.color} className="font-bold">{info.text}</Badge>;
      }
    },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
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
        title="SLA Escalation Monitoring"
        subtitle="Manage escalation logs, track response counts, and inspect potential breach lists."
        breadcrumbs={[
          { label: 'Overview', link: '/admin/dashboard' },
          { label: 'SLA Escalations', link: '/admin/sla' }
        ]}
        actions={
          <Select
            placeholder="All Priorities"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={['Low', 'Medium', 'High', 'Critical']}
            className="text-xs font-semibold max-w-xs"
          />
        }
      />

      <div className="glass-card rounded-2xl p-4 shadow-sm border border-slate-200/50 bg-white dark:bg-slate-950/20">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          pageSize={8}
          emptyTitle="All SLA targets compliant!"
          emptyDescription="Currently no active escalations."
        />
      </div>
    </div>
  );
};
export default SlaEscalation;
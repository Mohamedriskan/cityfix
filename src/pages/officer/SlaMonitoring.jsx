import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Select } from '../../components/common/Select';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Eye, ShieldAlert, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const getSlaInfo = (row) => {
  const slaLimit = row.priority === 'Critical' ? 12 : row.priority === 'High' ? 24 : row.priority === 'Medium' ? 72 : 120;
  const createdDate = new Date(row.createdAt);
  const now = new Date();
  if (isNaN(createdDate.getTime())) {
    return { slaLimit, elapsedHrs: 0, timeLeft: slaLimit, text: `${slaLimit}h left`, color: 'green' };
  }
  const elapsedHrs = Math.floor((now - createdDate) / (1000 * 60 * 60));
  const timeLeft = slaLimit - elapsedHrs;

  if (timeLeft <= 0) {
    return { slaLimit, elapsedHrs, timeLeft, text: `Overdue by ${Math.abs(timeLeft)}h`, color: 'red' };
  }
  if (timeLeft <= 6) {
    return { slaLimit, elapsedHrs, timeLeft, text: `${timeLeft}h remaining (Near SLA Breach)`, color: 'orange' };
  }
  return { slaLimit, elapsedHrs, timeLeft, text: `${timeLeft}h left`, color: 'green' };
};

export const SlaMonitoring = () => {
  const navigate = useNavigate();
  const { issues, loading } = useIssues();

  const [deptFilter, setDeptFilter] = useState('');

  const deptsList = [
    'Roads Department', 'Waste Management', 'Water Supply', 'Electricity',
    'Drainage', 'Public Safety', 'Parks & Recreation', 'Sanitation'
  ];

  const activeSlaIssues = issues.filter(i => i.status !== 'Completed' && i.status !== 'Citizen Feedback');

  const filtered = activeSlaIssues.filter(i => deptFilter === '' || i.department === deptFilter);

  const slaInfo = filtered.map(row => ({ row, info: getSlaInfo(row) }));
  const totalActive = activeSlaIssues.length;
  const overdue = slaInfo.filter(s => s.info.timeLeft <= 0).length;
  const nearDeadline = slaInfo.filter(s => s.info.timeLeft > 0 && s.info.timeLeft <= 6).length;
  const compliant = Math.max(0, totalActive - overdue - nearDeadline);

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
      header: 'Category',
      accessor: 'category',
      render: (row) => <span className="font-bold text-slate-700 dark:text-slate-300">{row.category}</span>
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => <span className="text-xs text-slate-500 font-semibold">{row.department}</span>
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <span className={`text-xs font-bold ${row.priority === 'Critical' ? 'text-red-500' : 'text-slate-500'}`}>
          {row.priority} ({row.priority === 'Critical' ? '12h' : row.priority === 'High' ? '24h' : '72h'})
        </span>
      )
    },
    {
      header: 'SLA Status',
      render: (row) => {
        const info = getSlaInfo(row);
        return (
          <Badge color={info.color} className="font-bold">
            {info.text}
          </Badge>
        );
      }
    },
    {
      header: 'Workflow',
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
          Dispatch
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <PageHeader
        title="SLA Compliance Monitoring"
        subtitle="Manage escalation logs, track response counts, and inspect potential breach lists."
        breadcrumbs={[{ label: 'SLA Monitoring', link: '/officer/sla' }]}
        actions={
          <Select
            placeholder="All Departments"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            options={deptsList}
            className="text-xs font-semibold max-w-xs"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active SLA Tasks" value={totalActive} icon={Clock} color="blue" />
        <StatCard title="Near Deadline" value={nearDeadline} icon={AlertTriangle} color="amber" />
        <StatCard title="Overdue (Breach)" value={overdue} icon={ShieldAlert} color="red" />
        <StatCard title="Within SLA Tiers" value={compliant} icon={CheckCircle2} color="green" />
      </div>

      <div className="glass-card rounded-2xl p-4 shadow-sm border border-slate-200/50">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          pageSize={8}
          emptyTitle="All SLA tickets resolved!"
          emptyDescription="Currently no active tickets under verification or dispatch queues."
        />
      </div>
    </div>
  );
};
export default SlaMonitoring;
import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';
import { FileSpreadsheet, Printer, Download, Filter, BarChart } from 'lucide-react';

export const Reports = () => {
  const { issues, loading } = useIssues();

  // Filters state
  const [reportType, setReportType] = useState('summary');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const reportTypes = [
    { label: 'Issue Summary Register', value: 'summary' },
    { label: 'Department SLA Compliance', value: 'sla' },
    { label: 'Citizen Satisfaction Reviews', value: 'satisfaction' },
    { label: 'Resolution Rate Log', value: 'resolution' }
  ];

  const statusesList = ['Created', 'Verification', 'Assigned', 'Working', 'Completed', 'Citizen Feedback'];
  const deptsList = [
    'Roads Department', 'Waste Management', 'Water Supply', 'Electricity',
    'Drainage', 'Public Safety', 'Parks & Recreation', 'Sanitation'
  ];

  // Apply filters
  const filtered = issues.filter(issue => {
    const matchesStatus = statusFilter === '' || issue.status === statusFilter;
    const matchesDept = deptFilter === '' || issue.department === deptFilter;
    
    // Type specific filtering
    if (reportType === 'satisfaction') {
      return matchesStatus && matchesDept && issue.feedback !== null;
    }
    if (reportType === 'resolution') {
      return matchesStatus && matchesDept && (issue.status === 'Completed' || issue.status === 'Citizen Feedback');
    }
    return matchesStatus && matchesDept;
  });

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    
    const headers = ['Ticket ID', 'Title', 'Category', 'Priority', 'Status', 'Department', 'Rating', 'Review Comment', 'Date Filed'];
    const rows = filtered.map(i => [
      i.ticketId,
      `"${i.title.replace(/"/g, '""')}"`,
      i.category,
      i.priority,
      i.status,
      i.department || 'None',
      i.feedback?.rating || 'N/A',
      i.feedback ? `"${i.feedback.comment.replace(/"/g, '""')}"` : 'N/A',
      new Date(i.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cityfix_admin_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    { header: 'Ticket ID', accessor: 'ticketId', render: (row) => <span className="font-extrabold text-slate-800 dark:text-white uppercase">{row.ticketId}</span> },
    { header: 'Incident Title', accessor: 'title', render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.title}</span> },
    { header: 'Department', accessor: 'department' },
    { 
      header: reportType === 'satisfaction' ? 'Rating' : 'Status', 
      render: (row) => {
        if (reportType === 'satisfaction') {
          return <span className="text-amber-500 font-bold">{row.feedback ? '★'.repeat(row.feedback.rating) : 'Pending Rating'}</span>;
        }
        return <span className="text-xs font-semibold">{row.status}</span>;
      }
    },
    { 
      header: reportType === 'satisfaction' ? 'Review Comment' : 'Priority', 
      render: (row) => {
        if (reportType === 'satisfaction') {
          return <span className="text-xs italic text-slate-500 truncate max-w-xs block">"{row.feedback ? row.feedback.comment : 'No comment submitted'}"</span>;
        }
        return <span>{row.priority}</span>;
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 text-left print:p-0">
      
      {/* Header */}
      <div className="print:hidden">
        <PageHeader
          title="Metric Audits & Reports"
          subtitle="Compile performance logs, export csv matrices, or print system reviews."
          breadcrumbs={[
            { label: 'Overview', link: '/admin/dashboard' },
            { label: 'Reports Audit', link: '/admin/reports' }
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="glass" size="sm" onClick={handlePrint} icon={Printer}>
                Print
              </Button>
              <Button 
                variant="gradient" 
                size="sm" 
                onClick={handleExportCSV} 
                icon={Download}
                disabled={filtered.length === 0}
              >
                Export CSV
              </Button>
            </div>
          }
        />
      </div>

      {/* Print sheet logo */}
      <div className="hidden print:block mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">CityFix Administrative Audit Sheet</h1>
        <p className="text-sm text-slate-500 mt-1">Generated: {new Date().toLocaleString()}</p>
        <p className="text-xs text-slate-500 mt-0.5">Report Type: {reportType.toUpperCase()}, Department Filter: {deptFilter || 'All'}</p>
      </div>

      {/* Filters (hidden in print) */}
      <div className="print:hidden glass-card rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-slate-200/50 dark:border-slate-800/50 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase pb-1 border-b border-slate-200/40 dark:border-slate-800/40">
          <Filter className="w-4 h-4 text-slate-400" />
          Filter Settings
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Select Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={reportTypes}
            className="text-xs"
          />

          <Select
            label="Workflow Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusesList}
            className="text-xs"
          />

          <Select
            label="Municipal Department"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            options={deptsList}
            className="text-xs"
          />
        </div>
      </div>

      {/* Results grid */}
      <div className="glass-card rounded-2xl p-4 shadow-sm border border-slate-200/50 bg-white dark:bg-slate-950/20">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 select-none print:hidden">
          <span>Matching records compilation</span>
          <span className="font-extrabold text-slate-800 dark:text-white">{filtered.length} entries</span>
        </div>
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          pageSize={8}
          emptyTitle="No records matches report type"
          emptyDescription="Modify filters or report configurations."
        />
      </div>

    </div>
  );
};
export default Reports;

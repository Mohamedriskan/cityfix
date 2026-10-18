import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';
import { FileSpreadsheet, Printer, Download, Filter } from 'lucide-react';

export const OfficerReports = () => {
  const { issues, loading } = useIssues();

  // Filters state
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const categoriesList = [
    'Garbage & Waste', 'Road & Potholes', 'Streetlight Failures', 'Water Supply Disruptions',
    'Drainage & Flooding', 'Electricity Failures', 'Flood Alerts', 'Sewage & Sanitation',
    'Parks & Public Spaces', 'General Safety Hazards'
  ];

  const statusesList = ['Created', 'Verification', 'Assigned', 'Working', 'Completed', 'Citizen Feedback'];
  const deptsList = [
    'Roads Department', 'Waste Management', 'Water Supply', 'Electricity',
    'Drainage', 'Public Safety', 'Parks & Recreation', 'Sanitation'
  ];

  // Apply filters
  const filtered = issues.filter(issue => {
    const matchesStatus = statusFilter === '' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === '' || issue.category === categoryFilter;
    const matchesDept = deptFilter === '' || issue.department === deptFilter;
    return matchesStatus && matchesCategory && matchesDept;
  });

  // Generate CSV string and trigger client download
  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    const headers = ['Ticket ID', 'Title', 'Category', 'Priority', 'Status', 'Citizen Name', 'Department', 'Coordinates', 'Date Filed'];
    
    const rows = filtered.map(issue => [
      issue.ticketId,
      `"${issue.title.replace(/"/g, '""')}"`,
      issue.category,
      issue.priority,
      issue.status,
      issue.citizen.name,
      issue.department || 'None',
      `"${issue.latitude.toFixed(5)},${issue.longitude.toFixed(5)}"`,
      new Date(issue.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cityfix_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    { header: 'Ticket ID', accessor: 'ticketId', render: (row) => <span className="font-extrabold text-slate-800 dark:text-white uppercase">{row.ticketId}</span> },
    { header: 'Title', accessor: 'title', render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.title}</span> },
    { header: 'Category', accessor: 'category' },
    { header: 'Department', accessor: 'department' },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Status', accessor: 'status' }
  ];

  return (
    <div className="flex flex-col gap-6 text-left print:p-0">
      
      {/* Page Header (hidden in print mode using print:hidden class) */}
      <div className="print:hidden">
        <PageHeader
          title="Incident Reports Compiler"
          subtitle="Generate, filter, and export municipal reports to CSV spreadsheets or print files."
          breadcrumbs={[{ label: 'Export Reports', link: '/officer/reports' }]}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="glass"
                size="sm"
                onClick={handlePrint}
                icon={Printer}
              >
                Print Report
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

      {/* Printable page outline (only visible in print) */}
      <div className="hidden print:block mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">CityFix Municipal Operations Report</h1>
        <p className="text-sm text-slate-500 font-semibold mt-1">Generated: {new Date().toLocaleString()}</p>
        <p className="text-xs text-slate-500 mt-0.5">Matching filter criteria: Category: {categoryFilter || 'All'}, Status: {statusFilter || 'All'}, Department: {deptFilter || 'All'}</p>
      </div>

      {/* Filters (hidden in print) */}
      <div className="print:hidden glass-card rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-slate-200/50 dark:border-slate-800/50 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase pb-1 border-b border-slate-200/40 dark:border-slate-800/40">
          <Filter className="w-4 h-4 text-slate-400" />
          Filter Settings
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            placeholder="All Departments"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            options={deptsList}
            className="text-xs"
          />
        </div>
      </div>

      {/* Main Table compilation */}
      <div className="glass-card rounded-2xl p-4 shadow-sm border border-slate-200/50 bg-white dark:bg-slate-950/20">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 select-none print:hidden">
          <span>Matching records compilation</span>
          <span className="font-extrabold text-slate-800 dark:text-white">{filtered.length} entries</span>
        </div>
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          pageSize={10}
          emptyTitle="No records compiled"
          emptyDescription="Try clearing or adjusting compiled filters."
        />
      </div>

    </div>
  );
};
export default OfficerReports;

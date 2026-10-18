import React, { useState, useEffect } from 'react';
import { departmentService } from '../../services/departmentService';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Toast } from '../../components/common/Toast';
import { LoadingState } from '../../components/common/LoadingState';
import { Building2, Plus, Edit, ShieldAlert } from 'lucide-react';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  // Modal form states
  const [deptName, setDeptName] = useState('');
  const [deptHead, setDeptHead] = useState('');

  const loadDepts = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error loading departments list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepts();
  }, []);

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!deptName.trim() || !deptHead.trim()) return;

    try {
      await departmentService.addDepartment({
        name: deptName,
        head: deptHead
      });
      setToastType('success');
      setToastMsg(`Department "${deptName}" created successfully!`);
      setIsModalOpen(false);
      setDeptName('');
      setDeptHead('');
      // Reload list
      loadDepts();
    } catch (err) {
      setToastType('error');
      setToastMsg('Failed to add department.');
    }
  };

  const columns = [
    {
      header: 'Department',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5 text-left">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">{row.name}</span>
        </div>
      )
    },
    { header: 'Officer Head', accessor: 'head' },
    { header: 'Active Issues', accessor: 'activeIssues', render: (row) => <span className="font-bold">{row.activeIssues}</span> },
    { header: 'Resolved Cases', accessor: 'resolved' },
    { header: 'SLA Performance', accessor: 'slaPerformance', render: (row) => <span className="text-emerald-500 font-extrabold">{row.slaPerformance}</span> },
    { header: 'Avg Resolution', accessor: 'avgResolutionTime' },
    { header: 'Status', accessor: 'status' }
  ];

  if (loading) {
    return <LoadingState message="Loading department registers..." />;
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}

      <PageHeader
        title="Municipal Departments"
        subtitle="Manage active officers, department heads, and SLA compliance metrics."
        breadcrumbs={[
          { label: 'Overview', link: '/admin/dashboard' },
          { label: 'Departments', link: '/admin/departments' }
        ]}
        actions={
          <Button variant="gradient" onClick={() => setIsModalOpen(true)} icon={Plus}>
            Add Department
          </Button>
        }
      />

      {/* Main Table compilation */}
      <div className="glass-card rounded-2xl p-4 shadow-sm border border-slate-200/50 bg-white dark:bg-slate-950/20">
        <DataTable
          columns={columns}
          data={departments}
          pageSize={8}
          emptyTitle="No departments found"
          emptyDescription="There are no active municipal departments recorded."
        />
      </div>

      {/* Add Department Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Register New Municipal Department"
        size="sm"
      >
        <form onSubmit={handleAddDept} className="flex flex-col gap-4 text-left">
          <Input
            label="Department Name"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            placeholder="e.g. Sanitation Department"
            required
          />

          <Input
            label="Officer Head Name"
            value={deptHead}
            onChange={(e) => setDeptHead(e.target.value)}
            placeholder="e.g. Mr. Rohan Perera"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Department
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
export default Departments;

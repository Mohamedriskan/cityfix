import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';
import { Toast } from '../../components/common/Toast';
import { LoadingState } from '../../components/common/LoadingState';
import { ShieldAlert, User, ShieldCheck } from 'lucide-react';

export const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen', 'officer', 'admin'
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users registers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeactivate = async (id, name, currentStatus) => {
    try {
      const updated = await userService.deactivateUser(id);
      setToastType('success');
      setToastMsg(`User "${name}" status toggled to "${updated.status}"`);
      // Reload list
      loadUsers();
    } catch (err) {
      setToastType('error');
      setToastMsg('Failed to toggle status.');
    }
  };

  // Filter users based on tab
  const filteredUsers = users.filter(u => u.role === activeTab);

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5 text-left">
          <img
            src={row.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
            alt="Avatar"
            className="w-8.5 h-8.5 rounded-xl border object-cover bg-white"
          />
          <span className="font-bold text-slate-800 dark:text-white">{row.name}</span>
        </div>
      )
    },
    { header: 'Email Address', accessor: 'email' },
    { header: 'Role Type', accessor: 'role', render: (row) => <span className="uppercase text-[10px] font-bold text-slate-400">{row.role}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
          row.status === 'Active' 
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
            : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
        }`}>
          {row.status}
        </span>
      )
    },
    { header: 'Date Joined', accessor: 'registeredDate' },
    {
      header: 'Operations',
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* Prevent self-deactivation */}
          {row.email !== 'admin@cityfix.demo' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeactivate(row.id, row.name, row.status)}
              className={row.status === 'Active' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}
            >
              {row.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return <LoadingState message="Loading directory databases..." />;
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}

      <PageHeader
        title="User Account Directory"
        subtitle="Manage authorization details, profile statuses, and login approvals."
        breadcrumbs={[
          { label: 'Overview', link: '/admin/dashboard' },
          { label: 'Users', link: '/admin/users' }
        ]}
      />

      {/* Tabs panels */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 select-none gap-2">
        {[
          { label: 'Citizens Registry', value: 'citizen' },
          { label: 'Municipal Officers', value: 'officer' },
          { label: 'Super Administrators', value: 'admin' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === tab.value
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table compilation */}
      <div className="glass-card rounded-2xl p-4 shadow-sm border border-slate-200/50 bg-white dark:bg-slate-950/20">
        <DataTable
          columns={columns}
          data={filteredUsers}
          pageSize={8}
          emptyTitle="No accounts logged"
          emptyDescription="There are no active credentials registered under this tab."
        />
      </div>

    </div>
  );
};
export default UsersList;

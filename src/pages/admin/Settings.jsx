import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Checkbox } from '../../components/common/Checkbox';
import { Toast } from '../../components/common/Toast';
import { Settings as SettingsIcon, ShieldCheck, Mail, Database, Bell } from 'lucide-react';

export const Settings = () => {
  const [slaCritical, setSlaCritical] = useState(12);
  const [slaHigh, setSlaHigh] = useState(24);
  const [slaMedium, setSlaMedium] = useState(72);
  
  const [enableEscalations, setEnableEscalations] = useState(true);
  const [backupInterval, setBackupInterval] = useState(24);
  
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastType('success');
      setToastMsg('Platform configuration updated successfully!');
    }, 450);
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}

      <PageHeader
        title="Platform Configuration"
        subtitle="Manage global SLA durations, escalation routing rules, and notification endpoints."
        breadcrumbs={[
          { label: 'Overview', link: '/admin/dashboard' },
          { label: 'Settings', link: '/admin/settings' }
        ]}
      />

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        
        {/* SLA Tiers Config */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 select-none">
            <ClockIcon className="w-4 h-4 text-slate-400" />
            SLA Thresholds (Hours)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Critical Priority SLA"
              type="number"
              value={slaCritical}
              onChange={(e) => setSlaCritical(parseInt(e.target.value))}
              required
            />
            <Input
              label="High Priority SLA"
              type="number"
              value={slaHigh}
              onChange={(e) => setSlaHigh(parseInt(e.target.value))}
              required
            />
            <Input
              label="Medium Priority SLA"
              type="number"
              value={slaMedium}
              onChange={(e) => setSlaMedium(parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Escalations and Backups */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 select-none">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            Operations & Maintenance
          </h3>

          <Checkbox
            label="Enable automatic email escalations to Municipal Department Heads upon SLA breach"
            checked={enableEscalations}
            onChange={(e) => setEnableEscalations(e.target.checked)}
          />

          <div className="mt-2">
            <Input
              label="System Database Backup Interval (Hours)"
              type="number"
              value={backupInterval}
              onChange={(e) => setBackupInterval(parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        <Button type="submit" variant="gradient" isLoading={isSaving} className="self-end px-6">
          Save Configuration
        </Button>

      </form>
    </div>
  );
};

// Internal mini-utility clock icon since Lucide Clock is imported elsewhere
const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default Settings;

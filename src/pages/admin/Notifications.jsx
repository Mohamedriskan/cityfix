import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Textarea } from '../../components/common/Textarea';
import { Select } from '../../components/common/Select';
import { Toast } from '../../components/common/Toast';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Megaphone, Trash, BellOff, Info, CheckCircle2, AlertTriangle, Send, CheckCheck } from 'lucide-react';

const getIcon = (type) => {
  if (type === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  if (type === 'danger') return <AlertTriangle className="w-5 h-5 text-red-500" />;
  return <Info className="w-5 h-5 text-brand-blue" />;
};

export const NotificationsCenter = () => {
  const {
    notifications,
    allNotifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    broadcastCampaign,
    fetchNotifications,
  } = useNotifications();

  const [message, setMessage] = useState('');
  const [notifType, setNotifType] = useState('info');
  const [sending, setSending] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [view, setView] = useState('inbox'); // 'inbox' | 'log'

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await broadcastCampaign(message.trim(), notifType);
      setToastType('success');
      setToastMsg(`Campaign sent! Delivered to ${res.data?.delivered ?? res.delivered ?? 'all'} recipients.`);
      setMessage('');
      setNotifType('info');
      await fetchNotifications();
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to broadcast campaign.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await deleteNotification(id);
    setToastType(ok ? 'success' : 'error');
    setToastMsg(ok ? 'Notification deleted.' : 'Failed to delete notification.');
  };

  if (loading) {
    return <LoadingState message="Loading notification broadcasts..." />;
  }

  const displayList = view === 'inbox'
    ? (notifications || [])
    : (allNotifications && allNotifications.length > 0 ? allNotifications : notifications || []);

  const listLabel = (n) => {
    if (view === 'log') {
      const target = n.userName ? `${n.userName} (${n.userRole || 'user'})` : null;
      return target || null;
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}

      <PageHeader
        title="Notification & Campaign Center"
        subtitle="Compose broadcast alerts to all citizens and officers, and manage the notification inbox."
        breadcrumbs={[
          { label: 'Overview', link: '/admin/dashboard' },
          { label: 'Notifications', link: '/admin/notifications' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'inbox' ? 'glass' : 'text'}
              size="sm"
              onClick={() => setView('inbox')}
            >
              My Inbox
            </Button>
            <Button
              variant={view === 'log' ? 'glass' : 'text'}
              size="sm"
              onClick={() => setView('log')}
            >
              Delivery Log
            </Button>
          </div>
        }
      />

      {/* Campaign compose card */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-4 select-none">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-sm">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">
              Broadcast Campaign
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Push alert to all citizens &amp; officers
            </span>
          </div>
        </div>

        <form onSubmit={handleBroadcast} className="flex flex-col gap-4 mt-4">
          <Textarea
            label="Campaign Message"
            placeholder="Write the public service announcement to deliver..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            charCount={message.length}
            maxChars={500}
          />
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Select
              label="Notification Type"
              value={notifType}
              onChange={(e) => setNotifType(e.target.value)}
              options={[
                { label: 'Info', value: 'info' },
                { label: 'Success', value: 'success' },
                { label: 'Warning', value: 'warning' },
                { label: 'Danger', value: 'danger' }
              ]}
              className="text-xs font-semibold sm:max-w-[220px]"
            />
            <Button
              type="submit"
              variant="gradient"
              size="md"
              icon={Send}
              disabled={!message.trim() || sending}
              isLoading={sending}
            >
              {sending ? 'Broadcasting...' : 'Broadcast to All'}
            </Button>
          </div>
        </form>
      </div>

      {/* Notification list */}
      <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-4 mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
            {view === 'inbox' ? 'My Notification Inbox' : 'Campaign Delivery Log'}
            <span className="ml-2 text-brand-blue font-extrabold">{displayList.length}</span>
          </span>
          {view === 'inbox' && notifications.some(n => !n.read) && (
            <Button
              variant="glass"
              size="sm"
              onClick={markAllAsRead}
              icon={CheckCheck}
            >
              Mark All Read
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {displayList.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && markAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex gap-4 items-start text-left shadow-sm ${
                notif.read
                  ? 'bg-white/40 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800/50 opacity-80'
                  : 'bg-white/70 dark:bg-slate-900/60 border-brand-blue/30 dark:border-brand-purple/30 ring-1 ring-brand-blue/10'
              }`}
            >
              <div className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-950">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {notif.isCampaign ? 'Campaign Broadcast' : 'Ticket Alert'}
                    {listLabel(notif) && (
                      <span className="ml-2 text-[10px] font-bold text-brand-blue uppercase">
                        to {listLabel(notif)}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold whitespace-nowrap">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {notif.text}
                </p>
                {notif.ticketId && (
                  <span className="text-[10px] font-bold text-brand-blue dark:text-brand-purple mt-1 uppercase">
                    Reference ID: {notif.ticketId}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
                title="Delete notification"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}

          {displayList.length === 0 && (
            <div className="py-8">
              <EmptyState
                title="No notifications yet"
                description="Broadcast a campaign or wait for ticket alerts to populate this inbox."
                icon={BellOff}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationsCenter;
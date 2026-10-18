import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { CheckCheck, Trash, BellOff, Info, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

export const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filterUnread, setFilterUnread] = useState(false);

  if (loading) {
    return <LoadingState message="Checking for new inbox notifications..." />;
  }

  const filtered = notifications.filter(n => !filterUnread || !n.read);

  const getIcon = (type) => {
    if (type === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (type === 'warning') return <Play className="w-5 h-5 text-brand-purple" />;
    if (type === 'danger') return <AlertTriangle className="w-5 h-5 text-red-500" />;
    return <Info className="w-5 h-5 text-brand-blue" />;
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <PageHeader
        title="Notifications Center"
        subtitle="Stay updated on the workflow progression of your filed tickets."
        breadcrumbs={[{ label: 'Notifications', link: '/citizen/notifications' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="text"
              size="sm"
              onClick={() => setFilterUnread(!filterUnread)}
              className={filterUnread ? 'text-brand-blue font-extrabold' : ''}
            >
              {filterUnread ? 'Showing Unread' : 'Filter Unread'}
            </Button>
            {notifications.some(n => !n.read) && (
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
        }
      />

      <div className="flex flex-col gap-3">
        {filtered.map((notif) => (
          <div
            key={notif.id}
            onClick={() => {
              markAsRead(notif.id);
              if (notif.issueId) {
                navigate(`/citizen/reports/${notif.issueId}`);
              }
            }}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-4 items-start text-left shadow-sm ${
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
                  {notif.isCampaign ? 'City Campaign' : 'Ticket Alert'}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold whitespace-nowrap">
                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              onClick={(e) => handleDelete(notif.id, e)}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
              title="Delete notification"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-8">
            <EmptyState
              title="Inbox is clean!"
              description="No pending alerts. Any updates on your issues will be logged here."
              icon={BellOff}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Notifications;
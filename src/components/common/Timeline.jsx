import React from 'react';
import { Check, ClipboardList, ShieldAlert, UserCheck, Play, CheckCircle2, MessageSquareHeart } from 'lucide-react';

export const Timeline = ({
  currentStatus,
  comments = [],
  className = ''
}) => {
  const steps = [
    { label: 'Created', status: 'Created', icon: ClipboardList },
    { label: 'Verification', status: 'Verification', icon: ShieldAlert },
    { label: 'Assigned', status: 'Assigned', icon: UserCheck },
    { label: 'Working', status: 'Working', icon: Play },
    { label: 'Completed', status: 'Completed', icon: CheckCircle2 },
    { label: 'Feedback', status: 'Citizen Feedback', icon: MessageSquareHeart }
  ];

  const statusOrder = ['Created', 'Verification', 'Assigned', 'Working', 'Completed', 'Citizen Feedback'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className={`w-full flex flex-col gap-6 ${className}`}>
      {/* Visual Milestones Progress Tracker */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-none">
        <div className="flex items-center min-w-[650px] justify-between relative px-2">
          {/* Connector Line */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-brand-blue to-brand-purple transition-all duration-500 rounded-full"
              style={{ width: `${(currentIndex / (statusOrder.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            const isFuture = idx > currentIndex;

            let circleClass = '';
            let textClass = '';

            if (isCompleted) {
              circleClass = 'bg-brand-blue text-white ring-4 ring-brand-blue/20';
              textClass = 'text-brand-blue font-bold';
            } else if (isActive) {
              circleClass = 'bg-brand-purple text-white ring-4 ring-brand-purple/30 animate-pulse';
              textClass = 'text-brand-purple font-extrabold';
            } else {
              circleClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700';
              textClass = 'text-slate-400 dark:text-slate-500 font-semibold';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 text-center select-none">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${circleClass}`}>
                  {isCompleted ? <Check className="w-5.5 h-5.5 stroke-[2.5]" /> : <Icon className="w-5.5 h-5.5" />}
                </div>
                <span className={`text-xs ${textClass}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Log Comments List */}
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
          Activity Log
        </h4>
        <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 flex flex-col gap-5 ml-4.5 mt-2">
          {comments.map((comm, idx) => (
            <div key={comm.id || idx} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-brand-blue ring-4 ring-white dark:ring-brand-slate-950" />
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {comm.sender}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-semibold">
                    {new Date(comm.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {comm.text}
                </p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-xs text-slate-400 font-semibold italic">No activity logs recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Timeline;

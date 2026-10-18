import React from 'react';
import { useIssues } from '../../context/IssueContext';

export const LiveIndicator = ({ className = '' }) => {
  const { refreshing } = useIssues();

  return (
    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
          refreshing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500 animate-ping'
        }`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          refreshing ? 'bg-amber-500' : 'bg-emerald-500'
        }`} />
      </span>
      <span className={refreshing ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}>
        LIVE
      </span>
    </div>
  );
};
export default LiveIndicator;
import React from 'react';

export const LoadingState = ({
  message = 'Loading dashboard data...',
  rows = 3
}) => {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center gap-4">
      {/* Dynamic spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
      </div>
      
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        {message}
      </p>

      {/* Skelton mock blocks */}
      <div className="w-full max-w-lg mt-4 flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-10 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse flex items-center px-4 justify-between">
            <div className="h-3 w-1/3 bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="h-3 w-1/5 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default LoadingState;

import React from 'react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'up', 'down', 'warning', 'neutral'
  color = 'blue',
  className = ''
}) => {
  const borderColors = {
    blue: 'border-l-4 border-l-brand-blue',
    purple: 'border-l-4 border-l-brand-purple',
    indigo: 'border-l-4 border-l-brand-indigo',
    pink: 'border-l-4 border-l-brand-pink',
    red: 'border-l-4 border-l-red-500',
    green: 'border-l-4 border-l-emerald-500',
    amber: 'border-l-4 border-l-amber-500'
  };

  const trendColors = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    warning: 'text-amber-600 dark:text-amber-400',
    neutral: 'text-slate-500 dark:text-slate-400'
  };

  const borderClass = borderColors[color] || '';

  return (
    <div className={`glass-card rounded-2xl p-5 flex flex-col justify-between hover:shadow-glass-hover transition-all duration-300 ${borderClass} ${className}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {value}
          </span>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300`}>
            <Icon className="w-5.5 h-5.5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          <span className={trendColors[trendType] || trendColors.neutral}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};
export default StatCard;

import React from 'react';

export const Badge = ({
  children,
  color = 'slate',
  className = '',
  ...props
}) => {
  const colors = {
    slate: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    red: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 border-red-100 dark:border-red-900/30',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border-rose-100 dark:border-rose-900/30',
    orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300 border-orange-100 dark:border-orange-900/30',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-100 dark:border-amber-900/30',
    yellow: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300 border-yellow-100 dark:border-yellow-900/20',
    green: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300 border-green-100 dark:border-green-900/30',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border-blue-100 dark:border-blue-900/30',
    cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300 border-cyan-100 dark:border-cyan-900/30',
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/30',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 border-purple-100 dark:border-purple-900/30',
    pink: 'bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300 border-pink-100 dark:border-pink-900/30',
  };

  const selectedColor = colors[color] || colors.slate;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedColor} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
export default Badge;

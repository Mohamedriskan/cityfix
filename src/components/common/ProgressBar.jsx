import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'brand', // 'brand', 'blue', 'purple', 'emerald', 'amber', 'red'
  showLabel = false,
  size = 'md', // 'sm', 'md', 'lg'
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const bgColors = {
    brand: 'bg-gradient-to-r from-brand-blue to-brand-purple',
    blue: 'bg-blue-500',
    purple: 'bg-brand-purple',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500'
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${sizes[size] || sizes.md}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${bgColors[color] || bgColors.brand}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
export default ProgressBar;

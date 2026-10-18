import React from 'react';

export const Checkbox = React.forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2.5">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-brand-indigo focus:ring-brand-indigo/50 focus:ring-offset-0 focus:outline-none transition duration-200 mt-0.5 cursor-pointer ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="text-sm text-slate-600 dark:text-slate-400 select-none cursor-pointer">
            {label}
          </label>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium ml-7 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;

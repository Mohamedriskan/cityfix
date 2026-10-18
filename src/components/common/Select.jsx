import React from 'react';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  className = '',
  id,
  placeholder,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`glass-input rounded-xl px-4 py-2 pr-10 text-sm text-slate-800 dark:text-slate-100 w-full appearance-none focus:ring-offset-0 ${error ? 'border-red-500 dark:border-red-500 focus:ring-red-500/30' : ''} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-slate-400 bg-slate-100 dark:bg-slate-900">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const key = opt.value !== undefined ? opt.value : opt;
            const labelText = opt.label !== undefined ? opt.label : opt;
            return (
              <option key={key} value={key} className="bg-white dark:bg-brand-slate-900 text-slate-800 dark:text-slate-100">
                {labelText}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;

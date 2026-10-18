import React from 'react';

export const Textarea = React.forwardRef(({
  label,
  error,
  rows = 4,
  className = '',
  id,
  charCount,
  maxChars,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {label}
          </label>
        )}
        {charCount !== undefined && maxChars && (
          <span className={`text-xs ${charCount > maxChars ? 'text-red-500 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
            {charCount}/{maxChars}
          </span>
        )}
      </div>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`glass-input rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full resize-none ${error ? 'border-red-500 dark:border-red-500 focus:ring-red-500/30' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;

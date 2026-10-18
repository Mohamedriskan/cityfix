import React from 'react';
import { Breadcrumb } from './Breadcrumb';

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-5 mb-6 ${className}`}>
      <div className="flex flex-col gap-1.5">
        {breadcrumbs.length > 0 && (
          <div className="mb-1">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
export default PageHeader;

import React from 'react';
import { Search } from 'lucide-react';

export const EmptyState = ({
  title = 'No results found',
  description = 'Try adjusting your search terms or filters to find what you are looking for.',
  icon: Icon = Search,
  actionButton
}) => {
  return (
    <div className="glass-card rounded-2xl p-8 py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4 animate-pulse">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
        {description}
      </p>
      {actionButton}
    </div>
  );
};
export default EmptyState;

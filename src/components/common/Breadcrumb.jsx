import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-brand-blue gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1 md:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {isLast ? (
                <span className="text-slate-800 dark:text-slate-200 select-none">
                  {item.label}
                </span>
              ) : (
                <Link to={item.link} className="hover:text-brand-blue transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
export default Breadcrumb;

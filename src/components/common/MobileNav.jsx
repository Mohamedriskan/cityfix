import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const MobileNav = ({ menuItems = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400"
        title="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-5 flex flex-col gap-1 animate-in slide-in-from-left overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/40 mb-3">
              <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                City<span className="text-brand-blue dark:text-brand-purple">Fix</span> Menu
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-brand-blue/15 to-brand-purple/15 text-brand-blue dark:text-brand-purple border-l-4 border-brand-blue'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    {item.label}
                    {item.badge > 0 && (
                      <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-pink text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
export default MobileNav;
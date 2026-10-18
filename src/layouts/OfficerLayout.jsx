import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MobileNav } from '../components/common/MobileNav';
import { LiveIndicator } from '../components/common/LiveIndicator';
import { LayoutDashboard, AlertCircle, Map, ShieldAlert, MessageSquare, FileSpreadsheet, Sun, Moon, LogOut, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '../components/common/Button';

export const OfficerLayout = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Overview Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Incoming Reports', path: '/officer/issues', icon: AlertCircle },
    { label: 'Operations Map', path: '/officer/map', icon: Map },
    { label: 'SLA Monitoring', path: '/officer/sla', icon: ShieldAlert },
    { label: 'Messages Chat', path: '/officer/messages', icon: MessageSquare },
    { label: 'Export Reports', path: '/officer/reports', icon: FileSpreadsheet }
  ];

  return (
    <div className="min-h-screen flex bg-atmosphere bg-slate-50 dark:bg-brand-slate-950 transition-colors duration-200">
      
      {/* Sidebar Panel */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/50 h-screen sticky top-0 shrink-0 p-5 z-20">
        <div className="flex items-center gap-2.5 pb-6 border-b border-slate-200/40 dark:border-slate-800/40 select-none">
          <img 
            src="/Cityfix.jpeg" 
            alt="CityFix Logo" 
            className="w-8 h-8 rounded-lg object-cover shadow" 
          />
          <div className="flex flex-col text-left">
            <span className="text-base font-extrabold text-slate-800 dark:text-white leading-none tracking-tight">
              City<span className="text-brand-blue dark:text-brand-purple">Fix</span> Ops
            </span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              Municipal Officer
            </span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 mt-6">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-250 ${
                  active
                    ? 'bg-gradient-to-r from-brand-blue/15 to-brand-purple/15 text-brand-blue dark:text-brand-purple border-l-4 border-brand-blue shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Night Mode</span>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Real-time Sync</span>
            <LiveIndicator />
          </div>

          <div className="flex items-center justify-between bg-slate-100/55 dark:bg-slate-900/55 p-2.5 rounded-2xl border border-slate-200/20 dark:border-slate-800/20">
            <div className="flex items-center gap-2 overflow-hidden text-left">
              <img
                src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Officer'}
                alt="Officer Avatar"
                className="w-8.5 h-8.5 rounded-xl object-cover shrink-0 bg-white"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser?.name || 'Officer'}
                </span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase">
                  {currentUser?.department || 'Field Ops'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Operations Frame */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header bar */}
        <header className="lg:hidden glass-nav sticky top-0 z-30 w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <MobileNav menuItems={menuItems} />
            <img 
              src="/Cityfix.jpeg" 
              alt="CityFix Logo" 
              className="w-7.5 h-7.5 rounded-lg object-cover shadow" 
            />
            <span className="text-sm font-extrabold text-slate-800 dark:text-white leading-none">
              CityFix Ops
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LiveIndicator />
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-red-500"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-none w-full">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
export default OfficerLayout;

import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MobileNav } from '../components/common/MobileNav';
import { LiveIndicator } from '../components/common/LiveIndicator';
import { LayoutDashboard, AlertOctagon, BarChart3, Flame, Building2, Users, Clock, FileText, Settings, Sun, Moon, LogOut, ShieldAlert, Megaphone } from 'lucide-react';

export const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Overview Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Issue Catalog', path: '/admin/issues', icon: AlertOctagon },
    { label: 'Deep Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Density Heatmap', path: '/admin/heatmap', icon: Flame },
    { label: 'Departments SLA', path: '/admin/departments', icon: Building2 },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'SLA Escalation', path: '/admin/sla', icon: Clock },
    { label: 'Notifications', path: '/admin/notifications', icon: Megaphone },
    { label: 'Metric Reports', path: '/admin/reports', icon: FileText },
    { label: 'System Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex bg-atmosphere bg-slate-50 dark:bg-brand-slate-950 transition-colors duration-200">
      
      {/* Sidebar Panel */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/50 h-screen sticky top-0 shrink-0 p-5 z-20 overflow-y-auto">
        <div className="flex items-center gap-2.5 pb-6 border-b border-slate-200/40 dark:border-slate-800/40 select-none">
          <img 
            src="/Cityfix.jpeg" 
            alt="CityFix Logo" 
            className="w-8 h-8 rounded-lg object-cover shadow" 
          />
          <div className="flex flex-col text-left">
            <span className="text-base font-extrabold text-slate-800 dark:text-white leading-none tracking-tight">
              City<span className="text-brand-blue dark:text-brand-purple">Fix</span> Admin
            </span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              Super Administrator
            </span>
          </div>
        </div>

        {/* Sidebar Search - Google style matching user image */}
        <div className="my-4 px-0.5 select-none">
          <div className="relative flex items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 px-3.5 py-2.5 text-xs text-slate-500 shadow-sm focus-within:ring-2 focus-within:ring-brand-blue/30 focus-within:bg-white/80 dark:focus-within:bg-slate-900/80 transition-all">
            <span className="font-extrabold text-brand-blue dark:text-brand-purple mr-2 select-none tracking-tight">CityFix</span>
            <input 
              type="text" 
              placeholder="Search console..." 
              className="w-full bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 font-semibold"
            />
            <svg className="w-4 h-4 text-slate-400 shrink-0 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 mt-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-brand-blue/15 to-brand-purple/15 text-brand-blue dark:text-brand-purple border-l-4 border-brand-blue shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-4 flex flex-col gap-3 mt-4">
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
                src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
                alt="Admin Avatar"
                className="w-8.5 h-8.5 rounded-xl object-cover shrink-0 bg-white"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser?.name || 'Admin'}
                </span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase">
                  Superuser
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
              CityFix Admin
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
export default AdminLayout;

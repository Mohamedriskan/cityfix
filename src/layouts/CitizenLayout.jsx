import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { LiveIndicator } from '../components/common/LiveIndicator';
import { LayoutDashboard, FileText, Bell, User, PlusCircle, Sun, Moon, LogOut, MapPin } from 'lucide-react';
import { Button } from '../components/common/Button';

export const CitizenLayout = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    { label: 'Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'My Reports', path: '/citizen/reports', icon: FileText },
    { label: 'Report Issue', path: '/citizen/report', icon: PlusCircle },
    { label: 'Notifications', path: '/citizen/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile', path: '/citizen/profile', icon: User }
  ];

  return (
    <div className="min-h-screen flex bg-atmosphere bg-slate-50 dark:bg-brand-slate-950 transition-colors duration-200">
      
      {/* 1. DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/50 h-screen sticky top-0 shrink-0 p-5 z-20">
        {/* Sidebar Header / Logo */}
        <div className="flex items-center gap-2.5 pb-6 border-b border-slate-200/40 dark:border-slate-800/40 select-none">
          <img 
            src="/Cityfix.jpeg" 
            alt="CityFix Logo" 
            className="w-8 h-8 rounded-lg object-cover shadow" 
          />
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-slate-800 dark:text-white leading-none tracking-tight">
              City<span className="text-brand-blue dark:text-brand-purple">Fix</span> Portal
            </span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              Citizen Access
            </span>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 flex flex-col gap-2 mt-6">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 border-l-4 border-l-brand-blue text-brand-blue dark:text-brand-purple'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-pink text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Theme</span>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          {/* User profile card & logout */}
          <div className="flex items-center justify-between bg-slate-100/50 dark:bg-slate-900/50 p-2.5 rounded-2xl border border-slate-200/20 dark:border-slate-800/20">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default'}
                alt="Avatar"
                className="w-8.5 h-8.5 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 bg-white"
              />
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser?.name || 'Citizen'}
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate">
                  {currentUser?.email}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN LAYOUT SHELL */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden pb-20 md:pb-0">
        {/* Desktop top navbar */}
        <header className="md:hidden glass-nav sticky top-0 z-30 w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <img 
              src="/Cityfix.jpeg" 
              alt="CityFix Logo" 
              className="w-7.5 h-7.5 rounded-lg object-cover shadow" 
            />
            <span className="text-sm font-extrabold text-slate-800 dark:text-white leading-none">
              City<span className="text-brand-blue dark:text-brand-purple">Fix</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LiveIndicator />
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-yellow-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-red-500"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-none w-full">
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE BOTTOM FLOATING NAVIGATION */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 h-16 rounded-2xl glass-panel border border-white/40 dark:border-slate-800/40 shadow-2xl flex items-center justify-around px-2">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={idx}
              to={item.path}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1.5 rounded-xl transition-all duration-150 ${
                active
                  ? 'text-brand-blue dark:text-brand-purple scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className="w-5.5 h-5.5" />
              <span className="text-[10px] font-bold mt-1 tracking-tight">
                {item.label === 'Notifications' ? 'Inbox' : item.label === 'Report Issue' ? 'Report' : item.label}
              </span>
              {item.badge > 0 && (
                <span className="absolute top-1 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-pink text-white leading-none scale-90">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

    </div>
  );
};
export default CitizenLayout;

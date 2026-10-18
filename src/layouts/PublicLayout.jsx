import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, MapPin, Check, Menu, X } from 'lucide-react';
import { Button } from '../components/common/Button';

export const PublicLayout = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin/dashboard';
    if (currentUser.role === 'officer') return '/officer/dashboard';
    return '/citizen/dashboard';
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Transparency', path: '/transparency' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-atmosphere bg-slate-50 dark:bg-brand-slate-950 transition-colors duration-200">
      {/* Header bar */}
      <header className="glass-nav sticky top-0 z-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo container */}
          <Link to="/" className="flex items-center gap-2.5 select-none group">
            <img 
              src="/Cityfix.jpeg" 
              alt="CityFix Logo" 
              className="w-9 h-9 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-200" 
            />
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-slate-800 dark:text-white leading-none tracking-tight">
                City<span className="text-brand-blue dark:text-brand-purple">Fix</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                Colombo Smart
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-brand-blue dark:text-brand-purple'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions panel */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="glass"
                  onClick={() => navigate(getDashboardLink())}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="glass" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="gradient" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-yellow-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-40 p-4 flex flex-col gap-4 shadow-xl animate-slide-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-semibold py-2 px-3 rounded-lg ${
                isActive(link.path)
                  ? 'bg-slate-100 dark:bg-slate-800 text-brand-blue dark:text-brand-purple'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Button
                variant="glass"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardLink());
                }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="glass" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="gradient" className="w-full">Register</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Outlet */}
      <main className="flex-1 w-full max-w-none px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer bar */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/20 py-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 backdrop-blur-sm mt-auto select-none">
        <div className="w-full px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-white">CityFix</span>
            <span>&copy; {new Date().getFullYear()} Colombo Smart City Administration. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="#" className="hover:underline">Privacy Policy</Link>
            <Link to="#" className="hover:underline">Terms of Service</Link>
            <Link to="#" className="hover:underline">Accessibility</Link>
            <Link to="#" className="hover:underline">City Hall</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default PublicLayout;

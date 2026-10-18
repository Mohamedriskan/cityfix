import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Checkbox } from '../components/common/Checkbox';
import { Toast } from '../components/common/Toast';
import { KeyRound, Mail, Eye, EyeOff, ShieldCheck, UserCheck, LayoutDashboard } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, currentUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const redirectUrl = searchParams.get('redirect');

  const handleRedirect = React.useCallback((role) => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'officer') navigate('/officer/dashboard');
    else navigate('/citizen/dashboard');
  }, [redirectUrl, navigate]);

  // If already logged in, redirect away
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      handleRedirect(currentUser.role);
    }
  }, [isAuthenticated, currentUser, handleRedirect]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setToastType('error');
      setToastMessage('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      setToastType('success');
      setToastMessage(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        handleRedirect(user.role);
      }, 800);
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Prefill demo login actions
  const prefillAndLogin = async (role) => {
    let demoEmail = '';
    if (role === 'citizen') demoEmail = 'citizen@cityfix.demo';
    if (role === 'officer') demoEmail = 'officer@cityfix.demo';
    if (role === 'admin') demoEmail = 'admin@cityfix.demo';

    setEmail(demoEmail);
    setPassword('CityFix123');
    
    setIsLoading(true);
    try {
      const user = await login(demoEmail, 'CityFix123');
      setToastType('success');
      setToastMessage(`Logged in as Demo ${role.toUpperCase()}: ${user.name}`);
      setTimeout(() => {
        handleRedirect(user.role);
      }, 800);
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-6 text-left">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}

      {/* Ambient backgrounds */}
      <div className="absolute w-64 h-64 rounded-full bg-brand-blue/10 blur-3xl -z-10 -translate-x-12 -translate-y-12" />
      <div className="absolute w-64 h-64 rounded-full bg-brand-purple/10 blur-3xl -z-10 translate-x-12 translate-y-12" />

      {/* Main Glass Login Card */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/40 dark:border-slate-800/40 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        
        {/* Logo */}
        <div className="flex justify-center select-none">
          <img 
            src="/Cityfix.jpeg" 
            alt="CityFix Logo" 
            className="w-16 h-16 rounded-2xl object-cover shadow-md" 
          />
        </div>

        {/* Title */}
        <div className="text-center flex flex-col gap-2 select-none">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Sign In to CityFix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Connect and start resolving civic issues.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. citizen@cityfix.demo"
            required
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>

          <div className="flex justify-between items-center text-xs mt-1">
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <button
              type="button"
              onClick={() => {
                setToastType('info');
                setToastMessage('For prototype, demo password is: CityFix123');
              }}
              className="text-brand-blue dark:text-brand-purple hover:underline font-semibold"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            variant="gradient"
            isLoading={isLoading}
            className="w-full mt-4"
          >
            Sign In
          </Button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800/80"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Demo Portal Access
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800/80"></div>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => prefillAndLogin('citizen')}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:border-brand-blue/30 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
          >
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              Demo Citizen Account
            </span>
            <span className="text-[10px] text-slate-400">Fill & login</span>
          </button>
          
          <button
            type="button"
            onClick={() => prefillAndLogin('officer')}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:border-brand-blue/30 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-blue" />
              Demo Municipal Officer
            </span>
            <span className="text-[10px] text-slate-400">Fill & login</span>
          </button>

          <button
            type="button"
            onClick={() => prefillAndLogin('admin')}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:border-brand-purple/30 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-brand-purple" />
              Demo System Admin
            </span>
            <span className="text-[10px] text-slate-400">Fill & login</span>
          </button>
        </div>

        {/* Register link footer */}
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-semibold mt-2 select-none">
          Don't have a citizen account?{' '}
          <Link to="/register" className="text-brand-blue dark:text-brand-purple hover:underline font-extrabold">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};
export default Login;

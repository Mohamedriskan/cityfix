import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Trash2, HardHat, Lightbulb, Droplet, CloudRain, Zap, Waves, Activity, Trees, AlertTriangle,
  Megaphone, ClipboardCheck, UserCheck, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Check
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoStart = async () => {
    try {
      await login('citizen@cityfix.demo', 'CityFix123');
      navigate('/citizen/dashboard');
    } catch (err) {
      console.error('Error starting demo:', err);
    }
  };

  const stats = [
    { label: 'Issues Reported', value: '18,497', color: 'blue' },
    { label: 'Issues Resolved', value: '15,842', color: 'green' },
    { label: 'Active Issues', value: '2,655', color: 'amber' },
    { label: 'Resolution Rate', value: '86%', color: 'purple' }
  ];

  const steps = [
    {
      title: '1. Report',
      desc: 'Snap a photo, select category and pinpoint the exact coordinates on our live map.',
      icon: Megaphone,
      color: 'blue'
    },
    {
      title: '2. Review',
      desc: 'Municipal dispatchers verify the submission details and route it to the field team.',
      icon: ClipboardCheck,
      color: 'amber'
    },
    {
      title: '3. Assign',
      desc: 'Work crews are dispatched within hours under strict SLA response time guidelines.',
      icon: UserCheck,
      color: 'purple'
    },
    {
      title: '4. Resolve',
      desc: 'Citizen is notified upon completion and confirms closure with satisfaction rating.',
      icon: CheckCircle2,
      color: 'green'
    }
  ];

  const categories = [
    { name: 'Garbage & Waste', icon: Trash2, color: 'text-red-500 bg-red-50 dark:bg-red-950/20' },
    { name: 'Road & Potholes', icon: HardHat, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { name: 'Streetlight Failures', icon: Lightbulb, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' },
    { name: 'Water Supply Disruptions', icon: Droplet, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { name: 'Drainage & Flooding', icon: CloudRain, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20' },
    { name: 'Electricity Failures', icon: Zap, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/20' },
    { name: 'Flood Alerts', icon: Waves, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { name: 'Sewage & Sanitation', icon: Activity, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { name: 'Parks & Public Spaces', icon: Trees, color: 'text-green-500 bg-green-50 dark:bg-green-950/20' },
    { name: 'General Safety Hazards', icon: AlertTriangle, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' }
  ];

  return (
    <div className="flex flex-col gap-20">
      
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-4">
        {/* Text Area */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-brand-blue dark:text-brand-purple w-fit">
            <ShieldCheck className="w-4 h-4" />
            Colombo Smart City Initiative
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 dark:text-white leading-tight tracking-tight">
            Report. Track.<br />
            <span className="text-brand-gradient">Improve Your City.</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            CityFix connects citizens with municipal authorities to report, manage and resolve urban issues faster and more transparently. Together, we build a smarter Colombo.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate('/login?redirect=/citizen/report')}
              icon={Megaphone}
            >
              Report an Issue
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => navigate('/transparency')}
              icon={ArrowRight}
            >
              Track on Map
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDemoStart}
              icon={Activity}
            >
              Try CityFix Demo
            </Button>
          </div>
        </div>

        {/* CSS-based Smart City Visual Panel */}
        <div className="lg:col-span-5 relative w-full aspect-square flex items-center justify-center select-none">
          {/* Ambient Glows */}
          <div className="absolute w-72 h-72 rounded-full bg-brand-blue/15 blur-3xl -z-10 animate-pulse" />
          <div className="absolute w-72 h-72 rounded-full bg-brand-purple/10 blur-3xl -z-10 translate-x-12 translate-y-12" />

          {/* Premium Glass Dashboard Visual */}
          <div className="w-full max-w-sm rounded-3xl glass-card border border-white/40 dark:border-slate-800/40 p-6 flex flex-col gap-5 shadow-2xl relative overflow-hidden transform hover:-rotate-1 hover:scale-[1.02] transition-all duration-300">
            {/* Top Bar */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                CityFix System v2.0
              </span>
            </div>

            {/* Smart City 3D Logo Simulation */}
            <div className="w-full h-48 rounded-2xl bg-gradient-to-tr from-brand-blue/10 to-brand-purple/10 border border-white/20 flex flex-col items-center justify-center relative overflow-hidden p-6 group">
              {/* Giant glowing Logo symbol */}
              <div className="relative w-24 h-24 rounded-3xl overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/Cityfix.jpeg" 
                  alt="CityFix Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Techy lines */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/5 dark:to-white/5 pointer-events-none" />
            </div>

            {/* Mock Dashboard metrics inside the visual */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel p-3 rounded-xl flex flex-col gap-0.5 text-left">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Response SLA</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-white">Under 2.5 Hrs</span>
              </div>
              <div className="glass-panel p-3 rounded-xl flex flex-col gap-0.5 text-left">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Satisfaction</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-white">4.8 / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TICKER STATISTICS SECTION */}
      <section className="flex flex-col gap-4 text-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Colombo Municipal Operations Data
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center shadow hover:shadow-glass-hover transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-1 font-semibold">
          * Note: Statistics are simulated for platform demonstration purposes.
        </p>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            How CityFix Works
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            A transparent 4-step pipeline that bridges the communication gap between citizens and Colombo municipal field crews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 text-left flex flex-col gap-3 shadow hover:shadow-glass-hover transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-brand-blue dark:text-brand-purple w-fit">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. ISSUE CATEGORIES */}
      <section className="flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Reportable Categories
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Choose from exactly mapped municipal departments to route your civic concerns efficiently.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 flex flex-col items-center text-center justify-center gap-3 hover:shadow-glass-hover hover:scale-[1.03] transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50 select-none group"
              >
                <div className={`p-3 rounded-full ${cat.color} group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="glass-card rounded-3xl p-8 md:p-12 text-center bg-gradient-to-tr from-brand-blue/5 via-brand-purple/5 to-transparent relative overflow-hidden border border-white/50">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/10 blur-3xl -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-purple/10 blur-3xl -z-10 rounded-full" />

        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">
            Ready to fix a hazard in your community?
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            Join thousands of Colombo residents who are actively mapping potholes, streetlight outages, and water line leaks. Registration takes less than 2 minutes.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/register">
              <Button variant="gradient" size="lg">Create Account</Button>
            </Link>
            <Link to="/login">
              <Button variant="glass" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
export default LandingPage;

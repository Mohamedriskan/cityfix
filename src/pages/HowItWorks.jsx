import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { ShieldCheck, Clock, FileCheck, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const HowItWorks = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: 'How long does it take to resolve an issue?', a: 'Resolution times depend on priority. Critical hazards (e.g., hanging power lines) are addressed in under 12 hours. Standard items like pothole repair are targeted within 72 hours.' },
    { q: 'Can I report anonymously?', a: 'You need an account to report issues, which helps prevent spam and allows officers to message you for location details. However, your private email/phone are never shown publicly.' },
    { q: 'What happens if an issue exceeds its SLA limit?', a: 'If a ticket goes overdue, it triggers automatic escalation notifications in the Admin Dashboard, alerting the department head and municipal directors.' },
    { q: 'Is there a mobile app?', a: 'CityFix is a responsive web application designed mobile-first. You can add it to your mobile home screen as a PWA (Progressive Web App) to snap photos directly in the field.' }
  ];

  return (
    <div className="flex flex-col gap-10 text-left">
      <PageHeader
        title="SLA Rules & Guidelines"
        subtitle="Understand how the CityFix system routes, monitors, and escalation protocols work."
        breadcrumbs={[{ label: 'How It Works', link: '/how-it-works' }]}
      />

      {/* Grid SOP card layouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 border border-l-4 border-l-brand-blue">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-brand-blue">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">Service Level Agreements</h3>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
            Every issue is automatically assigned a Service Level Agreement (SLA) countdown timer based on priority. High-priority road safety concerns must be verified and working within 24 hours.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 border border-l-4 border-l-brand-purple">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-brand-purple">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">Verification Audits</h3>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
            Municipal inspectors evaluate reports to verify photos and GPS coordinates. This filters out duplicates and assigns tasks to the appropriate department (e.g., Waste, Drainage, Roads).
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 border border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">Citizen Confirmation</h3>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
            Issues are only permanently resolved when the citizen completes a satisfaction review. If the repair is subpar, citizens can request a recheck to reopen the ticket.
          </p>
        </div>

      </div>

      {/* FAQ Accordions block */}
      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 flex gap-4 items-start shadow-sm border border-slate-200/50">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 shrink-0">
                <HelpCircle className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Ready to file a civic report?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">It takes less than 2 minutes to map a location and notify officers.</p>
        </div>
        <Button variant="gradient" onClick={() => navigate('/login?redirect=/citizen/report')}>
          File a Report Now <ChevronRight className="w-4 h-4" />
        </Button>
      </section>
    </div>
  );
};
export default HowItWorks;

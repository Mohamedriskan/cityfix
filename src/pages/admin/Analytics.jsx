import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { useIssues } from '../../context/IssueContext';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingState } from '../../components/common/LoadingState';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, Filter } from 'lucide-react';

export const Analytics = () => {
  const { issues } = useIssues();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30-days'); // '7-days', '30-days', '90-days', 'year'

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const result = await analyticsService.getAnalyticsData(issues);
        setData(result);
      } catch (err) {
        console.error('Error fetching analytics details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeframe, issues]);

  const COLORS = ['#0ea5e9', '#8b5cf6', '#6366f1', '#d946ef', '#f43f5e', '#f59e0b', '#10b981', '#14b8a6'];

  if (loading) {
    return <LoadingState message="Loading administrative charts and graphs..." />;
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      <PageHeader
        title="Operations Analytics Console"
        breadcrumbs={[
          { label: 'Overview', link: '/admin/dashboard' },
          { label: 'Analytics Console', link: '/admin/analytics' }
        ]}
        actions={
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 select-none">
            {[
              { label: '7 Days', value: '7-days' },
              { label: '30 Days', value: '30-days' },
              { label: '90 Days', value: '90-days' },
              { label: 'This Year', value: 'year' }
            ].map(tf => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeframe === tf.value
                    ? 'bg-white dark:bg-slate-800 shadow text-slate-800 dark:text-slate-200'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category distribution */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
            <BarChart3 className="w-4 h-4" />
            Tickets by Category
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.issuesByCategory || []}>
                <XAxis dataKey="name" tick={{ fontSize: 8 }} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data?.issuesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority distribution */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
            <PieIcon className="w-4 h-4" />
            Priority Distribution
          </h4>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.priorityDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Volume reports */}
        <div className="lg:col-span-12 glass-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
            <LineIcon className="w-4 h-4" />
            Monthly Ticket Resolution Index
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.issuesOverTime || []}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="reported" name="Reported Volume" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="resolved" name="Resolved Volume" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
export default Analytics;

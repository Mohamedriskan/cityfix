const isResolved = (i) => i.status === 'Completed' || i.status === 'Citizen Feedback';

const compute = (issues) => {
  const total = issues.length;
  const resolved = issues.filter(isResolved).length;
  const active = total - resolved;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const feedbackIssues = issues.filter(i => i.feedback && i.feedback.rating);
  const totalRating = feedbackIssues.reduce((sum, i) => sum + i.feedback.rating, 0);
  const citizenSatisfaction = feedbackIssues.length > 0
    ? parseFloat((totalRating / feedbackIssues.length).toFixed(1))
    : 0;

  // Issues by Category
  const categoryMap = {};
  issues.forEach(i => {
    categoryMap[i.category || 'Uncategorized'] = (categoryMap[i.category || 'Uncategorized'] || 0) + 1;
  });
  const issuesByCategory = Object.keys(categoryMap).map(cat => ({ name: cat, value: categoryMap[cat] }));

  // Issues over time (last 6 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyMap = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
    monthlyMap[key] = { reported: 0, resolved: 0 };
  }
  issues.forEach(i => {
    const date = new Date(i.createdAt);
    const key = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().substring(2)}`;
    if (monthlyMap[key]) {
      monthlyMap[key].reported += 1;
      if (isResolved(i)) monthlyMap[key].resolved += 1;
    }
  });
  const issuesOverTime = Object.keys(monthlyMap).map(key => ({
    name: key,
    reported: monthlyMap[key].reported,
    resolved: monthlyMap[key].resolved,
  }));

  // Priority distribution
  const priorityMap = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  issues.forEach(i => {
    if (priorityMap[i.priority] !== undefined) priorityMap[i.priority] += 1;
  });
  const priorityDistribution = Object.keys(priorityMap).map(p => ({ name: p, value: priorityMap[p] }));

  // Department performance
  const deptPerformanceMap = {};
  issues.forEach(i => {
    const dept = i.department || 'General Maintenance';
    if (!deptPerformanceMap[dept]) deptPerformanceMap[dept] = { active: 0, resolved: 0, total: 0 };
    deptPerformanceMap[dept].total += 1;
    if (isResolved(i)) deptPerformanceMap[dept].resolved += 1;
    else deptPerformanceMap[dept].active += 1;
  });
  const departmentPerformance = Object.keys(deptPerformanceMap).map(dept => {
    const t = deptPerformanceMap[dept].total;
    const r = deptPerformanceMap[dept].resolved;
    return {
      name: dept,
      active: deptPerformanceMap[dept].active,
      resolved: r,
      compliance: t > 0 ? Math.round((r / t) * 100) : 100,
    };
  });

  return { total, resolved, active, resolutionRate, citizenSatisfaction, issuesByCategory, issuesOverTime, priorityDistribution, departmentPerformance };
};

export const analyticsService = {
  getAdminMetrics: async (issues = []) => {
    const c = compute(issues);
    return {
      totalReports: c.total,
      resolutionRate: `${c.resolutionRate}%`,
      activeIssues: c.active,
      avgResolutionTime: '3.2 days',
      citizenSatisfaction: `${c.citizenSatisfaction} / 5`,
    };
  },

  getAnalyticsData: async (issues = []) => {
    const c = compute(issues);
    return {
      issuesByCategory: c.issuesByCategory,
      issuesOverTime: c.issuesOverTime,
      priorityDistribution: c.priorityDistribution,
      departmentPerformance: c.departmentPerformance,
      slaDistribution: [
        { name: 'Within SLA', value: Math.max(0, c.total - Math.ceil(c.total * 0.1) - 3), color: '#10b981' },
        { name: 'Near Deadline', value: 3, color: '#f59e0b' },
        { name: 'Overdue', value: Math.max(1, Math.ceil(c.total * 0.1)), color: '#ef4444' }
      ],
    };
  }
};
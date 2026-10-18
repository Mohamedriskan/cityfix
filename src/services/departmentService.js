import { api } from './api';

const asFrontendFormat = (dept, idx = 0) => {
  const metricDefaults = [
    { activeIssues: 4, resolved: 42, slaPerformance: '94%', avgResolutionTime: '4.2 days' },
    { activeIssues: 6, resolved: 89, slaPerformance: '88%', avgResolutionTime: '2.1 days' },
    { activeIssues: 3, resolved: 31, slaPerformance: '91%', avgResolutionTime: '3.5 days' },
    { activeIssues: 2, resolved: 75, slaPerformance: '96%', avgResolutionTime: '1.2 days' },
    { activeIssues: 5, resolved: 28, slaPerformance: '82%', avgResolutionTime: '5.8 days' },
    { activeIssues: 1, resolved: 14, slaPerformance: '98%', avgResolutionTime: '0.8 days' },
    { activeIssues: 2, resolved: 19, slaPerformance: '89%', avgResolutionTime: '4.8 days' },
    { activeIssues: 3, resolved: 53, slaPerformance: '92%', avgResolutionTime: '1.9 days' },
  ];
  const m = metricDefaults[idx % metricDefaults.length] || metricDefaults[0];
  return {
    id: dept.id,
    name: dept.name,
    head: 'Municipal Authority',
    activeIssues: m.activeIssues,
    resolved: m.resolved,
    slaPerformance: m.slaPerformance,
    avgResolutionTime: m.avgResolutionTime,
    status: 'Active',
  };
};

export const departmentService = {
  async getDepartments() {
    const data = await api.get('/departments');
    return (data.departments || []).map((d, i) => asFrontendFormat(d, i));
  },

  async addDepartment(deptData) {
    const data = await api.post('/departments', { name: deptData.name });
    return asFrontendFormat({ id: data.departmentId, name: deptData.name });
  },

  async updateDepartment(id, deptData) {
    return asFrontendFormat({ id, name: deptData.name });
  }
};

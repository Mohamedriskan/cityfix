import { api } from './api';

const normalizeIssue = (row) => {
  const categoryDeptMap = {
    'Garbage & Waste': 'Waste Management',
    'Road & Potholes': 'Roads Department',
    'Streetlight Failures': 'Electricity',
    'Water Supply Disruptions': 'Water Supply',
    'Drainage & Flooding': 'Drainage',
    'Electricity Failures': 'Electricity',
    'Flood Alerts': 'Drainage',
    'Sewage & Sanitation': 'Sanitation',
    'Parks & Public Spaces': 'Parks & Recreation',
    'General Safety Hazards': 'Public Safety'
  };

  const department = row.department_name || categoryDeptMap[row.category] || 'General Maintenance';
  const reporterName = row.reporter_name || 'Citizen';
  const reporterPhone = row.phone || '';

  return {
    id: row.id,
    ticketId: row.ticket_id || `CF-2026-${String(row.id).padStart(6, '0')}`,
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority || 'Medium',
    status: row.status || 'Created',
    citizen: {
      id: row.user_id,
      name: reporterName,
      email: row.email || '',
      phone: reporterPhone,
    },
    department,
    latitude: parseFloat(row.latitude) || 6.9271,
    longitude: parseFloat(row.longitude) || 79.8612,
    image: row.image || `https://placehold.co/600x400/0ea5e9/ffffff?text=${encodeURIComponent(row.category || 'Issue')}`,
    images: row.image ? [row.image] : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sla: row.priority === 'Critical' ? 12 : row.priority === 'High' ? 24 : row.priority === 'Medium' ? 72 : 120,
    feedback: (row.feedback_rating !== null && row.feedback_rating !== undefined)
      ? { rating: Number(row.feedback_rating), comment: row.feedback_comment || '' }
      : null,
    comments: [],
    department_id: row.department_id,
    department_name: row.department_name,
  };
};

export const issueService = {
  async getIssues() {
    const data = await api.get('/issues?limit=100');
    return (data.issues || []).map(normalizeIssue);
  },

  async getIssueById(id) {
    const data = await api.get(`/issues/${id}`);
    return normalizeIssue(data.issue);
  },

  async getIssueComments(id) {
    try {
      const data = await api.get(`/comments/issue/${id}`);
      return (data.comments || []).map(c => ({
        id: c.id,
        sender: c.user_name || 'User',
        text: c.comment,
        timestamp: c.created_at,
      }));
    } catch (e) {
      return [];
    }
  },

  async createIssue(issueData, citizenUser) {
    const formData = new FormData();
    formData.append('title', issueData.title);
    formData.append('description', issueData.description);
    formData.append('category', issueData.category);
    formData.append('priority', issueData.priority || 'Medium');
    formData.append('latitude', issueData.latitude || '');
    formData.append('longitude', issueData.longitude || '');
    if (issueData.images && issueData.images.length > 0 && issueData.images[0]) {
      formData.append('image', issueData.images[0]);
    }

    const data = await api.post('/issues', formData, {}, true);
    const id = data.issueId;
    const fresh = await api.get(`/issues/${id}`);
    return normalizeIssue(fresh.issue);
  },

  async updateIssueStatus(id, status, officerName = 'Officer') {
    const data = await api.patch(`/issues/${id}/status`, { status });
    const fresh = await api.get(`/issues/${id}`);
    return normalizeIssue(fresh.issue);
  },

  async assignDepartment(id, departmentName, officerName = 'Officer') {
    let deptId = null;
    try {
      const depts = await api.get('/departments');
      const match = (depts.departments || []).find(d => d.name === departmentName);
      deptId = match ? match.id : null;
    } catch (e) {
      deptId = null;
    }
    const data = await api.patch(`/issues/${id}/department`, { department_id: deptId });
    const fresh = await api.get(`/issues/${id}`);
    return normalizeIssue(fresh.issue);
  },

  async setPriority(id, priority, officerName = 'Officer') {
    const fresh = await api.get(`/issues/${id}`);
    const issue = fresh.issue;
    const formData = new FormData();
    formData.append('title', issue.title);
    formData.append('description', issue.description);
    formData.append('category', issue.category);
    formData.append('priority', priority);
    formData.append('latitude', issue.latitude || '');
    formData.append('longitude', issue.longitude || '');
    await api.put(`/issues/${id}`, formData, {}, true);
    const after = await api.get(`/issues/${id}`);
    return normalizeIssue(after.issue);
  },

  async addComment(id, senderName, text) {
    await api.post('/comments', { issue_id: id, comment: text });
    const fresh = await api.get(`/issues/${id}`);
    const issue = normalizeIssue(fresh.issue);
    issue.comments = await this.getIssueComments(id);
    return issue;
  },

  async submitFeedback(id, rating, feedbackComment) {
    await api.patch(`/issues/${id}/status`, {
      status: 'Citizen Feedback',
      rating: Number(rating) || 5,
      feedbackComment: feedbackComment || '',
    });
    const after = await api.get(`/issues/${id}`);
    return normalizeIssue(after.issue);
  }
};

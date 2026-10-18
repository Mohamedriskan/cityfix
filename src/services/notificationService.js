import { api } from './api';

const toFrontend = (n = {}) => ({
  id: String(n.id),
  userId: n.userId,
  text: n.text,
  type: n.type || 'info',
  ticketId: n.ticketId,
  issueId: n.issueId,
  isCampaign: !!n.isCampaign,
  read: !!n.read,
  createdAt: n.createdAt,
});

export const notificationService = {
  getNotifications: (userId) => {
    return api.get('/notifications/my').then(data => (data.notifications || []).map(toFrontend));
  },

  getAllNotifications: () => {
    return api.get('/notifications/all').then(data => (data.notifications || []).map(toFrontend));
  },

  markAsRead: (id) => {
    return api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: () => {
    return api.patch('/notifications/read-all');
  },

  createNotification: (userId, ticketId, issueId, text, type = 'info') => {
    return api.post('/notifications', {
      userId: Number(userId),
      text,
      type,
      ticketId: ticketId || null,
      issueId: issueId || null,
    }).then(data => ({
      id: String(data.notificationId),
      userId,
      text,
      type,
      ticketId,
      issueId,
      isCampaign: false,
      read: false,
      createdAt: new Date().toISOString(),
    }));
  },

  broadcastCampaign: (text, type = 'info') => {
    return api.post('/notifications/campaign', { text, type });
  },

  deleteNotification: (id) => {
    return api.delete(`/notifications/${id}`);
  },
};
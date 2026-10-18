import { api } from './api';

export const userService = {
  getUsers: async () => {
    const data = await api.get('/users');
    return data.users || [];
  },

  updateUser: async (id, userData) => {
    return { id, ...userData };
  },

  deactivateUser: async (id) => {
    const data = await api.patch(`/users/${id}/status`);
    return { id, status: data.user?.status || 'Deactivated' };
  }
};
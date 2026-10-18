import { api } from './api';

export const messageService = {
  getConversations: () => {
    return api.get('/messages/conversations').then(data => data.conversations || []);
  },

  sendMessage: (conversationId, text) => {
    return api.post('/messages', { conversationId: Number(conversationId), text });
  },
};
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) {
      setNotifications([]);
      setAllNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(currentUser.id);
      setNotifications(data || []);
      if (currentUser.role === 'admin') {
        const all = await notificationService.getAllNotifications();
        setAllNotifications(all || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
      setAllNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time polling while signed in
  useEffect(() => {
    if (!currentUser) return;
    const timer = setInterval(fetchNotifications, 7000);
    return () => clearInterval(timer);
  }, [currentUser, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setAllNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setAllNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setAllNotifications(prev => prev.filter(n => n.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      return false;
    }
  };

  const addNotification = async (userId, ticketId, issueId, text, type = 'info') => {
    try {
      const newNotif = await notificationService.createNotification(userId, ticketId, issueId, text, type);
      if (currentUser && currentUser.id === userId) {
        setNotifications(prev => [newNotif, ...prev]);
      }
      return newNotif;
    } catch (err) {
      console.error('Error adding notification:', err);
      return null;
    }
  };

  const broadcastCampaign = async (text, type = 'info') => {
    try {
      const res = await notificationService.broadcastCampaign(text, type);
      await fetchNotifications();
      return res;
    } catch (err) {
      console.error('Error broadcasting campaign:', err);
      throw err;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      allNotifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addNotification,
      broadcastCampaign,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
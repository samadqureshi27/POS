// hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { Notification } from '../types/notifications';
import { NotificationAPI } from '../util/notifications.api';
import { logError } from '@/lib/util/logger';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await NotificationAPI.getNotifications();
      setNotifications(data);
    } catch (error) {
      logError('Failed to load notifications', error, {
        component: "useNotifications",
        action: "loadNotifications",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await NotificationAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      logError('Failed to mark as read', error, {
        component: "useNotifications",
        action: "markAsRead",
        notificationId: id,
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      logError('Failed to mark all as read', error, {
        component: "useNotifications",
        action: "markAllAsRead",
      });
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await NotificationAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      logError('Failed to delete notification', error, {
        component: "useNotifications",
        action: "deleteNotification",
        notificationId: id,
      });
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: loadNotifications
  };
};
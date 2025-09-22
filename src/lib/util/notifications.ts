// utils/notifications.utils.ts
import { Notification, FilterType } from '../types/notifications';

export const formatTimeAgo = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

export const filterNotifications = (
  notifications: Notification[],
  filter: FilterType,
  searchQuery: string
): Notification[] => {
  return notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read) ||
      notification.type === filter;
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
};

export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.read).length;
};

export const getPriorityColorClasses = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return 'bg-black';
    case 'medium':
      return 'bg-gray-700';
    case 'low':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

export const getIconColorClasses = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return 'text-white';
    case 'medium':
      return 'text-gray-100';
    case 'low':
      return 'text-gray-200';
    default:
      return 'text-gray-200';
  }
};
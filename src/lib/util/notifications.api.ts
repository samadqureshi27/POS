// services/notifications.api.ts
import { Notification, NotificationAPIResponse } from '../types/notifications';
import { mockNotifications } from './notifications.data';

export class NotificationAPI {
  static async getNotifications(): Promise<Notification[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockNotifications), 500);
    });
  }

  static async markAsRead(id: number): Promise<NotificationAPIResponse> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 200);
    });
  }

  static async markAllAsRead(): Promise<NotificationAPIResponse> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  }

  static async deleteNotification(id: number): Promise<NotificationAPIResponse> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 200);
    });
  }
}
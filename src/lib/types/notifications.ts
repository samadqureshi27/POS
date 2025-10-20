// types/notifications.types.ts

export interface NotificationMetadata {
  clientId?: string;
  email?: string;
  amount?: number;
  invoiceId?: string;
  clientName?: string;
  time?: string;
  location?: string;
  device?: string;
  ip?: string;
  version?: string;
  downtime?: string;
  documentCount?: number;
  documentType?: string;
  daysOverdue?: number;
  dataSize?: string;
  backupLocation?: string;
}

export interface Notification {
  id: number;
  type: 'client' | 'payment' | 'appointment' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  avatar?: string;
  metadata?: NotificationMetadata;
}

export type FilterType = 'all' | 'unread' | 'read' | 'client' | 'payment' | 'appointment' | 'alert' | 'system';

export interface NotificationAPIResponse {
  success: boolean;
}
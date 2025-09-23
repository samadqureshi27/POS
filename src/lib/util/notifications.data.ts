// data/notifications.data.ts
import { Notification } from '../types/notifications';

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'client',
    title: 'New Client Registration',
    message: 'Sarah Johnson has registered as a new client and is waiting for approval.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    priority: 'high',
    actionRequired: true,
    avatar: '/api/placeholder/32/32',
    metadata: { clientId: 'CLT001', email: 'sarah.johnson@email.com' }
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of $2,500 received from ABC Corporation for Invoice #INV-2024-001.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    priority: 'medium',
    actionRequired: false,
    metadata: { amount: 2500, invoiceId: 'INV-2024-001', clientName: 'ABC Corporation' }
  },
  {
    id: 3,
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'Meeting with John Smith scheduled for today at 3:00 PM.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: 'high',
    actionRequired: true,
    metadata: { clientName: 'John Smith', time: '3:00 PM', location: 'Conference Room A' }
  },
  {
    id: 4,
    type: 'system',
    title: 'System Update Complete',
    message: 'The scheduled maintenance has been completed successfully. All systems are now operational.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    priority: 'low',
    actionRequired: false,
    metadata: { version: '2.1.0', downtime: '15 minutes' }
  },
  {
    id: 5,
    type: 'alert',
    title: 'Security Alert',
    message: 'Unusual login activity detected from a new device. Please verify if this was you.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
    priority: 'high',
    actionRequired: true,
    metadata: { device: 'iPhone 13', location: 'New York, NY', ip: '192.168.1.100' }
  },
  {
    id: 6,
    type: 'client',
    title: 'Client Document Uploaded',
    message: 'Emma Davis has uploaded new documents to her client portal.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: 'medium',
    actionRequired: false,
    avatar: '/api/placeholder/32/32',
    metadata: { clientId: 'CLT002', documentCount: 3, documentType: 'Tax Forms' }
  },
  {
    id: 7,
    type: 'payment',
    title: 'Payment Overdue',
    message: 'Invoice #INV-2024-002 from Tech Solutions Ltd is now 5 days overdue.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false,
    priority: 'high',
    actionRequired: true,
    metadata: { amount: 1200, invoiceId: 'INV-2024-002', clientName: 'Tech Solutions Ltd', daysOverdue: 5 }
  },
  {
    id: 8,
    type: 'system',
    title: 'Backup Completed',
    message: 'Daily backup has been completed successfully. 1.2GB of data backed up.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    priority: 'low',
    actionRequired: false,
    metadata: { dataSize: '1.2GB', backupLocation: 'Cloud Storage' }
  }
];
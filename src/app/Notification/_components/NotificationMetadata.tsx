// components/NotificationMetadata.tsx
import React from 'react';
import { Notification } from '@/lib/types/notifications';
import { formatCurrency } from '@/lib/util/formatters';

interface NotificationMetadataProps {
  notification: Notification;
}

export const NotificationMetadata: React.FC<NotificationMetadataProps> = ({ notification }) => {
  if (!notification.metadata) return null;

  return (
    <div className="mt-2 text-xs text-gray-600 space-y-1">
      {notification.type === 'payment' && notification.metadata.amount && (
        <p>Amount: ${formatCurrency(notification.metadata.amount)}</p>
      )}
      {notification.type === 'appointment' && notification.metadata.time && (
        <p>Time: {notification.metadata.time} • {notification.metadata.location}</p>
      )}
      {notification.type === 'alert' && notification.metadata.device && (
        <p>Device: {notification.metadata.device} • {notification.metadata.location}</p>
      )}
      {notification.type === 'system' && notification.metadata.version && (
        <p>Version: {notification.metadata.version} • Downtime: {notification.metadata.downtime}</p>
      )}
      {notification.type === 'client' && notification.metadata.documentCount && (
        <p>Documents: {notification.metadata.documentCount} • Type: {notification.metadata.documentType}</p>
      )}
    </div>
  );
};
// components/NotificationItem.tsx
import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Notification } from '@/lib/types/notifications';
import { NotificationIcon } from './NotificationIcon';
import { NotificationMetadata } from './NotificationMetadata';
import { formatTimeAgo, getPriorityColorClasses } from '@/lib/util/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-xl ${
        notification.read
          ? 'bg-white border-gray-300 hover:border-gray-400'
          : 'bg-white border-gray-400 hover:border-black shadow-lg'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 mt-1 p-2 rounded-full ${getPriorityColorClasses(notification.priority)}`}>
          <NotificationIcon type={notification.type} priority={notification.priority} />
        </div>
        
        {/* Avatar (for client notifications) */}
        {notification.avatar && (
          <div className="flex-shrink-0">
            <img
              src={notification.avatar}
              alt="Avatar"
              className="h-8 w-8 rounded-full border border-gray-400"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                {notification.title}
                {!notification.read && (
                  <span className="w-2 h-2 bg-black rounded-full"></span>
                )}
                {notification.actionRequired && (
                  <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full font-medium">
                    Action Required
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {notification.message}
              </p>
              
              {/* Metadata */}
              <NotificationMetadata notification={notification} />
              
              <p className="text-xs text-gray-500 mt-2">
                {formatTimeAgo(notification.timestamp)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-300 rounded-md transition-colors border border-transparent hover:border-gray-400"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-300 rounded-md transition-colors border border-transparent hover:border-gray-400"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
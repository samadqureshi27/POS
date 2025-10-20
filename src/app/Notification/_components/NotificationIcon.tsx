// components/NotificationIcon.tsx
import React from 'react';
import { Bell, User, DollarSign, Calendar, AlertCircle, Info } from 'lucide-react';
import { Notification } from '@/lib/types/notifications';
import { getIconColorClasses } from '@/lib/util/notifications';

interface NotificationIconProps {
  type: Notification['type'];
  priority: Notification['priority'];
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ type, priority }) => {
  const iconClass = `h-5 w-5 ${getIconColorClasses(priority)}`;
  
  switch (type) {
    case 'client':
      return <User className={iconClass} />;
    case 'payment':
      return <DollarSign className={iconClass} />;
    case 'appointment':
      return <Calendar className={iconClass} />;
    case 'alert':
      return <AlertCircle className={iconClass} />;
    case 'system':
      return <Info className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};
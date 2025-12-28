// pages/NotificationsPage.tsx
"use client";

import React, { useState } from "react";
import { FilterType } from "@/lib/types/notifications";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { filterNotifications, getUnreadCount } from "@/lib/util/notifications";
import { NotificationFilters } from "./_components/NotificationFilters";
import { NotificationItem } from "./_components/NotificationItem";
import { LoadingSkeleton } from "./_components/LoadingSkeleton";
import { EmptyState } from "./_components/EmptyState";

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNotifications = filterNotifications(notifications, filter, searchQuery);
  const unreadCount = getUnreadCount(notifications);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-semibold flex items-center gap-2 text-black">
              Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="px-4 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed rounded-sm text-sm font-medium transition-colors"
            >
              Mark all as read
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <NotificationFilters
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <EmptyState />
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-black text-black rounded-sm text-sm font-medium transition-colors">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
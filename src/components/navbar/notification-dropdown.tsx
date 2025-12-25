'use client';

import React from 'react';
import Link from 'next/link';
import { BellIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Notification {
    id: number;
    title: string;
    message: string;
    timestamp: Date | string;
    read: boolean;
}

interface NotificationDropdownProps {
    notifications: Notification[];
    notificationsLoading: boolean;
    showNotifications: boolean;
    setShowNotifications: (show: boolean) => void;
    toggleNotifications: () => void;
    handleNotificationClick: (id: number) => void;
    formatTimeAgo: (date: Date | string) => string;
    navItemClass: string;
}

export function NotificationDropdown({
    notifications,
    notificationsLoading,
    showNotifications,
    setShowNotifications,
    toggleNotifications,
    handleNotificationClick,
    formatTimeAgo,
    navItemClass
}: NotificationDropdownProps) {
    return (
        <div className="relative h-full">
            <button
                onClick={toggleNotifications}
                className={cn(navItemClass, "relative h-full rounded-none border-none outline-none", showNotifications && "bg-[#2E2E2E]")}
            >
                <BellIcon className="h-8 w-8" strokeWidth={1} />
                {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-5 right-3 bg-red-500 rounded-full h-2 w-2 ring-2 ring-[#1F1E1F]" />
                )}
            </button>

            {showNotifications && (
                <>
                    <div
                        className="fixed inset-0 z-[55] cursor-default"
                        onClick={() => setShowNotifications(false)}
                        aria-hidden="true"
                    />
                    <div
                        className="fixed top-[64px] right-0 left-auto w-72 bg-[#2E2E2E] text-white shadow-2xl z-[100] outline-none animate-in fade-in-0 transition-standard border-none"
                    >
                        <div className="p-5 border-b border-[#464646] flex justify-between items-center">
                            <h3 className="font-semibold text-base">Notifications</h3>
                            <Link href="/Notification" className="text-xs text-[#D4AF37] hover:underline" onClick={() => setShowNotifications(false)}>View all</Link>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto hide-scrollbar">
                            {notificationsLoading ? (
                                <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">No new notifications</div>
                            ) : (
                                notifications.slice(0, 5).map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => {
                                            handleNotificationClick(notification.id);
                                            setShowNotifications(false);
                                        }}
                                        className={cn(
                                            "p-4 border-b border-[#464646]/50 cursor-pointer hover:bg-[#363636] transition-all transition-standard flex gap-3",
                                            !notification.read ? "bg-[#363636]/50" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                                            !notification.read ? "bg-red-500" : "bg-gray-600"
                                        )} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-200 mb-0.5">{notification.title}</p>
                                            <p className="text-xs text-gray-400 line-clamp-2">{notification.message}</p>
                                            <p className="text-[10px] text-gray-500 mt-1.5 text-right">{formatTimeAgo(notification.timestamp)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

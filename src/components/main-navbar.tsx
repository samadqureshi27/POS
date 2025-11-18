// Enhanced MainNavbar.tsx with detailed action icons and consistent notification logic
'use client';

import Link from 'next/link';
import { Bell, Info, LogOut, Settings, HelpCircle, Mail, UserCircle2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { getPageTitle } from '@/lib/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type NavbarProps = {
  title?: string; // defaults to "Home"
};

// Helper to generate initials from username or email
const getInitials = (username?: string, email?: string): string => {
  if (username && username.length >= 2) {
    const parts = username.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return "U";
};

export default function Navbar({ title = 'Home' }: NavbarProps) {
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);
  const [showNotificationsOverlay, setShowNotificationsOverlay] = useState(false);
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const notificationsOverlayRef = useRef<HTMLDivElement>(null);
  const infoOverlayRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();
  const { pathname } = useNavigation();
  const pageTitle = getPageTitle(pathname);
  const { user, logout } = useAuth();

  // Generate user display data
  const userData = {
    name: user?.username || "Guest User",
    email: user?.email || "guest@pos.com",
    role: user?.role || "guest",
    initials: getInitials(user?.username, user?.email)
  };

  // ✅ Notifications are now stateful
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New client added', message: 'John Doe has been added to your client list', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment received', message: 'Payment of $500 received from ABC Corp', time: '1 hour ago', unread: true },
    { id: 3, title: 'Appointment reminder', message: 'Meeting with Jane Smith at 3 PM today', time: '2 hours ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close overlays when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setShowLogoutOverlay(false);
      }
      if (notificationsOverlayRef.current && !notificationsOverlayRef.current.contains(event.target as Node)) {
        setShowNotificationsOverlay(false);
        setNotifications([]); // clear when closed
      }
      if (infoOverlayRef.current && !infoOverlayRef.current.contains(event.target as Node)) {
        setShowInfoOverlay(false);
      }
    }

    if (showLogoutOverlay || showNotificationsOverlay || showInfoOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutOverlay, showNotificationsOverlay, showInfoOverlay]);

  // Close overlays on Escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowLogoutOverlay(false);
        if (showNotificationsOverlay) {
          setShowNotificationsOverlay(false);
          setNotifications([]); // clear when closed
        }
        setShowInfoOverlay(false);
      }
    }

    if (showLogoutOverlay || showNotificationsOverlay || showInfoOverlay) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showLogoutOverlay, showNotificationsOverlay, showInfoOverlay]);

  const handleProfileClick = () => {
    setShowNotificationsOverlay(false);
    setShowInfoOverlay(false);
    setShowLogoutOverlay(true);
  };

  const handleNotificationsClick = () => {
    setShowLogoutOverlay(false);
    setShowInfoOverlay(false);
    setShowNotificationsOverlay(true);
  };

  const handleInfoClick = () => {
    setShowLogoutOverlay(false);
    setShowNotificationsOverlay(false);
    setShowInfoOverlay(true);
  };

  const handleLogout = async () => {
    setShowLogoutOverlay(false);
    await logout();
    router.push('/login');
  };

  return (
    <>
      {/* Main navbar */}
      <header className="fixed top-0 z-50 w-full h-18">
        <nav className="bg-[#161616] text-white w-full h-full">
          <div className="w-full px-3 h-full">
            <div className="flex h-full items-center justify-between">
              {/* Left: logo + brand */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <img src="/logos/TTT-logo.png" alt="TTT Logo" className="h-9 w-auto" />
              </div>

              {/* Center: page title */}
              <div className="hidden md:flex flex-1 text-center px-4 min-w-0 justify-center">
                <h1 className="text-sm font-medium text-gray-200 truncate">{pageTitle}</h1>
              </div>

              {/* Right: action icons */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="hidden md:flex items-center gap-1 sm:gap-2">
                  {/* Notifications button with badge */}
                  <div className="relative">
                    <IconButton 
                      ariaLabel="Notifications" 
                      onClick={handleNotificationsClick}
                      ref={notificationsButtonRef}
                    >
                      <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                    </IconButton>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Info/Help button */}
                  <IconButton 
                    ariaLabel="Help & Info" 
                    onClick={handleInfoClick}
                    ref={infoButtonRef}
                  >
                    <Info className="h-5 w-5 sm:h-6 sm:w-6" />
                  </IconButton>
                </div>

                {/* Profile button */}
                <button
                  aria-label="Profile"
                  onClick={handleProfileClick}
                  ref={profileButtonRef}
                  className="inline-flex items-center justify-center hover:bg-yellow-600/10 transition-colors duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                >
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-yellow-500/30">
                    <AvatarFallback className="bg-yellow-500 text-gray-900 font-bold text-sm">
                      {userData.initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Notifications overlay */}
      {showNotificationsOverlay && (
        <div
          ref={notificationsOverlayRef}
          className="fixed top-16 right-3 sm:right-6 mid:right-8 w-80 bg-[#1a1a1a] border border-gray-700 rounded-md shadow-xl z-[9999]"
          style={{ transform: 'translateY(8px)' }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <span className="text-xs text-gray-400">{notifications.length} total</span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-sm">No new notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-md border transition-colors duration-150 cursor-pointer ${
                      notification.unread
                        ? 'bg-blue-900/20 border-blue-700/30 hover:bg-blue-900/30'
                        : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              {/* 🔗 Linked to Notifications page */}
              <Link 
                href="/Notification"
                className="w-full block text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Info/Help overlay */}
      {showInfoOverlay && (
        <div
          ref={infoOverlayRef}
          className="fixed top-16 right-3 sm:right-6 mid:right-8 w-64 bg-[#1a1a1a] border border-gray-700 rounded-md shadow-xl z-[9999]"
          style={{ transform: 'translateY(8px)' }}
        >
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Help & Support
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150">
              <Mail className="h-4 w-4" />
              Contact Support
            </button>
            
            <div className="border-t border-gray-700 mt-2 pt-2">
              <div className="px-3 py-2 text-xs text-gray-400">
                Version 1.2.0
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout overlay */}
      {showLogoutOverlay && (
        <div
          ref={overlayRef}
          className="fixed top-16 right-3 sm:right-6 mid:right-8 w-64 bg-[#1a1a1a] border border-gray-700 rounded-md shadow-xl z-[9999]"
          style={{ transform: 'translateY(8px)' }}
        >
          <div className="p-3">
            {/* User Info Section */}
            <div className="px-3 py-3 border-b border-gray-700 mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-yellow-500/30">
                  <AvatarFallback className="bg-yellow-500 text-gray-900 font-bold">
                    {userData.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Menu Options */}
            <Link
              href="/Profile"
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150"
            >
              <UserCircle2 className="h-4 w-4" />
              Profile Settings
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* Helper component */
const IconButton = React.forwardRef<HTMLButtonElement, {
  children: React.ReactNode;
  ariaLabel: string;
  asLink?: boolean;
  href?: string;
  onClick?: () => void;
}>(
  ({ children, ariaLabel, asLink, href, onClick }, ref) => {
    const classes =
      'inline-flex items-center justify-center p-2 text-yellow-500 hover:bg-yellow-600/10 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/20';

    if (asLink && href) {
      return (
        <Link href={href} aria-label={ariaLabel} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <button type="button" aria-label={ariaLabel} className={classes} onClick={onClick} ref={ref}>
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";
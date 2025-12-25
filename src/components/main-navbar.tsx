// Enhanced MainNavbar.tsx with real API data
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from "@/lib/utils";

// Modular components
import { PlanDropdown } from './navbar/plan-dropdown';
import { NotificationDropdown } from './navbar/notification-dropdown';
import { LanguageDropdown } from './navbar/language-dropdown';
import { ProfileDropdown } from './navbar/profile-dropdown';
import { MobileDrawer } from './navbar/mobile-drawer';

type NavbarProps = {
  title?: string;
};

export default function Navbar({ title }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { pageTitle: autoPageTitle } = useNavigation();

  // Use real notifications hook
  const {
    notifications,
    loading: notificationsLoading,
    markAsRead,
  } = useNotifications();

  // Use provided title prop, fallback to auto-detected page title
  const pageTitle = title || autoPageTitle;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleNotificationClick = (notificationId: number) => {
    markAsRead(notificationId);
    router.push('/Notification');
  };

  const formatTimeAgo = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return dateObj.toLocaleDateString();
  };

  // Plan selection state (mock for now as per requirement)
  const [selectedPlan, setSelectedPlan] = useState("Business Plan");

  // State for Notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Common styles for full-height hover items
  const navItemClass = "h-full flex items-center px-4 hover:bg-[#2E2E2E] transition-all transition-standard focus:outline-none text-[#D4AF37]";

  return (
    <header className="fixed top-0 z-[500] w-full h-[64px]">
      <nav className="bg-[#1F1E1F] text-white w-full h-full shadow-md">
        <div className="w-full h-full flex items-center justify-between pl-0 pr-0">

          {/* Mobile Header: Logo + Hamburger */}
          <div className="flex lg:hidden items-center justify-between h-full w-full pr-4">
            <Link href="/dashboard" className="flex items-center h-full mr-4 ml-4">
              <Image src="/logos/TTT-logo.png" alt="TTT Logo" width={32} height={32} className="h-8 w-auto" />
            </Link>

            <div className="flex-1" />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 focus:outline-none relative w-10 h-10 flex items-center justify-center mr-[-8px]"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-white rounded-full transition-all transition-standard origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`w-full h-0.5 bg-white rounded-full transition-all transition-standard ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-white rounded-full transition-all transition-standard origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>

          {/* Desktop Left: Logo & Plan Dropdown */}
          <div className="hidden lg:flex h-full flex-shrink-0">
            <div className="w-16 h-full flex items-center justify-center">
              <Link href="/dashboard" className="flex items-center justify-center">
                <Image src="/logos/TTT-logo.png" alt="TTT Logo" width={32} height={32} className="h-8 w-auto" />
              </Link>
            </div>

            <PlanDropdown user={user} navItemClass={navItemClass} />
          </div>

          {/* Desktop Center: Title (Optional) */}
          <div className="hidden lg:flex flex-1 items-center px-8">
            {/* <h1 className="text-xl font-medium text-[#D4AF37]">{pageTitle}</h1> */}
          </div>

          {/* Desktop Right: Icons */}
          <div className="hidden lg:flex items-center h-full flex-shrink-0 mr-8">
            <NotificationDropdown
              notifications={notifications}
              notificationsLoading={notificationsLoading}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              toggleNotifications={toggleNotifications}
              handleNotificationClick={handleNotificationClick}
              formatTimeAgo={formatTimeAgo}
              navItemClass={navItemClass}
            />

            <Link
              href="https://api.tritechtechnologyllc.com/api/docs"
              target="_blank"
              className={cn(navItemClass, "h-full rounded-none")}
              aria-label="API Documentation"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16V12" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 8H12.01" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>

            <LanguageDropdown
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              navItemClass={navItemClass}
            />

            <ProfileDropdown
              user={user}
              handleLogout={handleLogout}
              navItemClass={navItemClass}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Side Drawer */}
      <MobileDrawer
        user={user}
        selectedPlan={selectedPlan}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isLanguageExpanded={isLanguageExpanded}
        setIsLanguageExpanded={setIsLanguageExpanded}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        handleLogout={handleLogout}
      />
    </header>
  );
}

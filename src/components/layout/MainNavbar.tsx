// Fixed MainNavbar.tsx with proper overlay positioning
'use client';

import Link from 'next/link';
import { Bell, Info, UserCircle2, LogOut } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type NavbarProps = {
  title?: string; // defaults to "Home"
};

export default function Navbar({ title = 'Home' }: NavbarProps) {
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Close overlay when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setShowLogoutOverlay(false);
      }
    }

    if (showLogoutOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutOverlay]);

  // Close overlay on Escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowLogoutOverlay(false);
      }
    }

    if (showLogoutOverlay) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showLogoutOverlay]);

  const handleProfileClick = () => {
    setShowLogoutOverlay(true);
  };

  const handleLogout = () => {
    setShowLogoutOverlay(false);
    router.push('/login');
  };

  return (
    <>
      {/* Main navbar */}
      <header className="fixed top-0 z-50 w-full h-16">
        <nav className="bg-[#161616] text-white w-full h-full">
          <div className="w-full px-3 sm:px-6 lg:px-8 h-full">
            <div className="flex h-full items-center justify-between">
              {/* Left: logo + brand */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <img src="/Logos/TTT-logo.png" alt="TTT Logo" className="h-9 w-auto" />
                  <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-gray-300 whitespace-nowrap">
                    TTT PLUG
                  </span>
                </div>
              </div>

              {/* Center: page title */}
              <div className="hidden md:flex flex-1 text-center px-4 min-w-0 justify-center">
                <h1 className="text-sm font-medium text-gray-200 truncate">{title}</h1>
              </div>

              {/* Right: action icons */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="hidden md:flex items-center gap-1 sm:gap-2">
                  <IconButton ariaLabel="Notifications">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                  </IconButton>
                  <IconButton ariaLabel="Info">
                    <Info className="h-5 w-5 sm:h-6 sm:w-6" />
                  </IconButton>
                </div>
                
                {/* Profile button */}
                <IconButton 
                  ariaLabel="Profile" 
                  onClick={handleProfileClick}
                  ref={profileButtonRef}
                >
                  <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </IconButton>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Logout overlay - rendered as a portal-like element outside the navbar */}
      {showLogoutOverlay && (
        <div 
          ref={overlayRef}
          className="fixed top-16 right-3 sm:right-6 lg:right-8 w-48 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-[9999] animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            // Ensure it's positioned correctly relative to the profile button
            transform: 'translateY(8px)'
          }}
        >
          <div className="p-2">
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
function IconButton({
  children,
  ariaLabel,
  asLink,
  href,
  onClick,
  ref,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  asLink?: boolean;
  href?: string;
  onClick?: () => void;
  ref?: React.RefObject<HTMLButtonElement>;
}) {
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
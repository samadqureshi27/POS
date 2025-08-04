'use client';

import Link from 'next/link';
import { Bell, Info, UserCircle2 } from 'lucide-react';
import React from 'react';

type NavbarProps = {
  title?: string; // defaults to "Home"
};

export default function Navbar({ title = 'Home' }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40">
      {/* thin top strip */}
      {/* <div className="h-2 bg-[#4a2a2a]" /> */}

      <nav className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-8xl px-3 sm:px-4">
          <div className="flex h-12 items-center">
            {/* Left: logo + brand */}
            <div className="flex items-center gap-2">
              <LogoMark className="h-5 w-5 text-yellow-500" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-gray-300">
                TTT PLUG
              </span>
            </div>

            {/* Center: page title */}
            <div className="flex-1 text-center">
              <h1 className="text-sm font-medium text-gray-200">{title}</h1>
            </div>

            {/* Right: action icons */}
            <div className="flex items-center gap-2">
              <IconButton ariaLabel="Notifications">
                <Bell className="h-4 w-4" />
              </IconButton>
              <IconButton ariaLabel="Info">
                <Info className="h-4 w-4" />
              </IconButton>
              <IconButton ariaLabel="Profile" asLink href="/profile">
                <UserCircle2 className="h-4 w-4" />                                                                    
              </IconButton>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ------------ helpers ------------ */

function IconButton({
  children,
  ariaLabel,
  asLink,
  href,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  asLink?: boolean;
  href?: string;
}) {
  const classes =
    'inline-flex items-center justify-center rounded-full border border-yellow-600/70 p-1 text-yellow-500 hover:bg-yellow-600/10 transition';
  if (asLink && href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={ariaLabel} className={classes}>
      {children}
    </button>
  );
}

function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* simple emblem */}
      <path d="M12 3l7 4-7 4-7-4 7-4z" />
      <path d="M12 11v10" />
      <path d="M5 9v8l7 4 7-4V9" />
    </svg>
  );
}
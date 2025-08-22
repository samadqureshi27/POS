// src/app/(pos)/layout.tsx - NEW VERSION
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import POSSubmenu from '@/components/layout/submenus/POSSubmenu';

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Only show POS submenu for direct POS pages, not for nested management pages
  const showPOSSubmenu = pathname === '/pos-list' || pathname === '/pos';
  
  return (
    <>
      {showPOSSubmenu && <POSSubmenu />}
      {children}
    </>
  );
}
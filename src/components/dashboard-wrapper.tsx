// Fixed DashboardWrapper.tsx
'use client';

import React from 'react';
import Navbar from './main-navbar';
import Sidebar from './Sidebar';
import { useNavigation } from '@/lib/hooks/useNavigation';

type DashboardWrapperProps = {
  children: React.ReactNode;
  hasSubmenu?: boolean; // 🔴 NEW: Add this prop to indicate if page has submenu
};

export default function DashboardWrapper({ children, hasSubmenu = false }: DashboardWrapperProps) {
  const { pageTitle } = useNavigation();

  return (
    // 🔴 CHANGED: Added min-h-screen and bg-gray-50
    <div className="min-h-screen bg-gray-50">
      <Navbar title={pageTitle} />
      <Sidebar />
      
      {/* Main content area with proper spacing */}
      {/* 🔴 CHANGED: Complete className overhaul */}
      <main className={`
        md:ml-16 
        ${hasSubmenu ? 'pt-28' : 'pt-16'}
        pb-20 md:pb-4
        min-h-screen
        overflow-y-auto
      `}>
        {/* 🔴 CHANGED: Added wrapper div */}
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
// Fixed DashboardWrapper.tsx
'use client';

import React from 'react';
import Navbar from './main-navbar';
import Sidebar from './Sidebar';
import { useNavigation } from '@/lib/hooks/useNavigation';

type DashboardWrapperProps = {
  children: React.ReactNode;
  hasSubmenu?: boolean;
};

export default function DashboardWrapper({ children, hasSubmenu = false }: DashboardWrapperProps) {
  const { pageTitle } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <Navbar title={pageTitle} />
      <Sidebar />

      {/* Main content area with proper spacing */}
      {/* Adjusted pt-16 (64px) and pt-[128px] (64px navbar + 64px submenu) */}
      <main className={`
        lg:ml-16 
        ${hasSubmenu ? 'pt-[128px]' : 'pt-16'}
        pb-20 lg:pb-4
        min-h-screen
        overflow-y-auto
      `}>
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
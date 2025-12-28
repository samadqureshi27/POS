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
    <div className="bg-[#F7F7F8] overflow-x-hidden max-w-full">
      <Navbar title={pageTitle} />
      <Sidebar />

      {/* Main content area with proper spacing */}
      {/* Adjusted pt-16 (64px) and pt-[128px] (64px navbar + 64px submenu) */}
      <main className={`
        lg:ml-16 
        ${hasSubmenu ? 'pt-[128px]' : 'pt-16'}
        pb-20 lg:pb-4
        overflow-x-hidden
        min-w-0 max-w-full
      `}>
        <div className="w-full min-w-0 max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
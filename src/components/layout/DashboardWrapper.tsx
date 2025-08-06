'use client';

import React from 'react';
import Navbar from './MainNavbar';
import Sidebar from './Sidebar';

import { useNavigation } from '../../lib/hooks/useNavigation'; 

type DashboardWrapperProps = {
  children: React.ReactNode;
};

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const { pageTitle } = useNavigation();
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Main Navbar - Always visible */}
      <Navbar title={pageTitle} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Always visible */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1"> {/* ml-12 to account for sidebar width */}
          {children}
        </div>
      </div>
    </div>
  );
}
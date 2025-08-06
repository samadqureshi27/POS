'use client';

import React from 'react';
import Navbar from './MainNavbar';
import Sidebar from './Sidebar';

type DashboardWrapperProps = {
  children: React.ReactNode;
};

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navbar - Always visible */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar - Always visible */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 ml-12"> {/* ml-12 to account for sidebar width */}
          {children}
        </div>
      </div>
    </div>
  );
}
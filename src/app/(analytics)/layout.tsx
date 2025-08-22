import React from 'react';
import AnalyticsSubmenu from '@/components/layout/submenus/AnalyticsSubmenu';

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnalyticsSubmenu />
      <main className="p-6">
        {children}
      </main>
    </>
  );
}
import React from 'react';
import StaffSubmenu from '../../../components/layout/submenus/StaffSubmenu';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StaffSubmenu />
      <main className="p-6">
        {children}
      </main>
    </>
  );
}
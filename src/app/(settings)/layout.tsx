import React from 'react';
import SettingsSubmenu from '@/components/layout/submenus/SettingsSubmenu';


export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SettingsSubmenu />
      <main className="">
        {children}
      </main>
    </>
  );
}
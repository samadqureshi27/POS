import React from 'react';
import MenuSubmenu from '@/components/layout/submenus/MenuSubmenu';


export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MenuSubmenu />
      <main className="p-6">
        {children}
      </main>
    </>
  );
}

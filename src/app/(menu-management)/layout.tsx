import React from 'react';
import MenuSubmenu from '@/components/submenus/menu-submenu';


export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MenuSubmenu />
      <main>
        {children}
      </main>
    </>
  );
}

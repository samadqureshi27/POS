import React from 'react';
import RecipesSubmenu from '@/components/layout/submenus/recipes-submenu';


export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RecipesSubmenu />
      <main className="p-6">
        {children}
      </main>
    </>
  );
}
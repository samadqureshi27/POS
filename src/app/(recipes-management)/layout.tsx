import React from 'react';
import RecipesSubmenu from '@/components/submenus/recipes-submenu';


export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RecipesSubmenu />
      <main>
        {children}
      </main>
    </>
  );
}
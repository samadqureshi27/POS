import React from 'react';
// import DashboardWrapper from '../../../components/layout/DashboardWrapper';
import InventorySubmenu from '../../../../components/layout/submenus/InventorySubmenu';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <InventorySubmenu />
      <main className="p-6">
        {children}
      </main>
    </>
  );
}
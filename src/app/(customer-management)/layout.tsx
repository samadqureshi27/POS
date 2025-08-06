import React from 'react';
import CustomerMgmtSubmenu from '../../components/layout/submenus/CustomerMgmtSubmenu';


export default function CustomerMgmtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomerMgmtSubmenu />
      <main className="p-6">
        {children}
      </main>
    </>
  );
}
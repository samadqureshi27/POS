import React from 'react';


export default function CustomerMgmtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>
        {children}
      </main>
    </>
  );
}
import React from 'react';

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="p-6">
        {children}
      </main>
    </>
  );
}
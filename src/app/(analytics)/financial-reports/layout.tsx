import React from 'react';

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="">
        {children}
      </main>
    </>
  );
}
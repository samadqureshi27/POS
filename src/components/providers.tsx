'use client';

import React from 'react';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalLayoutWrapper } from '@/components/conditional-layout-wrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <ConditionalLayoutWrapper>
          {children}
        </ConditionalLayoutWrapper>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

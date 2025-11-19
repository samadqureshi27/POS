import type { Metadata } from "next";
import "./globals.css";
import DashboardWrapper from "@/components/dashboard-wrapper";
import { ConditionalLayoutWrapper } from '@/components/conditional-layout-wrapper';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/hooks/useAuth";

export const metadata: Metadata = {
  title: "POS Management System",
  description: "Restaurant Point of Sale Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
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
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
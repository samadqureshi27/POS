'use client'

import { usePathname } from 'next/navigation'
import DashboardWrapper from './dashboard-wrapper'

export function ConditionalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Define auth routes that should NOT show navbar/sidebar
  const authRoutes = [
    '/login',
    '/forgot-password', 
    '/reset-password',
    '/verify-password',
    '/signup',
    '/register'
  ]
  
  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route))
  
  if (isAuthRoute) {
    // Auth pages - clean layout without navbar/sidebar
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }
  
  // All other pages - with navbar/sidebar
  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  )
}
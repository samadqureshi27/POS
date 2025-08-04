'use client'
import { usePathname } from 'next/navigation'
import MainNavbar from '../MainNavbar'
import  Sidebar  from '../Sidebar'

interface DashboardWrapperProps {
  children: React.ReactNode
  showSubmenu?: boolean
}

export default function DashboardWrapper({ 
  children, 
  showSubmenu = false 
}: DashboardWrapperProps) {
  const pathname = usePathname()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

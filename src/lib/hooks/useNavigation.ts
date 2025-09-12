// lib/hooks/useNavigation.ts
'use client'
import { usePathname } from 'next/navigation'
import { findNavigationItem, getPageTitle } from '@/lib/navigation'

export function useNavigation() {
  const pathname = usePathname()
  
  const currentPage = findNavigationItem(pathname)
  const pageTitle = getPageTitle(pathname)
  
  return {
    pathname,
    pageTitle,
    currentPage
  }
}
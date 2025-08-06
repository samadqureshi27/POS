// lib/navigation.ts
export interface NavigationItem {
  name: string
  href: string
  icon?: string
  children?: NavigationItem[]
  group?: string
}

// Define your navigation structure
export const navigationConfig: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    group: 'main'
  },
  {
    name: 'Restaurant Management',
    href: '/restaurant-management',
    group: 'main'
  },
  {
    name: 'Order Management',
    href: '/order-management',
    group: 'main'
  },
  {
    name: 'Branches Management',
    href: '/branches-management',
    group: 'main'
  },
  {
    name: 'Customer Profile',
    href: '/customer-profile',
    group: 'main'
  },
  {
    name: 'POS',
    href: '/pos-list',
    group: 'pos',
    children: [
      {
        name: 'Staff Management',
        href: '/staff-management',
        children: [
          { name: 'Staff Management', href: '/staff-management' },
          { name: 'Payroll', href: '/payroll' },
          { name: 'Employee Records', href: '/employee-records' }
        ]
      },
      {
        name: 'Menu Management',
        href: '/menu-management',
        children: [
          { name: 'Menu Management', href: '/menu-management' },
          { name: 'Options', href: '/options' },
          { name: 'Category', href: '/category' }
        ]
      },
      {
        name: 'Inventory Management',
        href: '/inventory-management',
        children: [
          { name: 'Inventory Management', href: '/inventory-management' },
          { name: 'Vendors', href: '/vendors' },
          { name: 'Reports', href: '/reports' }
        ]
      },
      {
        name: 'Recipes Management',
        href: '/recipes-management',
        children: [
          { name: 'Recipes Management', href: '/recipes-management' },
          { name: 'Options', href: '/options' },
          { name: 'Ingredients', href: '/ingredients' }
        ]
      }
    ]
  },
  {
    name: 'Analytics',
    href: '/analytics',
    group: 'analytics',
    children: [
      { name: 'Analytics', href: '/analytics' },
      { name: 'Financial Report', href: '/financial-report' },
      { name: 'Customer Analytics', href: '/customer-analytics' },
      { name: 'Customer Reports', href: '/customer-reports' }
    ]
  },
  {
    name: 'Customer Management',
    href: '/customer-management',
    group: 'customer-management',
    children: [
      { name: 'Customer Management', href: '/customer-management' },
      { name: 'Customer Details', href: '/customer-details' },
      { name: 'Loyalty Details', href: '/loyalty-details' }
    ]
  }
]

// Utility functions for working with paths
export function findNavigationItem(path: string): NavigationItem | null {
  function searchInItems(items: NavigationItem[]): NavigationItem | null {
    for (const item of items) {
      if (item.href === path) {
        return item
      }
      if (item.children) {
        const found = searchInItems(item.children)
        if (found) return found
      }
    }
    return null
  }
  
  return searchInItems(navigationConfig)
}

export function getPageTitle(path: string): string {
  const item = findNavigationItem(path)
  return item?.name || 'Page'
}

export function getBreadcrumbs(path: string): NavigationItem[] {
  const breadcrumbs: NavigationItem[] = []
  
  function searchInItems(items: NavigationItem[], currentBreadcrumbs: NavigationItem[]): boolean {
    for (const item of items) {
      const newBreadcrumbs = [...currentBreadcrumbs, item]
      
      if (item.href === path) {
        breadcrumbs.push(...newBreadcrumbs)
        return true
      }
      
      if (item.children && searchInItems(item.children, newBreadcrumbs)) {
        return true
      }
    }
    return false
  }
  
  searchInItems(navigationConfig, [])
  return breadcrumbs
}

export function getRouteGroup(path: string): string | null {
  const item = findNavigationItem(path)
  return item?.group || null
}

export function isActivePath(currentPath: string, itemPath: string): boolean {
  return currentPath === itemPath || currentPath.startsWith(itemPath + '/')
}

export function getParentNavigation(path: string): NavigationItem | null {
  function searchInItems(items: NavigationItem[]): NavigationItem | null {
    for (const item of items) {
      if (item.children) {
        for (const child of item.children) {
          if (child.href === path || (child.children && child.children.some(c => c.href === path))) {
            return item
          }
        }
        const found = searchInItems(item.children)
        if (found) return found
      }
    }
    return null
  }
  
  return searchInItems(navigationConfig)
}
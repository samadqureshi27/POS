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
    name: 'POS List',
    href: '/pos-list',
    group: 'pos'
  },
  {
    name: 'Staff Management',
    href: '/staff-management',
    group: 'pos'
  },
  {
    name: 'Payroll',
    href: '/payroll',
    group: 'pos'
  },
  {
    name: 'Employee Records',
    href: '/employee-records',
    group: 'pos'
  },
  {
    name: 'Menu Management',
    href: '/menu-management',
    group: 'pos'
  },
  {
    name: 'Options',
    href: '/options',
    group: 'pos'
  },
  {
    name: 'Category',
    href: '/category',
    group: 'pos'
  },
  {
    name: 'Inventory Management',
    href: '/inventory-management',
    group: 'pos'
  },
  {
    name: 'Vendors',
    href: '/vendors',
    group: 'pos'
  },
  {
    name: 'Reports',
    href: '/reports',
    group: 'pos'
  },
  {
    name: 'Recipes Management',
    href: '/recipes-management',
    group: 'pos'
  },
  {
    name: 'Ingredients',
    href: '/ingredients',
    group: 'pos'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    group: 'analytics'
  },
  {
    name: 'Financial Report',
    href: '/financial-report',
    group: 'analytics'
  },
  {
    name: 'Customer Analytics',
    href: '/customer-analytics',
    group: 'analytics'
  },
  {
    name: 'Customer Reports',
    href: '/customer-reports',
    group: 'analytics'
  },
  {
    name: 'Customer Management',
    href: '/customer-management',
    group: 'customer-management'
  },
  {
    name: 'Customer Details',
    href: '/customer-details',
    group: 'customer-management'
  },
  {
    name: 'Loyalty Details',
    href: '/loyalty-details',
    group: 'customer-management'
  },
  {
    name: 'General Settings',
    href: '/general-settings',
    group: 'settings'
  },
  {
    name: 'Payment Settings',
    href: '/payment',
    group: 'settings'
  },
  {
    name: 'Notification Settings',
    href: '/notification',
    group: 'settings'
  },
  {
    name: 'Billing & License',
    href: '/billing-license',
    group: 'settings'
  },
  {
    name:'Restaurant Management',
    href: '/restaurant-management',
    group: 'settings'
  },
  {
    name: 'Back Up',
    href: '/backup',
    group: 'settings'
  }
  
]

// Utility function to find navigation item by path
export function findNavigationItem(path: string): NavigationItem | null {
  return navigationConfig.find(item => item.href === path) || null
}

// Utility function to get page title
export function getPageTitle(path: string): string {
  const item = findNavigationItem(path)
  return item?.name || 'Home'
}
// -------------------------
// Types
// -------------------------
export interface NavigationItem {
  name: string
  href: string
  icon?: string
  children?: NavigationItem[]
  group?: string
  dynamic?: boolean // ✅ mark if it's a dynamic route
}

// -------------------------
// Navigation Config
// -------------------------
export const navigationConfig: NavigationItem[] = [
  // --- MAIN ---
  {
    name: "Dashboard",
    href: "/dashboard",
    group: "main",
  },
  {
    name: "Restaurant Management",
    href: "/restaurant-management",
    group: "settings",
  },
  {
    name: "Order Management",
    href: "/order-management",
    group: "order",
  },
  {
    name: "Branches Management",
    href: "/branches-management",
    group: "branch",
    children: [
      {
        name: "POS",
        href: "/branch/[branchId]/pos",
        group: "branch",
        dynamic: true,
      },
      {
        name: "Inventory",
        href: "/branch/[branchId]/inventory",
        group: "branch",
        dynamic: true,
        children: [
          {
            name: "Vendors",
            href: "/branch/[branchId]/inventory/vendors",
            group: "branch",
            dynamic: true,
          },
          {
            name: "Reports",
            href: "/branch/[branchId]/inventory/reports",
            group: "branch",
            dynamic: true,
          },
        ],
      },
      {
        name: "Staff",
        href: "/branch/[branchId]/staff",
        group: "branch",
        dynamic: true,
        children: [
          {
            name: "Payroll",
            href: "/branch/[branchId]/staff/payroll",
            group: "branch",
            dynamic: true,
          },
        ],
      },
    ],
  },

  {
    name: "Menu Management",
    href: "/menu-management",
    group: "menu",
  },
  {
    name: "Options",
    href: "/options",
    group: "menu"
  }
  ,
  {
    name: "Category",
    href: "/category",
    group: "menu",
  },

  {
    name: "Recipes Management",
    href: "/recipes-management",
    group: "recipes",
  },
  {
    name: "Ingredients",
    href: "/ingredients",
    group: "recipes",
  },
  {
    name: "Financial Report",
    href: "/financial-reports",
    group:"analytics"
  },


  // --- CUSTOMER MANAGEMENT ---
  {
    name: "Customer Management",
    href: "/customer-details",
    group: "customer-management",
  },
  {
    name: "Customer Details",
    href: "/customer-details/[customer-profile]", // ✅ dynamic
    group: "customer-management",
    dynamic: true,
  },

  // --- SETTINGS ---
  {
    name: "General Settings",
    href: "/general-settings",
    group: "settings",
  },
  {
    name: "Payment Settings",
    href: "/payment",
    group: "settings",
  },
  {
    name: "Notification Settings",
    href: "/notification",
    group: "settings",
  },
  {
    name: "Billing & License",
    href: "/billing-license",
    group: "settings",
  },
  {
    name: "Restaurant Management",
    href: "/restaurant-management",
    group: "settings",
  },
  {
    name: "Backup Settings",
    href: "/backup",
    group: "settings",
  },

  // --- RECIPES & MENU ---
  {
    name: "Recipes Options",
    href: "/recipes-options",
    group: "recipes",
  },
  {
    name: "Menu Options",
    href: "/menu-options",
    group: "menu",
  },
]

// -------------------------
// util Functions
// -------------------------

// Match route with dynamic segments like /branch/[branchId]/pos
function matchDynamicRoute(pattern: string, path: string): boolean {
  const regex = new RegExp("^" + pattern.replace(/\[.*?\]/g, "[^/]+") + "$")
  return regex.test(path)
}

// Recursive search through items & children
function searchItems(items: NavigationItem[], path: string): NavigationItem | null {
  for (const item of items) {
    // dynamic match
    if (item.dynamic && matchDynamicRoute(item.href, path)) {
      return item
    }
    // exact match
    if (item.href === path) {
      return item
    }
    // check children recursively
    if (item.children) {
      const found = searchItems(item.children, path)
      if (found) return found
    }
  }
  return null
}

// Public: find navigation item
export function findNavigationItem(path: string): NavigationItem | null {
  return searchItems(navigationConfig, path)
}

// Public: get page title
export function getPageTitle(path: string): string {
  const item = findNavigationItem(path)
  return item?.name || "Home"
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingCart,
  User,
  Building2,
  ChefHat,
  Settings,
  DollarSign,
  Package2,
  AlignJustify,
} from 'lucide-react';
import { navigationConfig, findNavigationItem, type NavigationItem } from '@/lib/navigation';
import { group } from 'console';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: <Home className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Home',
      link: '/dashboard',
      group: 'main'
    },
    {
      icon: <ChefHat className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Menu Management',
      link: '/menu-management',
      group: 'menu' // This will match menu-related routes
    },
    {
      icon: <Package2 className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Recipe Management',
      link: '/recipes-management',
      group: 'recipes'
    },
    {
      icon: <Building2 className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Branch Management',
      link: '/branches-management',
      group: 'branch'
    },
    {
      icon: <DollarSign className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Financial Reports',
      link: '/financial-reports',
      group:'analytics'
    },
    {
      icon: <User className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Customer Management',
      link: '/customer-details',
      group: 'customer-management'
    },
    {
      icon: <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Order Management',
      link: '/order-management',
      group: 'order'
    },
    {
      icon: <Settings className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Settings',
      link: '/general-settings',
      group: 'settings'
    },
  ];

  // Function to check if current path should make this menu item active
  const isItemActive = (item: any) => {
    // Debug logging
    console.log('Checking item:', item.label, 'with group:', item.group);
    console.log('Current pathname:', pathname);

    // First check if current path matches exactly
    if (pathname === item.link) {
      console.log('Exact match found for:', item.label);
      return true;
    }

    // Find the current navigation item from your config
    const currentNavItem = findNavigationItem(pathname);
    console.log('Current nav item found:', currentNavItem);

    if (!currentNavItem) {
      console.log('No navigation item found for path:', pathname);
      return false;
    }

    // Special handling for different groups
    
    if (item.group === 'pos') {
      return currentNavItem.group === 'pos';
    }
    if (item.group === 'analytics') {
      return currentNavItem.group === 'analytics';
    }
    if (item.group === 'menu') {
      return currentNavItem.group === 'menu';
    }

    if (item.group === 'recipes') {
      return currentNavItem.group === 'recipes';
    }
    if (item.group === 'customer-management') {
      return currentNavItem.group === 'customer-management';
    }

    if (item.group === 'settings') {
      return currentNavItem.group === 'settings';
    }

    if (item.group === 'main') {
      return currentNavItem.group === 'main';
    }

    if (item.group === 'branch') {
      return currentNavItem.group === 'branch';
    }

    return false;
  };

  return (
    <>
      {/* Desktop Sidebar - Left side, vertical */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen bg-[#D1AB35] w-18 z-30">
        {/* Menu Items */}
        <nav className="h-full flex flex-col justify-center items-center gap-1 p-4">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className={`group relative flex items-center justify-center p-1 rounded hover:bg-[#454545] transition-all ${isItemActive(item) ? 'bg-[#454545]' : ''
                }`}
            >
              <span className={`transition ${isItemActive(item)
                ? 'text-white'
                : 'text-black group-hover:text-white'
                }`}>
                {item.icon}
              </span>

              {/* Desktop Tooltip */}
              <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs text-[#454545] shadow-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition z-50">
                {item.label}
              </span>

              {/* Desktop Tooltip arrow */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 h-0 w-0 border-y-4 border-y-transparent border-r-4 border-r-white opacity-0 group-hover:opacity-100 transition z-50"
              />
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar - Bottom of screen, horizontal */}
      <aside className="md:hidden fixed bottom-0 left-0 right-0 bg-[#D1AB35] h-16 z-50 border-t border-black/10">
        <div className="h-full overflow-x-auto">
          <nav className="h-full flex flex-row items-center gap-2 px-2" style={{ minWidth: 'max-content' }}>
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className={`flex items-center justify-center p-2 rounded hover:bg-[#2e2e2e] transition min-w-12 h-12 flex-shrink-0 ${isItemActive(item) ? 'bg-[#2e2e2e]' : ''
                  }`}
              >
                <span className={`transition ${isItemActive(item)
                  ? 'text-white'
                  : 'text-black hover:text-white'
                  }`}>
                  {item.icon}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
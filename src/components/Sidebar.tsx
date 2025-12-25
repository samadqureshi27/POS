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
  Package,
} from 'lucide-react';
import { CustomTooltip } from './ui/custom-tooltip';
import { findNavigationItem } from '@/lib/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: <Home className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Home',
      href: '/dashboard',
      group: 'main'
    },
    {
      icon: <Package className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Items',
      href: '/items',
      group: 'items'
    },
    {
      icon: <Package2 className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Recipe Management',
      href: '/recipes-management',
      group: 'recipes'
    },
    {
      icon: <ChefHat className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Menu Management',
      href: '/menu-items',
      group: 'menu'
    },
    {
      icon: <Building2 className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Branch Management',
      href: '/branches-management',
      group: 'branch'
    },
    {
      icon: <DollarSign className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Financial Reports',
      href: '/financial-reports',
      group: 'analytics'
    },
    {
      icon: <User className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Customer Management',
      href: '/customer-details',
      group: 'customer-management'
    },
    {
      icon: <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Order Management',
      href: '/order-management',
      group: 'order'
    },
    {
      icon: <Settings className="h-6 w-6 md:h-7 md:w-7 stroke-[1]" />,
      label: 'Settings',
      href: '/general-settings',
      group: 'settings'
    },
  ];

  // Function to check if current path should make this menu item active
  const isItemActive = (item: any) => {
    const activeItem = findNavigationItem(pathname);
    if (!activeItem) return pathname === item.href;

    // Special case for dashboard
    if (item.href === '/dashboard' || item.href === '/') {
      return pathname === '/dashboard' || pathname === '/';
    }

    // Match by href or group
    return pathname === item.href || activeItem.group === item.group;
  };

  return (
    <>
      {/* Desktop Sidebar - Left side, vertical */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen bg-[#D1AB35] w-16 z-30">
        {/* Menu Items */}
        <nav className="h-full flex flex-col justify-center items-center gap-1 p-4">
          {menuItems.map((item, idx) => (
            <CustomTooltip key={idx} label={item.label} direction="right">
              <Link
                href={item.href}
                className={`relative flex items-center justify-center p-2.5 rounded hover:bg-[#454545] transition-all transition-standard ${isItemActive(item) ? 'bg-[#454545]' : ''
                  }`}
              >
                <span className={`transition-colors transition-standard ${isItemActive(item)
                  ? 'text-white'
                  : 'text-black group-hover:text-white'
                  }`}>
                  {item.icon}
                </span>
              </Link>
            </CustomTooltip>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar - Bottom of screen, horizontal */}
      <aside className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#D1AB35] h-16 z-50 border-t border-black/10">
        <div className="h-full overflow-x-auto hide-scrollbar">
          <nav className="h-full flex flex-row items-center gap-2 px-2" style={{ minWidth: 'max-content' }}>
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`group flex items-center justify-center p-2 rounded hover:bg-[#454545] transition-all transition-standard min-w-12 h-12 flex-shrink-0 ${isItemActive(item) ? 'bg-[#454545]' : ''
                  }`}
              >
                <span className={`transition-colors transition-standard ${isItemActive(item)
                  ? 'text-white'
                  : 'text-black group-hover:text-white'
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

// Fixed Sidebar.tsx
// Fixed Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  ShoppingCart,
  User,
  Building2,
  Building2,
  ChefHat,
  Settings,
  DollarSign,
  Package2,
  AlignJustify,
  DollarSign,
  Package2,
  AlignJustify,
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: <Home className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />, label: 'Home', link: '/' },
    { icon: <ChefHat className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />, label: 'Menu Management', link: '/menu-management' },
    { icon: <Package2 className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />, label: 'Recipes Management', link: '/recipes-management' },
    { icon: <AlignJustify className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />, label: 'POS Management', link: '/pos-list' },
    { icon: <DollarSign className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />, label: 'Financial Reports', link: '/financial-reports' },
    { icon: <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />, label: 'Orders Management', link: '/order-management' },
    { icon: <User className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />, label: 'Customer Management', link: '/customer-details' },
    { icon: <Building2 className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />, label: 'Branches Management', link: '/branches-management' },
    { icon: <Settings className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />, label: 'Settings', link: '/general-settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar - Left side, vertical */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen bg-[#D1AB35] w-16 z-30">
        {/* Menu Items */}
        <nav className="h-full flex flex-col justify-center items-center gap-1 p-4">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="group relative flex items-center justify-center p-1 rounded hover:bg-[#2e2e2e] transition"
            >
              <span className="text-black group-hover:text-white transition">
                {item.icon}
              </span>
    <>
      {/* Desktop Sidebar - Left side, vertical */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen bg-[#D1AB35] w-16 z-30">
        {/* Menu Items */}
        <nav className="h-full flex flex-col justify-center items-center gap-1 p-4">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="group relative flex items-center justify-center p-1 rounded hover:bg-[#2e2e2e] transition"
            >
              <span className="text-black group-hover:text-white transition">
                {item.icon}
              </span>

              {/* Desktop Tooltip */}
              {/* 🔴 CHANGED: Added z-50 */}
              <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs text-[#454545] shadow-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition z-50">
                {item.label}
              </span>
              {/* Desktop Tooltip */}
              {/* 🔴 CHANGED: Added z-50 */}
              <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs text-[#454545] shadow-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition z-50">
                {item.label}
              </span>

              {/* Desktop Tooltip arrow */}
              {/* 🔴 CHANGED: Added z-50 */}
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
          {/* 🔴 CHANGED: Added style minWidth and removed min-w-max class */}
          <nav className="h-full flex flex-row items-center gap-2 px-2" style={{ minWidth: 'max-content' }}>
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                // 🔴 CHANGED: Added flex-shrink-0
                className="flex items-center justify-center p-2 rounded hover:bg-[#2e2e2e] transition min-w-12 h-12 flex-shrink-0"
              >
                <span className="text-black hover:text-white transition">
                  {item.icon}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
              {/* Desktop Tooltip arrow */}
              {/* 🔴 CHANGED: Added z-50 */}
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
          {/* 🔴 CHANGED: Added style minWidth and removed min-w-max class */}
          <nav className="h-full flex flex-row items-center gap-2 px-2" style={{ minWidth: 'max-content' }}>
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                // 🔴 CHANGED: Added flex-shrink-0
                className="flex items-center justify-center p-2 rounded hover:bg-[#2e2e2e] transition min-w-12 h-12 flex-shrink-0"
              >
                <span className="text-black hover:text-white transition">
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

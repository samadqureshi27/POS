'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Users,
  Menu,
  ShoppingCart,
  User,
  ClipboardList,
  Pencil,
  IdCard,
  ChefHat,
  Settings,
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: <Home className="h-6 w-6" />, label: 'Home', link: '/' },
    { icon: <Users className="h-6 w-6" />, label: 'Customers', link: '/customers' },
    { icon: <Menu className="h-6 w-6" />, label: 'Menu', link: '/menu' },
    { icon: <ShoppingCart className="h-6 w-6" />, label: 'Orders', link: '/orders' },
    { icon: <User className="h-6 w-6" />, label: 'Profile', link: '/profile' },
    { icon: <ClipboardList className="h-6 w-6" />, label: 'Inventory', link: '/inventory' },
    { icon: <Pencil className="h-6 w-6" />, label: 'Edit', link: '/edit' },
    { icon: <IdCard className="h-6 w-6" />, label: 'Staff', link: '/staff' },
    { icon: <ChefHat className="h-6 w-6" />, label: 'Kitchen', link: '/kitchen' },
    { icon: <Settings className="h-6 w-6" />, label: 'Settings', link: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-12 bg-[#CCAB4D] flex flex-col items-center justify-center ">
      
      {/* Menu Icons with hover tooltips */}
      <nav className="justify-center flex-1 flex flex-col gap-2">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            className="group relative flex items-center justify-center p-1 rounded hover:bg-black/20 transition"
          >
            <span className="text-black">{item.icon}</span>

            {/* Tooltip */}
            <span
              className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs text-[#454545] shadow-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition"
            >
              {item.label}
            </span>
            {/* Tooltip arrow */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 h-0 w-0 border-y-4 border-y-transparent border-r-4 border-r-white opacity-0 group-hover:opacity-100 transition"
            />
          </Link>
        ))}
      </nav>
    </aside>
  );
}

/** Logo SVG */
function LogoMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 4-7 4-7-4 7-4z" />
      <path d="M12 11v10" />
      <path d="M5 9v8l7 4 7-4V9" />
    </svg>
  );
}

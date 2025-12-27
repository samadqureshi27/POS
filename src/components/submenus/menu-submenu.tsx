'use client';

import React from 'react';
import { ChefHat } from 'lucide-react';
import BaseSubmenu from '../base-submenu';

export default function MenuSubmenu() {
  const items = [
    { label: 'Menu Management', href: '/menu-items' },
    { label: 'Category', href: '/categories' },
    { label: 'Options', href: '/menu-options', hasNewBadge: true }, // Example: badge on Options
  ];

  // Pass contextIcon to show icon in left section (64px wide)
  return <BaseSubmenu items={items} contextIcon={<ChefHat size={28} strokeWidth={1} />} />;
}
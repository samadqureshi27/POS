'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function POSSubmenu() {
  const items = [
    // { label: 'POS List', href: '/pos-list' },
    { label: 'Inventory Management', href: '/inventory-management' },
    { label: 'Staff Management', href: '/staff-management' },
    // { label: 'Menu Management', href: '/menu-management' },
    // { label: 'Recipes Management', href: '/recipes-management' },
  ];

  return <BaseSubmenu items={items} />;
}
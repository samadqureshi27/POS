'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function InventorySubmenu() {
  const items = [
    { label: 'Inventory', href: '/inventory-management' },
    { label: 'Report', href: '/reports' },
    { label: 'Vendors', href: '/vendors' },
  ];

  return <BaseSubmenu items={items} />;
}
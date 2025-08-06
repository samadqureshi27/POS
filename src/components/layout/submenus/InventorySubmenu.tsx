'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function InventorySubmenu() {
  const items = [
    { label: 'Inventory', href: '/inventory-management' },
    { label: 'Vendors', href: '/vendors' },
    { label: 'Report', href: '/reports' },
  ];

  return <BaseSubmenu items={items} />;
}
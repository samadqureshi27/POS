'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function POSSubmenu() {
  const items = [
    { label: 'Inventory Management', href: '/inventory-management' },
    { label: 'Staff Management', href: '/employee-records' },
  ];

  return <BaseSubmenu items={items} />;
}
'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function CustomerMgmtSubmenu() {
  const items = [
    { label: 'Customer Details', href: '/customer-details' },
    { label: 'Loyalty Details', href: '/loyalty-details' },
  ];

  return <BaseSubmenu items={items} />;
}
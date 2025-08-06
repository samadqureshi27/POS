'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function MenuSubmenu() {
  const items = [
    { label: 'Menu Management', href: '/menu-management' },
    { label: 'Options', href: '/options' },
    { label: 'Category', href: '/category' },
  ];

  return <BaseSubmenu items={items} />;
}
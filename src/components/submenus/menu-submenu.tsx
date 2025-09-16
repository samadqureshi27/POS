'use client';

import React from 'react';
import BaseSubmenu from '../base-submenu';

export default function MenuSubmenu() {
  const items = [
    { label: 'Menu Management', href: '/menu-management' },
    { label: 'Category', href: '/category' },
    { label: 'Options', href: '/menu-options' },
  ];

  return <BaseSubmenu items={items} />;
}
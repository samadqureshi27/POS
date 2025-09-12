'use client';

import React from 'react';
import BaseSubmenu from '../base-submenu';

export default function SettingsSubmenu() {
  const items = [
    { label: 'General', href: '/general-settings' },
    { label: 'Restaurant Profile', href: '/restaurant-management' },
    { label: 'Payment', href: '/payment' },
    { label: 'Notification', href: '/notification' },
    { label: 'Backup', href: '/backup' },
    { label: 'Billing & license', href: '/billing-license' },
  ];

  return <BaseSubmenu items={items} />;
}
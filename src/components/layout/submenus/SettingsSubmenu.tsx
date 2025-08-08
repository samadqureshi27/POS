'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function SettingsSubmenu() {
  const items = [
    { label: 'General', href: '/general-settings' },
    { label: 'Payment', href: '/payment' },
    { label: 'Notification', href: '/notification' },
    { label: 'Backup', href: '/backup' },
    { label: 'Billing & license', href: '/billing-license' },
    { label: 'Restaurant', href: '/restaurant-management' },
  ];

  return <BaseSubmenu items={items} />;
}
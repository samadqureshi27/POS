'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import BaseSubmenu from '../base-submenu';

export default function SettingsSubmenu() {
  const items = [
    { label: 'General', href: '/general-settings' },
    { label: 'Restaurant Profile', href: '/restaurant-management' },
    { label: 'Payment', href: '/payment', hasNewBadge: true }, // Example: badge on Payment
    { label: 'Notification', href: '/notification' },
    { label: 'Backup', href: '/backup' },
    { label: 'Billing & license', href: '/billing-license' },
  ];

  // Pass contextIcon to show icon in left section (64px wide)
  return <BaseSubmenu items={items} contextIcon={<Settings size={28} strokeWidth={1} />} />;
}
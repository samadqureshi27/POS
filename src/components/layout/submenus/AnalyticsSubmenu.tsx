'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function AnalyticsSubmenu() {
  const items = [
    { label: 'Financial Report', href: '/financial-report' },
    { label: 'Customer Analytics', href: '/customer-analytics' },
    { label: 'Customer Reports', href: '/customer-reports' },
  ];

  return <BaseSubmenu items={items} />;
}
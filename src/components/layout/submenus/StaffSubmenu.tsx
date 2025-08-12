'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function StaffSubmenu() {
  const items = [
    { label: 'Employee Records', href: '/employee-records' },
    { label: 'Payroll', href: '/payroll' },
  ];

  return <BaseSubmenu items={items} />;
}
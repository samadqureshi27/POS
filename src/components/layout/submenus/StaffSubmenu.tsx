'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function StaffSubmenu() {
  const items = [
    { label: 'Staff Management', href: '/staff-management' },
    { label: 'Payroll', href: '/payroll' },
    { label: 'Employee Records', href: '/employee-records' },
  ];

  return <BaseSubmenu items={items} />;
}
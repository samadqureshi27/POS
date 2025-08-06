'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function RecipesSubmenu() {
  const items = [
    { label: 'Recipes Management', href: '/recipes-management' },
    { label: 'Options', href: '/options' },
    { label: 'Ingredients', href: '/ingredients' },
  ];

  return <BaseSubmenu items={items} />;
}
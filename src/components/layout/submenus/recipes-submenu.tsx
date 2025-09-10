'use client';

import React from 'react';
import BaseSubmenu from '../BaseSubmenu';

export default function RecipesSubmenu() {
  const items = [
    { label: 'Recipes Management', href: '/recipes-management' },
    { label: 'Ingredients', href: '/ingredients' },
    { label: 'Options', href: '/recipes-options' },
  ];

  return <BaseSubmenu items={items} />;
}
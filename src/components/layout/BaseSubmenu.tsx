'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SubmenuItem = {
  label: string;
  href: string;
  isActive?: boolean;
};

type BaseSubmenuProps = {
  items: SubmenuItem[];
};

export default function BaseSubmenu({ items }: BaseSubmenuProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 z-60 bg-[#2E2E2E] shadow-md">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <nav className="flex gap-2 px-10 py-3 min-w-max ml-8">
          {items.map((item, idx) => {
            const isActive = pathname === item.href || item.isActive;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F6F6F6] text-gray-800 shadow-sm'
                    : 'bg-[#454545] text-[#f6f6f6] hover:bg-[#161616]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
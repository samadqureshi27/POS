'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type SubmenuItem = {
  label: string;
  href: string;
  isActive?: boolean;
};

type BaseSubmenuProps = {
  items: SubmenuItem[];
  showBackArrow?: boolean;
};

export default function BaseSubmenu({ items, showBackArrow = false }: BaseSubmenuProps) {
  const pathname = usePathname();

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-[50] overflow-x-auto w-full bg-[#2E2E2E] shadow-md">
      <div className={`w-full px-3 sm:px-6 ${showBackArrow ? 'lg:px-4' : 'lg:px-22.5'}`}>
        <div className="flex items-center">
          {showBackArrow && (
            <ArrowLeft 
              size={20} 
              className="text-white mb-1 cursor-pointer hidden md:block mr-7" 
              onClick={handleBack}
            />
          )}
          <nav className={`flex gap-5 py-3 ${showBackArrow ? 'md:ml-4' : ''}`}>
            {items.map((item, idx) => {
              const isActive = pathname === item.href || item.isActive;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`border-[0.1rem] border-[#83838a] px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
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
    </div>
  );
}
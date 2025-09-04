'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type SubmenuItem = {
  label: string;
  href: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuItem[];
};

type BaseSubmenuProps = {
  items: SubmenuItem[];
  showBackArrow?: boolean;
};

export default function BaseSubmenu({ items, showBackArrow = false }: BaseSubmenuProps) {
  const pathname = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  // Check if current path belongs to any submenu and auto-expand
  useEffect(() => {
    for (const item of items) {
      if (item.hasSubmenu && item.submenuItems) {
        const isInSubmenu = item.submenuItems.some(subItem => pathname === subItem.href);
        if (isInSubmenu) {
          setActiveSubmenu(item.label);
          return;
        }
      }
    }
    // If not in any submenu, collapse
    setActiveSubmenu(null);
  }, [pathname, items]);

  const handleBack = () => {
    window.history.back();
  };

  const handleParentClick = (e: React.MouseEvent, item: SubmenuItem) => {
    e.preventDefault();
    if (item.hasSubmenu) {
      // Toggle submenu for items that have submenus
      setActiveSubmenu(activeSubmenu === item.label ? null : item.label);
    }
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
          <nav className={`flex flex-wrap items-baseline py-3 ${showBackArrow ? 'md:ml-4' : ''}`}>
            {items.map((item, idx) => {
              const isActive = pathname === item.href || item.isActive;
              const isParentActive = activeSubmenu === item.label;
              
              return (
                <div key={idx} className="flex items-baseline mr-5">
                  {item.hasSubmenu ? (
                    <>
                      <Link
                        href={item.href}
                        onClick={(e) => handleParentClick(e, item)}
                        className={`border-[0.1rem] border-[#83838a] px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                          isActive || isParentActive
                            ? 'bg-[#F6F6F6] text-gray-800 shadow-sm'
                            : 'bg-[#454545] text-[#f6f6f6] hover:bg-[#161616]'
                        }`}
                      >
                        {item.label}
                      </Link>
                      
                      {/* Submenu items rendered inline after their parent */}
                      {isParentActive && item.submenuItems && (
                        <div className="flex items-baseline ml-3">
                          {item.submenuItems.map((subItem, subIndex) => {
                            const isSubActive = pathname === subItem.href || subItem.isActive;
                            return (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                onClick={() => setActiveSubmenu(null)}
                                className={`border-[0.1rem] border-[#83838a] px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ml-3 animate-fadeIn ${
                                  isSubActive
                                    ? 'bg-[#F6F6F6] text-gray-800 shadow-sm'
                                    : 'bg-[#454545] text-[#f6f6f6] hover:bg-[#161616]'
                                }`}
                                style={{
                                  animationDelay: `${subIndex * 100}ms`
                                }}
                              >
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setActiveSubmenu(null)}
                      className={`border-[0.1rem] border-[#83838a] px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[#F6F6F6] text-gray-800 shadow-sm'
                          : 'bg-[#454545] text-[#f6f6f6] hover:bg-[#161616]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
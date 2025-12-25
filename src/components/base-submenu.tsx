'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { NewBadge } from './ui/new-badge';

type SubmenuItem = {
  label: string;
  href: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuItem[];
  hasNewBadge?: boolean;
};

type BaseSubmenuProps = {
  items: SubmenuItem[];
  showBackArrow?: boolean;
  backPath?: string;
  contextIcon?: React.ReactNode;
};

export default function BaseSubmenu({
  items,
  showBackArrow = false,
  backPath = '/branches-management/',
  contextIcon
}: BaseSubmenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  // Check if current path belongs to any submenu and auto-expand
  useEffect(() => {
    for (const item of items) {
      if (item.hasSubmenu && item.submenuItems) {
        const isParentPath = pathname === item.href;
        const isInSubmenu = item.submenuItems.some(subItem => pathname === subItem.href);

        if (isParentPath || isInSubmenu) {
          if (activeSubmenu !== item.label) {
            setActiveSubmenu(item.label);
          }
          return;
        }
      }
    }
    if (activeSubmenu !== null) {
      setActiveSubmenu(null);
    }
  }, [pathname, items, activeSubmenu]);

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="fixed top-[64px] left-0 right-0 z-[40] w-full h-16 bg-[#2E2E2E] shadow-md flex items-center">
      {/* Left Icon Section (64px wide to match sidebar) - Hidden on mobile */}
      <div className="hidden md:flex w-16 h-full items-center justify-center">
        {showBackArrow ? (
          <button
            onClick={handleBack}
            className="text-white cursor-pointer flex items-center justify-center hover:text-gray-300 transition-all duration-400 ease-in-out hover:scale-110 active:scale-95 transform"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
        ) : (
          contextIcon && (
            <div className="text-white flex items-center justify-center">
              {contextIcon}
            </div>
          )
        )}
      </div>

      <div className="flex-1 h-full overflow-hidden">
        <nav className="h-full flex items-center px-4 md:px-6 overflow-x-auto scrollbar-hide gap-4">
          {items.map((item, idx) => {
            let isActive = false;
            if (item.hasSubmenu && item.submenuItems) {
              isActive = pathname === item.href;
            } else {
              isActive = pathname === item.href || (item.isActive ?? false);
            }

            const isParentActive = activeSubmenu === item.label;
            const hasActiveSubmenu = item.hasSubmenu && isParentActive;

            return (
              <div key={idx} className="flex items-center flex-shrink-0 h-full">
                {/* Left separator - shows only when this item has an active submenu */}
                {hasActiveSubmenu && (
                  <div className="h-8 w-px bg-[#464646] mr-4 animate-in fade-in duration-400" />
                )}

                <div className="flex items-center h-full gap-4">
                  <div className="relative h-full flex items-center">
                    <Link
                      href={item.hasSubmenu && item.submenuItems ? item.submenuItems[0].href : item.href}
                      className={`
                        border border-[#83838a] px-6 h-12 flex items-center rounded text-base font-manrope
                        transition-all duration-400 ease-in-out whitespace-nowrap
                        ${isActive
                          ? 'bg-[#F6F6F6] text-black shadow-lg border-gray-300'
                          : 'bg-[#454545] text-[#f6f6f6] hover:bg-[#2E2E2E] hover:border-[#83838a]'
                        }
                      `}
                    >
                      {item.label}
                    </Link>

                    {/* NEW Badge at bottom border */}
                    {item.hasNewBadge && (
                      <NewBadge className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20" />
                    )}
                  </div>

                  {/* Submenu items */}
                  {item.submenuItems && (
                    <div
                      className={`
                        overflow-hidden transition-all duration-400 ease-in-out h-full
                        ${isParentActive
                          ? 'max-w-[800px] opacity-100 translate-x-0'
                          : 'max-w-0 opacity-0 -translate-x-5'
                        }
                      `}
                    >
                      <div className={`flex items-center h-full px-1 gap-5 ${isParentActive ? 'animate-in slide-in-from-left-3 fade-in duration-400' : ''}`}>
                        {item.submenuItems.slice(1).map((subItem, subIndex) => {
                          const isSubActive = pathname === subItem.href || (subItem.isActive ?? false);
                          return (
                            <div key={subIndex} className="relative h-full flex items-center">
                              <Link
                                href={subItem.href}
                                className={`
                                  border border-[#83838a] px-8 h-[44px] flex items-center rounded text-base font-light font-manrope
                                  transition-all duration-400 ease-in-out whitespace-nowrap
                                  animate-in fade-in zoom-in-95 flex-shrink-0
                                  ${isSubActive
                                    ? 'bg-[#F6F6F6] text-gray-800 shadow-lg border-gray-300'
                                    : 'bg-[#454545] text-[#f6f6f6] hover:bg-[#2E2E2E] hover:border-[#a0a0a0]'
                                  }
                                `}
                                style={{
                                  animationDelay: `${subIndex * 50}ms`,
                                  animationFillMode: 'both'
                                }}
                              >
                                {subItem.label}
                              </Link>

                              {/* NEW Badge for subitem */}
                              {subItem.hasNewBadge && (
                                <NewBadge className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-100" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right separator - shows only when this item has an active submenu */}
                {hasActiveSubmenu && (
                  <div className="h-8 w-px bg-[#464646] ml-5 animate-in fade-in duration-400 mr-5" />
                )}

                {/* Regular spacing between menu items when no submenu is active */}
                {!hasActiveSubmenu && idx < items.length - 1 && (
                  <div className="w-4" />
                )}
              </div>
            );
          })}
        </nav>
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

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
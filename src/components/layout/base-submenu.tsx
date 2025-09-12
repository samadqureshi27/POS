'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  backPath?: string;
};

export default function BaseSubmenu({ 
  items, 
  showBackArrow = false, 
  backPath ='/branches-management/'
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
    <div className="fixed top-16 left-0 right-0 z-[50] w-full bg-[#2E2E2E] shadow-md">
      <div className={`w-full px-2 sm:px-5 ${showBackArrow ? 'lg:px-4' : 'lg:px-22.5'}`}>
        <div className="flex items-center">
          {showBackArrow && (
            <button
              onClick={handleBack}
              className="text-white mb-1 cursor-pointer hidden md:flex mr-7 items-center justify-center hover:text-gray-300 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 transform"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <nav className={`flex items-center py-3 px-1 ${showBackArrow ? 'md:ml-4' : ''} overflow-x-auto scrollbar-hide`}>
            {items.map((item, idx) => {
              let isActive = false;
              if (item.hasSubmenu && item.submenuItems) {
                isActive = pathname === item.href;
              } else {
                isActive = pathname === item.href || item.isActive;
              }
              
              const isParentActive = activeSubmenu === item.label;
              const hasActiveSubmenu = item.hasSubmenu && isParentActive;
              
              return (
                <div key={idx} className="flex items-center flex-shrink-0">
                  {/* Left separator - shows only when this item has an active submenu */}
                  {hasActiveSubmenu && (
                    <div className="h-8 w-px bg-[#83838a] mr-3 animate-in fade-in duration-300" />
                  )}
                  
                  <div className="flex items-center">
                    <Link
                      href={item.hasSubmenu && item.submenuItems ? item.submenuItems[0].href : item.href}
                      className={`
                        border border-[#83838a] px-4 py-2 rounded text-sm font-medium 
                        transition-all duration-200 ease-in-out whitespace-nowrap
                        transform hover:scale-[1.02] active:scale-[0.98]
                        ${isActive
                          ? 'bg-[#F6F6F6] text-gray-800 shadow-lg border-gray-300'
                          : 'bg-[#454545] text-[#f6f6f6] hover:bg-[#161616] hover:border-[#a0a0a0] hover:shadow-md'
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                    
                    {/* Submenu items with Tailwind animations */}
                    {item.submenuItems && (
                      <div 
                        className={`
                          overflow-hidden transition-all duration-300 ease-in-out
                          ${isParentActive 
                            ? 'max-w-[800px] opacity-100 translate-x-0' 
                            : 'max-w-0 opacity-0 -translate-x-5'
                          }
                        `}
                      >
                        <div className={`flex items-center px-1  ${isParentActive ? 'animate-in slide-in-from-left-3 fade-in duration-300' : ''}`}>
                          {item.submenuItems.slice(1).map((subItem, subIndex) => {
                            const isSubActive = pathname === subItem.href || subItem.isActive;
                            return (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className={`
                                  border border-[#83838a] px-4 py-2 rounded text-sm font-medium 
                                  transition-all duration-200 ease-in-out whitespace-nowrap ml-3
                                  transform hover:scale-[1.02] active:scale-[0.98]
                                  animate-in fade-in zoom-in-95 flex-shrink-0
                                  ${isSubActive
                                    ? 'bg-[#F6F6F6] text-gray-800 shadow-lg border-gray-300'
                                    : 'bg-[#454545] text-[#f6f6f6] hover:bg-[#161616] hover:border-[#a0a0a0] hover:shadow-md'
                                  }
                                `}
                                style={{
                                  animationDelay: `${subIndex * 50}ms`,
                                  animationFillMode: 'both'
                                }}
                              >
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right separator - shows only when this item has an active submenu */}
                  {hasActiveSubmenu && (
                    <div className="h-8 w-px bg-[#83838a] ml-3 animate-in fade-in duration-300 mr-4" />
                  )}
                  
                  {/* Regular spacing between menu items when no submenu is active */}
                  {!hasActiveSubmenu && idx < items.length - 1 && (
                    <div className="mr-5" />
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
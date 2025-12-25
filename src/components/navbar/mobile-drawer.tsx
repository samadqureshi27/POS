'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, Home, Package, Package2, ChefHat, Building2, DollarSign, User, ShoppingCart, Settings } from 'lucide-react';
import { NewBadge } from '../ui/new-badge';

interface MobileDrawerProps {
    user: any;
    selectedPlan: string;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    isLanguageExpanded: boolean;
    setIsLanguageExpanded: (expanded: boolean) => void;
    selectedLanguage: string;
    setSelectedLanguage: (lang: string) => void;
    handleLogout: () => void;
}

export function MobileDrawer({
    user,
    selectedPlan,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isLanguageExpanded,
    setIsLanguageExpanded,
    selectedLanguage,
    setSelectedLanguage,
    handleLogout
}: MobileDrawerProps) {
    if (!isMobileMenuOpen) return null;

    // Define POS specific menu items here for the mobile drawer
    const menuItems = [
        { icon: <Home className="h-6 w-6 stroke-[1.5]" />, label: 'Home', href: '/dashboard' },
        { icon: <Package className="h-6 w-6 stroke-[1.5]" />, label: 'Items', href: '/items' },
        { icon: <Package2 className="h-6 w-6 stroke-[1.5]" />, label: 'Recipe Management', href: '/recipes-management' },
        { icon: <ChefHat className="h-6 w-6 stroke-[1.5]" />, label: 'Menu Management', href: '/menu-items' },
        { icon: <Building2 className="h-6 w-6 stroke-[1.5]" />, label: 'Branch Management', href: '/branches-management' },
        { icon: <DollarSign className="h-6 w-6 stroke-[1.5]" />, label: 'Financial Reports', href: '/financial-reports' },
        { icon: <User className="h-6 w-6 stroke-[1.5]" />, label: 'Customer Management', href: '/customer-details' },
        { icon: <ShoppingCart className="h-6 w-6 stroke-[1.5]" />, label: 'Order Management', href: '/order-management' },
        { icon: <Settings className="h-6 w-6 stroke-[1.5]" />, label: 'Settings', href: '/general-settings' },
    ];

    return (
        <div className="lg:hidden">
            {/* Invisible Backdrop to handle click-outside */}
            <div
                className="fixed inset-0 top-[64px] z-[500] bg-black/20 cursor-default"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div className="fixed top-[64px] right-0 sm:left-auto left-0 bottom-0 w-full sm:w-72 bg-[#1F1E1F] z-[501] shadow-2xl flex flex-col animate-in slide-in-from-right transition-standard">
                {/* User Info Section */}
                <div className="px-6 py-6 flex justify-between items-start">
                    <div>
                        <div className="text-[#D4AF37] text-sm mb-1">Hi,</div>
                        <div className="text-[#D4AF37] font-semibold text-xl leading-none">{user?.fullName || user?.username || "POS"}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[#D4AF37] text-sm mb-1">Plan:</div>
                        <div className="text-[#D4AF37] font-semibold text-xl leading-none">{selectedPlan.split(' ')[0] || "Business"}</div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto flex flex-col bg-[#2E2E2E]">
                    {/* Navigation Links */}
                    <div>
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center space-x-4 px-6 py-5 border-t border-[#464646] transition-all transition-standard group"
                            >
                                <div className="text-[#D4AF37]">
                                    {item.icon}
                                </div>
                                <span className="text-[#D4AF37] text-lg font-light">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Language Dropdown Section */}
                    <div>
                        {/* Language Title - Clickable to expand/collapse */}
                        <button
                            onClick={() => setIsLanguageExpanded(!isLanguageExpanded)}
                            className={`w-full flex items-center justify-between px-6 py-5 border-t border-[#464646] ${isLanguageExpanded ? 'bg-[#363636]' : ''}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="text-[#D4AF37]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                </div>
                                <span className="text-[#D4AF37] text-lg font-light">Language:</span>
                            </div>
                            {!isLanguageExpanded && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#464646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            )}
                        </button>

                        {/* Language Options - Shown when expanded */}
                        {isLanguageExpanded && (
                            <div className="bg-[#363636]">
                                {['English', 'Urdu'].map((language) => (
                                    <button
                                        key={language}
                                        onClick={() => setSelectedLanguage(language)}
                                        className="w-full flex items-center space-x-4 px-6 py-5 border-t border-[#464646] bg-[#363636] hover:bg-[#404040] transition-all transition-standard"
                                    >
                                        <div className="text-[#D4AF37]">
                                            {selectedLanguage === language ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-[#D4AF37] text-lg font-light">{language}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-4 px-6 py-5 border-t border-[#464646] transition-all transition-standard group"
                        >
                            <div className="text-[#D4AF37]">
                                <LogOut className="w-6 h-6 stroke-[1.5]" />
                            </div>
                            <span className="text-[#D4AF37] text-lg font-light">Log out</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

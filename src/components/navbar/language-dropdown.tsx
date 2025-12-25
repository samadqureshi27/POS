'use client';

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LanguageDropdownProps {
    selectedLanguage: string;
    setSelectedLanguage: (lang: string) => void;
    navItemClass: string;
}

export function LanguageDropdown({
    selectedLanguage,
    setSelectedLanguage,
    navItemClass
}: LanguageDropdownProps) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className={cn(navItemClass, "h-full rounded-none data-[state=open]:bg-[#2E2E2E]")}>
                <div className="h-8 w-8 rounded-full border border-[#D4AF37] flex items-center justify-center text-xs">
                    {selectedLanguage === 'English' ? 'En' : 'Ur'}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-72 bg-[#2E2E2E] border-none text-white rounded-none shadow-2xl p-0 mt-[0px] z-[100]"
                alignOffset={0}
                sideOffset={0}
            >
                <div className="p-5 border-b border-[#464646]">
                    <p className="text-base font-medium text-white">Language:</p>
                </div>

                <div className="py-1">
                    {['English', 'Urdu'].map((language) => (
                        <button
                            key={language}
                            onClick={() => setSelectedLanguage(language)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-[#363636] hover:text-white transition-all transition-standard text-left"
                        >
                            <div className="h-4 w-4 flex items-center justify-center">
                                {selectedLanguage === language ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                )}
                            </div>
                            {language}
                        </button>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

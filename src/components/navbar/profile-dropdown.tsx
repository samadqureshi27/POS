'use client';

import React from 'react';
import Link from 'next/link';
import { UserCircle2, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
    user: any;
    handleLogout: () => void;
    navItemClass: string;
}

export function ProfileDropdown({ user, handleLogout, navItemClass }: ProfileDropdownProps) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className={cn(navItemClass, "gap-2 pr-4 h-full data-[state=open]:bg-[#2E2E2E] rounded-none")}>
                <UserCircle2 className="h-8 w-8" strokeWidth={1} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-72 bg-[#2E2E2E] border-none text-white rounded-none shadow-2xl p-0 mt-[0px] z-[100]"
                alignOffset={0}
                sideOffset={0}
            >
                <div className="p-5 border-b border-[#464646]">
                    <p className="text-base font-medium text-white">{user?.fullName || user?.username || "Admin User"}</p>
                    <p className="text-sm text-gray-400 truncate">{user?.email || "admin@example.com"}</p>
                </div>

                <div className="py-1">
                    <Link href="/Profile" className="flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-[#363636] hover:text-white transition-all transition-standard">
                        <UserCircle2 className="h-4 w-4" />
                        My profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-[#363636] hover:text-white transition-all transition-standard text-left"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

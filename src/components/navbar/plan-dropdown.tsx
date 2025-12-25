'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PlanDropdownProps {
    user: any;
    navItemClass: string;
}

export function PlanDropdown({ user, navItemClass }: PlanDropdownProps) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className={cn(navItemClass, "gap-12 h-full border-none rounded-none px-6 data-[state=open]:bg-[#2E2E2E]")}>
                <div className="flex flex-col items-start gap-2">
                    <span className="text-sm text-[#D4AF37] leading-none">Hi,</span>
                    <span className="text-sm font-bold text-[#D4AF37] leading-none">{user?.fullName || user?.username || "Backoffice"}</span>
                </div>
                <div className="bg-[#2E2E2E] h-4 w-4 flex items-center justify-center rounded-full ml-2">
                    <ChevronDown className="h-4 w-4 text-white" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="w-[600px] bg-[#2E2E2E] border-none text-white rounded-none shadow-2xl p-0 mt-[0px] z-[100]"
                sideOffset={0}
            >
                <div className="p-5 border-b border-[#464646] bg-[#363636]">
                    <p className="text-sm text-gray-400">Plan: <span className="text-white font-bold">Business</span></p>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-[#4CAF50] font-medium mb-4">Available</h4>
                            <ul className="space-y-2 text-sm text-white list-disc list-outside ml-4 marker:text-white">
                                <li>Access to Yusufi</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[#FF5252] font-medium mb-4">Unavailable</h4>
                            <ul className="space-y-2 text-sm text-white list-disc list-outside ml-4 marker:text-white">
                                <li>Yusufi</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-[#464646]/50 bg-[#363636]">
                    <p className="text-sm text-white mb-2">Your plan is <span className="font-bold">Business (Trial)</span></p>
                    <p className="text-xs text-gray-400">
                        If you have a need for more functionality, contact us to find out more about our other plans.
                    </p>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CustomTooltipProps {
    label: string;
    direction?: 'top' | 'bottom' | 'left' | 'right';
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function CustomTooltip({
    label,
    direction = 'right',
    children,
    className,
    delay = 400
}: CustomTooltipProps) {
    const containerClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b',
        bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t',
        left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-l border-b',
        right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t'
    };

    const animationClasses = {
        top: 'group-hover:-translate-y-1',
        bottom: 'group-hover:translate-y-1',
        left: 'group-hover:-translate-x-1',
        right: 'group-hover:translate-x-1'
    };

    return (
        <div className={cn("group relative", className)}>
            {children}

            <div
                className={cn(
                    "pointer-events-none absolute opacity-0 transition-all z-50",
                    containerClasses[direction],
                    animationClasses[direction],
                    "group-hover:opacity-100"
                )}
            >
                <div className="relative bg-white border border-gray-200 rounded-sm px-5 py-2 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] whitespace-nowrap">
                    <span className="text-base font-medium text-black">{label}</span>

                    {/* Tooltip Arrow (Rotated Square) */}
                    <div
                        className={cn(
                            "absolute w-3 h-3 bg-white rotate-[-45deg] z-10",
                            arrowClasses[direction],
                            "border-gray-200"
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NewBadgeProps {
    className?: string;
}

export function NewBadge({ className }: NewBadgeProps) {
    return (
        <div className={cn(
            "bg-green-500 text-[8px] font-light text-white px-1.5 py-0 rounded-sm flex items-center justify-center shadow-md",
            className
        )}>
            NEW
        </div>
    );
}

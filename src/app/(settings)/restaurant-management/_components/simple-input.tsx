"use client";
// components/SimpleInput.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SimpleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    required?: boolean;
}

export const SimpleInput: React.FC<SimpleInputProps> = ({
    label,
    required = false,
    className,
    ...props
}) => (
    <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input
            {...props}
            className={cn("transition-all duration-200", className)}
        />
    </div>
);
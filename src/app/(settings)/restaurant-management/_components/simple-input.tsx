// components/SimpleInput.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SimpleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    required?: boolean;
}

export const SimpleInput: React.FC<SimpleInputProps> = ({
    label,
    required = false,
    ...props
}) => (
    <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
            {...props}
            className="px-4 py-3 rounded-lg transition-all duration-200"
        />
    </div>
);
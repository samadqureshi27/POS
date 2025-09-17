// components/SimpleTextarea.tsx
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SimpleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    required?: boolean;
}

export const SimpleTextarea: React.FC<SimpleTextareaProps> = ({
    label,
    required = false,
    ...props
}) => (
    <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Textarea
            {...props}
            className="px-4 py-3 rounded-lg transition-all duration-200 resize-none"
        />
    </div>
);
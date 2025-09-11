// components/SimpleTextarea.tsx
import React from 'react';

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
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
            {...props}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-all duration-200 resize-none"
        />
    </div>
);
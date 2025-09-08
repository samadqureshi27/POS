// components/SimpleInput.tsx
import React from 'react';

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
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            {...props}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-all duration-200"
        />
    </div>
);
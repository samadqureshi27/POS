// components/RestaurantDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface RestaurantDropdownProps {
    value: string;
    options: { value: string; label: string }[];
    onValueChange: (value: string) => void;
    placeholder: string;
}

export const RestaurantDropdown: React.FC<RestaurantDropdownProps> = ({
    value,
    options,
    onValueChange,
    placeholder,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent bg-white text-left flex items-center justify-between transition-all duration-200"
            >
                <span className={value ? "text-gray-900" : "text-gray-500"}>
                    {options.find((opt) => opt.value === value)?.label || placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto backdrop-blur-sm">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => {
                                onValueChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
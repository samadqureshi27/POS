// components/FilterDropdown.tsx
import React from 'react';
import { ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface FilterDropdownProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    getOptionClassName?: (option: string) => string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    value,
    options,
    onChange,
    getOptionClassName
}) => {
    return (
        <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                {value || label}
                <ChevronDown size={14} className="text-gray-500 ml-auto" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                    sideOffset={6}
                >
                    <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                    <DropdownMenu.Item
                        className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                        onClick={() => onChange("")}
                    >
                        {label}
                    </DropdownMenu.Item>
                    {options.map((option) => (
                        <DropdownMenu.Item
                            key={option}
                            className={`px-3 py-1 text-sm cursor-pointer rounded outline-none ${getOptionClassName ? getOptionClassName(option) : "hover:bg-gray-100 text-black"
                                }`}
                            onClick={() => onChange(option)}
                        >
                            {option}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
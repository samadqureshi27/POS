"use client";
// components/FilterDropdown.tsx
import React from 'react';
import { ChevronDown, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "./dropdown-menu";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    getOptionClassName?: (option: string) => string;
    placeholder?: string;
    className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    value,
    options,
    onChange,
    getOptionClassName,
    placeholder,
    className
}) => {
    const displayValue = value || placeholder || label;
    const hasValue = Boolean(value);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-2 lg:px-3",
                        className
                    )}
                >
                    <span className="truncate">{displayValue}</span>
                    {hasValue ? (
                        <X 
                            className="ml-2 h-4 w-4" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                        />
                    ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[200px]"
                align="start"
            >
                <DropdownMenuItem
                    onClick={() => onChange("")}
                    className={cn(
                        "cursor-pointer",
                        !hasValue && "bg-accent"
                    )}
                >
                    {label}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option}
                        className={cn(
                            "cursor-pointer",
                            value === option && "bg-accent",
                            getOptionClassName ? getOptionClassName(option) : ""
                        )}
                        onClick={() => onChange(option)}
                    >
                        {option}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
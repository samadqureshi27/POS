"use client";

import React, { useState, useEffect, useRef } from "react";
import { DropdownProps } from "@/lib/types/payroll";

// Simple Dropdown Component (replacing Radix UI)
export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, isOpen, onOpenChange }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                onOpenChange(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onOpenChange]);

    return (
        <>
            <div ref={triggerRef} onClick={() => onOpenChange(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="fixed z-50 min-w-[120px] rounded-sm bg-white shadow-lg border border-gray-200 p-1"
                    style={{ top: position.top + 5, left: position.left }}
                >
                    {children}
                </div>
            )}
        </>
    );
};
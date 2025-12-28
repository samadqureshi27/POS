'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface CustomTooltipProps {
    label: string;
    direction?: 'top' | 'bottom' | 'left' | 'right';
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function CustomTooltip({
    label,
    direction = 'right',
    children,
    className,
    delay = 400
}: CustomTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const calculatePosition = useCallback(() => {
        if (!triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const gap = 8;
        const rightGap = 20; // Increased gap for right direction to move tooltip further right
        const tooltipWidth = 200; // Approximate width, will be adjusted after render
        const tooltipHeight = 40; // Approximate height

        let top = 0;
        let left = 0;

        switch (direction) {
            case 'top':
                top = triggerRect.top - tooltipHeight - gap;
                left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom + gap;
                left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
                break;
            case 'left':
                top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
                left = triggerRect.left - tooltipWidth - gap;
                break;
            case 'right':
                top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
                left = triggerRect.right + rightGap;
                break;
        }

        // Keep tooltip within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left < 8) left = 8;
        if (left + tooltipWidth > viewportWidth - 8) {
            left = viewportWidth - tooltipWidth - 8;
        }
        if (top < 8) top = 8;
        if (top + tooltipHeight > viewportHeight - 8) {
            top = viewportHeight - tooltipHeight - 8;
        }

        setPosition({ top, left });

        // Recalculate after tooltip renders to get actual dimensions
        requestAnimationFrame(() => {
            if (tooltipRef.current && triggerRef.current) {
                const actualRect = tooltipRef.current.getBoundingClientRect();
                const updatedTriggerRect = triggerRef.current.getBoundingClientRect();
                
                let adjustedTop = 0;
                let adjustedLeft = 0;

                // Adjust based on actual dimensions
                const rightGap = 20; // Increased gap for right direction to move tooltip further right
                if (direction === 'right') {
                    adjustedLeft = updatedTriggerRect.right + rightGap;
                    adjustedTop = updatedTriggerRect.top + updatedTriggerRect.height / 2 - actualRect.height / 2;
                } else if (direction === 'left') {
                    adjustedLeft = updatedTriggerRect.left - actualRect.width - gap;
                    adjustedTop = updatedTriggerRect.top + updatedTriggerRect.height / 2 - actualRect.height / 2;
                } else if (direction === 'top') {
                    adjustedTop = updatedTriggerRect.top - actualRect.height - gap;
                    adjustedLeft = updatedTriggerRect.left + updatedTriggerRect.width / 2 - actualRect.width / 2;
                } else if (direction === 'bottom') {
                    adjustedTop = updatedTriggerRect.bottom + gap;
                    adjustedLeft = updatedTriggerRect.left + updatedTriggerRect.width / 2 - actualRect.width / 2;
                }

                // Keep within viewport
                if (adjustedLeft < 8) adjustedLeft = 8;
                if (adjustedLeft + actualRect.width > viewportWidth - 8) {
                    adjustedLeft = viewportWidth - actualRect.width - 8;
                }
                if (adjustedTop < 8) adjustedTop = 8;
                if (adjustedTop + actualRect.height > viewportHeight - 8) {
                    adjustedTop = viewportHeight - actualRect.height - 8;
                }

                setPosition({ top: adjustedTop, left: adjustedLeft });
            }
        });
    }, [direction]);

    const showTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            // Calculate position after a brief delay to ensure tooltip is rendered
            setTimeout(calculatePosition, 0);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    const containerClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b',
        bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t',
        left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-l border-b',
        right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t'
    };

    useEffect(() => {
        if (isVisible) {
            calculatePosition();
            
            const handleScroll = () => {
                calculatePosition();
            };

            const handleResize = () => {
                calculatePosition();
            };

            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('scroll', handleScroll, true);
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [isVisible, calculatePosition]);

    // Close tooltip when clicking outside on mobile
    useEffect(() => {
        if (!isVisible) return;

        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (window.innerWidth < 768 || 'ontouchstart' in window) {
                if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
                    hideTooltip();
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isVisible]);

    const tooltipContent = mounted && isVisible && (
        <div
            ref={tooltipRef}
            className="fixed z-[1002] pointer-events-none"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
        >
            <div className="relative bg-white border border-gray-200 rounded-sm px-5 py-2 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200">
                <span className="text-base font-medium text-black">{label}</span>

                {/* Tooltip Arrow (Rotated Square) */}
                <div
                    className={cn(
                        "absolute w-3 h-3 bg-white rotate-[-45deg] z-10",
                        arrowClasses[direction],
                        "border-gray-200"
                    )}
                />
            </div>
        </div>
    );

    return (
        <>
            <div
                ref={triggerRef}
                className={cn("relative", className)}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onTouchStart={(e) => {
                    // Show tooltip on touch for mobile
                    e.stopPropagation();
                    showTooltip();
                }}
                onClick={(e) => {
                    // Toggle on mobile click/tap
                    if (window.innerWidth < 768 || 'ontouchstart' in window) {
                        e.stopPropagation();
                        if (isVisible) {
                            hideTooltip();
                        } else {
                            setIsVisible(true);
                            setTimeout(calculatePosition, 0);
                        }
                    }
                }}
            >
                {children}
            </div>
            {mounted && createPortal(tooltipContent, document.body)}
        </>
    );
}

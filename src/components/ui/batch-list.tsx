"use client";

import React, { useRef, useEffect } from "react";
import { Info, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BatchItem {
    id: string;
    [key: string]: any;
}

interface BatchListProps<T extends BatchItem> {
    items: T[];
    expandedId: string | null;
    onToggleExpand: (id: string | null) => void;
    onEdit: (id: string) => void;
    onRemove: (id: string) => void;
    renderHeader: (item: T, index: number) => React.ReactNode;
    renderDetails: (item: T) => React.ReactNode;
    scrollToId?: string | null;
}

export function BatchList<T extends BatchItem>({
    items,
    expandedId,
    onToggleExpand,
    onEdit,
    onRemove,
    renderHeader,
    renderDetails,
    scrollToId,
}: BatchListProps<T>) {
    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Handle auto-scroll when scrollToId changes
    useEffect(() => {
        if (scrollToId && itemRefs.current[scrollToId]) {
            // Small timeout to ensure DOM is ready
            setTimeout(() => {
                itemRefs.current[scrollToId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }, [scrollToId]);

    return (
        <>
            {items.map((item, index) => {
                const isExpanded = expandedId === item.id;

                return (
                    <div
                        key={item.id}
                        ref={el => { itemRefs.current[item.id] = el; }}
                    >
                        <div
                            className="sticky top-0 z-20 flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f0fdf4] hover:bg-[#dcfce7] transition-colors border-b border-[#d5d5dd]"
                            onClick={() => onToggleExpand(isExpanded ? null : item.id)}
                        >
                            {/* Header Content */}
                            {renderHeader(item, index)}

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(item.id);
                                    }}
                                    className="flex items-center justify-center text-[#6b7280] hover:text-[#3b82f6] transition-colors"
                                    title="Edit in form"
                                >
                                    <Info className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(item.id);
                                    }}
                                    className="flex items-center justify-center text-[#6b7280] hover:text-[#ef4444] transition-colors"
                                    title="Remove"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
                                )}
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="p-4 bg-[#f9fafb] border-t border-[#d5d5dd]">
                                {renderDetails(item)}
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
}

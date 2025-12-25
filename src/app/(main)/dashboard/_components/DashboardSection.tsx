"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    className?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
    title,
    children,
    defaultExpanded = true,
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className={cn("mb-8", className)}>
            {/* Section Header */}
            <div className="flex items-center w-full mb-6 relative">
                {/* Title Box */}
                <div className="px-5 py-2 bg-white border border-[#d5d5dd] rounded-sm shadow-none font-medium text-lg text-gray-800 z-10">
                    {title}
                </div>

                {/* Connecting Line */}
                <div className="flex-grow border-t border-[#d5d5dd] -ml-1"></div>

                {/* Toggle Button Box */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 bg-white border border-[#d5d5dd] rounded-sm shadow-none hover:bg-gray-50 transition-colors z-10 ml-0"
                    title={isExpanded ? "Collapse Section" : "Expand Section"}
                >
                    {isExpanded ? (
                        <Minimize2 size={25} strokeWidth={1} className="text-gray-500" />
                    ) : (
                        <Maximize2 size={25} strokeWidth={1} className="text-gray-500" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white rounded-lg border border-[#d5d5dd] p-6 shadow-none">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

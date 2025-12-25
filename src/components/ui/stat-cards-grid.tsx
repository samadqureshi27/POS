"use client";

import React from "react";
import DynamicRevenueCard from "./revenue-card";
import { Skeleton } from "./skeleton";

export interface CardData {
    id?: string;
    title: string;
    amount: string | number;
    percentage?: string;
    trend?: "up" | "down" | "NULL";
    description: string;
    icon?: "dollar" | "users" | "cart" | "activity" | "trending-up" | "trending-down" | "customer";
    variant?: "default" | "success" | "warning" | "danger" | "simple";
    formatType?: "currency" | "number" | "percentage";
    currency?: string;
}

interface StatCardsGridProps {
    cards?: CardData[];
    loading?: boolean;
    gridClassName?: string;
    children?: React.ReactNode;
}

export const StatCardsGrid: React.FC<StatCardsGridProps> = ({
    cards = [],
    loading = false,
    gridClassName = "",
    children
}) => {
    if (loading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8 ${gridClassName}`}>
                {Array(4).fill(0).map((_, index) => (
                    <div key={index} className="px-6 py-6 rounded-sm bg-white shadow-none border border-[#d5d5dd] py-0 gap-0">
                        <Skeleton className="h-12 w-20 mb-3" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8 ${gridClassName}`}>
            {children ? children : (
                cards.map((card, index) => (
                    <DynamicRevenueCard
                        key={card.id || index}
                        title={card.title}
                        amount={card.amount}
                        percentage={card.percentage}
                        trend={card.trend}
                        description={card.description}
                        icon={card.icon}
                        variant={card.variant}
                        formatType={card.formatType}
                        currency={card.currency}
                    />
                ))
            )}
        </div>
    );
};

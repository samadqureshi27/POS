// components/CustomerSummaryCards.tsx
"use client";

import React from 'react';
import { AdvancedMetricCard } from '@/components/ui/advanced-metric-card';
import { StatCardsGrid } from '@/components/ui/stat-cards-grid';
import { ProfilePicture, StarRating, LargeStarRating } from './rating';
import { CustomerSummaryData } from '@/lib/types/customer-details';
import { formatDecimal } from '@/lib/util/formatters';

interface CustomerSummaryCardsProps {
    summaryData: CustomerSummaryData;
}

const CustomerSummaryCards: React.FC<CustomerSummaryCardsProps> = ({ summaryData }) => {
    const { totalCustomers, totalOrders, bestCustomer, averageRating } = summaryData;

    return (
        <StatCardsGrid>
            <AdvancedMetricCard
                title="Total Customers"
                value={totalCustomers}
                format="number"
            />

            <AdvancedMetricCard
                title="Total Orders"
                value={totalOrders}
                format="number"
            />

            <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-none transition-shadow duration-200">
                <div className="w-full">
                    {bestCustomer ? (
                        <div className="flex items-center gap-3 mb-2">
                            <ProfilePicture name={bestCustomer.Name} size="large" />
                            <div className="flex-1">
                                <p className="text-lg font-semibold text-gray-800 truncate" title={bestCustomer.Name}>
                                    {bestCustomer.Name}
                                </p>
                                <div className="flex items-center gap-2">
                                    <StarRating rating={bestCustomer.Feedback_Rating} />
                                    <span className="text-sm text-gray-500">({bestCustomer.Total_Orders} orders)</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-2xl mb-1">-</p>
                    )}
                    <p className="text-1xl text-gray-500">Best Customer</p>
                </div>
            </div>

            <div className="flex items-center justify-start min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-none transition-shadow duration-200">
                <div>
                    <div className="flex items-center justify-start mb-2">
                        <LargeStarRating rating={Math.round(averageRating)} />
                    </div>
                    <p className="text-1xl text-gray-500">
                        Avg. Feedback Rating{' '}
                        <span className="text-xl text-gray-500">({formatDecimal(averageRating)})</span>
                    </p>
                </div>
            </div>
        </StatCardsGrid>
    );
};

export default CustomerSummaryCards;
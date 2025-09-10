// components/CustomerMetricsSection.tsx
import React from 'react';
import { CustomerItem, OrderItem } from '@/lib/types/customerProfile';
import { CustomerProfileCard } from './CustomerProfileCard';
import { CustomerFeedbackCard } from './CustomerFeedbackCard';
import { MetricCard } from './metricCard';
import { OrderChart } from './orderChart';

interface CustomerMetricsSectionProps {
    customer: CustomerItem;
    orders: OrderItem[];
    totalSpent: number;
    averageOrderValue: number;
}

export const CustomerMetricsSection: React.FC<CustomerMetricsSectionProps> = ({
    customer,
    orders,
    totalSpent,
    averageOrderValue
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
            {/* Left Column - Customer Profile Card and Customer Feedback */}
            <div className="lg:col-span-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:h-[450px]">
                    {/* Left side - Customer Profile Card and Customer Feedback */}
                    <div className="flex flex-col gap-4 h-full">
                        <CustomerProfileCard customer={customer} />
                        <CustomerFeedbackCard rating={customer.Feedback_Rating} />
                    </div>

                    {/* Right side - Metrics */}
                    <div className="flex flex-col gap-4 h-full">
                        <MetricCard
                            value={customer.Total_Orders}
                            label="Total Orders"
                        />
                        <MetricCard
                            value={totalSpent.toLocaleString()}
                            label="Total Spent (PKR)"
                        />
                        <MetricCard
                            value={averageOrderValue}
                            label="Avg Order Value (PKR)"
                        />
                    </div>
                </div>
            </div>

            {/* Right Column - Chart */}
            <div className="lg:col-span-3">
                <OrderChart orders={orders} />
            </div>
        </div>
    );
};
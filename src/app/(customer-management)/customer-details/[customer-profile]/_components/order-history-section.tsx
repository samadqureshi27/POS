// components/OrderHistorySection.tsx
import React from 'react';
import { OrderItem } from '@/lib/types/customer-profile';
import { OrdersTable } from './orders-table';
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";

interface OrderHistorySectionProps {
    orders: OrderItem[];
    filteredOrders: OrderItem[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    typeFilter: string;
    statusFilter: string;
    setTypeFilter: (value: string) => void;
    setStatusFilter: (value: string) => void;
}

export const OrderHistorySection: React.FC<OrderHistorySectionProps> = ({
    orders,
    filteredOrders,
    searchTerm,
    onSearchChange,
    typeFilter,
    statusFilter,
    setTypeFilter,
    setStatusFilter
}) => {
    return (
        <div className="space-y-6">
            {/* Order History Title */}
            <div className="bg-white rounded-sm border border-gray-300 p-6 mb-8 shadow-sm">
                <h3 className="text-2xl font-semibold">Order History</h3>
            </div>

            {/* Search Bar */}
            <EnhancedActionBar
                searchValue={searchTerm}
                onSearchChange={onSearchChange}
                searchPlaceholder="Search orders by ID, date, or amount..."
                showViewToggle={false}
            />

            {/* Orders Table */}
            <OrdersTable
                orders={orders}
                filteredOrders={filteredOrders}
                typeFilter={typeFilter}
                statusFilter={statusFilter}
                setTypeFilter={setTypeFilter}
                setStatusFilter={setStatusFilter}
                searchTerm={searchTerm}
            />
        </div>
    );
};
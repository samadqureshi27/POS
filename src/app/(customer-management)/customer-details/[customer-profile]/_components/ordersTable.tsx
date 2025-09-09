// components/OrdersTable.tsx
import React from 'react';
import { OrderItem } from '@/types/customerProfile';
import { FilterDropdown } from '@/components/layout/UI/FilterDropdown';
import ResponsiveDetailButton from "@/components/layout/UI/ResponsiveDetailButton";

interface OrdersTableProps {
    orders: OrderItem[];
    filteredOrders: OrderItem[];
    typeFilter: string;
    statusFilter: string;
    setTypeFilter: (value: string) => void;
    setStatusFilter: (value: string) => void;
    searchTerm: string;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
    orders,
    filteredOrders,
    typeFilter,
    statusFilter,
    setTypeFilter,
    setStatusFilter,
    searchTerm
}) => {
    const getTypeClassName = (type: string) => {
        return `hover:bg-gray-100 ${type === "Dine in"
            ? "text-yellow-400"
            : type === "Takeaway"
                ? "text-green-400"
                : "text-blue-400"
            }`;
    };

    const getStatusClassName = (status: string) => {
        return `hover:bg-gray-100 ${status === "Completed"
            ? "text-green-400"
            : status === "Pending"
                ? "text-blue-400"
                : "text-red-400"
            }`;
    };

    const getStatusBadgeClassName = (status: string) => {
        return `inline-flex py-1 text-xs font-medium rounded-full ${status === "Completed"
            ? "text-green-400"
            : status === "Pending"
                ? "text-blue-400"
                : "text-red-400"
            }`;
    };

    const getTypeBadgeClassName = (type: string) => {
        return `inline-flex py-1 text-xs font-medium rounded-full ${type === "Dine in"
            ? "text-yellow-400"
            : type === "Takeaway"
                ? "text-green-400"
                : "text-blue-400"
            }`;
    };

    const uniqueTypes = Array.from(new Set(orders.map((order) => order.Type)));
    const uniqueStatuses = Array.from(new Set(orders.map((order) => order.Status)));

    return (
        <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm overflow-x-auto responsive-customer-table">
            <div className="rounded-sm table-container">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
                        <tr>
                            <th className="relative px-6 py-6 text-left w-24">
                                Order ID
                            </th>
                            <th className="relative px-4 py-3 text-left w-40">
                                Order Number
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-36">
                                <div className="flex flex-col gap-1">
                                    <FilterDropdown
                                        label="Type"
                                        value={typeFilter}
                                        options={uniqueTypes} // Changed from allTypes to uniqueTypes
                                        onChange={setTypeFilter}
                                        getOptionClassName={getTypeClassName}
                                    />
                                </div>
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-32">
                                Date
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-36">
                                Total
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-32">
                                <div className="flex flex-col gap-1">
                                    <FilterDropdown
                                        label="Status"
                                        value={statusFilter}
                                        options={uniqueStatuses} // Changed from allStatuses to uniqueStatuses
                                        onChange={setStatusFilter}
                                        getOptionClassName={getStatusClassName}
                                    />
                                </div>
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-32">
                                Details
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y text-gray-500 divide-gray-300">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    {searchTerm || typeFilter || statusFilter
                                        ? "No orders match your search criteria."
                                        : "No orders found."}
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr
                                    key={order.Order_ID}
                                    className="bg-white hover:bg-gray-50"
                                >
                                    <td className="px-6 py-8 whitespace-nowrap text-sm card-name-cell" data-label="ID">
                                        {order.Order_ID}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Order Number">
                                        {order.Order_Number}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Type">
                                        <span className={getTypeBadgeClassName(order.Type)}>
                                            {order.Type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Date">
                                        {new Date(order.Date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Total">
                                        PKR {order.Total.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                                        <span className={getStatusBadgeClassName(order.Status)}>
                                            {order.Status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap card-actions-cell" data-label="Actions" onClick={(e) => e.stopPropagation()}>
                                        <ResponsiveDetailButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
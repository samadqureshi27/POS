// components/OrdersTable.tsx
import React from 'react';
import { Eye } from 'lucide-react';
import { OrderItem } from '@/lib/types/customer-profile';
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from '@/components/ui/filter-dropdown';


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

    const uniqueTypes = Array.from(new Set(orders.map((order) => order.Type))).map(type => ({
        value: type,
        label: type,
        className: getTypeClassName(type)
    }));
    const uniqueStatuses = Array.from(new Set(orders.map((order) => order.Status))).map(status => ({
        value: status,
        label: status,
        className: getStatusClassName(status)
    }));

    const columns: DataTableColumn<OrderItem>[] = [
        {
            key: "orderId",
            title: "Order ID",
            dataIndex: "Order_ID",
            width: "100px"
        },
        {
            key: "orderNumber",
            title: "Order Number",
            dataIndex: "Order_Number"
        },
        {
            key: "type",
            title: "Type",
            dataIndex: "Type",
            filterable: true,
            filterComponent: (
                <FilterDropdown
                    label="Type"
                    value={typeFilter}
                    options={uniqueTypes}
                    onChange={setTypeFilter}
                />
            ),
            render: (value) => <StatusBadge status={value} />
        },
        {
            key: "date",
            title: "Date",
            dataIndex: "Date",
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            key: "total",
            title: "Total",
            dataIndex: "Total",
            render: (value) => `PKR ${value.toLocaleString()}`
        },
        {
            key: "status",
            title: "Status",
            dataIndex: "Status",
            filterable: true,
            filterComponent: (
                <FilterDropdown
                    label="Status"
                    value={statusFilter}
                    options={uniqueStatuses}
                    onChange={setStatusFilter}
                />
            ),
            render: (value) => <StatusBadge status={value} />
        }
    ];

    const actions: DataTableAction<OrderItem>[] = [
        {
            key: "details",
            label: "Details",
            icon: <Eye className="h-4 w-4" />,
            onClick: (order) => {
                // Handle details action
            }
        }
    ];

    const emptyMessage = searchTerm || typeFilter || statusFilter
        ? "No orders match your search criteria."
        : "No orders found.";


    return (
        <DataTable
            data={filteredOrders}
            columns={columns}
            actions={actions}
            selectable={false}
            getRowId={(item) => item.Order_ID}
            maxHeight="600px"
            emptyMessage={emptyMessage}
            mobileResponsive={true}
            nameColumn="orderNumber"
        />
    );
};
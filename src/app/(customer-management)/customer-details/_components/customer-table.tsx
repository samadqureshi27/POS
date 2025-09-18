// components/CustomerTable.tsx
"use client";

import React from 'react';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { ProfilePicture, StarRating } from './rating';
import { CustomerItem } from '@/lib/types/customer-details';

interface CustomerTableProps {
    customers: CustomerItem[];
    searchTerm: string;
    onCustomerClick: (customerId: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
    customers,
    searchTerm,
    onCustomerClick
}) => {
    const columns: DataTableColumn<CustomerItem>[] = [
        {
            key: "name",
            title: "Name",
            dataIndex: "Name",
            render: (value, record) => (
                <div className="name-content flex items-center gap-2">
                    <ProfilePicture name={record.Name} />
                    <span className="font-medium">{value}</span>
                </div>
            )
        },
        {
            key: "contact",
            title: "Contact",
            dataIndex: "Contact"
        },
        {
            key: "email",
            title: "Email",
            dataIndex: "Email"
        },
        {
            key: "feedbackRating",
            title: "Feedback Rating",
            dataIndex: "Feedback_Rating",
            render: (value) => <StarRating rating={value} />
        },
        {
            key: "totalOrders",
            title: "Total Orders",
            dataIndex: "Total_Orders"
        },
        {
            key: "birthdate",
            title: "Birthdate",
            dataIndex: "Birthdate"
        },
        {
            key: "profileCreated",
            title: "Profile Created",
            dataIndex: "Profile_Creation_Date"
        },
        {
            key: "device",
            title: "Device",
            dataIndex: "Device"
        }
    ];

    const emptyMessage = searchTerm
        ? "No customers match your search criteria."
        : "No customers found.";

    return (
        <DataTable
            data={customers}
            columns={columns}
            selectable={false}
            getRowId={(item) => item.Customer_ID}
            maxHeight="600px"
            emptyMessage={emptyMessage}
            onRowClick={(record) => onCustomerClick(record.Customer_ID)}
        />
    );
};

export default CustomerTable;
// components/VendorTable.tsx
"use client";

import React from "react";
import { Edit } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { VendorItem, VendorTableProps } from "@/lib/types/vendors";

const VendorTable: React.FC<VendorTableProps> = ({
    vendorItems,
    selectedItems,
    onSelectAll,
    onSelectItem,
    onEditItem,
    isAllSelected,
    branchId,
}) => {
    const columns: DataTableColumn<VendorItem>[] = [
        {
            key: "id",
            title: "ID",
            dataIndex: "ID",
            width: "80px"
        },
        {
            key: "companyName",
            title: "Company Name",
            dataIndex: "Company_Name",
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: "contactPerson",
            title: "Contact Person",
            dataIndex: "Name"
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
            key: "address",
            title: "Address",
            dataIndex: "Address"
        }
    ];

    const actions: DataTableAction<VendorItem>[] = [
        {
            key: "edit",
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: onEditItem
        }
    ];

    return (
        <DataTable
            data={vendorItems}
            columns={columns}
            actions={actions}
            selectable={true}
            selectedItems={selectedItems}
            onSelectAll={onSelectAll}
            onSelectItem={onSelectItem}
            getRowId={(item) => item.ID}
            maxHeight="600px"
            emptyMessage={`No vendors found for Branch #${branchId}.`}
        />
    );
};

export default VendorTable;
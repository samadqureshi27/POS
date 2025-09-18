"use client";
import React from "react";
import { Edit } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { PaymentTableProps } from "@/lib/types/payment";

const PaymentTable: React.FC<PaymentTableProps> = ({
    paymentMethods,
    filteredItems,
    selectedItems,
    statusFilter,
    taxTypeFilter,
    onStatusFilterChange,
    onTaxTypeFilterChange,
    onSelectAll,
    onSelectItem,
    onEditItem,
    isAllSelected,
}) => {
    const statusOptions = [
        { value: "Cash", label: "Cash", className: "hover:bg-red-100 text-red-400" },
        { value: "Card", label: "Card", className: "hover:bg-green-100 text-green-400" },
        { value: "Digital", label: "Digital", className: "hover:bg-blue-100 text-blue-400" }
    ];

    const taxTypeOptions = [
        { value: "Inclusive", label: "Inclusive", className: "hover:bg-red-100 text-red-400" },
        { value: "Exclusive", label: "Exclusive", className: "hover:bg-green-100 text-green-400" }
    ];

    const columns: DataTableColumn<any>[] = [
        {
            key: "id",
            title: "ID",
            dataIndex: "ID",
            width: "80px"
        },
        {
            key: "name",
            title: "Name",
            dataIndex: "Name",
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: "paymentType",
            title: "Payment Type",
            dataIndex: "Payment_Type",
            filterable: true,
            filterComponent: (
                <FilterDropdown
                    label="Payment Type"
                    value={statusFilter}
                    onChange={onStatusFilterChange}
                    options={statusOptions}
                />
            ),
            render: (value) => <StatusBadge status={value} />
        },
        {
            key: "taxType",
            title: "Tax Type",
            dataIndex: "Tax_Type",
            filterable: true,
            filterComponent: (
                <FilterDropdown
                    label="Tax Type"
                    value={taxTypeFilter}
                    onChange={onTaxTypeFilterChange}
                    options={taxTypeOptions}
                />
            ),
            render: (value) => <StatusBadge status={value} />
        }
    ];

    const actions: DataTableAction<any>[] = [
        {
            key: "edit",
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: onEditItem
        }
    ];

    const emptyMessage = statusFilter || taxTypeFilter
        ? "No payment methods match your search criteria."
        : "No payment methods found.";

    return (
        <DataTable
            data={filteredItems}
            columns={columns}
            actions={actions}
            selectable={true}
            selectedItems={selectedItems}
            onSelectAll={onSelectAll}
            onSelectItem={onSelectItem}
            getRowId={(item) => item.ID}
            maxHeight="600px"
            emptyMessage={emptyMessage}
            mobileResponsive={true}
            nameColumn="name"
        />
    );
};

export default PaymentTable;
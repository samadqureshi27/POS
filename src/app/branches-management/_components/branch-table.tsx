"use client";

import React from "react";
import { Edit, Eye } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { BranchTableProps } from "@/lib/types/branch";

const BranchTable: React.FC<BranchTableProps> = ({
    branchItems,
    filteredItems,
    selectedItems,
    statusFilter,
    onStatusFilterChange,
    onSelectAll,
    onSelectItem,
    onEditItem,
    onItemClick,
    isAllSelected,
}) => {
    const statusOptions = [
        { value: "Inactive", label: "Inactive", className: "hover:bg-red-100 text-red-400" },
        { value: "Active", label: "Active", className: "hover:bg-green-100 text-green-400" }
    ];

    const columns: DataTableColumn<any>[] = [
        {
            key: "branchId",
            title: "Branch ID",
            dataIndex: "Branch-ID",
            render: (value) => `#${String(value).padStart(3, "0")}`
        },
        {
            key: "branchName",
            title: "Branch Name",
            dataIndex: "Branch_Name",
            render: (value) => <span className="font-medium">{value}</span>
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
                    onChange={onStatusFilterChange}
                    options={statusOptions}
                />
            ),
            render: (value) => <StatusBadge status={value} />
        },
        {
            key: "contactInfo",
            title: "Contact Info",
            dataIndex: "Contact-Info"
        },
        {
            key: "address",
            title: "Address",
            dataIndex: "Address",
            render: (value) => (
                <div className="truncate max-w-[150px]" title={value}>
                    {value}
                </div>
            )
        }
    ];

    const actions: DataTableAction<any>[] = [
        {
            key: "view",
            label: "View Details",
            icon: <Eye className="h-4 w-4" />,
            onClick: (record) => onItemClick(record["Branch-ID"]),
            showOnMobile: true // This will show as a mobile button
        },
        {
            key: "edit",
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: onEditItem,
            showOnMobile: true // This will show as a mobile button
        }
    ];

    const emptyMessage = statusFilter
        ? "No branches match your search criteria."
        : "No branches found.";

    return (
        <DataTable
            data={filteredItems}
            columns={columns}
            actions={actions}
            selectable={true}
            selectedItems={selectedItems}
            onSelectAll={onSelectAll}
            onSelectItem={onSelectItem}
            getRowId={(item) => item["Branch-ID"]}
            maxHeight="600px"
            emptyMessage={emptyMessage}
            mobileResponsive={true}
            nameColumn="branchName"
            multipleMobileButtons={true} // Enable multiple mobile buttons
        />
    );
};

export default BranchTable;
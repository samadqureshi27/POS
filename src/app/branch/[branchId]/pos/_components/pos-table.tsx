"use client";

import React from "react";
import { Edit } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { PosTableProps } from "@/lib/types/pos";

const PosTable: React.FC<PosTableProps> = ({
    posItems,
    filteredItems,
    selectedItems,
    statusFilter,
    onStatusFilterChange,
    onSelectAll,
    onSelectItem,
    onEditItem,
    isAllSelected,
}) => {
    const branchId = filteredItems.length > 0 ? filteredItems[0].Branch_ID_fk : "";

    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "Inactive", label: "Inactive", className: "hover:bg-red-100 text-red-400" },
        { value: "Active", label: "Active", className: "hover:bg-green-100 text-green-400" }
    ];

    const columns: DataTableColumn<any>[] = [
        {
            key: "posId",
            title: "POS ID",
            dataIndex: "POS_ID",
            render: (value) => `#${String(value).padStart(3, "0")}`
        },
        {
            key: "posName",
            title: "POS Name",
            dataIndex: "POS_Name",
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

    const emptyMessage = statusFilter
        ? `No POS match your search criteria for Branch #${branchId}.`
        : `No POS found for Branch #${branchId}.`;

    return (
        <DataTable
            data={filteredItems}
            columns={columns}
            actions={actions}
            selectable={true}
            selectedItems={selectedItems}
            onSelectAll={onSelectAll}
            onSelectItem={onSelectItem}
            getRowId={(item) => item.POS_ID}
            maxHeight="600px"
            emptyMessage={emptyMessage}
        />
    );
};

export default PosTable;
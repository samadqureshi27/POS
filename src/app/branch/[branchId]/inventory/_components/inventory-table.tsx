"use client";

import React from "react";
import { Edit } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { InventoryTableProps } from "@/lib/types/inventory";
import ResponsiveEditButton from "@/components/ui/responsive-edit-button";
const InventoryTable: React.FC<InventoryTableProps> = ({
    inventoryItems,
    filteredItems,
    selectedItems,
    statusFilter,
    unitFilter,
    onStatusFilterChange,
    onUnitFilterChange,
    onSelectAll,
    onSelectItem,
    onEditItem,
    isAllSelected,
}) => {
    const statusOptions = [
        { value: "Low", label: "Low", className: "hover:bg-red-100 text-red-400" },
        { value: "Medium", label: "Medium", className: "hover:bg-yellow-100 text-yellow-400" },
        { value: "High", label: "High", className: "hover:bg-green-100 text-green-400" }
    ];

    const unitOptions = [
        ...Array.from(new Set(inventoryItems.map((i) => i.Unit))).map(unit => ({ value: unit, label: unit }))
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
            dataIndex: "Name"
        },
        {
            key: "unit",
            title: "Unit",
            dataIndex: "Unit",
            filterable: true,
            filterComponent: (
                <FilterDropdown
                    label="Unit"
                    value={unitFilter}
                    onChange={onUnitFilterChange}
                    options={unitOptions}
                />
            )
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
            key: "initialStock",
            title: "Initial Stock",
            dataIndex: "InitialStock"
        },
        {
            key: "addedStock",
            title: "Added Stock",
            dataIndex: "AddedStock"
        },
        {
            key: "updatedStock",
            title: "Updated Stock",
            dataIndex: "UpdatedStock"
        },
        {
            key: "threshold",
            title: "Threshold",
            dataIndex: "Threshold"
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
            emptyMessage="No inventory items match your search criteria."
            mobileResponsive={true}
            nameColumn="name"
        />
    );
};

export default InventoryTable;
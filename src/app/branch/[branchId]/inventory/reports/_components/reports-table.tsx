"use client";

import React from "react";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { ReportsTableProps, ReportItem } from "@/lib/types/reports";

const ReportsTable: React.FC<ReportsTableProps> = ({
    reportItems,
    filteredItems,
    unitFilter,
    onUnitFilterChange,
}) => {
    const branchId = filteredItems.length > 0 ? filteredItems[0].Branch_ID_fk : "";
    const uniqueUnits = Array.from(new Set(reportItems.map((i) => i.Unit)));

    const unitOptions = [
        { value: "", label: "All Units" },
        ...uniqueUnits.map(unit => ({ value: unit, label: unit }))
    ];

    const columns: DataTableColumn<ReportItem>[] = [
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
            key: "initialStock",
            title: "Initial Stock",
            dataIndex: "InitialStock",
            hideOnMobile: true
        },
        {
            key: "purchased",
            title: "Purchased",
            dataIndex: "Purchased",
            hideOnMobile: true
        },
        {
            key: "used",
            title: "Used",
            dataIndex: "Used",
            hideOnMobile: true
        },
        {
            key: "variance",
            title: "Variance",
            dataIndex: "Variance",
            hideOnMobile: true
        },
        {
            key: "wasteage",
            title: "Wasteage",
            dataIndex: "Wasteage",
            hideOnMobile: true
        },
        {
            key: "closingStock",
            title: "Closing Stock",
            dataIndex: "ClosingStock",
            hideOnMobile: true
        },
        {
            key: "totalValue",
            title: "Total Value",
            dataIndex: "Total_Value",
            render: (value) => `$${value}`,
            mobileLabel: "Value"
        }
    ];

    const emptyMessage = reportItems.length === 0
        ? `No inventory items found for Branch #${branchId}.`
        : "No inventory items match your search criteria.";

    return (
        <DataTable
            data={filteredItems}
            columns={columns}
            selectable={false}
            maxHeight="600px"
            emptyMessage={emptyMessage}
            mobileResponsive={true}
            nameColumn="name"
        />
    );
};

export default ReportsTable;
"use client";

import React from "react";
import { Eye } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { StaffTableProps, StaffItem } from "@/lib/types/payroll";

export const StaffTable: React.FC<StaffTableProps> = ({
    filteredItems,
    staffItems,
    filters,
    branchId,
}) => {
    const {
        statusFilter,
        setStatusFilter,
        roleFilter,
        setRoleFilter,
        searchTerm,
    } = filters;

    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "Paid", label: "Paid", className: "text-green-600" },
        { value: "Unpaid", label: "Unpaid", className: "text-red-600" }
    ];

    const roleOptions = [
        { value: "", label: "All Roles" },
        ...Array.from(new Set(staffItems.map((item) => item.Role))).map(role => ({
            value: role,
            label: role
        }))
    ];

    const columns: DataTableColumn<StaffItem>[] = [
        {
            key: "staffId",
            title: "Staff ID",
            dataIndex: "STAFF_ID",
            width: "100px",
            render: (value) => `#${String(value).padStart(3, "0")}`
        },
        {
            key: "name",
            title: "Name",
            dataIndex: "Name",
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: "contact",
            title: "Contact",
            dataIndex: "Contact",
            hideOnMobile: true
        },
        {
            key: "role",
            title: "Role",
            dataIndex: "Role",
            filterable: true,
            filterComponent: (
                <FilterDropdown
                    label="Role"
                    value={roleFilter}
                    onChange={setRoleFilter}
                    options={roleOptions}
                />
            ),
            hideOnMobile: true
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
                    onChange={setStatusFilter}
                    options={statusOptions}
                />
            ),
            render: (value) => (
                <Badge
                    variant={value === "Paid" ? "default" : "destructive"}
                    className="text-xs"
                >
                    {value}
                </Badge>
            )
        },
        {
            key: "salary",
            title: "Salary",
            dataIndex: "Salary",
            render: (value) => `${value.toLocaleString()}Rs`,
            hideOnMobile: true
        },
        {
            key: "joinDate",
            title: "Join Date",
            dataIndex: "JoinDate",
            render: (value) => new Date(value).toLocaleDateString(),
            hideOnMobile: true
        }
    ];

    const actions: DataTableAction<StaffItem>[] = [
        {
            key: "details",
            label: "Details",
            icon: <Eye className="h-4 w-4" />,
            onClick: (item) => {
                // Handle details action
            }
        }
    ];

    const emptyMessage = searchTerm || statusFilter || roleFilter
        ? `No staff members match your search criteria for Branch #${branchId}.`
        : `No staff members found for Branch #${branchId}.`;

    return (
        <DataTable
            data={filteredItems}
            columns={columns}
            actions={actions}
            selectable={false}
            maxHeight="600px"
            emptyMessage={emptyMessage}
            mobileResponsive={true}
            nameColumn="name"
        />
    );
};
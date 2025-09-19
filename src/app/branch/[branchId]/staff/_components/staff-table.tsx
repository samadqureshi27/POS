import React from "react";
import { Edit } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { StaffItem } from "@/lib/types/staff-management";
import { formatStaffId } from "@/lib/util/Staff-formatters";

interface StaffTableProps {
    staffItems: StaffItem[];
    filteredItems: StaffItem[];
    selectedItems: string[];
    statusFilter: "" | "Active" | "Inactive";
    roleFilter: string;
    isAllSelected: boolean;
    onSelectAll: (checked: boolean) => void;
    onSelectItem: (id: string, checked: boolean) => void;
    onEditItem: (item: StaffItem) => void;
    onStatusFilterChange: (status: "" | "Active" | "Inactive") => void;
    onRoleFilterChange: (role: string) => void;
    searchTerm: string;
}

const StaffTable: React.FC<StaffTableProps> = ({
    staffItems,
    filteredItems,
    selectedItems,
    statusFilter,
    roleFilter,
    isAllSelected,
    onSelectAll,
    onSelectItem,
    onEditItem,
    onStatusFilterChange,
    onRoleFilterChange,
    searchTerm,
}) => {
    const getUniqueRoles = () => Array.from(new Set(staffItems.map((i) => i.Role)));

    const statusOptions = [,
        { value: "Inactive", label: "Inactive", className: "hover:bg-red-100 text-red-400" },
        { value: "Active", label: "Active", className: "hover:bg-green-100 text-green-400" }
    ];

    const roleOptions = [
        ...getUniqueRoles().map(role => ({ value: role, label: role }))
    ];

    const columns: DataTableColumn<StaffItem>[] = [
        {
            key: "staffId",
            title: "Staff ID",
            dataIndex: "Staff_ID",
            render: (value) => formatStaffId(value)
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
            dataIndex: "Contact"
        },
        {
            key: "address",
            title: "Address",
            dataIndex: "Address"
        },
        {
            key: "cnic",
            title: "CNIC",
            dataIndex: "CNIC"
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
            key: "role",
            title: "Role",
            dataIndex: "Role",
            filterable: true,
            filterComponent: (
                <FilterDropdown
                    label="Role"
                    value={roleFilter}
                    onChange={onRoleFilterChange}
                    options={roleOptions}
                />
            )
        },
        {
            key: "salary",
            title: "Salary",
            dataIndex: "Salary"
        },
        {
            key: "shiftStartTime",
            title: "Shift Start Time",
            dataIndex: "Shift_Start_Time"
        },
        {
            key: "shiftEndTime",
            title: "Shift End Time",
            dataIndex: "Shift_End_Time"
        },
        {
            key: "accessCode",
            title: "Access Code",
            dataIndex: "Access_Code",
            render: (value, record) => {
                if ((record.Role === "Cashier" || record.Role === "Manager") && value) {
                    return (
                        <span
                            className={`px-2 py-1 rounded text-xs font-mono ${
                                record.Role === "Cashier"
                                    ? "bg-blue-100 text-blue-400"
                                    : "bg-purple-100 text-purple-400"
                            }`}
                        >
                            {value}
                        </span>
                    );
                }
                return <span className="text-muted-foreground">—</span>;
            }
        }
    ];

    const actions: DataTableAction<StaffItem>[] = [
        {
            key: "edit",
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: onEditItem
        }
    ];

    const emptyMessage = searchTerm || statusFilter || roleFilter
        ? "No staff match your search criteria."
        : "No staff found for this branch.";

    return (
        <DataTable
            data={filteredItems}
            columns={columns}
            actions={actions}
            selectable={true}
            selectedItems={selectedItems}
            onSelectAll={onSelectAll}
            onSelectItem={onSelectItem}
            getRowId={(item) => item.Staff_ID}
            maxHeight="600px"
            emptyMessage={emptyMessage}
            mobileResponsive={true}
            nameColumn="name"
        />
    );
};

export default StaffTable;
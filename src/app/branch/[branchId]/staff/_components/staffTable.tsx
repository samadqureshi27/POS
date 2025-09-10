import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ResponsiveEditButton from "@/components/layout/UI/ResponsiveEditButton";
import { StaffItem } from "@/types/staffManagement";
<<<<<<< HEAD
import { formatStaffId } from "@/lib/util/StaffFormatters";
=======
import { formatStaffId } from "@/lib/util/Staff-formatters";
>>>>>>> fa4c0c4c5551bd77636fd1d5b27ca4fad7662fa6

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

    return (
        <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm responsive-customer-table">
            <div className="rounded-sm table-container">
                <table className="min-w-full divide-y max-w-[800px] divide-gray-200 table-fixed">
                    <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-6 text-left w-[2.5px]">
                                <Checkbox
                                    checked={isAllSelected}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    disableRipple
                                    sx={{
                                        transform: "scale(1.5)",
                                        p: 0,
                                    }}
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24">
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="3"
                                                ry="3"
                                                fill="#e0e0e0"
                                                stroke="#d1d1d1"
                                                strokeWidth="2"
                                            />
                                        </svg>
                                    }
                                    checkedIcon={
                                        <svg width="20" height="20" viewBox="0 0 24 24">
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="3"
                                                ry="3"
                                                fill="#e0e0e0"
                                                stroke="#2C2C2C"
                                                strokeWidth="2"
                                            />
                                            <path
                                                d="M9 12.5l2 2 4-4.5"
                                                fill="none"
                                                stroke="#2C2C2C"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    }
                                />
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Staff ID
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Name
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Contact
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Address
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                CNIC
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                <div className="flex flex-col gap-1">
                                    <DropdownMenu.Root modal={false}>
                                        <DropdownMenu.Trigger className="px-2 py-1 rounded bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                                            {statusFilter || "Status"}
                                            <ChevronDown
                                                size={14}
                                                className="text-gray-500 ml-auto"
                                            />
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Content
                                            className="min-w-[120px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                                            sideOffset={6}
                                            onOpenAutoFocus={(e) => e.preventDefault()}
                                            onCloseAutoFocus={(e) => e.preventDefault()}
                                            style={{ zIndex: 1000 }}
                                        >
                                            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                                            <DropdownMenu.Item
                                                className="px-3 py-1 cursor-pointer hover:bg-gray-100 rounded outline-none"
                                                onClick={() => onStatusFilterChange("")}
                                            >
                                                Status
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                className="px-3 py-1 cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                                                onClick={() => onStatusFilterChange("Active")}
                                            >
                                                Active
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                className="px-3 py-1 cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                                                onClick={() => onStatusFilterChange("Inactive")}
                                            >
                                                Inactive
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </div>
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                <div className="flex flex-col gap-1">
                                    <DropdownMenu.Root modal={false}>
                                        <DropdownMenu.Trigger className="px-2 py-1 rounded bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                                            {roleFilter || "Role"}
                                            <ChevronDown
                                                size={14}
                                                className="text-gray-500 ml-auto"
                                            />
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Content
                                            className="min-w-[120px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                                            sideOffset={6}
                                            onOpenAutoFocus={(e) => e.preventDefault()}
                                            onCloseAutoFocus={(e) => e.preventDefault()}
                                            style={{ zIndex: 1000 }}
                                        >
                                            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                                            <DropdownMenu.Item
                                                className="px-3 py-1 cursor-pointer hover:bg-gray-100 rounded outline-none"
                                                onClick={() => onRoleFilterChange("")}
                                            >
                                                Role
                                            </DropdownMenu.Item>
                                            {getUniqueRoles().map((role) => (
                                                <DropdownMenu.Item
                                                    key={role}
                                                    className="px-3 py-1 cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                                    onClick={() => onRoleFilterChange(role)}
                                                >
                                                    {role}
                                                </DropdownMenu.Item>
                                            ))}
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </div>
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Salary
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Shift Start Time
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Shift End Time
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Access Code
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Actions
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y text-gray-500 divide-gray-300">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={13}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    {searchTerm || statusFilter || roleFilter
                                        ? "No staff match your search criteria."
                                        : "No staff found for this branch."}
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr
                                    key={item.Staff_ID}
                                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-8 whitespace-nowrap card-checkbox-cell">
                                        <Checkbox
                                            checked={selectedItems.includes(item.Staff_ID)}
                                            onChange={(e) =>
                                                onSelectItem(item.Staff_ID, e.target.checked)
                                            }
                                            disableRipple
                                            sx={{
                                                p: 0,
                                                transform: "scale(1.5)",
                                            }}
                                            icon={
                                                <svg width="20" height="20" viewBox="0 0 24 24">
                                                    <rect
                                                        x="3"
                                                        y="3"
                                                        width="18"
                                                        height="18"
                                                        rx="3"
                                                        ry="3"
                                                        fill="#e0e0e0"
                                                        stroke="#d1d1d1"
                                                        strokeWidth="2"
                                                    />
                                                </svg>
                                            }
                                            checkedIcon={
                                                <svg width="20" height="20" viewBox="0 0 24 24">
                                                    <rect
                                                        x="3"
                                                        y="3"
                                                        width="18"
                                                        height="18"
                                                        rx="3"
                                                        ry="3"
                                                        fill="#e0e0e0"
                                                        stroke="#2C2C2C"
                                                        strokeWidth="2"
                                                    />
                                                    <path
                                                        d="M9 12.5l2 2 4-4.5"
                                                        fill="none"
                                                        stroke="#2C2C2C"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Staff ID">
                                        {formatStaffId(item.Staff_ID)}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap card-name-cell" data-label="Name">
                                        <span className="font-medium">{item.Name}</span>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Contact">
                                        {item.Contact}
                                    </td>
                                    <td className="px-4 py-4" data-label="Address" title={item.Address}>
                                        {item.Address}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="CNIC">
                                        {item.CNIC}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                                        <span
                                            className={`inline-block w-20 text-right lg:text-center py-[2px] rounded-sm text-xs font-medium 
                                        ${item.Status === "Active" ? "text-green-400 border-green-600" : ""}
                                        ${item.Status === "Inactive" ? "text-red-400 border-red-600" : ""}`}
                                        >
                                            {item.Status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Role">
                                        {item.Role}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Salary">
                                        {item.Salary}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-600" data-label="Shift Start Time">
                                        {item.Shift_Start_Time}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-600" data-label="Shift End Time">
                                        {item.Shift_End_Time}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Access Code">
                                        {(item.Role === "Cashier" || item.Role === "Manager") &&
                                            item.Access_Code ? (
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-mono ${item.Role === "Cashier"
                                                        ? "bg-blue-100 text-blue-400"
                                                        : "bg-purple-100 text-purple-400"
                                                    }`}
                                            >
                                                {item.Access_Code}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap card-actions-cell" data-label="Actions" onClick={(e) => e.stopPropagation()}>
                                        <ResponsiveEditButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditItem(item);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffTable;
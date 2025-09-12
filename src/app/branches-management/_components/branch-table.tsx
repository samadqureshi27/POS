// _components/BranchTable.tsx
"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ResponsiveEditButton from "@/components/layout/ui/responsive-edit-button";
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
    const isSomeSelected = selectedItems.length > 0;

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
                                Branch ID
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Branch Name
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                <div className="flex flex-col gap-1">
                                    <DropdownMenu.Root modal={false}>
                                        <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                                            {statusFilter || "Status"}
                                            <ChevronDown size={14} className="text-gray-500 ml-auto" />
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Content
                                            className="min-w-[120px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                                            sideOffset={6}
                                            onCloseAutoFocus={(e) => e.preventDefault()}
                                            style={{ zIndex: 1000 }}
                                        >
                                            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                                            <DropdownMenu.Item
                                                className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                                onClick={() => onStatusFilterChange("")}
                                            >
                                                Status
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                                                onClick={() => onStatusFilterChange("Active")}
                                            >
                                                Active
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
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
                                Contact Info
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Address
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
                            <tr className="bg-white hover:bg-gray-50">
                                <td colSpan={8} className="px-6 py-8">
                                    {statusFilter
                                        ? "No branches match your search criteria."
                                        : "No branches found."}
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr
                                    key={item["Branch-ID"]}
                                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => onItemClick(item["Branch-ID"])}
                                >
                                    <td
                                        className="px-6 py-8 whitespace-nowrap text-sm card-checkbox-cell"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Checkbox
                                            checked={selectedItems.includes(item["Branch-ID"])}
                                            onChange={(e) =>
                                                onSelectItem(item["Branch-ID"], e.target.checked)
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
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Branch ID">
                                        {`#${String(item["Branch-ID"]).padStart(3, "0")}`}
                                    </td>
                                    <td
                                        className="px-4 py-4 whitespace-nowrap text-sm card-name-cell"
                                        data-label="Branch Name"
                                    >
                                        <span className="font-medium">{item.Branch_Name}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                                        <span
                                            className={`inline-block w-20 text-right py-[2px] rounded-sm text-xs font-medium 
                        ${item.Status === "Active" ? "text-green-400" : ""}
                        ${item.Status === "Inactive" ? "text-red-400" : ""}`}
                                        >
                                            {item.Status}
                                        </span>
                                    </td>
                                    <td
                                        className="px-4 py-4 whitespace-nowrap text-sm"
                                        data-label="Contact Info"
                                    >
                                        {item["Contact-Info"]}
                                    </td>
                                    <td
                                        className="px-4 py-4 whitespace-nowrap text-sm"
                                        data-label="Address"
                                    >
                                        <div className="truncate max-w-[150px]" title={item.Address}>
                                            {item.Address}
                                        </div>
                                    </td>
                                    <td
                                        className="px-4 py-4 whitespace-nowrap card-actions-cell"
                                        data-label="Actions"
                                        onClick={(e) => e.stopPropagation()}
                                    >
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

export default BranchTable;
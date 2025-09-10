// components/VendorTable.tsx
"use client";

import React from "react";
import Checkbox from "@mui/material/Checkbox";
import ResponsiveEditButton from "@/components/layout/ui/ResponsiveEditButton";
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
                                ID
                                <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Company Name
                                <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Contact Person
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Contact
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Email
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
                        {vendorItems.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                    No vendors found for Branch #{branchId}.
                                </td>
                            </tr>
                        ) : (
                            vendorItems.map((item) => (
                                <tr
                                    key={item.ID}
                                    className="bg-white hover:bg-gray-50"
                                >
                                    <td className="px-6 py-8 card-checkbox-cell" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedItems.includes(item.ID)}
                                            onChange={(e) =>
                                                onSelectItem(item.ID, e.target.checked)
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
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Vendor ID">
                                        {item.ID}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap card-name-cell" data-label="Company Name">
                                        <div className="name-content">
                                            <span className="font-medium">{item.Company_Name}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Contact Person">
                                        {item.Name}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Contact">
                                        {item.Contact}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Email">
                                        {item.Email}
                                    </td>
                                    <td
                                        className="px-4 py-4 whitespace-nowrap"
                                        data-label="Address"
                                    >
                                        {item.Address}
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

export default VendorTable;
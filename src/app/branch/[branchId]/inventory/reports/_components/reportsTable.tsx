"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReportsTableProps } from "@/types/reports";

const ReportsTable: React.FC<ReportsTableProps> = ({
    reportItems,
    filteredItems,
    unitFilter,
    onUnitFilterChange,
}) => {
    const branchId = filteredItems.length > 0 ? filteredItems[0].Branch_ID_fk : "";
    const uniqueUnits = Array.from(new Set(reportItems.map((i) => i.Unit)));

    return (
        <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm responsive-customer-table">
            <div className="rounded-sm table-container">
                <table className="min-w-full divide-y max-w-[800px] divide-gray-200 table-fixed">
                    <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
                        <tr>
                            <th className="relative px-4 py-3 text-left">
                                ID
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Name
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                <div className="flex flex-col gap-1">
                                    <DropdownMenu.Root modal={false}>
                                        <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                                            {unitFilter || "Unit"}
                                            <ChevronDown
                                                size={14}
                                                className="text-gray-500 ml-auto"
                                            />
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Content
                                            className="min-w-[200px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                                            sideOffset={6}
                                            onOpenAutoFocus={(e) => e.preventDefault()}
                                            onCloseAutoFocus={(e) => e.preventDefault()}
                                            style={{ zIndex: 1000 }}
                                        >
                                            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                                            <DropdownMenu.Item
                                                className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                                onClick={() => onUnitFilterChange("")}
                                            >
                                                All Units
                                            </DropdownMenu.Item>

                                            {uniqueUnits.map((unit) => (
                                                <DropdownMenu.Item
                                                    key={unit}
                                                    className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 text-black rounded outline-none"
                                                    onClick={() => onUnitFilterChange(unit)}
                                                >
                                                    {unit}
                                                </DropdownMenu.Item>
                                            ))}
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </div>
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Initial Stock
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Purchased
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Used
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Variance
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Wasteage
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Closing Stock
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Total Value
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y text-gray-500 divide-gray-300">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    {reportItems.length === 0
                                        ? `No inventory items found for Branch #${branchId}.`
                                        : "No inventory items match your search criteria."}
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr
                                    key={item.ID}
                                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="ID">
                                        {item.ID}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap text-sm card-name-cell" data-label="Name">
                                        <div className="name-content">
                                            <span className="font-medium">{item.Name}</span>
                                        </div>
                                    </td>

                                    <td
                                        className="px-4 py-4 text-sm text-gray-600"
                                        title={item.Unit}
                                        data-label="Unit"
                                    >
                                        {item.Unit}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Initial Stock">
                                        {item.InitialStock}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Purchased">
                                        {item.Purchased}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Used">
                                        {item.Used}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Variance">
                                        {item.Variance}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Wasteage">
                                        {item.Wasteage}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Closing Stock">
                                        {item.ClosingStock}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" data-label="Total Value">
                                        ${item.Total_Value}
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

export default ReportsTable;
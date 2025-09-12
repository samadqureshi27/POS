"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ResponsiveEditButton from "@/components/layout/ui/responsive-edit-button";
import { PaymentTableProps } from "@/lib/types/payment";
import CustomCheckbox from "@/components/layout/ui/custom-checkbox";

const PaymentTable: React.FC<PaymentTableProps> = ({
    paymentMethods,
    filteredItems,
    selectedItems,
    statusFilter,
    taxTypeFilter,
    onStatusFilterChange,
    onTaxTypeFilterChange,
    onSelectAll,
    onSelectItem,
    onEditItem,
    isAllSelected,
}) => {
    return (
        <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm responsive-customer-table">
            <div className="rounded-sm table-container">
                <table className="min-w-full divide-y max-w-[800px] divide-gray-200 table-fixed">
                    <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-6 text-left w-[2.5px]">
                                <CustomCheckbox
                                    checked={isAllSelected}
                                    onChange={onSelectAll}
                                />
                            </th>
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
                                            {statusFilter || "Payment Type"}
                                            <ChevronDown
                                                size={14}
                                                className="text-gray-500 ml-auto"
                                            />
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content
                                                className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                                                sideOffset={6}
                                            >
                                                <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                                                <DropdownMenu.Item
                                                    className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                                    onClick={() => onStatusFilterChange("")}
                                                >
                                                    Payment Type
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item
                                                    className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                                                    onClick={() => onStatusFilterChange("Cash")}
                                                >
                                                    Cash
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item
                                                    className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-blue-400 rounded outline-none"
                                                    onClick={() => onStatusFilterChange("Card")}
                                                >
                                                    Card
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item
                                                    className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                                                    onClick={() => onStatusFilterChange("Online")}
                                                >
                                                    Online
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                </div>
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>

                            <th className="relative px-4 py-3 text-left">
                                <div className="flex flex-col gap-1">
                                    <DropdownMenu.Root modal={false}>
                                        <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                                            {taxTypeFilter || "Tax Type"}
                                            <ChevronDown
                                                size={14}
                                                className="text-gray-500 ml-auto"
                                            />
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content
                                                className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                                                sideOffset={6}
                                            >
                                                <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                                                <DropdownMenu.Item
                                                    className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                                    onClick={() => onTaxTypeFilterChange("")}
                                                >
                                                    Tax Type
                                                </DropdownMenu.Item>

                                                {Array.from(new Set(paymentMethods.map((i) => i.TaxType))).map(
                                                    (taxType) => (
                                                        <DropdownMenu.Item
                                                            key={taxType}
                                                            className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                                            onClick={() => onTaxTypeFilterChange(taxType)}
                                                        >
                                                            {taxType}
                                                        </DropdownMenu.Item>
                                                    )
                                                )}
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                </div>
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>

                            <th className="relative px-4 py-3 text-left">
                                Tax Percentage
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>

                            <th className="relative px-4 py-3 text-left">
                                Status
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>

                            <th className="relative px-4 py-3 text-left">
                                Actions
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y text-gray-500 divide-gray-300">
                        {filteredItems.map((item) => (
                            <tr key={item.ID} className="bg-white hover:bg-gray-50">
                                <td className="px-6 py-8 card-checkbox-cell">
                                    <CustomCheckbox
                                        checked={selectedItems.includes(item.ID)}
                                        onChange={(checked) => onSelectItem(item.ID, checked)}
                                    />
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap" data-label="ID">{item.ID}</td>
                                <td className="px-4 py-4 whitespace-nowrap card-name-cell" data-label="Name">{item.Name}</td>

                                <td className="px-4 py-4 whitespace-nowrap" data-label="Payment Type">
                                    <span
                                        className={`inline-block w-20 text-right py-[2px] rounded-sm text-xs font-medium 
                ${item.PaymentType === "Cash" ? "text-red-400 border-red-600" : ""}
                ${item.PaymentType === "Card" ? "text-blue-400 border-blue-600" : ""}
                ${item.PaymentType === "Online" ? "text-green-400 border-green-700" : ""}`}
                                    >
                                        {item.PaymentType}
                                    </span>
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap" data-label="Tax Type">{item.TaxType}</td>
                                <td className="px-4 py-4 whitespace-nowrap" data-label="Tax Percentage">{item.TaxPercentage}%</td>

                                <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                                    <span
                                        className={`inline-block w-20 text-right py-[2px] rounded-sm text-xs font-medium 
                ${item.Status === "Active" ? "text-green-400 border-green-700" : "text-red-400 border-red-600"}`}
                                    >
                                        {item.Status}
                                    </span>
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentTable;
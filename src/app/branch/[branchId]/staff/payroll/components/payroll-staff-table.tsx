"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { StaffTableProps } from "@/lib/types/payroll";
import { Dropdown } from "./dropdown";
import ResponsiveDetailButton from "@/components/ui/responsive-detail-button";

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
        statusDropdownOpen,
        setStatusDropdownOpen,
        roleDropdownOpen,
        setRoleDropdownOpen,
        searchTerm,
    } = filters;

    return (
        <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm responsive-customer-table">
            <div className="rounded-sm table-container">
                <table className="min-w-full divide-y max-w-[800px] divide-gray-200 table-fixed">
                    <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
                        <tr>
                            <td className="card-checkbox-cell relative px-4 py-3 text-left">
                                Staff ID
                            </td>
                            <td className="card-name-cell relative px-4 py-3 text-left">
                                Name
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-[#d9d9e1]"></span>
                            </td>
                            <th className="relative px-4 py-3 text-left">
                                Contact
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-[#d9d9e1]"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                <div className="flex flex-col gap-1">
                                    <Dropdown
                                        isOpen={roleDropdownOpen}
                                        onOpenChange={setRoleDropdownOpen}
                                        trigger={
                                            <button className="px-2 py-1 rounded bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                                                {roleFilter || "Role"}
                                                <ChevronDown size={14} className="text-gray-500 ml-auto" />
                                            </button>
                                        }
                                    >
                                        <button
                                            className="w-full px-3 py-1 cursor-pointer hover:bg-gray-100 rounded outline-none text-left"
                                            onClick={() => {
                                                setRoleFilter("");
                                                setRoleDropdownOpen(false);
                                            }}
                                        >
                                            Role
                                        </button>
                                        {Array.from(new Set(staffItems.map((item) => item.Role))).map(
                                            (role) => (
                                                <button
                                                    key={role}
                                                    className="w-full px-3 py-1 cursor-pointer hover:bg-gray-100 text-black-700 rounded outline-none text-left"
                                                    onClick={() => {
                                                        setRoleFilter(role);
                                                        setRoleDropdownOpen(false);
                                                    }}
                                                >
                                                    {role}
                                                </button>
                                            )
                                        )}
                                    </Dropdown>
                                </div>
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                <div className="flex flex-col gap-1">
                                    <Dropdown
                                        isOpen={statusDropdownOpen}
                                        onOpenChange={setStatusDropdownOpen}
                                        trigger={
                                            <button className="px-2 py-1 rounded bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                                                {statusFilter || "Status"}
                                                <ChevronDown size={14} className="text-gray-500 ml-auto" />
                                            </button>
                                        }
                                    >
                                        <button
                                            className="w-full px-3 py-1 cursor-pointer hover:bg-gray-100 rounded outline-none text-left"
                                            onClick={() => {
                                                setStatusFilter("");
                                                setStatusDropdownOpen(false);
                                            }}
                                        >
                                            Status
                                        </button>
                                        <button
                                            className="w-full px-3 py-1 cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none text-left"
                                            onClick={() => {
                                                setStatusFilter("Paid");
                                                setStatusDropdownOpen(false);
                                            }}
                                        >
                                            Paid
                                        </button>
                                        <button
                                            className="w-full px-3 py-1 cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none text-left"
                                            onClick={() => {
                                                setStatusFilter("Unpaid");
                                                setStatusDropdownOpen(false);
                                            }}
                                        >
                                            Unpaid
                                        </button>
                                    </Dropdown>
                                </div>
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Salary
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Join Date
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left">
                                Details
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y text-gray-500 divide-gray-300">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    {searchTerm || statusFilter || roleFilter
                                        ? `No staff members match your search criteria for Branch #${branchId}.`
                                        : `No staff members found for Branch #${branchId}.`}
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr key={item.STAFF_ID} className="bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                    <td className="px-6 py-8 whitespace-nowrap" data-label="Staff ID">
                                        {`#${String(item.STAFF_ID).padStart(3, "0")}`}
                                    </td>
                                    <td className="card-name-cell px-4 py-4 whitespace-nowrap" data-label="Name">
                                        <span>{item.Name}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Contact">
                                        {item.Contact}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Role">
                                        {item.Role}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                                        <span
                                            className={`inline-block w-20 lg:text-center text-right py-[2px] rounded-md text-xs font-medium ${item.Status === "Paid"
                                                ? "text-green-400 border-green-600"
                                                : ""
                                                } ${item.Status === "Unpaid"
                                                    ? "text-red-400 border-red-600"
                                                    : ""
                                                }`}
                                        >
                                            {item.Status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Salary">
                                        {item.Salary.toLocaleString()}Rs
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap" data-label="Join Date">
                                        {new Date(item.JoinDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap card-actions-cell" data-label="Actions" onClick={(e) => e.stopPropagation()}>
                                        <ResponsiveDetailButton
                                            onClick={(e) => {
                                                e.stopPropagation();
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
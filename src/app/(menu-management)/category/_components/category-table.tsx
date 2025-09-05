"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ResponsiveEditButton from "@/components/layout/UI/ResponsiveEditButton";
import { CategoryItem } from '@/types/category';

interface CategoryTableProps {
  filteredItems: CategoryItem[];
  selectedItems: number[];
  statusFilter: "" | "Active" | "Inactive";
  searchTerm: string;
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: number, checked: boolean) => void;
  onStatusFilterChange: (status: "" | "Active" | "Inactive") => void;
  onEdit: (item: CategoryItem) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  filteredItems,
  selectedItems,
  statusFilter,
  searchTerm,
  isAllSelected,
  onSelectAll,
  onSelectItem,
  onStatusFilterChange,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-300 max-w-[100vw] responsive-customer-table">
      <div className="rounded-sm table-container">
        <table className="min-w-full divide-y max-w-[800px] border-b rounded-sm border-gray-200 divide-gray-200 table-fixed">
          <thead className="bg-white border-b text-gray-500 rounded-sm border-gray-200 py-50 sticky top-0 z-10">
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
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Name
                <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                <div className="flex flex-col gap-1">
                  <DropdownMenu.Root modal={false}>
                    <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                      {statusFilter || "Status"}
                      <ChevronDown size={14} className="text-gray-500 ml-auto" />
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[320px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                        sideOffset={6}
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
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </div>
              </th>
              <th className="relative px-4 py-3 text-left hidden md:table-cell">
                Description
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Parent
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Priority
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Actions
                <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y text-gray-500 divide-gray-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {searchTerm || statusFilter
                    ? "No categories match your search criteria."
                    : "No categories found."}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.ID} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-8 card-checkbox-cell">
                    <Checkbox
                      checked={selectedItems.includes(item.ID)}
                      onChange={(e) => onSelectItem(item.ID, e.target.checked)}
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
                  <td
                    className="px-4 py-4 whitespace-nowrap text-sm"
                    data-label="ID"
                  >
                    {item.ID}
                  </td>
                  <td
                    className="px-4 py-4 whitespace-nowrap text-sm font-medium card-name-cell"
                    data-label="Name"
                  >
                    {item.Name}
                  </td>
                  <td
                    className="px-4 py-4 whitespace-nowrap"
                    data-label="Status"
                  >
                    <span
                      className={`inline-block w-20 text-right py-[2px] rounded-sm text-xs font-medium 
                        ${item.Status === "Active" ? "text-green-400 " : ""}
                        ${item.Status === "Inactive" ? "text-red-400 " : ""}
                      `}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate !hidden min-[1100px]:!table-cell"
                    title={item.Description}
                    data-label="Description"
                  >
                    {item.Description}
                  </td>
                  <td
                    className="px-4 py-4 whitespace-nowrap text-sm"
                    data-label="Parent"
                  >
                    {item.Parent}
                  </td>
                  <td
                    className="px-4 py-4 whitespace-nowrap text-sm"
                    data-label="Priority"
                  >
                    {item.Priority}
                  </td>
                  <td
                    className="px-4 py-4 whitespace-nowrap card-actions-cell"
                    data-label="Actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ResponsiveEditButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
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

export default CategoryTable;
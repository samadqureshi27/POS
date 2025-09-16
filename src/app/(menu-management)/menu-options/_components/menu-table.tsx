// components/MenuTable.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ResponsiveEditButton from '@/components/ui/responsive-edit-button';
import { MenuItemOptions, MenuTableProps } from '@/lib/types/menuItemOptions';
import CustomCheckbox from "@/components/ui/custom-checkbox";

const MenuTable: React.FC<MenuTableProps> = ({
  filteredItems,
  selectedItems,
  searchTerm,
  DisplayFilter,
  isAllSelected,
  onSelectAll,
  onSelectItem,
  onEditItem,
  onDisplayFilterChange,
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
                <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Name
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                <div className="flex flex-col gap-1">
                  <DropdownMenu.Root modal={false}>
                    <DropdownMenu.Trigger className="px-2 py-1 rounded cursor-pointer bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                      {DisplayFilter || "Display Type"}
                      <ChevronDown
                        size={14}
                        className="text-gray-500 ml-auto"
                      />
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[320px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                        sideOffset={6}
                      >
                        <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                        <DropdownMenu.Item
                          className="px-3 py-1 cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() => onDisplayFilterChange("")}
                        >
                          Display Type
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-1 cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                          onClick={() => onDisplayFilterChange("Radio")}
                        >
                          Radio
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-1 cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                          onClick={() => onDisplayFilterChange("Select")}
                        >
                          Select
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-1 cursor-pointer hover:bg-blue-100 text-blue-400 rounded outline-none"
                          onClick={() => onDisplayFilterChange("Checkbox")}
                        >
                          Checkbox
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </div>
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
                  {searchTerm || DisplayFilter
                    ? "No categories match your search criteria."
                    : "No categories found."}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.ID}
                  className="bg-white hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-8 cursor-pointer whitespace-nowrap card-checkbox-cell">
                    <CustomCheckbox
                      checked={selectedItems.includes(item.ID)}
                      onChange={(checked) => onSelectItem(item.ID, checked)}
                    />
                  </td>

                  <td
                    data-label="ID"
                    className="px-4 py-4 whitespace-nowrap"
                  >
                    {item.ID}
                  </td>

                  <td
                    data-label="Name"
                    className="px-4 py-4 whitespace-nowrap font-medium card-name-cell"
                  >
                    {item.Name}
                  </td>

                  <td
                    data-label="Display Type"
                    className="px-4 py-4 whitespace-nowrap"
                  >
                    <span
                      className={`inline-block w-20 text-right lg:text-center py-[2px] rounded-sm text-xs font-medium 
            ${item.DisplayType === "Radio" ? "text-green-400" : ""}
            ${item.DisplayType === "Select" ? "text-red-400" : ""}
            ${item.DisplayType === "Checkbox" ? "text-blue-400" : ""}
          `}
                    >
                      {item.DisplayType}
                    </span>
                  </td>

                  <td
                    data-label="Priority"
                    className="px-4 py-4 whitespace-nowrap"
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

export default MenuTable;
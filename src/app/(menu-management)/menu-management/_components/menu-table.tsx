import React from "react";
import { Edit } from "lucide-react";
import CustomCheckbox from "./custom-checkbox";
import FilterDropdown from "./filter-dropdown";

interface MenuItem {
  ID: number;
  Name: string;
  Price: number;
  Category: string;
  StockQty: string;
  Status: "Active" | "Inactive";
}

interface MenuTableProps {
  filteredItems: MenuItem[];
  selectedItems: number[];
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: number, checked: boolean) => void;
  onEditItem: (item: MenuItem) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categories: string[];
}

const MenuTable: React.FC<MenuTableProps> = ({
  filteredItems,
  selectedItems,
  isAllSelected,
  onSelectAll,
  onSelectItem,
  onEditItem,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  categories
}) => {
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Inactive", label: "Inactive", className: "hover:bg-red-100 text-red-400" },
    { value: "Active", label: "Active", className: "hover:bg-green-100 text-green-400" }
  ];

  return (
    <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm responsive-customer-table">
      <div className="rounded-sm table-container">
        <table className="min-w-full divide-y max-h-[800px] divide-gray-200 table-fixed">
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
                Price
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                <div className="flex-col gap-1">
                  <FilterDropdown
                    label="Category"
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    options={categoryOptions}
                  />
                </div>
                <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Stock Qty
                <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                <div className="flex flex-col gap-1">
                  <FilterDropdown
                    label="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                  />
                </div>
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Actions
                <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
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
                <td className="px-4 py-4 whitespace-nowrap" data-label="ID">
                  {item.ID}
                </td>
                <td className="px-4 py-4 whitespace-nowrap card-name-cell" data-label="Name">
                  {item.Name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap" data-label="Price">
                  ${item.Price}
                </td>
                <td className="px-4 py-4 whitespace-nowrap" data-label="Category">
                  {item.Category}
                </td>
                <td className="px-4 py-4 whitespace-nowrap" data-label="StockQty">
                  {item.StockQty}
                </td>
                <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                  <span
                    className={`inline-block w-24 text-right py-[2px] rounded-sm text-xs font-medium ${
                      item.Status === "Inactive"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {item.Status}
                  </span>
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap card-actions-cell"
                  data-label="Actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditItem(item);
                    }}
                    className="text-gray-600 hover:text-gray-800 p-1"
                  >
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;
import React from "react";
import CustomCheckbox from "./custom-checkbox";
import ResponsiveEditButton from "@/components/layout/UI/ResponsiveEditButton";

interface RecipeOption {
  ID: number;
  Name: string;
  price: number;
}

interface RecipeTableProps {
  items: RecipeOption[];
  selectedItems: number[];
  searchTerm: string;
  displayFilter: string;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: number, checked: boolean) => void;
  onEditItem: (item: RecipeOption) => void;
}

const RecipeTable: React.FC<RecipeTableProps> = ({
  items,
  selectedItems,
  searchTerm,
  displayFilter,
  onSelectAll,
  onSelectItem,
  onEditItem,
}) => {
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.Name.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    return matchesSearch;
  });

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;

  return (
    <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm responsive-customer-table">
      <div className="rounded-sm table-container">
        <table className="min-w-full max-h-[800px] divide-y divide-gray-200 table-fixed">
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
                Price
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
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm || displayFilter
                    ? "No categories match your search criteria."
                    : "No categories found."}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.ID} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-8 card-checkbox-cell">
                    <CustomCheckbox
                      checked={selectedItems.includes(item.ID)}
                      onChange={(checked) => onSelectItem(item.ID, checked)}
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
                    className="px-4 py-4 whitespace-nowrap text-sm"
                    data-label="Price"
                  >
                    ${item.price}
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

export default RecipeTable;
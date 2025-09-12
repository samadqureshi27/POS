import React from 'react';
import IngredientsTableHeader from './ingredients-table-header';
import IngredientsTableRow from './ingredients-table-rows';

interface InventoryItem {
  ID: string;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Unit: string;
  Priority: number;
}

interface IngredientsTableProps {
  filteredItems: InventoryItem[];
  selectedItems: string[];
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: string, checked: boolean) => void;
  onEditItem: (item: InventoryItem) => void;
  statusFilter: "" | "Active" | "Inactive";
  setStatusFilter: (status: "" | "Active" | "Inactive") => void;
}

const IngredientsTable: React.FC<IngredientsTableProps> = ({
  filteredItems,
  selectedItems,
  isAllSelected,
  onSelectAll,
  onSelectItem,
  onEditItem,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw] shadow-sm responsive-customer-table">
      <div className="rounded-sm table-container">
        <table className="min-w-full divide-y max-h-[800px] divide-gray-200 table-fixed">
          <IngredientsTableHeader 
            isAllSelected={isAllSelected}
            onSelectAll={onSelectAll}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <tbody className="divide-y text-gray-500 divide-gray-300">
            {filteredItems.map((item) => (
              <IngredientsTableRow
                key={item.ID}
                item={item}
                isSelected={selectedItems.includes(item.ID)}
                onSelectItem={onSelectItem}
                onEditItem={onEditItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientsTable;
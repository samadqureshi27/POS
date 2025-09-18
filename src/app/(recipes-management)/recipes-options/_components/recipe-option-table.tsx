import React from "react";
import { Edit2 } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { RecipeOption } from "@/lib/types/recipe-options";

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

  const columns: DataTableColumn<RecipeOption>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "ID",
      width: "80px"
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "Name"
    },
    {
      key: "price",
      title: "Price",
      dataIndex: "price",
      render: (value) => `$${value}`
    }
  ];

  const actions: DataTableAction<RecipeOption>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <Edit2 className="h-4 w-4" />,
      onClick: (item) => onEditItem(item)
    }
  ];

  const emptyMessage = searchTerm || displayFilter
    ? "No recipe options match your search criteria."
    : "No recipe options found.";

  return (
    <DataTable
      data={filteredItems}
      columns={columns}
      actions={actions}
      selectable={true}
      selectedItems={selectedItems}
      onSelectAll={onSelectAll}
      onSelectItem={onSelectItem}
      getRowId={(item) => item.ID}
      maxHeight="600px"
      emptyMessage={emptyMessage}
      mobileResponsive={true}
      nameColumn="name"
    />
  );
};

export default RecipeTable;
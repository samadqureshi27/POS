import React from "react";
import { Edit } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { RecipeOption } from "@/lib/types/recipes";

interface RecipeTableProps {
  items: RecipeOption[];
  selectedItems: number[];
  statusFilter: "" | "Active" | "Inactive";
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: number, checked: boolean) => void;
  onStatusFilterChange: (status: "" | "Active" | "Inactive") => void;
  onEditItem: (item: RecipeOption) => void;
}

const RecipeTable: React.FC<RecipeTableProps> = ({
  items,
  selectedItems,
  statusFilter,
  onSelectAll,
  onSelectItem,
  onStatusFilterChange,
  onEditItem,
}) => {
  const statusOptions = [,
    { value: "Inactive", label: "Inactive", className: "hover:bg-red-100 text-red-400" },
    { value: "Active", label: "Active", className: "hover:bg-green-100 text-green-400" }
  ];

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
      key: "status",
      title: "Status",
      dataIndex: "Status",
      filterable: true,
      filterComponent: (
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={statusOptions}
        />
      ),
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "Description"
    },
    {
      key: "priority",
      title: "Priority",
      dataIndex: "Priority"
    }
  ];

  const actions: DataTableAction<RecipeOption>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: onEditItem
    }
  ];

  return (
    <DataTable
      data={items}
      columns={columns}
      actions={actions}
      selectable={true}
      selectedItems={selectedItems}
      onSelectAll={onSelectAll}
      onSelectItem={onSelectItem}
      getRowId={(item) => item.ID}
      maxHeight="600px"
      emptyMessage="No recipes found"
      mobileResponsive={true}
      nameColumn="name"
    />
  );
};

export default RecipeTable;
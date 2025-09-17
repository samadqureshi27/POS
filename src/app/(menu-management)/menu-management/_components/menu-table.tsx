import React from "react";
import { Edit } from "lucide-react";
import FilterDropdown from "./filter-dropdown";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

import {MenuItem,MenuTableProps} from "@/lib/types/menum";

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

  const columns: DataTableColumn<MenuItem>[] = [
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
      dataIndex: "Price",
      render: (value) => `$${value}`
    },
    {
      key: "category",
      title: "Category",
      dataIndex: "Category",
      filterable: true,
      filterComponent: (
        <FilterDropdown
          label="Category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
        />
      )
    },
    {
      key: "stockQty",
      title: "Stock Qty",
      dataIndex: "StockQty"
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
          onChange={setStatusFilter}
          options={statusOptions}
        />
      ),
      render: (value) => <StatusBadge status={value} />
    }
  ];

  const actions: DataTableAction<MenuItem>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: onEditItem
    }
  ];

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
      emptyMessage="No menu items found"
    />
  );
};

export default MenuTable;
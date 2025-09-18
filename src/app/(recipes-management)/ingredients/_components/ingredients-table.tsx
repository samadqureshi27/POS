import React from 'react';
import { Edit } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";

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
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Inactive", label: "Inactive", className: "hover:bg-red-100 text-red-400" },
    { value: "Active", label: "Active", className: "hover:bg-green-100 text-green-400" }
  ];

  const columns: DataTableColumn<InventoryItem>[] = [
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
          onChange={setStatusFilter}
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
      key: "unit",
      title: "Unit",
      dataIndex: "Unit"
    },
    {
      key: "priority",
      title: "Priority",
      dataIndex: "Priority"
    }
  ];

  const actions: DataTableAction<InventoryItem>[] = [
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
      emptyMessage="No ingredients found"
      mobileResponsive={true}
      nameColumn="name"
    />
  );
};

export default IngredientsTable;
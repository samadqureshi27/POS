"use client";

import React from "react";
import { Edit2 } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { CategoryItem, CategoryTableProps } from '@/lib/types/category';

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
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Active", label: "Active", className: "text-green-600" },
    { value: "Inactive", label: "Inactive", className: "text-red-600" }
  ];

  const columns: DataTableColumn<CategoryItem>[] = [
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
          options={statusOptions}
          onChange={onStatusFilterChange}
        />
      ),
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "Description",
      hideOnMobile: true,
      render: (value) => (
        <span className="max-w-xs truncate block" title={value}>
          {value}
        </span>
      )
    },
    {
      key: "parent",
      title: "Parent",
      dataIndex: "Parent"
    },
    {
      key: "priority",
      title: "Priority",
      dataIndex: "Priority"
    }
  ];

  const actions: DataTableAction<CategoryItem>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <Edit2 className="h-4 w-4" />,
      onClick: (item) => onEdit(item)
    }
  ];

  const emptyMessage = searchTerm || statusFilter
    ? "No categories match your search criteria."
    : "No categories found.";

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

export default CategoryTable;
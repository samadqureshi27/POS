// components/MenuTable.tsx
import React from 'react';
import { Edit } from 'lucide-react';
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { MenuItemOptions, MenuTableProps } from '@/lib/types/menuItemOptions';

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
  const displayTypeOptions = [
    { value: "Radio", label: "Radio", className: "hover:bg-green-100 text-green-400" },
    { value: "Select", label: "Select", className: "hover:bg-red-100 text-red-400" },
    { value: "Checkbox", label: "Checkbox", className: "hover:bg-blue-100 text-blue-400" }
  ];

  const columns: DataTableColumn<MenuItemOptions>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "ID",
      width: "80px"
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "Name",
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: "displayType",
      title: "Display Type",
      dataIndex: "DisplayType",
      filterable: true,
      filterComponent: (
        <FilterDropdown
          label="Display Type"
          value={DisplayFilter}
          onChange={onDisplayFilterChange}
          options={displayTypeOptions}
        />
      ),
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: "priority",
      title: "Priority",
      dataIndex: "Priority"
    }
  ];

  const actions: DataTableAction<MenuItemOptions>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: onEditItem
    }
  ];

  const emptyMessage = searchTerm || DisplayFilter
    ? "No menu options match your search criteria."
    : "No menu options found.";

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
      emptyMessage={emptyMessage}
      mobileResponsive={true}
      nameColumn="name"
    />
  );
};

export default MenuTable;
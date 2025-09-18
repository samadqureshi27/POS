// _components/OrderTable/OrderTable.tsx
import React from 'react';
import { Eye } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { OrderItem } from '@/lib/types';

interface OrderTableProps {
  items: OrderItem[];
  filteredItems: OrderItem[];
  statusFilter: "" | "Active" | "Inactive";
  unitFilter: string;
  setStatusFilter: (filter: "" | "Active" | "Inactive") => void;
  setUnitFilter: (filter: string) => void;
  loading: boolean;
}

const OrderTable: React.FC<OrderTableProps> = ({
  items,
  filteredItems,
  statusFilter,
  unitFilter,
  setStatusFilter,
  setUnitFilter,
  loading,
}) => {
  const statusOptions = [
    { value: "Inactive", label: "Inactive", className: "hover:bg-red-100 text-red-400" },
    { value: "Active", label: "Active", className: "hover:bg-green-100 text-green-400" }
  ];

  const typeOptions = [
    ...Array.from(new Set(items.map((i) => i.Type))).map(type => ({ value: type, label: type }))
  ];

  const columns: DataTableColumn<OrderItem>[] = [
    {
      key: "order",
      title: "Order#",
      dataIndex: "Order"
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "Name"
    },
    {
      key: "quantity",
      title: "Quantity",
      dataIndex: "number_item"
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
      key: "type",
      title: "Type",
      dataIndex: "Type",
      filterable: true,
      filterComponent: (
        <FilterDropdown
          label="Type"
          value={unitFilter}
          onChange={setUnitFilter}
          options={typeOptions}
        />
      )
    },
    {
      key: "payment",
      title: "Payment",
      dataIndex: "Payment"
    },
    {
      key: "total",
      title: "Total",
      dataIndex: "Total"
    },
    {
      key: "date",
      title: "Date",
      dataIndex: "Time_Date"
    }
  ];

  const actions: DataTableAction<OrderItem>[] = [
    {
      key: "details",
      label: "Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (record) => {
        // Handle details action
        console.log("View details for order:", record.Order);
      }
    }
  ];

  const emptyMessage = loading
    ? "Loading orders..."
    : "No orders found matching your criteria";

  return (
    <DataTable
      data={filteredItems}
      columns={columns}
      actions={actions}
      selectable={false}
      getRowId={(item) => item.Order}
      maxHeight="600px"
      emptyMessage={emptyMessage}
      loading={loading}
      mobileResponsive={true}
      nameColumn="name"
    />
  );
};

export default OrderTable;
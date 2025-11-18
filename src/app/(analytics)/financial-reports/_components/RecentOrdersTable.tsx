// components/tables/RecentOrdersTable.tsx
import React from 'react';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { OrderItem } from '@/lib/types/analytics';
import { formatCurrency } from '@/lib/util/formatters';

interface RecentOrdersTableProps {
  orders: OrderItem[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  maxRows?: number;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
  searchTerm,
  onSearchChange,
  maxRows = 8
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default" as const;
      case "Pending":
        return "secondary" as const;
      case "Cancelled":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "Dine in":
        return "secondary" as const;
      case "Takeaway":
        return "default" as const;
      case "Delivery":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  const displayedOrders = orders.slice(0, maxRows);

  const columns: DataTableColumn<OrderItem>[] = [
    {
      key: "orderId",
      title: "Order ID",
      dataIndex: "Order_ID",
      width: "120px"
    },
    {
      key: "type",
      title: "Type",
      dataIndex: "Type",
      render: (value) => (
        <Badge variant={getTypeVariant(value)} className="text-xs">
          {value}
        </Badge>
      )
    },
    {
      key: "total",
      title: "Total",
      dataIndex: "Total",
      render: (value) => <span className="font-medium">PKR {formatCurrency(value)}</span>
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "Status",
      render: (value) => (
        <Badge variant={getStatusVariant(value)} className="text-xs">
          {value}
        </Badge>
      )
    }
  ];

  return (
    <div className="bg-card rounded-sm border shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Recent Orders</h3>
            <p className="text-sm text-muted-foreground mt-1">Latest order activity</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-48 pr-8 pl-3 py-2 border border-input rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <DataTable
          data={displayedOrders}
          columns={columns}
          selectable={false}
          showHeader={true}
          emptyMessage="No recent orders found"
          mobileResponsive={true}
          nameColumn="orderId"
        />
      </div>
    </div>
  );
};
// components/tables/RecentOrdersTable.tsx
import React from 'react';
import { Search } from 'lucide-react';
import { OrderItem } from '@/lib/types/analytics';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-500";
      case "Pending":
        return "text-blue-500";
      case "Cancelled":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Dine in":
        return "text-yellow-500";
      case "Takeaway":
        return "text-green-500";
      case "Delivery":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-500">Order ID</th>
              <th className="px-6 py-3 text-left text-sm text-gray-500">Type</th>
              <th className="px-6 py-3 text-left text-sm text-gray-500">Total</th>
              <th className="px-6 py-3 text-left text-sm text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.slice(0, maxRows).map((order) => (
              <tr key={order.Order_ID} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{order.Order_ID}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(order.Type)}`}>
                    {order.Type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">PKR {order.Total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.Status)}`}>
                    {order.Status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
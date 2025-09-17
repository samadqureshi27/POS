// components/tables/TopCustomersTable.tsx
import React from 'react';
import { CustomerItem } from '@/lib/types/analytics';
import { StarRating } from '@/components/ui/StarRating';

interface TopCustomersTableProps {
  customers: CustomerItem[];
}

export const TopCustomersTable: React.FC<TopCustomersTableProps> = ({ customers }) => {
  return (
    <div className="bg-white rounded-sm border border-gray-300 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold">Top Customers</h3>
        <p className="text-sm text-gray-500 mt-1">By total orders</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.Customer_ID} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#2c2c2c] rounded-full flex items-center justify-center text-white text-sm">
                  {customer.Name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium">{customer.Name}</p>
                  <p className="text-sm text-gray-500">{customer.Email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{customer.Total_Orders} orders</p>
                <StarRating rating={customer.Feedback_Rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


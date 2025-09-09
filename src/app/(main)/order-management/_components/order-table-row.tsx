// _components/OrderTable/OrderTableRow.tsx
import React from 'react';
import ResponsiveDetailButton from "@/components/layout/UI/ResponsiveDetailButton";
import { OrderItem } from '@/types';

interface OrderTableRowProps {
  item: OrderItem;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({ item }) => {
  return (
    <tr className="bg-white hover:bg-gray-50">
      <td
        className="px-4 py-4 whitespace-nowrap card-name-cell"
        data-label="Order"
      >
        {item.Order}
      </td>
      <td
        className="px-4 py-4 whitespace-nowrap"
        data-label="Name"
      >
        {item.Name}
      </td>
      <td
        className="px-4 py-4 whitespace-nowrap text-center"
        data-label="Quantity"
      >
        {item.number_item}
      </td>
      <td
        className="px-4 py-4 whitespace-nowrap"
        data-label="Status"
      >
        <span
          className={`inline-block w-20 text-right py-1 rounded-sm text-xs font-medium 
            ${item.Status === "Inactive"
              ? "text-red-400"
              : "text-green-400"
            }
          `}
        >
          {item.Status}
        </span>
      </td>
      <td
        className="px-4 py-4 whitespace-nowrap"
        data-label="Type"
      >
        <span className="py-1 text-right text-blue-400 rounded-sm text-sm">
          {item.Type}
        </span>
      </td>
      <td
        className="px-4 py-4 whitespace-nowrap"
        data-label="Payment"
      >
        {item.Payment}
      </td>
      <td
        className="px-4 py-4 whitespace-nowrap font-semibold text-gray-900"
        data-label="Total"
      >
        {item.Total}
      </td>
      <td
        className="px-4 py-4 whitespace-nowrap text-sm text-gray-600"
        data-label="Date"
      >
        {item.Time_Date}
      </td>
      <td 
        className="px-4 py-4 whitespace-nowrap card-actions-cell" 
        data-label="Actions" 
        onClick={(e) => e.stopPropagation()}
      >
        <ResponsiveDetailButton
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </td>
    </tr>
  );
};

export default OrderTableRow;
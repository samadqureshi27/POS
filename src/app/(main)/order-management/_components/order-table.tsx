// _components/OrderTable/OrderTable.tsx
import React from 'react';
import { ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { OrderItem } from '@/types/types';
import OrderTableRow from './order-table-row';

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
  return (
    <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm responsive-customer-table">
      <div className="rounded-sm table-container">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
            <tr>
              <th className="relative px-4 py-3 text-left">
                Order#
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Name
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Quantity
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <DropdownMenu.Root modal={false}>
                    <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                      {statusFilter || "Status"}
                      <ChevronDown size={14} className="text-gray-500 ml-auto" />
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                        sideOffset={6}
                      >
                        <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                        <DropdownMenu.Item
                          className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() => setStatusFilter("")}
                        >
                          All Status
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                          onClick={() => setStatusFilter("Active")}
                        >
                          Active
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                          onClick={() => setStatusFilter("Inactive")}
                        >
                          Inactive
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>

              <th className="relative px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <DropdownMenu.Root modal={false}>
                    <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                      {unitFilter || "Type"}
                      <ChevronDown size={14} className="text-gray-500 ml-auto" />
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                        sideOffset={6}
                      >
                        <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                        <DropdownMenu.Item
                          className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() => setUnitFilter("")}
                        >
                          All Types
                        </DropdownMenu.Item>
                        {Array.from(new Set(items.map((i) => i.Type))).map((Type) => (
                          <DropdownMenu.Item
                            key={Type}
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                            onClick={() => setUnitFilter(Type)}
                          >
                            {Type}
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>

              <th className="relative px-4 py-3 text-left">
                Payment
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Total
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Date
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
              <th className="relative px-4 py-3 text-left">
                Details
                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y text-gray-500 divide-gray-300">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  {loading
                    ? "Loading orders..."
                    : "No orders found matching your criteria"}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <OrderTableRow key={item.Order} item={item} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
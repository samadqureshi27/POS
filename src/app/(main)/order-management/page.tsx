"use client";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
} from "lucide-react";

interface OrderItem {
  Order: string;
  Name: string;
  number_item: string;
  Status: "Active" | "Inactive";
  Type: string;
  Payment: string;
  Total: string;
  Time_Date: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface OrderStats {
  mostOrdered: OrderItem[];
  leastOrdered: OrderItem[];
  orderTypeStats: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

class OrderAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Mock data for OrderItem suitable for a coffee shop or restaurant
  private static mockData: OrderItem[] = [
    {
      Order: "#001",
      Name: "Cappuccino",
      number_item: "45",
      Status: "Active",
      Type: "Dine-In",
      Payment: "Card",
      Total: "$4.50",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#002",
      Name: "Latte",
      number_item: "38",
      Status: "Active",
      Type: "Takeaway",
      Payment: "Cash",
      Total: "$5.00",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#003",
      Name: "Espresso",
      number_item: "52",
      Status: "Active",
      Type: "Dine-In",
      Payment: "Online",
      Total: "$3.00",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#004",
      Name: "Croissant",
      number_item: "23",
      Status: "Inactive",
      Type: "Delivery",
      Payment: "Online",
      Total: "$6.50",
      Time_Date: "21-08-2025",
    },
    {
      Order: "#005",
      Name: "Americano",
      number_item: "41",
      Status: "Active",
      Type: "Takeaway",
      Payment: "Card",
      Total: "$3.75",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#006",
      Name: "Sandwich",
      number_item: "19",
      Status: "Active",
      Type: "Dine-In",
      Payment: "Cash",
      Total: "$8.50",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#007",
      Name: "Mocha",
      number_item: "34",
      Status: "Active",
      Type: "Delivery",
      Payment: "Online",
      Total: "$5.50",
      Time_Date: "21-08-2025",
    },
    {
      Order: "#008",
      Name: "Tea",
      number_item: "27",
      Status: "Inactive",
      Type: "Takeaway",
      Payment: "Cash",
      Total: "$2.50",
      Time_Date: "21-08-2025",
    },
  ];

  // ✅ GET /api/orders/
  static async getOrders(): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Orders fetched successfully",
    };
  }

  // ✅ GET /api/orders/stats/
  static async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    await this.delay(600);

    const sortedByQuantity = [...this.mockData].sort(
      (a, b) => parseInt(b.number_item) - parseInt(a.number_item)
    );

    // Calculate order type statistics
    const typeStats = this.mockData.reduce((acc, order) => {
      acc[order.Type] = (acc[order.Type] || 0) + parseInt(order.number_item);
      return acc;
    }, {} as Record<string, number>);

    const orderTypeStats = [
      { name: "Dine-In", value: typeStats["Dine-In"] || 0, fill: "#959AA3" },
      { name: "Takeaway", value: typeStats["Takeaway"] || 0, fill: "#CCAB4D" },
      { name: "Delivery", value: typeStats["Delivery"] || 0, fill: "#000000" },
    ];

    return {
      success: true,
      data: {
        mostOrdered: sortedByQuantity.slice(0, 5),
        leastOrdered: sortedByQuantity.slice(-5).reverse(),
        orderTypeStats,
      },
      message: "Order statistics fetched successfully",
    };
  }

  // ✅ GET /api/orders/filter/
  static async getFilteredOrders(filters: {
    search?: string;
    status?: "Active" | "Inactive";
    type?: string;
    dateRange?: string;
    customDate?: string;
  }): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(400);

    let filteredData = [...this.mockData];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.Order.toLowerCase().includes(searchTerm) ||
          item.Name.toLowerCase().includes(searchTerm) ||
          item.Type.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filteredData = filteredData.filter((item) => item.Status === filters.status);
    }

    if (filters.type) {
      filteredData = filteredData.filter((item) => item.Type === filters.type);
    }

    if (filters.customDate) {
      filteredData = filteredData.filter((item) => item.Time_Date === filters.customDate);
    }

    return {
      success: true,
      data: filteredData,
      message: "Filtered orders fetched successfully",
    };
  }
}

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
  >
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X size={16} />
    </button>
  </div>
);

const OrderManagementPage = () => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<OrderItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [unitFilter, setUnitFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Stats data
  const [orderStats, setOrderStats] = useState<OrderStats>({
    mostOrdered: [],
    leastOrdered: [],
    orderTypeStats: []
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Date filter states
  const options = ["Today", "Week", "Month", "Quarter", "Year", "Custom date"];
  const [active, setActive] = useState("Week");
  const [customDate, setCustomDate] = useState<Date | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load orders on mount
  useEffect(() => {
    loadOrders();
    loadOrderStats();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderAPI.getOrders();
      if (response.success) {
        setItems(response.data);
        setFilteredItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadOrderStats = async () => {
    try {
      setStatsLoading(true);
      const response = await OrderAPI.getOrderStats();
      if (response.success) {
        setOrderStats(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch order statistics");
      }
    } catch (error) {
      console.error("Error fetching order stats:", error);
      showToast("Failed to load order statistics", "error");
    } finally {
      setStatsLoading(false);
    }
  };

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, unitFilter, customDate, items]);

  const applyFilters = async () => {
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter || undefined,
        type: unitFilter || undefined,
        customDate: customDate ? formatDate(customDate) : undefined,
      };

      const response = await OrderAPI.getFilteredOrders(filters);
      if (response.success) {
        setFilteredItems(response.data);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredItems(items); // Fallback to original data
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems(
      checked ? [...selectedItems, id] : selectedItems.filter((i) => i !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((i) => i.Order) : []);
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Order Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-6 bg-gray-50 min-h-screen overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-4 pl-20">Order Management</h1>

      <div className="flex gap-2 pl-20 mb-8 items-center">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setActive(option)}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors
            ${active === option
                ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }
          `}
          >
            {option}
          </button>
        ))}

        {/* Show calendar if "Custom date" is active */}
        {active === "Custom date" && (
          <DatePicker
            selected={customDate}
            onChange={(date: Date | null) => setCustomDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            className="ml-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        )}
      </div>

      <div className="flex gap-6">
        {/* Most Ordered Table */}
        <div className="bg-gray-50 ml-20 rounded-lg overflow-x-auto w-1/3">
          <div className="max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-center flex-1 gap-2 max-w-[450px] max-h-[50px] rounded-md mb-2 p-4 bg-white shadow-sm">
              <div>
                <p className="text-2xl mb-1">Most Ordered</p>
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200 table-fixed text-sm">
              <thead className="bg-white border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left">Rank</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Total Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {statsLoading ? (
                  <tr>
                    <td colSpan={3} className="px-2 py-4 text-center text-gray-500">
                      Loading statistics...
                    </td>
                  </tr>
                ) : (
                  orderStats.mostOrdered.map((item, index) => (
                    <tr key={item.Order} className="bg-white hover:bg-gray-50">
                      <td className="px-2 py-2">#{index + 1}</td>
                      <td className="px-2 py-2">{item.Name}</td>
                      <td className="px-2 py-2">{item.number_item}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Least Ordered Table */}
        <div className="bg-gray-50 rounded-lg overflow-x-auto w-1/3">
          <div className="max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-center flex-1 gap-2 max-w-[450px] max-h-[50px] rounded-md mb-2 p-4 bg-white shadow-sm">
              <div>
                <p className="text-2xl mb-1">Least Ordered</p>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 table-fixed text-sm">
              <thead className="bg-white border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left">Rank</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Total Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {statsLoading ? (
                  <tr>
                    <td colSpan={3} className="px-2 py-4 text-center text-gray-500">
                      Loading statistics...
                    </td>
                  </tr>
                ) : (
                  orderStats.leastOrdered.map((item, index) => (
                    <tr key={item.Order} className="bg-white hover:bg-gray-50">
                      <td className="px-2 py-2">#{index + 1}</td>
                      <td className="px-2 py-2">{item.Name}</td>
                      <td className="px-2 py-2">{item.number_item}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Radial Chart */}
        <div className="w-1/3 flex items-center justify-center overflow-hidden">
          <div className="max-h-[300px]">
            <div className="flex items-center justify-center">
              <p className="text-2xl mb-1">Most Type of Orders</p>
            </div>
            <div className="flex items-center justify-center">
              {statsLoading ? (
                <div className="flex items-center justify-center h-[250px]">
                  <div className="animate-spin h-8 w-8 border-b-2 border-gray-600 rounded-full"></div>
                </div>
              ) : (
                <RadialBarChart
                  width={370}
                  height={250}
                  cx="40%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  barSize={20}
                  data={orderStats.orderTypeStats}
                >
                  <RadialBar minAngle={15} clockWise dataKey="value" />
                  <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} Orders`,
                      props.payload.name,
                    ]}
                  />
                </RadialBarChart>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
       <div className="mb-6 mt-8 ml-20 flex items-center justify-end gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search Orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>


      {/* Table + filters */}
      <div className="bg-gray-50 rounded-lg ml-20 shadow-sm overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{
                      color: "#2C2C2C",
                      "&.Mui-checked": { color: "#2C2C2C" },
                    }}
                  />
                </th>
                <th className="relative px-4 py-3 text-left">
                  Order#
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Quantity
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {statusFilter || "Status"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[240px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
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
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-700 rounded outline-none"
                            onClick={() => setStatusFilter("Inactive")}
                          >
                            Inactive
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {unitFilter || "Type"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[240px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() => setUnitFilter("")}
                          >
                            All Types
                          </DropdownMenu.Item>

                          {Array.from(new Set(items.map((i) => i.Type))).map(
                            (Type) => (
                              <DropdownMenu.Item
                                key={Type}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                onClick={() => setUnitFilter(Type)}
                              >
                                {Type}
                              </DropdownMenu.Item>
                            )
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Payment
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Total
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Date
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    {loading ? "Loading orders..." : "No orders found matching your criteria"}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.Order} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedItems.includes(item.Order)}
                        onChange={(e) =>
                          handleSelectItem(item.Order, e.target.checked)
                        }
                        sx={{
                          color: "#d9d9e1",
                          "&.Mui-checked": { color: "#d9d9e1" },
                        }}
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                      {item.Order}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{item.Name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {item.number_item}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block w-20 text-center px-2 py-1 rounded-md text-xs font-medium border
                    ${item.Status === "Inactive"
                            ? "text-red-600 border-red-600 bg-red-50"
                            : "text-green-700 border-green-700 bg-green-50"
                          }
                  `}
                      >
                        {item.Status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                        {item.Type}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">{item.Payment}</td>
                    <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-900">
                      {item.Total}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.Time_Date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementPage;
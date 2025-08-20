"use client";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
} from "lucide-react";

interface InventoryItem {
  ID: number;
  Name: string;
  Unit: string;
  InitialStock: number;
  Purchased: number;
  Used: number;
  Variance: number;
  Wasteage: number;
  ClosingStock: number;
  Total_Value: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Dummy inventory data matching the InventoryItem interface
  private static mockData: InventoryItem[] = [
    {
      ID: 1,
      Name: "Ketchup",
      Unit: "Kilograms (Kg's)",
      InitialStock: 12,
      Purchased: 50,
      Used: 25,
      Variance: 5,
      Wasteage: 5,
      ClosingStock: 27,
      Total_Value: 135,
    },
    {
      ID: 2,
      Name: "Cheese",
      Unit: "Grams (g)",
      InitialStock: 500,
      Purchased: 200,
      Used: 300,
      Variance: 10,
      Wasteage: 5,
      ClosingStock: 385,
      Total_Value: 770,
    },
    {
      ID: 3,
      Name: "Tomato Sauce",
      Unit: "Liters (L)",
      InitialStock: 10,
      Purchased: 15,
      Used: 20,
      Variance: 2,
      Wasteage: 1,
      ClosingStock: 2,
      Total_Value: 40,
    },
    {
      ID: 4,
      Name: "Chicken Breast",
      Unit: "Kilograms (Kg's)",
      InitialStock: 20,
      Purchased: 30,
      Used: 40,
      Variance: 3,
      Wasteage: 2,
      ClosingStock: 5,
      Total_Value: 250,
    },
    {
      ID: 5,
      Name: "Lettuce",
      Unit: "Pieces",
      InitialStock: 30,
      Purchased: 10,
      Used: 25,
      Variance: 1,
      Wasteage: 2,
      ClosingStock: 12,
      Total_Value: 24,
    },
  ];

  // GET /api/menu-items/
  static async getInventoryItems(): Promise<ApiResponse<InventoryItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Category items fetched successfully",
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
    className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}
  >
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X size={16} />
    </button>
  </div>
);

const ReportsPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [unitFilter, setUnitFilter] = useState("");

  useEffect(() => {
    loadInventoryItems();
  }, []);

  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getInventoryItems();
      if (response.success) {
        setItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch category items");
      }
    } catch (error) {
      console.error("Error fetching category items:", error);
      showToast("Failed to load category items", "error");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered items for better performance
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        item.Name.toLowerCase().includes(q) ||
        item.ID.toString().includes(q) ||
        item.Unit.toLowerCase().includes(q);

      const matchesUnit = unitFilter ? item.Unit === unitFilter : true;
      return matchesQuery && matchesUnit;
    });
  }, [items, searchTerm, unitFilter]);

  // Generate consistent usage data using item ID as seed
  const itemsWithUsage = useMemo(() => {
    return items.map((item) => {
      // Use item ID as seed for consistent random numbers
      const seed = item.ID;
      const usageCount = Math.floor((seed * 17 + 23) % 100);
      return {
        ...item,
        usageCount,
      };
    });
  }, [items]);

  // Find most used item
  const mostUsedItem = useMemo(() => {
    if (itemsWithUsage.length === 0) return null;
    return itemsWithUsage.reduce((max, item) =>
      item.usageCount > max.usageCount ? item : max
    );
  }, [itemsWithUsage]);

  // Find least used item
  const leastUsedItem = useMemo(() => {
    if (itemsWithUsage.length === 0) return null;
    return itemsWithUsage.reduce((min, item) =>
      item.usageCount < min.usageCount ? item : min
    );
  }, [itemsWithUsage]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    setSelectedItems(
      checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((id) => id !== itemId)
    );
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  // Get unique units for dropdown
  const uniqueUnits = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.Unit)));
  }, [items]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Inventory Report...</p>
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

      <h1 className="text-3xl font-semibold mb-4 pl-20">Inventory Report</h1>

      {/* Top summary row like the screenshot */}
      <div className="flex gap-4 mb-6 pl-20">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-3xl font-semibold mb-1">
              {mostUsedItem?.Name || "N/A"}
            </p>
            <p className="text-gray-500">
              Most Used ({mostUsedItem?.usageCount || 0} times)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-3xl font-semibold mb-1">
              {leastUsedItem?.Name || "N/A"}
            </p>
            <p className="text-gray-500">
              Least Used ({leastUsedItem?.usageCount || 0} times)
            </p>
          </div>
        </div>
      </div>

      {/* Action bar search */}
      <div className="mb-6 pl-20 flex items-center justify-between gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>

      {/* Table + filters */}
      <div className="bg-white rounded-lg ml-20 shadow-sm overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="relative px-4 py-3 text-left">ID</th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex flex-col gap-1">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {unitFilter || "Unit"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w=[320px] rounded-md bg-white shadow-md border-none p-1 relative outline-none ml-34"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() => setUnitFilter("")}
                          >
                            All Units
                          </DropdownMenu.Item>

                          {uniqueUnits.map((unit) => (
                            <DropdownMenu.Item
                              key={unit}
                              className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                              onClick={() => setUnitFilter(unit)}
                            >
                              {unit}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Initial Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Purchased
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Used
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Variance
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Wasteage
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Closing Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Total Value
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm !== "" || unitFilter !== ""
                      ? "No items match your search criteria."
                      : "No inventory items found."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.ID} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.ID}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {item.Name}
                    </td>
                    <td
                      className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate"
                      title={item.Unit}
                    >
                      {item.Unit}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.InitialStock}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Purchased}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Used}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Variance}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Wasteage}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.ClosingStock}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Total_Value}
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

export default ReportsPage;
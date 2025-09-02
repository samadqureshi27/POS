"use client";
import { ChevronDown, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Trash2,
  Search,
  CheckCircle,
  X,
  Edit,
} from "lucide-react";
import ActionBar from "@/components/layout/UI/ActionBar";

interface InventoryItem {
  ID: number;
  Branch_ID_fk: string;
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

  // Updated dummy inventory data with branch foreign keys
  private static mockData: InventoryItem[] = [
    {
      ID: 1,
      Branch_ID_fk: "1",
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
      Branch_ID_fk: "1",
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
      Branch_ID_fk: "1",
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
      Branch_ID_fk: "2",
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
      Branch_ID_fk: "2",
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
    {
      ID: 6,
      Branch_ID_fk: "2",
      Name: "Beef Patties",
      Unit: "Pieces",
      InitialStock: 100,
      Purchased: 50,
      Used: 80,
      Variance: 5,
      Wasteage: 10,
      ClosingStock: 55,
      Total_Value: 275,
    },
    {
      ID: 7,
      Branch_ID_fk: "3",
      Name: "Flour",
      Unit: "Kilograms (Kg's)",
      InitialStock: 25,
      Purchased: 15,
      Used: 20,
      Variance: 2,
      Wasteage: 3,
      ClosingStock: 15,
      Total_Value: 75,
    },
    {
      ID: 8,
      Branch_ID_fk: "3",
      Name: "Milk",
      Unit: "Liters (L)",
      InitialStock: 40,
      Purchased: 20,
      Used: 35,
      Variance: 3,
      Wasteage: 2,
      ClosingStock: 20,
      Total_Value: 100,
    }
  ];

  // GET inventory items filtered by branch ID
  static async getInventoryItemsByBranch(branchId: string): Promise<ApiResponse<InventoryItem[]>> {
    await this.delay(800);

    // Filter inventory items by branch ID
    const filteredData = this.mockData.filter(item => item.Branch_ID_fk === branchId);

    return {
      success: true,
      data: filteredData,
      message: `Inventory items for branch ${branchId} fetched successfully`,
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
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-out transform ${type === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"
        } ${isVisible && !isClosing
          ? "translate-x-0 opacity-100"
          : isClosing
            ? "translate-x-full opacity-0"
            : "translate-x-full opacity-0"
        }`}
    >
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
      <button
        onClick={handleClose}
        className="ml-2 hover:bg-black/10 rounded p-1 transition-colors duration-200"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const ReportsPage = () => {
  const params = useParams();
  const branchId = params?.branchId as string;

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [unitFilter, setUnitFilter] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (branchId) {
      loadInventoryItems();
    }
  }, [branchId]);

  const loadInventoryItems = async () => {
    if (!branchId) {
      showToast("Branch ID not found", "error");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await MenuAPI.getInventoryItemsByBranch(branchId);
      if (response.success) {
        setItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch inventory items");
      }
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      showToast("Failed to load inventory items", "error");
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

  // Calculate total inventory value
  const totalInventoryValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.Total_Value, 0);
  }, [items]);

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

  if (!branchId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Branch ID not found in URL parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-17">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold">
          Inventory Report - Branch #{branchId}
        </h1>
      </div>

      {/* Summary Cards - Most and Least Used Items */}
      <div className="grid grid-cols-1 max-w-[100vw]  lg:grid-cols-2   gap-4 mb-8 lg:max-w-[50vw]">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[100%] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl mb-1">{mostUsedItem ? mostUsedItem.Name : "N/A"}</p>
            <p className="text-1xl text-gray-500">Most Used({mostUsedItem ? mostUsedItem.usageCount : 0} times)</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[100%] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl mb-1"> {leastUsedItem ? leastUsedItem.Name : "N/A"}
            </p>
            <p className="text-1xl text-gray-500">Least Used( {leastUsedItem ? leastUsedItem.usageCount : 0} times)</p>
          </div>
        </div>
      </div>

     <ActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
      />


      {/* Responsive Table with Global CSS Classes */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm responsive-customer-table">
        <div className="rounded-sm table-container">
          <table className="min-w-full divide-y max-w-[800px] divide-gray-200 table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
              <tr>
                <th className="relative px-4 py-3 text-left">
                  ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex  flex-col gap-1">
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                        {unitFilter || "Unit"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content
                        className="min-w-[200px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                        sideOffset={6}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        style={{ zIndex: 1000 }}
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
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 text-black rounded outline-none"
                            onClick={() => setUnitFilter(unit)}
                          >
                            {unit}
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left ">
                  Initial Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left ">
                  Purchased
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left ">
                  Used
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left ">
                  Variance
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left ">
                  Wasteage
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left ">
                  Closing Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left ">
                  Total Value
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-500 divide-gray-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm !== "" || unitFilter !== ""
                      ? `No inventory items match your search criteria for Branch #${branchId}.`
                      : items.length === 0
                        ? `No inventory items found for Branch #${branchId}.`
                        : "No inventory items found."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.ID}
                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="ID">
                      {item.ID}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm  card-name-cell" data-label="Name">
                      <div className="name-content">
                        <span className="font-medium">{item.Name}</span>
                      </div>
                    </td>

                    <td
                      className="px-4 py-4 text-sm text-gray-600 "
                      title={item.Unit}
                      data-label="Unit"
                    >
                      {item.Unit}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Initial Stock">
                      {item.InitialStock}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Purchased">
                      {item.Purchased}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Used">
                      {item.Used}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Variance">
                      {item.Variance}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Wasteage">
                      {item.Wasteage}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Closing Stock">
                      {item.ClosingStock}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" data-label="Total Value">
                      ${item.Total_Value}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}

export default ReportsPage;
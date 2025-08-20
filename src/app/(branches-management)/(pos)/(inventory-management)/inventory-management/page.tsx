"use client";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState, useEffect } from "react";

import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit, Save
} from "lucide-react";

interface InventoryItem {
  ID: number;
  Name: string;
  Unit: string;
  Status: "Low" | "Medium" | "High";
  InitialStock: number;
  AddedStock: number;
  UpdatedStock: number;
  Threshold: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Function to calculate status based on threshold
const calculateStatus = (updatedStock: number, threshold: number): "Low" | "Medium" | "High" => {
  if (updatedStock <= threshold) {
    return "Low";
  } else if (updatedStock <= threshold * 1.25) { // 25% above threshold
    return "Medium";
  } else {
    return "High";
  }
};

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Mock data for InventoryItem suitable for a coffee shop or restaurant
  private static mockData: InventoryItem[] = [
    {
      ID: 1,
      Name: "Espresso Beans",
      Unit: "Kilograms (Kg's)",
      Status: "High",
      InitialStock: 20,
      AddedStock: 5,
      UpdatedStock: 25,
      Threshold: 10,
    },
    {
      ID: 2,
      Name: "Milk",
      Unit: "Liters",
      Status: "Medium",
      InitialStock: 30,
      AddedStock: 10,
      UpdatedStock: 40,
      Threshold: 15,
    },
    {
      ID: 3,
      Name: "Sugar",
      Unit: "Kilograms (Kg's)",
      Status: "Low",
      InitialStock: 8,
      AddedStock: 2,
      UpdatedStock: 10,
      Threshold: 12,
    },
    {
      ID: 4,
      Name: "Croissants",
      Unit: "Pieces",
      Status: "Medium",
      InitialStock: 50,
      AddedStock: 20,
      UpdatedStock: 70,
      Threshold: 30,
    },
    {
      ID: 5,
      Name: "Tea Bags",
      Unit: "Boxes",
      Status: "High",
      InitialStock: 15,
      AddedStock: 5,
      UpdatedStock: 20,
      Threshold: 5,
    },
    {
      ID: 6,
      Name: "Chocolate Syrup",
      Unit: "Bottles",
      Status: "Low",
      InitialStock: 3,
      AddedStock: 2,
      UpdatedStock: 5,
      Threshold: 6,
    },
    {
      ID: 7,
      Name: "Whipped Cream",
      Unit: "Cans",
      Status: "Medium",
      InitialStock: 10,
      AddedStock: 5,
      UpdatedStock: 15,
      Threshold: 8,
    },
    {
      ID: 8,
      Name: "Paper Cups",
      Unit: "Packs",
      Status: "High",
      InitialStock: 40,
      AddedStock: 10,
      UpdatedStock: 50,
      Threshold: 20,
    },
    {
      ID: 9,
      Name: "Vanilla Syrup",
      Unit: "Bottles",
      Status: "Medium",
      InitialStock: 7,
      AddedStock: 3,
      UpdatedStock: 10,
      Threshold: 5,
    },
    {
      ID: 10,
      Name: "Butter",
      Unit: "Kilograms (Kg's)",
      Status: "Low",
      InitialStock: 4,
      AddedStock: 1,
      UpdatedStock: 5,
      Threshold: 6,
    },
  ].map(item => ({
    ...item,
    Status: calculateStatus(item.UpdatedStock, item.Threshold)
  }));

  // ✅ GET /api/inventory-items/
  static async getInventoryItems(): Promise<ApiResponse<InventoryItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Inventory items fetched successfully",
    };
  }

  // ✅ POST /api/inventory-items/
  static async createInventoryItem(
    item: Omit<InventoryItem, "ID">
  ): Promise<ApiResponse<InventoryItem>> {
    await this.delay(1000);
    const newId = this.mockData.length > 0 ? Math.max(...this.mockData.map(i => i.ID)) + 1 : 1;
    const updatedStock = item.InitialStock + item.AddedStock;
    const newItem: InventoryItem = {
      ...item,
      ID: newId,
      UpdatedStock: updatedStock,
      Status: calculateStatus(updatedStock, item.Threshold),
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Inventory item created successfully",
    };
  }

  // ✅ PUT /api/inventory-items/{id}/
  static async updateInventoryItem(
    id: number,
    item: Partial<InventoryItem>
  ): Promise<ApiResponse<InventoryItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    const updatedStock = (item.InitialStock || 0) + (item.AddedStock || 0);
    const updatedItem = {
      ...this.mockData[index],
      ...item,
      UpdatedStock: updatedStock,
      Status: calculateStatus(updatedStock, item.Threshold || this.mockData[index].Threshold),
    };

    this.mockData[index] = updatedItem;
    return {
      success: true,
      data: this.mockData[index],
      message: "Inventory item updated successfully",
    };
  }

  // ✅ DELETE /api/inventory-items/{id}/
  static async deleteInventoryItem(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData.splice(index, 1);

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
    }));

    return {
      success: true,
      data: null,
      message: "Inventory item deleted successfully",
    };
  }

  // ✅ DELETE /api/inventory-items/bulk-delete/
  static async bulkDeleteInventoryItem(
    ids: number[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
    }));

    return {
      success: true,
      data: null,
      message: `${ids.length} inventory items deleted successfully`,
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

const InventoryManagementPage = () => {
  const [Item, setInventoryItem] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Low" | "Medium" | "High">("");
  const [unitFilter, setUnitFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<Omit<InventoryItem, "ID">>({
    Name: "",
    Unit: "",
    Status: "Low",
    InitialStock: 0,
    AddedStock: 0,
    UpdatedStock: 0,
    Threshold: 0,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // load inventory on mount
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getInventoryItems();
      if (response.success) {
        setInventoryItem(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch inventory items");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      showToast("Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  // filter
  const filteredItems = Item.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      item.Name.toLowerCase().includes(q) ||
      item.ID ||
      item.Unit.toLowerCase().includes(q);
    const matchesStatus = statusFilter ? item.Status === statusFilter : true;
    const matchesUnit = unitFilter ? item.Unit === unitFilter : true;
    return matchesQuery && matchesStatus && matchesUnit;
  });

  // create
  const handleCreateItem = async (itemData: Omit<InventoryItem, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createInventoryItem(itemData);
      if (response.success) {
        setInventoryItem((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        showToast(response.message || "Item created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<InventoryItem, "ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateInventoryItem(
        editingItem.ID,
        itemData
      );
      if (response.success) {
        setInventoryItem(
          Item.map((item) =>
            item.ID === editingItem.ID ? response.data : item
          )
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Item updated successfully", "success");
      }
    } catch (error) {
      showToast("Failed to update menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.bulkDeleteInventoryItem(selectedItems);
      if (response.success) {
        setInventoryItem((prev) => {
          const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
          return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
        });
        setSelectedItems([]);
        showToast(response.message || "Items deleted successfully", "success");
      }
    } catch (error) {
      showToast("Failed to delete menu items", "error");
    } finally {
      setActionLoading(false);
    }
  };


  // modal form
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Unit: editingItem.Unit,
        Status: editingItem.Status,
        InitialStock: editingItem.InitialStock,
        AddedStock: editingItem.AddedStock,
        UpdatedStock: editingItem.UpdatedStock,
        Threshold: editingItem.Threshold,
      });
    } else {
      setFormData({
        Name: "",
        Unit: "",
        Status: "Low",
        InitialStock: 0,
        AddedStock: 0,
        UpdatedStock: 0,
        Threshold: 0,
      });
      setPreview(null);
    }
  }, [editingItem, isModalOpen]);

  // Update UpdatedStock and Status whenever InitialStock, AddedStock, or Threshold changes
  useEffect(() => {
    const newUpdatedStock = formData.InitialStock + formData.AddedStock;
    const newStatus = calculateStatus(newUpdatedStock, formData.Threshold);

    setFormData((prev) => ({
      ...prev,
      UpdatedStock: newUpdatedStock,
      Status: newStatus,
    }));
  }, [formData.InitialStock, formData.AddedStock, formData.Threshold]);

  const handleModalSubmit = () => {
    if (
      !formData.Name.trim()
    ) {
      return;
    }
    const payload = {
      ...formData,
      UpdatedStock: formData.InitialStock + formData.AddedStock,
      Status: calculateStatus(formData.InitialStock + formData.AddedStock, formData.Threshold),
    };
    if (editingItem) {
      handleUpdateItem(payload);
    } else {
      handleCreateItem(payload);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
  };
  // Add random usage count (0–99) to each item
  const itemsWithUsage = Item.map((item) => ({
    ...item,
    usageCount: Math.floor(Math.random() * 100),
  }));

  // Find most used item
  const mostUsedItem = itemsWithUsage.reduce(
    (max, item) => (item.usageCount > max.usageCount ? item : max),
    itemsWithUsage[0] || { usageCount: 0 }
  );

  // Find least used item
  const leastUsedItem = itemsWithUsage.reduce(
    (min, item) => (item.usageCount < min.usageCount ? item : min),
    itemsWithUsage[0] || { usageCount: 0 }
  );
  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedItems(
      checked ? [...selectedItems, id] : selectedItems.filter((i) => i !== id)
    );
  };

  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Inventory...</p>
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

      <h1 className="text-3xl font-semibold mb-4 pl-20">
        Inventory Management
      </h1>

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

      {/* Action bar: add, delete, search */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        {/* Action Buttons */}
        <div className="flex gap-3 pl-20">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length > 0}
            className={`flex items-center text-center gap-2 w-[100px] px-4 py-2 rounded-lg transition-colors ${selectedItems.length === 0
              ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Plus size={16} />
            Add
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={!isSomeSelected || actionLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSomeSelected && !actionLoading
              ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Trash2 size={16} />
            {actionLoading ? "Deleting..." : "Delete Selected"}
          </button>
        </div>

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
                  ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
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
                          className="min-w-[240px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() => setUnitFilter("")}
                          >
                            Unit
                          </DropdownMenu.Item>

                          {Array.from(new Set(Item.map((i) => i.Unit))).map(
                            (unit) => (
                              <DropdownMenu.Item
                                key={unit}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                onClick={() => setUnitFilter(unit)}
                              >
                                {unit}
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
                            Status
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-700 rounded outline-none"
                            onClick={() => setStatusFilter("Low")}
                          >
                            Low
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-yellow-100 text-yellow-700 rounded outline-none"
                            onClick={() => setStatusFilter("Medium")}
                          >
                            Medium
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                            onClick={() => setStatusFilter("High")}
                          >
                            High
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  InitialStock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Added Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Updated Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Threshold
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.ID} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedItems.includes(item.ID)}
                      onChange={(e) =>
                        handleSelectItem(item.ID, e.target.checked)
                      }
                      sx={{
                        color: "#d9d9e1",
                        "&.Mui-checked": { color: "#d9d9e1" },
                      }}
                    />
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">{item.ID}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Name}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Unit}</td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block w-24 text-center px-2 py-[2px] rounded-md text-xs font-medium border
                  ${item.Status === "Low" ? "text-red-600 border-red-600" : ""}
                  ${item.Status === "Medium"
                          ? "text-yellow-600 border-yellow-600"
                          : ""
                        }
                  ${item.Status === "High"
                          ? "text-green-700 border-green-700"
                          : ""
                        }
                `}
                    >
                      {item.Status}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.InitialStock}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.AddedStock}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.UpdatedStock}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.Threshold}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={
                          () => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                        className="text-gray-600 hover:text-gray-800 p-1"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-71">
          <div className="bg-white rounded-lg p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
              {/* Item Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter item name"
                  required
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit of Measurement
                </label>
                <select
                  value={formData.Unit}
                  onChange={(e) =>
                    setFormData({ ...formData, Unit: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                >
                  <option value="">Select Unit</option>
                  <option value="Kg">Kilogram (Kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="Liters">Liters</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Boxes">Boxes</option>
                  <option value="Packets">Packets</option>
                  <option value="Bottles">Bottles</option>
                </select>
              </div>

              {/* Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                  <span className="text-xs text-gray-500 ml-1">(Alert when below)</span>
                </label>
                <input
                  type="number"
                  value={formData.Threshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Threshold: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Initial Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Stock
                  <span className="text-xs text-gray-500 ml-1">(Starting quantity)</span>
                </label>
                <input
                  type="number"
                  value={formData.InitialStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      InitialStock: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Added Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Stock
                  <span className="text-xs text-gray-500 ml-1">(Stock to add)</span>
                </label>
                <input
                  type="number"
                  value={formData.AddedStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      AddedStock: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Current Stock Display */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Current Stock
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-lg">
                      {(formData.InitialStock || 0) + (formData.AddedStock || 0)} {formData.Unit || 'units'}
                    </span>
                    <div className="text-sm text-gray-500">
                      Initial: {formData.InitialStock || 0} + Added: {formData.AddedStock || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Status Indicator */}
              {((formData.InitialStock || 0) + (formData.AddedStock || 0)) > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                    <span className="text-xs text-gray-500 ml-1">(Auto-calculated based on threshold)</span>
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                    <div className={`w-4 h-4 rounded-full ${formData.Status === 'Low'
                        ? 'bg-red-500'
                        : formData.Status === 'Medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}></div>
                    <span className={`text-sm font-semibold ${formData.Status === 'Low'
                        ? 'text-red-600'
                        : formData.Status === 'Medium'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
                      {formData.Status.toUpperCase()} STOCK
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      Threshold: {formData.Threshold || 0} {formData.Unit || 'units'}
                    </span>
                  </div>
                </div>
              )}


            </div>

            {/* Fixed Action Buttons */}
            <div className="flex gap-3 pt-6 justify-end border-t border-gray-200 mt-auto">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={
                  !formData.Name.trim() ||
                  actionLoading
                }
                className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${!formData.Name.trim() ||
                    actionLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#2C2C2C] text-white hover:bg-gray-700"
                  }`}
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                    {editingItem ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingItem ? "Update Item" : "Add Item"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default InventoryManagementPage;
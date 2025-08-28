"use client";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Save,
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
  supplier: string;
  BranchID: number; // Added branch ID field
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Function to calculate status based on threshold
const calculateStatus = (
  updatedStock: number,
  threshold: number
): "Low" | "Medium" | "High" => {
  if (updatedStock <= threshold) {
    return "Low";
  } else if (updatedStock <= threshold * 1.25) {
    return "Medium";
  } else {
    return "High";
  }
};

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Extended mock data with branch assignments
  private static mockData: InventoryItem[] = [
    // Branch 1 items
    {
      ID: 1,
      Name: "Espresso Beans",
      Unit: "Kilograms (Kg's)",
      Status: "High",
      InitialStock: 20,
      AddedStock: 5,
      UpdatedStock: 25,
      Threshold: 10,
      supplier: "Premium Coffee Co.",
      BranchID: 1,
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
      supplier: "Dairy Fresh Ltd",
      BranchID: 1,
    },
    {
      ID: 3,
      Name: "Sugar",
      Unit: "Kilograms (Kg's)",
      Status: "Low",
      InitialStock: 8,
      AddedStock: 2,
      UpdatedStock: 10,
      supplier: "Sweet Supply Inc",
      Threshold: 12,
      BranchID: 1,
    },
    // Branch 2 items
    {
      ID: 4,
      Name: "Croissants",
      Unit: "Pieces",
      Status: "Medium",
      InitialStock: 50,
      AddedStock: 20,
      supplier: "Bakery Express",
      UpdatedStock: 70,
      Threshold: 30,
      BranchID: 2,
    },
    {
      ID: 5,
      Name: "Tea Bags",
      Unit: "Boxes",
      supplier: "Tea Masters",
      Status: "High",
      InitialStock: 15,
      AddedStock: 5,
      UpdatedStock: 20,
      Threshold: 5,
      BranchID: 2,
    },
    // Branch 3 items
    {
      ID: 6,
      Name: "Chocolate Syrup",
      Unit: "Bottles",
      Status: "Low",
      InitialStock: 3,
      AddedStock: 2,
      UpdatedStock: 5,
      Threshold: 6,
      supplier: "Sweet Treats Co",
      BranchID: 3,
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
      supplier: "Cream Factory",
      BranchID: 3,
    },
    // Additional items for all branches
    {
      ID: 8,
      Name: "Paper Cups",
      Unit: "Packs",
      Status: "High",
      InitialStock: 40,
      AddedStock: 10,
      UpdatedStock: 50,
      Threshold: 20,
      supplier: "Packaging Plus",
      BranchID: 1,
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
      supplier: "Flavor World",
      BranchID: 2,
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
      supplier: "Dairy Best",
      BranchID: 3,
    },
  ].map((item) => ({
    ...item,
    Status: calculateStatus(item.UpdatedStock, item.Threshold),
  }));

  // ✅ GET /api/inventory-items/ - Now filtered by branch ID
  static async getInventoryItems(branchId: number): Promise<ApiResponse<InventoryItem[]>> {
    await this.delay(800);
    const branchItems = this.mockData.filter(item => item.BranchID === branchId);
    return {
      success: true,
      data: [...branchItems],
      message: `Inventory items for Branch #${branchId} fetched successfully`,
    };
  }

  // ✅ POST /api/inventory-items/ - Now includes branch ID
  static async createInventoryItem(
    item: Omit<InventoryItem, "ID">,
    branchId: number
  ): Promise<ApiResponse<InventoryItem>> {
    await this.delay(1000);
    const branchItems = this.mockData.filter(i => i.BranchID === branchId);
    const newId = branchItems.length > 0
      ? Math.max(...branchItems.map(i => i.ID)) + 1
      : Math.max(...this.mockData.map(i => i.ID)) + 1;

    const updatedStock = item.InitialStock + item.AddedStock;
    const newItem: InventoryItem = {
      ...item,
      ID: newId,
      UpdatedStock: updatedStock,
      Status: calculateStatus(updatedStock, item.Threshold),
      BranchID: branchId,
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: `Inventory item created successfully for Branch #${branchId}`,
    };
  }

  // ✅ PUT /api/inventory-items/{id}/ - Branch aware update
  static async updateInventoryItem(
    id: number,
    item: Partial<InventoryItem>,
    branchId: number
  ): Promise<ApiResponse<InventoryItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id && i.BranchID === branchId);
    if (index === -1) throw new Error("Item not found in this branch");

    const updatedStock = (item.InitialStock || 0) + (item.AddedStock || 0);
    const updatedItem = {
      ...this.mockData[index],
      ...item,
      UpdatedStock: updatedStock,
      Status: calculateStatus(
        updatedStock,
        item.Threshold || this.mockData[index].Threshold
      ),
      BranchID: branchId, // Ensure branch ID remains consistent
    };

    this.mockData[index] = updatedItem;
    return {
      success: true,
      data: this.mockData[index],
      message: `Inventory item updated successfully for Branch #${branchId}`,
    };
  }

  // ✅ DELETE /api/inventory-items/{id}/ - Branch aware delete
  static async deleteInventoryItem(id: number, branchId: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id && i.BranchID === branchId);
    if (index === -1) throw new Error("Item not found in this branch");

    this.mockData.splice(index, 1);

    return {
      success: true,
      data: null,
      message: `Inventory item deleted successfully from Branch #${branchId}`,
    };
  }

  // ✅ DELETE /api/inventory-items/bulk-delete/ - Branch aware bulk delete
  static async bulkDeleteInventoryItem(
    ids: number[],
    branchId: number
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter(
      (item) => !(ids.includes(item.ID) && item.BranchID === branchId)
    );

    return {
      success: true,
      data: null,
      message: `${ids.length} inventory items deleted successfully from Branch #${branchId}`,
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

const InventoryManagementPage = () => {
  const params = useParams();
  const branchId = parseInt(params?.branchId as string) || 1;

  const [Item, setInventoryItem] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "" | "Low" | "Medium" | "High"
  >("");
  const [unitFilter, setUnitFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<Omit<InventoryItem, "ID" | "BranchID">>({
    Name: "",
    Unit: "",
    Status: "Low",
    InitialStock: 0,
    AddedStock: 0,
    UpdatedStock: 0,
    Threshold: 0,
    supplier: "",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load inventory for specific branch
  useEffect(() => {
    loadInventory();
  }, [branchId]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getInventoryItems(branchId);
      if (response.success) {
        setInventoryItem(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch inventory items");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      showToast(`Failed to load inventory for Branch #${branchId}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  const filteredItems = Item.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      item.Name.toLowerCase().includes(q) ||
      item.supplier.toLowerCase().includes(q) ||
      item.Unit.toLowerCase().includes(q);
    const matchesStatus = statusFilter ? item.Status === statusFilter : true;
    const matchesUnit = unitFilter ? item.Unit === unitFilter : true;
    return matchesQuery && matchesStatus && matchesUnit;
  });

  // Create item for current branch
  const handleCreateItem = async (itemData: Omit<InventoryItem, "ID" | "BranchID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createInventoryItem(itemData, branchId);
      if (response.success) {
        setInventoryItem((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        showToast(response.message || "Item created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create inventory item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<InventoryItem, "ID" | "BranchID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateInventoryItem(
        editingItem.ID,
        itemData,
        branchId
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
      showToast("Failed to update inventory item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.bulkDeleteInventoryItem(selectedItems, branchId);
      if (response.success) {
        setInventoryItem((prev) => prev.filter((i) => !selectedItems.includes(i.ID)));
        setSelectedItems([]);
        showToast(response.message || "Items deleted successfully", "success");
      }
    } catch (error) {
      showToast("Failed to delete inventory items", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Modal form
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
        supplier: editingItem.supplier,
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
        supplier: "",
      });
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
    if (!formData.Name.trim()) {
      return;
    }
    const payload = {
      ...formData,
      UpdatedStock: formData.InitialStock + formData.AddedStock,
      Status: calculateStatus(
        formData.InitialStock + formData.AddedStock,
        formData.Threshold
      ),
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

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
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
          Inventory Management - Branch #{branchId}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-[95vw]">
        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl mb-1">{mostUsedItem?.Name || "N/A"}</p>
            <p className="text-1xl text-gray-500">Most Used ({mostUsedItem?.usageCount || 0} times)</p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl mb-1">{leastUsedItem?.Name || "N/A"}
            </p>
            <p className="text-1xl text-gray-500">
              Least Used ({leastUsedItem?.usageCount || 0} times)</p>
          </div>
        </div>



      </div>

      {/* Action bar: add, delete, search */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        {/* Action Buttons */}
        <div className="flex gap-3 h-[40px]">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length > 0}
            className={`flex items-center text-center gap-2 w-[100px] px-6.5 py-2 rounded-sm transition-colors ${selectedItems.length === 0
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
            className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors ${isSomeSelected && !actionLoading
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
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 h-[40px] py-2 border bg-white border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      {/* Table + filters */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw] shadow-sm">
        <div className="rounded-sm">
          <table className="min-w-full max-w-[800px] divide-y divide-gray-200 table-fixed">

            <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-6 text-left w-[2.5px]">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disableRipple
                    sx={{
                      transform: "scale(1.5)", // size adjustment
                      p: 0, // remove extra padding
                    }}
                    icon={
                      // unchecked grey box
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                          ry="3"
                          fill="#e0e0e0" // grey inside
                          stroke="#d1d1d1" // border grey
                          strokeWidth="2"
                        />
                      </svg>
                    }
                    checkedIcon={
                      // checked with tick
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                          ry="3"
                          fill="#e0e0e0" // grey inside
                          stroke="#2C2C2C" // dark border
                          strokeWidth="2"
                        />
                        <path
                          d="M9 12.5l2 2 4-4.5"
                          fill="none"
                          stroke="#2C2C2C"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
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
                          className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
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
                          className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
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
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                            onClick={() => setStatusFilter("Low")}
                          >
                            Low
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-yellow-100 text-yellow-400 rounded outline-none"
                            onClick={() => setStatusFilter("Medium")}
                          >
                            Medium
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                            onClick={() => setStatusFilter("High")}
                          >
                            High
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  InitialStock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Added Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Updated Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Threshold
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-500 divide-gray-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm || statusFilter || unitFilter
                      ? `No inventory items match your search criteria for Branch #${branchId}.`
                      : `No inventory items found for Branch #${branchId}.`}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.ID} className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-8">
                      <Checkbox
                        checked={selectedItems.includes(item.ID)}
                        onChange={(e) =>
                          handleSelectItem(item.ID, e.target.checked)
                        }
                        disableRipple
                        sx={{
                          p: 0,
                          transform: "scale(1.5)",
                        }}
                        icon={
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="3"
                              ry="3"
                              fill="#e0e0e0"
                              stroke="#d1d1d1"
                              strokeWidth="2"
                            />
                          </svg>
                        }
                        checkedIcon={
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="3"
                              ry="3"
                              fill="#e0e0e0"
                              stroke="#2C2C2C"
                              strokeWidth="2"
                            />
                            <path
                              d="M9 12.5l2 2 4-4.5"
                              fill="none"
                              stroke="#2C2C2C"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        }
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">{item.ID}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{item.Name}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{item.Unit}</td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block w-24 text-center px-2 py-[2px] rounded-sm text-xs font-medium 
                    ${item.Status === "Low" ? "text-red-400 border-red-400" : ""}
                    ${item.Status === "Medium"
                            ? "text-yellow-400 border-yellow-600"
                            : ""
                          }
                    ${item.Status === "High"
                            ? "text-green-400 border-green-700"
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
                          onClick={() => {
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
          <div className="bg-white rounded-lg p-6 w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingItem ? "Edit Inventory Item" : `Add New Inventory Item - Branch #${branchId}`}
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

              {/* Supplier */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter supplier name"
                  required
                />
              </div>

              {/* Unit */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Measurement
                </label>

                <div className="flex items-center gap-2">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="px-3 py-2 w-full rounded-lg text-sm bg-white border border-gray-300 outline-none flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]">
                      {formData.Unit || "Select Unit"}
                      <ChevronDown size={16} className="text-gray-500" />
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[240px] rounded-sm bg-white shadow-md border border-gray-200 p-1 relative outline-none z-100"
                        sideOffset={6}
                      >
                        <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 z-100" />

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "" })
                          }
                        >
                          Select Unit
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "Kilograms (Kg's)" })
                          }
                        >
                          Kilogram (Kg)
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "Grams (g)" })
                          }
                        >
                          Gram (g)
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "Liters" })
                          }
                        >
                          Liters
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "Milliliters (ml)" })
                          }
                        >
                          Milliliter (ml)
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "Pieces" })
                          }
                        >
                          Pieces
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "Boxes" })
                          }
                        >
                          Boxes
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "Bottles" })
                          }
                        >
                          Bottles
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "Cans" })
                          }
                        >
                          Cans
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() =>
                            setFormData({ ...formData, Unit: "Packs" })
                          }
                        >
                          Packs
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>

              {/* Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                  <span className="text-xs text-gray-500 ml-1">
                    (Alert when below)
                  </span>
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
                  <span className="text-xs text-gray-500 ml-1">
                    (Starting quantity)
                  </span>
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
                  <span className="text-xs text-gray-500 ml-1">
                    (Stock to add)
                  </span>
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
                      {(formData.InitialStock || 0) +
                        (formData.AddedStock || 0)}{" "}
                      {formData.Unit || "units"}
                    </span>
                    <div className="text-sm text-gray-500">
                      Initial: {formData.InitialStock || 0} + Added:{" "}
                      {formData.AddedStock || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Status Indicator */}
              {(formData.InitialStock || 0) + (formData.AddedStock || 0) >
                0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Status
                      <span className="text-xs text-gray-500 ml-1">
                        (Auto-calculated based on threshold)
                      </span>
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                      <div
                        className={`w-4 h-4 rounded-full ${formData.Status === "Low"
                          ? "bg-red-500"
                          : formData.Status === "Medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          }`}
                      ></div>
                      <span
                        className={`text-sm font-semibold ${formData.Status === "Low"
                          ? "text-red-600"
                          : formData.Status === "Medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                          }`}
                      >
                        {formData.Status.toUpperCase()} STOCK
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Threshold: {formData.Threshold || 0}{" "}
                        {formData.Unit || "units"}
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
                disabled={!formData.Name.trim() || !formData.supplier.trim() || actionLoading}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${!formData.Name.trim() || !formData.supplier.trim() || actionLoading
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
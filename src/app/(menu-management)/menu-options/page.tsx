"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Grip,
  Edit,
  Filter,
  Save,
  ImageIcon,
  Move,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";

interface MenuItemOptions {
  ID: number;
  Name: string;
  DisplayType: "Radio" | "Select" | "Checkbox"; // Radio = one, Select = one or none, Checkbox = multiple
  Priority: number;
  OptionValue: string[];
  OptionPrice: number[];
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: MenuItemOptions[] = [
    {
      ID: 1,
      Name: "Cheese Type",
      DisplayType: "Radio",
      Priority: 1,
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
    },
    {
      ID: 2,
      Name: "Toppings",
      DisplayType: "Checkbox",
      Priority: 2,
      OptionValue: ["Olives", "Mushrooms", "Pepperoni", "Onions"],
      OptionPrice: [0.5, 0.5, 1, 0.3],
    },
    {
      ID: 3,
      Name: "Cold Drink",
      DisplayType: "Select",
      Priority: 3,
      OptionValue: ["Coke", "Sprite", "Fanta"],
      OptionPrice: [1.5, 1.5, 1.5],
    },
    {
      ID: 4,
      Name: "Bread Type",
      DisplayType: "Radio",
      Priority: 4,
      OptionValue: ["White", "Whole Wheat", "Multigrain"],
      OptionPrice: [0, 0.2, 0.3],
    },
    {
      ID: 5,
      Name: "Sauce",
      DisplayType: "Checkbox",
      Priority: 5,
      OptionValue: ["Tomato", "Barbecue", "Garlic", "Pesto"],
      OptionPrice: [0, 0.5, 0.3, 0.7],
    },
    {
      ID: 6,
      Name: "Spice Level",
      DisplayType: "Select",
      Priority: 6,
      OptionValue: ["Mild", "Medium", "Hot"],
      OptionPrice: [0, 0, 0],
    },
    {
      ID: 7,
      Name: "Add-ons",
      DisplayType: "Checkbox",
      Priority: 7,
      OptionValue: ["Extra Cheese", "Bacon", "Avocado"],
      OptionPrice: [1, 1.5, 2],
    },
    {
      ID: 8,
      Name: "Cooking Preference",
      DisplayType: "Radio",
      Priority: 8,
      OptionValue: ["Rare", "Medium", "Well Done"],
      OptionPrice: [0, 0, 0],
    },
    {
      ID: 9,
      Name: "Side Dish",
      DisplayType: "Select",
      Priority: 9,
      OptionValue: ["Fries", "Salad", "Coleslaw"],
      OptionPrice: [2, 2.5, 2],
    },
    {
      ID: 10,
      Name: "Serving Size",
      DisplayType: "Radio",
      Priority: 10,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [0, 1, 2],
    },
  ];

  // ✅ GET /api/menu-items/
  static async getMenuItemOptions(): Promise<ApiResponse<MenuItemOptions[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items fetched successfully",
    };
  }

  // ✅ POST /api/menu-items/
  static async createMenuItemOptions(
    item: Omit<MenuItemOptions, "ID">
  ): Promise<ApiResponse<MenuItemOptions>> {
    await this.delay(1000);
    
    // Validation
    if (!item.Name || item.Name.trim().length === 0) {
      throw new Error("Name is required");
    }
    
    if (!["Radio", "Select", "Checkbox"].includes(item.DisplayType)) {
      throw new Error("Invalid DisplayType");
    }
    
    if (!item.Priority || item.Priority < 1) {
      throw new Error("Priority must be at least 1");
    }
    
    // Check for duplicate priority
    if (this.mockData.some(existing => existing.Priority === item.Priority)) {
      throw new Error("Priority already exists");
    }
    
    // Ensure OptionValue and OptionPrice arrays have same length
    if (item.OptionValue.length !== item.OptionPrice.length) {
      throw new Error("OptionValue and OptionPrice arrays must have the same length");
    }
    
    // Validate option values are not empty
    if (item.OptionValue.some(val => !val || val.trim().length === 0)) {
      throw new Error("All option values must be non-empty");
    }
    
    // Validate prices are non-negative
    if (item.OptionPrice.some(price => price < 0)) {
      throw new Error("All prices must be non-negative");
    }

    const newId =
      this.mockData.length > 0
        ? Math.max(...this.mockData.map((i) => i.ID)) + 1
        : 1;
    const newItem: MenuItemOptions = {
      ...item,
      ID: newId,
      Name: item.Name.trim(),
      OptionValue: item.OptionValue.filter(v => v.trim() !== "").map(v => v.trim()),
      OptionPrice: item.OptionPrice.filter((_, index) => item.OptionValue[index] && item.OptionValue[index].trim() !== ""),
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Menu item created successfully",
    };
  }

  // ✅ PUT /api/menu-items/{id}/
  static async updateMenuItemOptions(
    id: number,
    item: Partial<MenuItemOptions>
  ): Promise<ApiResponse<MenuItemOptions>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    // Validation
    if (item.Name !== undefined) {
      if (!item.Name || item.Name.trim().length === 0) {
        throw new Error("Name is required");
      }
    }
    
    if (item.DisplayType !== undefined) {
      if (!["Radio", "Select", "Checkbox"].includes(item.DisplayType)) {
        throw new Error("Invalid DisplayType");
      }
    }
    
    if (item.Priority !== undefined) {
      if (!item.Priority || item.Priority < 1) {
        throw new Error("Priority must be at least 1");
      }
      // Check for duplicate priority (excluding current item)
      if (this.mockData.some(existing => existing.ID !== id && existing.Priority === item.Priority)) {
        throw new Error("Priority already exists");
      }
    }
    
    if (item.OptionValue && item.OptionPrice) {
      // Ensure arrays have same length
      if (item.OptionValue.length !== item.OptionPrice.length) {
        throw new Error("OptionValue and OptionPrice arrays must have the same length");
      }
      
      // Validate option values are not empty
      if (item.OptionValue.some(val => !val || val.trim().length === 0)) {
        throw new Error("All option values must be non-empty");
      }
      
      // Validate prices are non-negative
      if (item.OptionPrice.some(price => price < 0)) {
        throw new Error("All prices must be non-negative");
      }
    }

    // Clean data
    if (item.OptionValue) {
      item.OptionValue = item.OptionValue.filter((v) => v.trim() !== "").map(v => v.trim());
    }
    if (item.OptionPrice) {
      item.OptionPrice = item.OptionPrice.filter((p) => p >= 0);
    }
    if (item.Name) {
      item.Name = item.Name.trim();
    }

    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Menu item updated successfully",
    };
  }

  // ✅ DELETE /api/menu-items/{id}/
  static async deleteMenuItemOptions(id: number): Promise<ApiResponse<null>> {
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
      message: "Menu item deleted successfully",
    };
  }

  // ✅ DELETE /api/menu-items/bulk-delete/
  static async bulkDeleteMenuItemOptions(
    ids: number[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    
    if (!ids || ids.length === 0) {
      throw new Error("No items selected for deletion");
    }
    
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
    }));

    return {
      success: true,
      data: null,
      message: `${ids.length} menu items deleted successfully`,
    };
  }

  // ✅ GET /api/menu-items/{id}/
  static async getMenuItemOptionsById(id: number): Promise<ApiResponse<MenuItemOptions>> {
    await this.delay(500);
    const item = this.mockData.find((i) => i.ID === id);
    if (!item) throw new Error("Item not found");

    return {
      success: true,
      data: item,
      message: "Menu item fetched successfully",
    };
  }

  // ✅ PUT /api/menu-items/reorder/
  static async reorderMenuItemOptions(
    reorderedItems: { ID: number; Priority: number }[]
  ): Promise<ApiResponse<MenuItemOptions[]>> {
    await this.delay(800);
    
    // Update priorities
    reorderedItems.forEach(({ ID, Priority }) => {
      const item = this.mockData.find(i => i.ID === ID);
      if (item) {
        item.Priority = Priority;
      }
    });

    // Sort by priority
    this.mockData.sort((a, b) => a.Priority - b.Priority);

    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items reordered successfully",
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
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for exit animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-out transform ${
        type === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"
      } ${
        isVisible && !isClosing
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

const CategoryPage = () => {
  const [MenuItemOptionss, setMenuItemOptionss] = useState<MenuItemOptions[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItemOptions | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("Details");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [DisplayFilter, setDisplayFilter] = useState<
    "" | "Radio" | "Select" | "Checkbox"
  >("");

  // Modal form state
  const [formData, setFormData] = useState<Omit<MenuItemOptions, "ID">>({
    Name: "",
    DisplayType: "Radio",
    Priority: 1,
    OptionValue: [],
    OptionPrice: [],
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadMenuItemOptionss();
  }, []);

  // Modal form effect
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        DisplayType: editingItem.DisplayType,
        OptionValue: [...editingItem.OptionValue], // Create new arrays to avoid reference issues
        OptionPrice: [...editingItem.OptionPrice],
        Priority: editingItem.Priority,
      });
      setActiveTab("Details");
    } else {
      // When creating new item, calculate next available priority
      const maxPriority = MenuItemOptionss.length > 0 
        ? Math.max(...MenuItemOptionss.map(item => item.Priority)) 
        : 0;
      
      setFormData({
        Name: "",
        DisplayType: "Radio",
        OptionValue: [],
        OptionPrice: [],
        Priority: maxPriority + 1,
      });
      setActiveTab("Details");
    }
  }, [editingItem, isModalOpen, MenuItemOptionss]);

  const loadMenuItemOptionss = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getMenuItemOptions();
      if (response.success) {
        // Sort by priority
        const sortedData = response.data.sort((a, b) => a.Priority - b.Priority);
        setMenuItemOptionss(sortedData);
      } else {
        throw new Error(response.message || "Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      showToast(error instanceof Error ? error.message : "Failed to load menu items", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = MenuItemOptionss.filter((item) => {
    const matchesSearch =
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Priority.toString().includes(searchTerm);
    const matchesStatus = DisplayFilter
      ? item.DisplayType === DisplayFilter
      : true;
    return matchesStatus && matchesSearch;
  });

  const handleCreateItem = async (itemData: Omit<MenuItemOptions, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createMenuItemOptions(itemData);
      if (response.success) {
        setMenuItemOptionss((prevItems) => {
          const newItems = [...prevItems, response.data];
          return newItems.sort((a, b) => a.Priority - b.Priority);
        });
        setIsModalOpen(false);
        setEditingItem(null);
        setSearchTerm("");
        setDisplayFilter("");
        showToast(response.message || "Item created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast(error instanceof Error ? error.message : "Failed to create menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<MenuItemOptions, "ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateMenuItemOptions(
        editingItem.ID,
        itemData
      );
      if (response.success) {
        setMenuItemOptionss(prev => {
          const updated = prev.map(item =>
            item.ID === editingItem.ID ? response.data : item
          );
          return updated.sort((a, b) => a.Priority - b.Priority);
        });
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Item updated successfully", "success");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      showToast(error instanceof Error ? error.message : "Failed to update menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      setActionLoading(true);
      const response = await MenuAPI.bulkDeleteMenuItemOptions(selectedItems);
      if (response.success) {
        setMenuItemOptionss((prev) => {
          const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
          return remaining.map((item, idx) => ({ ...item, ID: idx + 1 }))
            .sort((a, b) => a.Priority - b.Priority);
        });
        setSelectedItems([]);
        showToast(response.message || "Items deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      showToast(error instanceof Error ? error.message : "Failed to delete menu items", "error");
    } finally {
      setActionLoading(false);
    }
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

  const isFormValid = () => {
    if (!formData.Name.trim()) return false;
    if (!formData.DisplayType.trim()) return false;
    if (formData.Priority < 1) return false;

    // If there are option values, validate them
    if (formData.OptionValue.length > 0) {
      // Check that arrays have same length
      if (formData.OptionValue.length !== formData.OptionPrice.length) return false;
      
      // Check option values (must not be empty if provided)
      for (let i = 0; i < formData.OptionValue.length; i++) {
        if (!formData.OptionValue[i] || !formData.OptionValue[i].trim()) return false;
        if (formData.OptionPrice[i] == null || formData.OptionPrice[i] < 0) return false;
      }
    }

    // Check for duplicate priority (excluding current item when editing)
    const duplicatePriority = MenuItemOptionss.some(item => 
      item.Priority === formData.Priority && 
      (!editingItem || item.ID !== editingItem.ID)
    );
    if (duplicatePriority) return false;

    return true;
  };

  // Modal form handlers
  const handleModalSubmit = () => {
    if (!isFormValid()) {
      showToast("Please fix form errors before submitting", "error");
      return;
    }

    if (editingItem) {
      handleUpdateItem(formData);
    } else {
      handleCreateItem(formData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setActiveTab("Details");
  };

  // Add option value/price pair
  const addOptionPair = () => {
    setFormData({
      ...formData,
      OptionValue: [...formData.OptionValue, ""],
      OptionPrice: [...formData.OptionPrice, 0],
    });
  };

  // Remove option value/price pair
  const removeOptionPair = (index: number) => {
    setFormData({
      ...formData,
      OptionValue: formData.OptionValue.filter((_, i) => i !== index),
      OptionPrice: formData.OptionPrice.filter((_, i) => i !== index),
    });
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-w-full h-full overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mt-14 mb-8 ">Menu Options</h1>

      {/* Action bar */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        {/* Action Buttons */}
        <div className="flex gap-3 h-[40px]">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length > 0 || actionLoading}
            className={`flex items-center text-center gap-2 w-[100px] px-6.5 py-2 rounded-sm transition-colors ${
              selectedItems.length === 0 && !actionLoading
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
            className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors ${
              isSomeSelected && !actionLoading
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
            placeholder="Search Menu Options..."
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

      {/* Table */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw] shadow-sm ">
        <div className=" max-h-[500px] rounded-sm overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-6 text-left w-[2.5px]">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disableRipple
                    sx={{
                      transform: "scale(1.5)",
                      p: 0,
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
                </th>
                <th className="relative px-4 py-3 text-left">
                  ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex flex-col gap-1">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {DisplayFilter || "Display Type"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[320px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() => setDisplayFilter("")}
                          >
                            Display Type
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                            onClick={() => setDisplayFilter("Radio")}
                          >
                            Radio
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                            onClick={() => setDisplayFilter("Select")}
                          >
                            Select
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-blue-400 rounded outline-none"
                            onClick={() => setDisplayFilter("Checkbox")}
                          >
                            Checkbox
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                  </div>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Priority
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-500 divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || DisplayFilter
                      ? "No categories match your search criteria."
                      : "No categories found."}
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.ID}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {item.Name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block w-20 text-center px-2 py-[2px] rounded-md text-xs font-medium
      ${item.DisplayType === "Radio" ? "text-green-400 " : ""}
      ${item.DisplayType === "Select" ? "text-red-400 " : ""}
      ${item.DisplayType === "Checkbox" ? "text-blue-400 " : ""}
    `}
                      >
                        {item.DisplayType}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Priority}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-71">
          <div className="bg-white rounded-lg w-[37vw] max-w-2xl h-[70vh] shadow-lg flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl pl-5 pt-2 font-medium">
                {editingItem ? "Edit Option Menu" : "Add Option Menu"}
              </h1>

              {/* Tab Navigation */}
              <div className="flex w-[250px] items-center justify-center border-b border-gray-200 mx-auto">
                {["Details", "Option Values"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500 hover:text-black hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "Details" && (
                <div className="space-y-8">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.Name}
                      onChange={(e) =>
                        setFormData({ ...formData, Name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                    />
                  </div>

                  {/* Display Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Type
                    </label>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-between text-sm bg-white outline-none hover:bg-gray-50 focus:ring-2 focus:ring-[#d9d9e1]">
                          <span>
                            {formData.DisplayType || "Select Display Type"}
                          </span>
                          <ChevronDown size={14} className="text-gray-500" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[220px] rounded-md bg-white shadow-md border border-gray-200 p-1 outline-none z-72"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                          <DropdownMenu.Item
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() =>
                              setFormData({ ...formData, DisplayType: "Radio" })
                            }
                          >
                            Radio
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                DisplayType: "Select",
                              })
                            }
                          >
                            Select
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                DisplayType: "Checkbox",
                              })
                            }
                          >
                            Checkbox
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={formData.Priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Priority: Number(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      min={1}
                      required
                    />
                  </div>
                </div>
              )}

              {activeTab === "Option Values" && (
                <div className="space-y-4">
                  {/* Fixed Header */}
                  <div className="border border-gray-200 rounded-t-lg bg-gray-50">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="w-8 p-2 text-center text-sm font-medium text-gray-700">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  OptionValue: [...formData.OptionValue, ""],
                                  OptionPrice: [...formData.OptionPrice, 0],
                                })
                              }
                              className="w-8 h-8 flex items-center justify-center text-black rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Plus size={18} />
                            </button>
                          </th>
                          <th className="w-80 p-3 text-left text-sm font-medium text-gray-700">
                            Option Value
                          </th>
                          <th className="p-3 text-center text-sm font-medium text-gray-700">
                            Option Price
                          </th>
                          <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="border-l border-r border-b border-gray-200 rounded-b-lg max-h-60 overflow-y-auto bg-white">
                    <DragDropContext
                      onDragEnd={(result) => {
                        const { source, destination } = result;
                        if (!destination || source.index === destination.index)
                          return;

                        const newOptionValue = Array.from(formData.OptionValue);
                        const [movedValue] = newOptionValue.splice(
                          source.index,
                          1
                        );
                        newOptionValue.splice(destination.index, 0, movedValue);

                        const newOptionPrice = Array.from(formData.OptionPrice);
                        const [movedPrice] = newOptionPrice.splice(
                          source.index,
                          1
                        );
                        newOptionPrice.splice(destination.index, 0, movedPrice);

                        setFormData({
                          ...formData,
                          OptionValue: newOptionValue,
                          OptionPrice: newOptionPrice,
                        });
                      }}
                    >
                      <Droppable droppableId="option-values">
                        {(provided) => (
                          <table className="w-full border-collapse">
                            <tbody
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {formData.OptionValue.map((opt, idx) => (
                                <Draggable
                                  key={idx}
                                  draggableId={`option-${idx}`}
                                  index={idx}
                                >
                                  {(provided, snapshot) => (
                                    <tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`hover:bg-gray-50 ${
                                        snapshot.isDragging
                                          ? "bg-gray-100 shadow-lg"
                                          : ""
                                      } border-b border-gray-200`}
                                    >
                                      {/* Drag Handle */}
                                      <td
                                        className="p-3 text-center cursor-grab w-12"
                                        {...provided.dragHandleProps}
                                      >
                                        <Grip
                                          size={18}
                                          className="text-gray-500 mx-auto"
                                        />
                                      </td>

                                      {/* Option Name */}
                                      <td className="min-w-[300px] p-3">
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const updated = [
                                              ...formData.OptionValue,
                                            ];
                                            updated[idx] = e.target.value;
                                            setFormData({
                                              ...formData,
                                              OptionValue: updated,
                                            });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                                          placeholder="Enter option value"
                                        />
                                      </td>

                                      {/* Option Price */}
                                      <td className="p-3 text-center">
                                        <input
                                          type="text"
                                          inputMode="numeric"
                                          pattern="[0-9]*"
                                          value={formData.OptionPrice[idx]}
                                          onChange={(e) => {
                                            const updated = [
                                              ...formData.OptionPrice,
                                            ];
                                            updated[idx] =
                                              Number(
                                                e.target.value.replace(
                                                  /\D/g,
                                                  ""
                                                )
                                              ) || 0;
                                            setFormData({
                                              ...formData,
                                              OptionPrice: updated,
                                            });
                                          }}
                                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-center mx-auto"
                                          placeholder="0"
                                        />
                                      </td>

                                      {/* Delete Button */}
                                      <td className="p-3 text-center w-12">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedValues =
                                              formData.OptionValue.filter(
                                                (_, i) => i !== idx
                                              );
                                            const updatedPrices =
                                              formData.OptionPrice.filter(
                                                (_, i) => i !== idx
                                              );
                                            setFormData({
                                              ...formData,
                                              OptionValue: updatedValues,
                                              OptionPrice: updatedPrices,
                                            });
                                          }}
                                          className="text-black px-2 py-1 rounded hover:text-gray-700"
                                        >
                                          <X size={20} />
                                        </button>
                                      </td>
                                    </tr>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </tbody>
                          </table>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons - Fixed at bottom */}
            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                disabled={!isFormValid()}
                className={`px-4 py-2 rounded-lg ${
                  isFormValid()
                    ? "bg-black text-white hover:bg-gray-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {editingItem ? "Update" : "Save & Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
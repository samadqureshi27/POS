"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import ButtonPage from "@/components/layout/UI/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Grip,
  Edit,
  ImageIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { grey } from "@mui/material/colors";

interface MenuItem {
  ID: number;
  Name: string;
  Price: number;
  Category: string;
  StockQty: string;
  Status: "Active" | "Inactive";
  status: ("Active" | "Inactive")[]; // Fixed: should be array of status values
  Description?: string;
  MealType?: string;
  Priority?: number;
  MinimumQuantity?: number;
  ShowOnMenu?: "Active" | "Inactive";
  Featured?: "Active" | "Inactive";
  StaffPick?: "Active" | "Inactive";
  DisplayType?: string;
  Displaycat?: string;
  SpecialStartDate?: string;
  SpecialEndDate?: string;
  SpecialPrice?: number;
  OptionValue?: string[];
  OptionPrice?: number[];
  MealValue?: string[];
  MealPrice?: number[];
  PName?: string[];
  PPrice?: number[];
  OverRide?: ("Active" | "Inactive")[]; // Fixed: should be array of status values
  ShowOnMain?: "Active" | "Inactive";
  SubTBE?: "Active" | "Inactive";
  Deal?: "Active" | "Inactive";
  Special?: "Active" | "Inactive";
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Toggle Component
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-black" : "bg-gray-200"
      }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"
        }`}
    />
  </button>
);

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  public static mockData: MenuItem[] = [
    {
      ID: 1,
      Name: "Margherita Pizza",
      Price: 23,
      Category: "Pizza",
      StockQty: "25",
      Status: "Active",
      Description: "Fresh tomatoes, mozzarella, and basil",
      MealType: "Evening",
      Priority: 1,
      MinimumQuantity: 5,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Radio",
      Displaycat: "Var",
      SpecialStartDate: "2025-01-01", // Added missing field
      SpecialEndDate: "2025-12-31", // Added missing field
      SpecialPrice: 20, // Added missing field
      OptionValue: ["Regular", "Large"],
      OptionPrice: [0, 3],
      MealValue: ["Single", "Combo"], // Added missing field
      MealPrice: [0, 5], // Added missing field
      PName: ["Basic", "Premium"], // Added missing field
      PPrice: [0, 8], // Added missing field
      OverRide: ["Inactive", "Active"],
      status: ["Active", "Inactive"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 2,
      Name: "Caesar Salad",
      Price: 54,
      Displaycat: "Var",
      Category: "Salads",
      StockQty: "15",
      Status: "Active",
      Description: "Crisp romaine lettuce with parmesan",
      MealType: "Afternoon",
      Priority: 2,
      MinimumQuantity: 3,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Select",
      SpecialStartDate: "2025-06-01",
      SpecialEndDate: "2025-08-31",
      SpecialPrice: 45,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Light", "Full"],
      MealPrice: [0, 10],
      PName: ["Standard", "Deluxe"],
      PPrice: [0, 12],
      OverRide: ["Inactive", "Active", "Inactive"],
      status: ["Active", "Inactive", "Active"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 3,
      Name: "Beef Burger",
      Price: 7,
      Category: "Burgers",
      StockQty: "30",
      Status: "Active",
      Description: "Juicy beef patty with fresh vegetables",
      MealType: "Evening",
      Priority: 1,
      MinimumQuantity: 2,
      Displaycat: "Var",
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Checkbox",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Solo", "Meal Deal"],
      MealPrice: [0, 6],
      PName: ["Regular", "Gourmet"],
      PPrice: [0, 5],
      OverRide: ["Inactive", "Active", "Inactive"],
      status: ["Active", "Inactive", "Active"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 4,
      Name: "Chicken Wings",
      Price: 8,
      Category: "Appetizers",
      StockQty: "20",
      Status: "Active",
      Description: "Crispy chicken wings with special sauce",
      MealType: "Evening",
      Priority: 3,
      MinimumQuantity: 6,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Radio",
      SpecialStartDate: "2025-03-01",
      SpecialEndDate: "2025-05-31",
      SpecialPrice: 6,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["6 pieces", "12 pieces"],
      MealPrice: [0, 8],
      PName: ["Mild", "Hot", "BBQ"],
      PPrice: [0, 1, 2],
      OverRide: ["Inactive", "Active", "Inactive"],
      status: ["Active", "Inactive", "Active"],
      ShowOnMain: "Inactive",
      Displaycat: "Var",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 5,
      Name: "Chocolate Cake",
      Price: 8,
      Category: "Desserts",
      StockQty: "12",
      Status: "Active",
      Displaycat: "Var",
      Description: "Rich chocolate cake with ganache",
      MealType: "Afternoon",
      Priority: 2,
      MinimumQuantity: 1,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Select",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Slice", "Whole Cake"],
      MealPrice: [0, 25],
      PName: ["Regular", "With Ice Cream"],
      PPrice: [0, 3],
      OverRide: ["Inactive", "Active", "Inactive"],
      status: ["Active", "Inactive", "Active"],
      ShowOnMain: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
      SubTBE: "Inactive",
    },
    {
      ID: 6,
      Name: "Grilled Salmon",
      Price: 78,
      Category: "Main Course",
      StockQty: "18",
      Displaycat: "Var",
      Description: "Fresh Atlantic salmon grilled to perfection",
      MealType: "Evening",
      Priority: 1,
      Status: "Active",
      MinimumQuantity: 1,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Radio",
      SpecialStartDate: "2025-04-15",
      SpecialEndDate: "2025-06-15",
      SpecialPrice: 65,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Fillet", "Whole Fish"],
      MealPrice: [0, 20],
      PName: ["Plain", "Herb Crusted", "Teriyaki"],
      PPrice: [0, 5, 8],
      OverRide: ["Inactive", "Active", "Inactive"],
      status: ["Active", "Inactive", "Active"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 7,
      Name: "Cappuccino",
      Price: 89,
      Category: "Beverages",
      StockQty: "50",
      Displaycat: "Var",
      Status: "Active",
      Description: "Rich espresso with steamed milk foam",
      MealType: "Morning",
      Priority: 1,
      MinimumQuantity: 1,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Select",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Regular", "Decaf"],
      MealPrice: [0, 0],
      PName: ["No Sugar", "1 Sugar", "2 Sugars"],
      PPrice: [0, 0, 0],
      OverRide: ["Inactive", "Active", "Inactive"],
      status: ["Active", "Inactive", "Active"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 8,
      Name: "French Fries",
      Price: 8,
      Category: "Sides",
      StockQty: "40",
      Displaycat: "Var",
      Status: "Active",
      Description: "Crispy golden potato fries",
      MealType: "Afternoon",
      Priority: 3,
      MinimumQuantity: 10,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Radio",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Plain", "Seasoned"],
      MealPrice: [0, 1],
      PName: ["Regular", "Sweet Potato"],
      PPrice: [0, 2],
      OverRide: ["Inactive", "Active", "Inactive"],
      status: ["Active", "Inactive", "Active"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
  ];

  static async getMenuItems(): Promise<ApiResponse<MenuItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items fetched successfully",
    };
  }

  static async createMenuItem(
    item: Omit<MenuItem, "ID">
  ): Promise<ApiResponse<MenuItem>> {
    await this.delay(1000);
    const newId =
      this.mockData.length > 0
        ? Math.max(...this.mockData.map((i) => i.ID)) + 1
        : 1;
    const newItem: MenuItem = {
      ...item,
      ID: newId,
      OptionValue: item.OptionValue || ["Regular"],
      OptionPrice: item.OptionPrice || [0],
      MealValue: item.MealValue || [], // Fixed: initialize empty arrays
      MealPrice: item.MealPrice || [],
      PName: item.PName || [],
      PPrice: item.PPrice || [],
      SpecialStartDate: item.SpecialStartDate || "",
      SpecialEndDate: item.SpecialEndDate || "",
      SpecialPrice: item.SpecialPrice || 0,
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Menu item created successfully",
    };
  }

  static async updateMenuItem(
    id: number,
    item: Partial<MenuItem>
  ): Promise<ApiResponse<MenuItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Menu item updated successfully",
    };
  }

  static async deleteMenuItem(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData.splice(index, 1);
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

  static async bulkDeleteMenuItem(ids: number[]): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));
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
}

const sizeOptions = ["Small", "Regular", "Large", "Extra Large"];
const mealTimeOptions = ["Morning", "Afternoon", "Evening"];

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

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );
  const [categoryFilter, setCategoryFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Menu Items");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Modal form state - Fixed initialization
  const [formData, setFormData] = useState<Omit<MenuItem, "ID">>({
    Name: "",
    Price: 0,
    Category: "",
    StockQty: "",
    Status: "Inactive",
    Description: "",
    MealType: "Morning",
    Priority: 1,
    MinimumQuantity: 0,
    ShowOnMenu: "Inactive",
    Featured: "Inactive",
    StaffPick: "Inactive",
    DisplayType: "Radio",
    Displaycat: "Var",
    SpecialStartDate: "",
    SpecialEndDate: "",
    SpecialPrice: 0,
    status: [], // Fixed: initialize as empty array
    OverRide: [], // Fixed: initialize as empty array
    OptionValue: [],
    OptionPrice: [],
    MealValue: [],
    MealPrice: [],
    PName: [],
    PPrice: [],
    ShowOnMain: "Inactive",
    SubTBE: "Inactive",
    Deal: "Inactive",
    Special: "Inactive",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  // Modal form effect
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Price: editingItem.Price || 0,
        Category: editingItem.Category,
        StockQty: editingItem.StockQty,
        Status: editingItem.Status,
        Description: editingItem.Description || "",
        MealType: editingItem.MealType || "Morning",
        Priority: editingItem.Priority || 1,
        MinimumQuantity: editingItem.MinimumQuantity || 0,
        ShowOnMenu: editingItem.ShowOnMenu || "Inactive",
        Featured: editingItem.Featured || "Inactive",
        StaffPick: editingItem.StaffPick || "Inactive",
        ShowOnMain: editingItem.ShowOnMain || "Inactive",
        Deal: editingItem.Deal || "Inactive",
        Special: editingItem.Special || "Inactive",
        SubTBE: editingItem.SubTBE || "Inactive",
        DisplayType: editingItem.DisplayType || "Radio",
        Displaycat: editingItem.Displaycat || "Var",
        SpecialStartDate: editingItem.SpecialStartDate || "",
        SpecialEndDate: editingItem.SpecialEndDate || "",
        SpecialPrice: editingItem.SpecialPrice || 0,
        OverRide: editingItem.OverRide || [],
        status: editingItem.status || [],
        OptionValue: editingItem.OptionValue || [],
        OptionPrice: editingItem.OptionPrice || [],
        MealValue: editingItem.MealValue || [],
        MealPrice: editingItem.MealPrice || [],
        PName: editingItem.PName || [],
        PPrice: editingItem.PPrice || [],
      });
    } else {
      setFormData({
        Name: "",
        Price: 0,
        Category: "",
        StockQty: "",
        Status: "Inactive",
        Description: "",
        MealType: "Morning",
        Priority: 1,
        MinimumQuantity: 0,
        ShowOnMenu: "Inactive",
        Featured: "Inactive",
        StaffPick: "Inactive",
        DisplayType: "Radio",
        Displaycat: "Var",
        SpecialStartDate: "",
        SpecialEndDate: "",
        SpecialPrice: 0,
        OptionValue: [],
        OptionPrice: [],
        status: [],
        OverRide: [],
        MealValue: [],
        MealPrice: [],
        PName: [],
        PPrice: [],
        ShowOnMain: "Inactive",
        SubTBE: "Inactive",
        Deal: "Inactive",
        Special: "Inactive",
      });
      setPreview(null);
    }
  }, [editingItem, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      setActiveTab("Menu Items");
    }
  }, [isModalOpen]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getMenuItems();
      if (response.success) {
        setMenuItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      showToast("Failed to load menu items", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || item.Status === statusFilter;
    const matchesCategory =
      categoryFilter === "" || item.Category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const isFormValid = () => {
    return (
      formData.Name?.trim() &&
      formData.DisplayType &&
      formData.Price > 0 &&
      preview && // image uploaded
      formData.Description?.trim() &&
      formData.MealType &&
      formData.Priority > 0 &&
      formData.MinimumQuantity >= 0 &&
      formData.OptionValue?.length > 0 &&
      formData.OptionValue.every((val) => val.trim() !== "") &&
      formData.OptionPrice?.length === formData.OptionValue?.length
    );
  };

  const categories = [...new Set(menuItems.map((item) => item.Category))];

  const handleCreateItem = async (itemData: Omit<MenuItem, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createMenuItem(itemData);
      if (response.success) {
        setMenuItems((prevItems) => [...prevItems, response.data]);
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

  const handleUpdateItem = async (itemData: Omit<MenuItem, "ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateMenuItem(editingItem.ID, itemData);
      if (response.success) {
        setMenuItems(
          menuItems.map((item) =>
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
      const response = await MenuAPI.bulkDeleteMenuItem(selectedItems);
      if (response.success) {
        setMenuItems((prev) => {
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

  // Added individual delete function with toast
  const handleDeleteItem = async (itemId: number) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.deleteMenuItem(itemId);
      if (response.success) {
        setMenuItems((prev) => {
          const remaining = prev.filter((i) => i.ID !== itemId);
          return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
        });
        showToast(response.message || "Item deleted successfully", "success");
      }
    } catch (error) {
      showToast("Failed to delete menu item", "error");
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

  const handleModalSubmit = () => {
    // Validate required fields
    if (!formData.Name.trim()) {
      showToast("Please enter a menu item name", "error");
      return;
    }

    if (editingItem) {
      handleUpdateItem(formData);
    } else {
      handleCreateItem(formData);
    }
  };

  const handleStatusChange = (
    field: keyof typeof formData,
    isActive: boolean
  ) => {
    setFormData({
      ...formData,
      [field]: isActive ? "Active" : "Inactive",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Menu Management...</p>
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

      <h1 className="text-3xl font-semibold mt-14 mb-8">Menu Management</h1>

      {/* Action bar */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
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

        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search Menu Items..."
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
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw] shadow-sm">
        <div className="max-h-[500px] rounded-sm overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
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
                  Price
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {categoryFilter || "Category"}
                        <ChevronDown size={14} className="text-gray-500 ml-auto" />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[240px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() => setCategoryFilter("")}
                          >
                            All Categories
                          </DropdownMenu.Item>
                          {categories.map((category) => (
                            <DropdownMenu.Item
                              key={category}
                              className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                              onClick={() => setCategoryFilter(category)}
                            >
                              {category}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Stock Qty
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {statusFilter || "Status"}
                        <ChevronDown size={14} className="text-gray-500 ml-auto" />
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
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                            onClick={() => setStatusFilter("Inactive")}
                          >
                            Inactive
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-500 divide-gray-300">
              {filteredItems.map((item) => (
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
                  <td className="px-4 py-4 whitespace-nowrap">${item.Price}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Category}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.StockQty}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block w-24 text-center px-2 py-[2px] rounded-md text-xs font-medium ${item.Status === "Inactive"
                          ? "text-red-400"
                          : "text-green-400"
                        }`}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        className="text-black hover:text-gray-800 transition-colors"
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

      {/* Modal remains the same from here... */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-71">
          <div className="bg-white rounded-lg w-[37vw] max-w-2xl h-[70vh] shadow-lg flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl pl-5 pt-2 font-medium">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h1>

              {/* Tab Navigation */}
              <div className="flex w-[37vw] items-center justify-center border-b border-gray-200 mx-auto">
                {[
                  "Menu Items",
                  "Details",
                  "Options",
                  "Meal",
                  "Specials",
                  "Price",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-2 py-3 text-xs font-medium transition-colors ${activeTab === tab
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
            <div className="flex-1 overflow-y-auto   p-6">
              {activeTab === "Menu Items" && (
                <div className="space-y-8 pl-4 ">
                  {/* Menu Item Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Menu Item Name
                    </label>
                    <input
                      type="text"
                      value={formData.Name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      placeholder="Sweet / Spicy Sausage Wrap"
                      required
                    />
                  </div>

                  {/* Category*/}
                  <div className="grid grid-cols-2 gap-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Category
                      </label>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-white hover:bg-gray-50">
                          <span className="text-sm">
                            {formData.DisplayType || "Select display type"}
                          </span>
                          <ChevronDown size={16} className="text-gray-500" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="w-full rounded-md bg-white shadow-md border border-gray-200 p-1 relative outline-none z-100"
                            sideOffset={6}
                          >
                            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 z-100" />
                            {["Radio", "Select", "Checkbox"].map((type) => (
                              <DropdownMenu.Item
                                key={type}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 rounded outline-none"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    DisplayType: type,
                                  })
                                }
                              >
                                {type}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>

                    <div className="">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Type
                      </label>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-white hover:bg-gray-50">
                          <span className="text-sm">
                            {formData.Displaycat || "Select display type"}
                          </span>
                          <ChevronDown size={16} className="text-gray-500" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="w-full rounded-md bg-white shadow-md border border-gray-200 p-1 relative outline-none z-100"
                            sideOffset={6}
                          >
                            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 z-100" />
                            {["Qty", "Weight", "Var"].map((type) => (
                              <DropdownMenu.Item
                                key={type}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 rounded outline-none"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    Displaycat: type,
                                  })
                                }
                              >
                                {type}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </div>

                  {/* Price  */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.Price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Price: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      placeholder="12.99"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      {preview ? (
                        <div className="relative">
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-40 mx-auto rounded"
                          />
                          <button
                            onClick={() => setPreview(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-blue-600 hover:text-blue-500"
                            >
                              Upload a file
                            </button>
                            <span> or drag and drop</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) =>
                              setPreview(e.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.Description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      rows={3}
                      placeholder="Enter description"
                    />
                  </div>
                </div>
              )}

              {activeTab === "Details" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Meal Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meal Time
                      </label>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-white hover:bg-gray-50">
                          <span className="text-sm">
                            {formData.MealType || "Select meal time"}
                          </span>
                          <ChevronDown size={16} className="text-gray-500" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="w-full rounded-md bg-white shadow-md border border-gray-200 p-1 relative outline-none z-100"
                            sideOffset={6}
                          >
                            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 z-100" />
                            {mealTimeOptions.map((time) => (
                              <DropdownMenu.Item
                                key={time}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 rounded outline-none"
                                onClick={() =>
                                  setFormData({ ...formData, MealType: time })
                                }
                              >
                                {time}
                              </DropdownMenu.Item>
                            ))}
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
                        step="1"
                        value={formData.Priority}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Priority: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                        placeholder="12.99"
                        required
                      />
                    </div>
                  </div>

                  {/* Minimum Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.MinimumQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          MinimumQuantity: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      placeholder="Stock Qty to place successful"
                      min={0}
                    />
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Feature
                      </label>
                      <ButtonPage
                        checked={formData.Featured === "Active"}
                        onChange={(checked) =>
                          handleStatusChange("Featured", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Staff pick
                      </label>
                      <ButtonPage
                        checked={formData.StaffPick === "Active"}
                        onChange={(checked) =>
                          handleStatusChange("StaffPick", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Show on Main
                      </label>
                      <ButtonPage
                        checked={formData.ShowOnMain === "Active"}
                        onChange={(checked) =>
                          handleStatusChange("ShowOnMain", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Subtract Stock
                      </label>
                      <ButtonPage
                        checked={formData.SubTBE === "Active"}
                        onChange={(checked) =>
                          handleStatusChange("SubTBE", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Options" && (
                <div className=" ">
                  {/* Add Size Button */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Menu Item Option
                  </label>

                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="min-w-[510px] flex items-center justify-between px-4 py-2 mb-2 text-black rounded-lg hover:bg-gray-300 transition-colors cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]">
                        <span className="text-sm">Add New Size Option</span>
                        <ChevronDown size={16} className="text-gray-500" />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[510px] rounded-md bg-white shadow-md border border-gray-200 p-1 relative outline-none max-h-60 overflow-y-auto z-100"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 z-100" />
                          {sizeOptions.map((size, i) => (
                            <DropdownMenu.Item
                              key={i}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                              onClick={() => {
                                if (!formData.OptionValue?.includes(size)) {
                                  setFormData({
                                    ...formData,
                                    OptionValue: [
                                      ...(formData.OptionValue || []),
                                      size,
                                    ],
                                    OptionPrice: [
                                      ...(formData.OptionPrice || []),
                                      0,
                                    ],
                                  });
                                }
                              }}
                            >
                              {size}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>

                  {/* Fixed Header */}
                  <div className="border border-gray-200 rounded-t-lg bg-gray-50">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                          <th className="w-80 p-3 text-left text-sm font-medium text-gray-700">
                            Name
                          </th>
                          <th className="p-3 text-center text-sm font-medium text-gray-700">
                            Price
                          </th>

                          <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="border-l border-r border-b border-gray-200 rounded-b-lg min-h-[217px] overflow-y-auto bg-white">
                    <DragDropContext
                      onDragEnd={(result) => {
                        const { source, destination } = result;
                        if (!destination || source.index === destination.index)
                          return;

                        const newOptionValue = Array.from(
                          formData.OptionValue || []
                        );
                        const [movedValue] = newOptionValue.splice(
                          source.index,
                          1
                        );
                        newOptionValue.splice(destination.index, 0, movedValue);

                        const newOptionPrice = Array.from(
                          formData.OptionPrice || []
                        );
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
                      <Droppable droppableId="sizes">
                        {(provided) => (
                          <table className="w-full border-collapse">
                            <tbody
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {(formData.OptionValue || []).map((opt, idx) => (
                                <Draggable
                                  key={idx}
                                  draggableId={`size-${idx}`}
                                  index={idx}
                                >
                                  {(provided, snapshot) => (
                                    <tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`hover:bg-gray-50 ${snapshot.isDragging
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

                                      {/* Size Name */}
                                      <td className="min-w-[300px] p-3">
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const updated = [
                                              ...(formData.OptionValue || []),
                                            ];
                                            updated[idx] = e.target.value;
                                            setFormData({
                                              ...formData,
                                              OptionValue: updated,
                                            });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                                          placeholder="Size name"
                                        />
                                      </td>

                                      {/* Price */}
                                      <td className="p-3 text-center">
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            formData.OptionPrice?.[idx] || 0
                                          }
                                          onChange={(e) => {
                                            const updated = [
                                              ...(formData.OptionPrice || []),
                                            ];
                                            updated[idx] =
                                              Number(e.target.value) || 0;
                                            setFormData({
                                              ...formData,
                                              OptionPrice: updated,
                                            });
                                          }}
                                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-center mx-auto"
                                          placeholder="0.00"
                                        />
                                      </td>

                                      {/* Delete Button */}
                                      <td className="p-3 text-center w-12">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedValues = (
                                              formData.OptionValue || []
                                            ).filter((_, i) => i !== idx);
                                            const updatedPrices = (
                                              formData.OptionPrice || []
                                            ).filter((_, i) => i !== idx);
                                            setFormData({
                                              ...formData,
                                              OptionValue: updatedValues,
                                              OptionPrice: updatedPrices,
                                            });
                                          }}
                                          className="text-black border-2 px-2 py-1 rounded hover:text-gray-700"
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

              {activeTab === "Meal" && (
                <div className=" pr-4">
                  {/* Add Size Button */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Menu Item Option
                  </label>

                  <div className="flex items-center mb-2 gap-3">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="min-w-[450px] flex items-center justify-between px-4 py-2 mt-5  text-black rounded-lg hover:bg-gray-300 transition-colors cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]">
                        <span className="text-sm">Add New Size Option</span>
                        <ChevronDown size={16} className="text-gray-500" />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[510px] ml-10 rounded-md bg-white shadow-md border border-gray-200 p-1 relative outline-none max-h-60 overflow-y-auto z-100"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 z-100" />
                          {sizeOptions.map((size, i) => (
                            <DropdownMenu.Item
                              key={i}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                              onClick={() => {
                                if (!formData.MealValue?.includes(size)) {
                                  setFormData({
                                    ...formData,
                                    MealValue: [
                                      ...(formData.MealValue || []),
                                      size,
                                    ],
                                    MealPrice: [
                                      ...(formData.MealPrice || []),
                                      0,
                                    ],
                                  });
                                }
                              }}
                            >
                              {size}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <div className="flex flex-col items-center gap-2 ml-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Deal?
                      </label>
                      <ButtonPage
                        checked={formData.Deal === "Active"}
                        onChange={(checked) =>
                          handleStatusChange("Deal", checked)
                        }
                      />
                    </div>
                  </div>

                  {/* Fixed Header */}
                  <div className="border min-w-[515px] border-gray-200 rounded-t-lg bg-gray-50">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                          <th className="w-60 p-3 text-left text-sm font-medium text-gray-700">
                            Name
                          </th>
                          <th className="p-3 text-center text-sm font-medium text-gray-700">
                            Price
                          </th>
                          <th className="w-8 p-3 text-center text-sm font-medium text-gray-700">
                            Override
                          </th>
                          <th className=" p-3 pr-5 text-center text-sm font-medium text-gray-700">
                            Status
                          </th>

                          <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="border-l border-r border-b border-gray-200 rounded-b-lg min-w-[515px] min-h-[197px] overflow-y-auto bg-white">
                    <DragDropContext
                      onDragEnd={(result) => {
                        const { source, destination } = result;
                        if (!destination || source.index === destination.index)
                          return;

                        const newMealValue = Array.from(
                          formData.MealValue || []
                        );
                        const [movedValue] = newMealValue.splice(
                          source.index,
                          1
                        );
                        newMealValue.splice(destination.index, 0, movedValue);

                        const newMealPrice = Array.from(
                          formData.MealPrice || []
                        );
                        const [movedPrice] = newMealPrice.splice(
                          source.index,
                          1
                        );
                        newMealPrice.splice(destination.index, 0, movedPrice);

                        setFormData({
                          ...formData,
                          MealValue: newMealValue,
                          MealPrice: newMealPrice,
                        });
                      }}
                    >
                      <Droppable droppableId="sizes">
                        {(provided) => (
                          <table className="w-full border-collapse">
                            <tbody
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {(formData.MealValue || []).map((opt, idx) => (
                                <Draggable
                                  key={idx}
                                  draggableId={`size-${idx}`}
                                  index={idx}
                                >
                                  {(provided, snapshot) => (
                                    <tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`hover:bg-gray-50 ${snapshot.isDragging
                                          ? "bg-gray-100 shadow-lg"
                                          : ""
                                        } border-b border-gray-200`}
                                    >
                                      {/* Drag Handle */}
                                      <td
                                        className="p-3 text-center cursor-grab w-10"
                                        {...provided.dragHandleProps}
                                      >
                                        <Grip
                                          size={18}
                                          className="text-gray-500 mx-auto"
                                        />
                                      </td>

                                      {/* Size Name */}
                                      <td className="min-w-[200px] p-3">
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const updated = [
                                              ...(formData.MealValue || []),
                                            ];
                                            updated[idx] = e.target.value;
                                            setFormData({
                                              ...formData,
                                              MealValue: updated,
                                            });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                                          placeholder="Size name"
                                        />
                                      </td>

                                      {/* Price */}
                                      <td className="p-3 text-center">
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={formData.MealPrice?.[idx] || 0}
                                          onChange={(e) => {
                                            const updated = [
                                              ...(formData.MealPrice || []),
                                            ];
                                            updated[idx] =
                                              Number(e.target.value) || 0;
                                            setFormData({
                                              ...formData,
                                              MealPrice: updated,
                                            });
                                          }}
                                          className="w-15 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-center mx-auto"
                                          placeholder="0.00"
                                        />
                                      </td>
                                      {/* OverRide */}
                                      <td className="p-3 text-center">
                                        <ButtonPage
                                          checked={
                                            formData.OverRide?.[idx] ===
                                            "Active"
                                          }
                                          onChange={(checked) => {
                                            const updated = [
                                              ...(formData.OverRide || []),
                                            ];
                                            updated[idx] = checked
                                              ? "Active"
                                              : "Inactive";
                                            setFormData({
                                              ...formData,
                                              OverRide: updated,
                                            });
                                          }}
                                        />
                                      </td>
                                      {/* Status */}
                                      <td className="p-3 text-center">
                                        <ButtonPage
                                          checked={
                                            formData.Status?.[idx] === "Active"
                                          }
                                          onChange={(checked) => {
                                            const updated = [
                                              ...(formData.Status || []),
                                            ];
                                            updated[idx] = checked
                                              ? "Active"
                                              : "Inactive";
                                            setFormData({
                                              ...formData,
                                              Status: updated,
                                            });
                                          }}
                                        />
                                      </td>

                                      {/* Delete Button */}
                                      <td className="p-3 text-center w-10">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedValues = (
                                              formData.MealValue || []
                                            ).filter((_, i) => i !== idx);
                                            const updatedPrices = (
                                              formData.MealPrice || []
                                            ).filter((_, i) => i !== idx);
                                            setFormData({
                                              ...formData,
                                              MealValue: updatedValues,
                                              MealPrice: updatedPrices,
                                            });
                                          }}
                                          className="text-black border-2 px-2 py-1 rounded hover:text-gray-700"
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

              {activeTab === "Specials" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-10">
                    <label className="block text-sm font-medium text-gray-700">
                      Special
                    </label>
                    <ButtonPage
                      checked={formData.Special === "Active"}
                      onChange={(checked) =>
                        handleStatusChange("Special", checked)
                      }
                    />
                  </div>

                  {/* Special Dates */}
                  <div className="grid grid-2 gap-8">
                    <div className="relative w-full">
                      <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
                        Special Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.SpecialStartDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            SpecialStartDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      />
                    </div>

                    <div className="relative w-full">
                      <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
                        Special End Date
                      </label>
                      <input
                        type="date"
                        value={formData.SpecialEndDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            SpecialEndDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      />
                    </div>
                  </div>

                  {/* Special Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.SpecialPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          SpecialPrice: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      placeholder="499.00"
                    />
                  </div>
                </div>
              )}

              {activeTab === "Price" && (
                <div className=" ">
                  {/* Fixed Header */}
                  <div className="border border-gray-200 rounded-t-lg  bg-gray-50">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="w-12 p-2 text-center text-sm font-medium text-gray-700">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  PName: [...formData.PName, ""],
                                  PPrice: [...formData.PPrice, 0],
                                })
                              }
                              className="w-8 h-8 flex items-center justify-center text-black rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Plus size={18} />
                            </button>
                          </th>
                          <th className="w-80 p-3 text-left text-sm font-medium text-gray-700">
                            Name
                          </th>
                          <th className="p-3 text-center text-sm font-medium text-gray-700">
                            Price
                          </th>
                          <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="border-l border-r border-b border-gray-200 rounded-b-lg  min-h-[217px] overflow-y-auto bg-white">
                    <DragDropContext
                      onDragEnd={(result) => {
                        const { source, destination } = result;
                        if (!destination || source.index === destination.index)
                          return;

                        const newPValue = Array.from(formData.PName);
                        const [movedValue] = newPValue.splice(source.index, 1);
                        newPValue.splice(destination.index, 0, movedValue);

                        const newPPrice = Array.from(formData.PPrice);
                        const [movedPrice] = newPPrice.splice(source.index, 1);
                        newPPrice.splice(destination.index, 0, movedPrice);

                        setFormData({
                          ...formData,
                          PName: newPValue,
                          PPrice: newPPrice,
                        });
                      }}
                    >
                      <Droppable droppableId="p-values">
                        {(provided) => (
                          <table className="w-full border-collapse">
                            <tbody
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {formData.PName.map((opt, idx) => (
                                <Draggable
                                  key={idx}
                                  draggableId={`p-${idx}`}
                                  index={idx}
                                >
                                  {(provided, snapshot) => (
                                    <tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`hover:bg-gray-50 ${snapshot.isDragging
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

                                      {/* PValue (Compact Input) */}
                                      <td className="min-w-[300px] p-3">
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const updated = [...formData.PName];
                                            updated[idx] = e.target.value;
                                            setFormData({
                                              ...formData,
                                              PName: updated,
                                            });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm"
                                        />
                                      </td>

                                      {/* PPrice (Compact Numeric Input) */}
                                      <td className="p-3 text-center">
                                        <input
                                          type="number"
                                          value={formData.PPrice[idx]}
                                          onChange={(e) => {
                                            const updated = [
                                              ...formData.PPrice,
                                            ];
                                            updated[idx] =
                                              Number(e.target.value) || 0;
                                            setFormData({
                                              ...formData,
                                              PPrice: updated,
                                            });
                                          }}
                                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm text-center"
                                        />
                                      </td>

                                      {/* Delete Button */}
                                      <td className="p-3 text-center w-12">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedValues =
                                              formData.PName.filter(
                                                (_, i) => i !== idx
                                              );
                                            const updatedPrices =
                                              formData.PPrice.filter(
                                                (_, i) => i !== idx
                                              );
                                            setFormData({
                                              ...formData,
                                              PName: updatedValues,
                                              PPrice: updatedPrices,
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

            {/* Fixed Action Buttons - This was the problematic section */}
            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={actionLoading || !isFormValid()}
                className={`px-4 py-2 min-w-[120px] rounded-lg transition-colors text-white ${actionLoading || !isFormValid()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-700"
                  }`}
              >
                {actionLoading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin w-4 h-4" />
                    {editingItem ? "Updating..." : "Saving..."}
                  </div>
                ) : editingItem ? (
                  "Update"
                ) : (
                  "Save & Close"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuManagementPage;
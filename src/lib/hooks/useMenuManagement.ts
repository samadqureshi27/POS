import { useState, useEffect, useRef } from "react";
import { useToast } from "@/lib/hooks";
import MenuAPI from "@/lib/util/menu1-api";

// Define MenuItem interface
interface MenuItem {
  ID: number;
  Name: string;
  Price: number;
  Category: string;
  StockQty: string;
  Status: "Active" | "Inactive";
  Description?: string;
  MealType?: string;
  Priority?: number;
  MinimumQuantity?: number;
  ShowOnMenu?: "Active" | "Inactive";
  Featured?: "Active" | "Inactive";
  StaffPick?: "Active" | "Inactive";
  ShowOnMain?: "Active" | "Inactive";
  Deal?: "Active" | "Inactive";
  Special?: "Active" | "Inactive";
  SubTBE?: "Active" | "Inactive";
  DisplayType?: string;
  Displaycat?: string;
  SpecialStartDate?: string;
  SpecialEndDate?: string;
  SpecialPrice?: number;
  OverRide?: any[];
  OptionValue?: string[];
  OptionPrice?: number[];
  MealValue?: string[];
  MealPrice?: number[];
  PName?: string[];
  PPrice?: number[];
}

export const useMenuManagement = () => {
  // State management
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Menu Items");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    DisplayType: "Select a type",
    Displaycat: "Var",
    SpecialStartDate: "",
    SpecialEndDate: "",
    SpecialPrice: 0,
    OverRide: [],
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

  // Utility functions
  const { toast, toastVisible, showToast, hideToast } = useToast();

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

  // Form initialization
  const initializeFormData = () => {
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
      DisplayType: "Select a type",
      Displaycat: "Var",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: [],
      OptionPrice: [],
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
  };

  // Effects
  useEffect(() => {
    loadMenuItems();
  }, []);

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
        DisplayType: editingItem.DisplayType || "Select a type",
        Displaycat: editingItem.Displaycat || "Var",
        SpecialStartDate: editingItem.SpecialStartDate || "",
        SpecialEndDate: editingItem.SpecialEndDate || "",
        SpecialPrice: editingItem.SpecialPrice || 0,
        OverRide: editingItem.OverRide || [],
        OptionValue: editingItem.OptionValue || [],
        OptionPrice: editingItem.OptionPrice || [],
        MealValue: editingItem.MealValue || [],
        MealPrice: editingItem.MealPrice || [],
        PName: editingItem.PName || [],
        PPrice: editingItem.PPrice || [],
      });
    } else {
      initializeFormData();
    }
  }, [editingItem, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      setActiveTab("Menu Items");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Computed values
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || item.Status === statusFilter;
    const matchesCategory = categoryFilter === "" || item.Category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const isFormValid = () => {
    const isPriceValid = formData.Displaycat === "Var" || formData.Price > 0;

    return (
      formData.Name?.trim() &&
      formData.DisplayType &&
      isPriceValid &&
      preview &&
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
  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0;

  // Event handlers
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

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as "" | "Active" | "Inactive");
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  // Form data handlers
  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleFormFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    // State
    menuItems,
    selectedItems,
    loading,
    statusFilter,
    categoryFilter,
    actionLoading,
    searchTerm,
    editingItem,
    isModalOpen,
    activeTab,
    preview,
    formData,
    fileInputRef,
    
    // Computed values
    filteredItems,
    isFormValid: isFormValid(),
    categories,
    isAllSelected,
    
    // Toast
    toast,
    toastVisible,
    showToast,
    hideToast,
    
    // Handlers
    handleCreateItem,
    handleUpdateItem,
    handleDeleteSelected,
    handleSelectAll,
    handleSelectItem,
    handleModalSubmit,
    handleStatusChange,
    handleCloseModal,
    handleStatusFilterChange,
    handleEditItem,
    handleAddItem,
    updateFormData,
    handleFormFieldChange,
    
    // Setters
    setSearchTerm,
    setCategoryFilter,
    setActiveTab,
    setPreview,
    loadMenuItems,
  };
};
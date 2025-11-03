import { useState, useEffect, useRef } from "react";
import { useToast } from "@/lib/hooks";
import MenuAPI from "@/lib/util/menu1-api";
import { MenuItem } from "@/lib/types/menum";
import { useMenuOptions } from "@/lib/hooks/useMenuOptions";
import { useCategory } from "@/lib/hooks/useCategory";
import { MenuItemOptions } from "@/lib/types/menuItemOptions";
import { CategoryItem } from "@/lib/types/category";

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
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [formData, setFormData] = useState<Omit<MenuItem, "ID">>({
    Name: "",
    Price: 0,
    Category: "",
    StockQty: "",
    Status: "Active",
    Description: "",
    MealType: "All Day",
    Priority: 1,
    MinimumQuantity: 1,
    ShowOnMenu: "Inactive",
    Featured: "Inactive",
    StaffPick: "Inactive",
    DisplayType: "Select a type",
    Displaycat: "",
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
    ShowOnMain: "Active",
    SubTBE: "Inactive",
    Deal: "Inactive",
    Special: "Inactive",
  });

  // Utility functions
  const { toast, toastVisible, showToast, hideToast } = useToast();

  // Load menu options and categories using existing hooks
  const { MenuItemOptionss: menuOptions } = useMenuOptions();
  const { categoryItems: categories } = useCategory();

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getMenuItems();
      if (response.success && response.data) {
        setMenuItems(response.data.sort((a, b) => (a.Priority || 0) - (b.Priority || 0)));
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

  // Form initialization
  const initializeFormData = () => {
    setFormData({
      Name: "",
      Price: 0,
      Category: "",
      StockQty: "",
      Status: "Active",
      Description: "",
      MealType: "All Day",
      Priority: 1,
      MinimumQuantity: 1,
      ShowOnMenu: "Inactive",
      Featured: "Inactive",
      StaffPick: "Inactive",
      DisplayType: "Select a type",
      Displaycat: "",
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
      ShowOnMain: "Active",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    });
    setPreview(null);
  };

  // Effects - wait for categories and modifiers to load before loading items
  useEffect(() => {
    // Only load items once categories are available (they're needed for mapping)
    if (!hasLoadedOnce && categories.length > 0) {
      loadMenuItems();
      setHasLoadedOnce(true);
    }
  }, [categories.length, hasLoadedOnce]);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Price: editingItem.Price || 0,
        Category: editingItem.Category,
        StockQty: editingItem.StockQty,
        Status: editingItem.Status,
        Description: editingItem.Description || "",
        MealType: editingItem.MealType || "All Day",
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
        Displaycat: editingItem.Displaycat || "",
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
  const filteredItems = menuItems
    .filter((item) => {
      const matchesSearch =
        item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || item.Status === statusFilter;
      const matchesCategory = categoryFilter === "" || item.Category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => (a.Priority || 0) - (b.Priority || 0));

  const isFormValid = () => {
    // For "Var" (multi-variant), price validation happens in Price tab
    // For "Qty" and other single-variant types, require price
    // "Weight" is ignored for now (not in backend)
    const isPriceValid = formData.Displaycat === "Var" || formData.Price > 0;

    return (
      formData.Name?.trim() &&
      formData.Displaycat &&
      formData.Displaycat !== "" &&
      formData.Category?.trim() &&
      isPriceValid
    );
  };

  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0;

  // Event handlers
  const handleCreateItem = async (itemData: Omit<MenuItem, "ID">) => {
    try {
      setActionLoading(true);

      const response = await MenuAPI.createMenuItem(itemData);
      if (response.success) {
        await loadMenuItems(); // Reload list
        setIsModalOpen(false);
        setSearchTerm("");
        showToast(response.message || "Item created successfully", "success");
      } else {
        showToast(response.message || "Failed to create item", "error");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast(error instanceof Error ? error.message : "Failed to create menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<MenuItem, "ID">) => {
    if (!editingItem) {
      showToast("Menu item ID not found", "error");
      return;
    }

    try {
      setActionLoading(true);

      const response = await MenuAPI.updateMenuItem(editingItem.ID, itemData);
      if (response.success) {
        await loadMenuItems(); // Reload list
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Item updated successfully", "success");
      } else {
        showToast(response.message || "Failed to update item", "error");
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

      // Use bulk delete with mock API
      const response = await MenuAPI.bulkDeleteMenuItem(selectedItems);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete items");
      }

      await loadMenuItems();
      setSelectedItems([]);
      showToast("Items deleted successfully", "success");
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
    initializeFormData();
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as "" | "Active" | "Inactive");
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
    menuOptions,
    categories,
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
    fileInputRef,
    formData,
    filteredItems,
    isAllSelected,
    toast,
    toastVisible,

    // Setters
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setFormData,
    setIsModalOpen,
    setActiveTab,
    setPreview,

    // Handlers
    handleCreateItem,
    handleUpdateItem,
    handleDeleteSelected,
    handleSelectAll,
    handleSelectItem,
    handleModalSubmit,
    handleStatusChange,
    handleCloseModal,
    handleEditItem,
    handleAddItem,
    handleStatusFilterChange,
    updateFormData,
    handleFormFieldChange,
    hideToast,

    // Utils
    isFormValid,
    loadMenuItems,
  };
};

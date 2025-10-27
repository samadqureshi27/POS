import { useState, useEffect, useRef } from "react";
import { useToast } from "@/lib/hooks";
import { MenuItemService, TenantMenuItem } from "@/lib/services/menu-item-service";
import { useMenuOptions } from "@/lib/hooks/useMenuOptions";
import { useCategory } from "@/lib/hooks/useCategory";
import { MenuItemOptions } from "@/lib/types/menuItemOptions";
import { CategoryItem } from "@/lib/types/category";

// Frontend MenuItem interface (existing structure)
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
  SpecialPrice?: number | string;
  OverRide?: any[];
  OptionValue?: string[];
  OptionPrice?: number[];
  MealValue?: string[];
  MealPrice?: number[];
  PName?: string[];
  PPrice?: number[];
  backendId?: string; // Store backend ID
}

// Map API Item to frontend MenuItem
const mapApiItemToMenuItem = (apiItem: TenantMenuItem, index: number, categories: CategoryItem[], modifierGroups: MenuItemOptions[]): MenuItem => {
  const id = apiItem._id || apiItem.id || String(index + 1);

  // Get first variant price as the main price (if variants exist)
  const price = apiItem.variants && apiItem.variants.length > 0
    ? apiItem.variants[0].price
    : 0;

  // Map first categoryId to category name
  const categoryId = apiItem.categoryIds && apiItem.categoryIds.length > 0
    ? apiItem.categoryIds[0]
    : "";
  const category = categories.find(cat => cat.backendId === categoryId);
  const categoryName = category?.Name || "";

  // Map modifiers from backend to frontend format
  // Backend: modifiers = [{ groupId: "abc", required: false, min: 0, max: 1 }]
  // Frontend: OptionValue = ["Milk Options", "Size"] (modifier group names)
  const optionValue: string[] = [];
  const optionPrice: number[] = [];

  if (apiItem.modifiers && apiItem.modifiers.length > 0) {
    apiItem.modifiers.forEach(mod => {
      const modGroup = modifierGroups.find(mg => mg.backendId === mod.groupId);
      if (modGroup) {
        optionValue.push(modGroup.Name);
        optionPrice.push(0); // Prices are in the modifier group options, not here
      }
    });
  }

  // Determine display type based on variants
  // Multiple variants = "Var" (multi-price)
  // Single variant = "Qty" (quantity-based, simple pricing)
  // Weight/Units not supported in backend yet, so ignoring "Weight" option
  const displaycat = apiItem.variants && apiItem.variants.length > 1 ? "Var" : "Qty";

  return {
    ID: index + 1,
    Name: apiItem.name,
    Price: price,
    Category: categoryName,
    StockQty: apiItem.stockQty?.toString() || "0",
    Status: apiItem.isActive ? "Active" : "Inactive",
    Description: apiItem.description || "",
    Priority: apiItem.priority || index + 1,
    Featured: apiItem.featured ? "Active" : "Inactive",
    MinimumQuantity: apiItem.minStockThreshold || 0,
    backendId: id,

    // Stubbed fields (not in API)
    MealType: "All Day",
    ShowOnMenu: "Active",
    StaffPick: "Inactive",
    ShowOnMain: "Active",
    Deal: "Inactive",
    Special: "Inactive",
    SubTBE: "Inactive",
    DisplayType: "Select a type",
    Displaycat: displaycat,
    SpecialStartDate: "",
    SpecialEndDate: "",
    SpecialPrice: "",
    OverRide: [],
    OptionValue: optionValue,
    OptionPrice: optionPrice,
    MealValue: [],
    MealPrice: [],
    PName: apiItem.variants?.map(v => v.name) || [],
    PPrice: apiItem.variants?.map(v => v.price) || [],
  };
};

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
    SpecialPrice: "",
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
      const response = await MenuItemService.listItems();
      if (response.success && response.data) {
        const mapped = response.data.map((item, idx) => mapApiItemToMenuItem(item, idx, categories, menuOptions));
        setMenuItems(mapped.sort((a, b) => (a.Priority || 0) - (b.Priority || 0)));
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
      SpecialPrice: "",
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
        SpecialPrice: editingItem.SpecialPrice || "",
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

      // Find category ID from name
      const category = categories.find(cat => cat.Name === itemData.Category);
      const categoryIds = category?.backendId ? [category.backendId] : [];

      // Build variants array
      const variants = [];
      if (itemData.Displaycat === "Var" && itemData.PName && itemData.PPrice) {
        for (let i = 0; i < itemData.PName.length; i++) {
          if (itemData.PName[i] && itemData.PPrice[i] !== undefined) {
            variants.push({
              name: itemData.PName[i],
              price: itemData.PPrice[i],
            });
          }
        }
      } else {
        // Single price item - create one default variant
        variants.push({
          name: "Regular",
          price: itemData.Price,
        });
      }

      // Map modifiers from frontend to backend
      // Frontend: OptionValue = ["Milk Options", "Size"] (modifier group names)
      // Backend: modifiers = [{ groupId: "abc", required: false, min: 0, max: 1 }]
      const modifiers = (itemData.OptionValue || []).map(optionName => {
        const modGroup = menuOptions.find(mg => mg.Name === optionName);
        return {
          groupId: modGroup?.backendId || "",
          required: false,
          min: modGroup?.min || 0,
          max: modGroup?.max || 1,
        };
      }).filter(mod => mod.groupId); // Remove any that didn't find a match

      const payload: Partial<TenantMenuItem> = {
        name: itemData.Name,
        categoryIds,
        description: itemData.Description || "",
        variants,
        modifiers,
        isActive: itemData.Status === "Active",
        featured: itemData.Featured === "Active",
        priority: itemData.Priority || 1,
        trackStock: false,
        stockQty: parseInt(itemData.StockQty) || 0,
        minStockThreshold: itemData.MinimumQuantity || 0,
      };

      const response = await MenuItemService.createItem(payload);
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
    if (!editingItem || !editingItem.backendId) {
      showToast("Menu item ID not found", "error");
      return;
    }

    try {
      setActionLoading(true);

      // Find category ID from name
      const category = categories.find(cat => cat.Name === itemData.Category);
      const categoryIds = category?.backendId ? [category.backendId] : [];

      // Build variants array
      const variants = [];
      if (itemData.Displaycat === "Var" && itemData.PName && itemData.PPrice) {
        for (let i = 0; i < itemData.PName.length; i++) {
          if (itemData.PName[i] && itemData.PPrice[i] !== undefined) {
            variants.push({
              name: itemData.PName[i],
              price: itemData.PPrice[i],
            });
          }
        }
      } else {
        variants.push({
          name: "Regular",
          price: itemData.Price,
        });
      }

      // Map modifiers from frontend to backend
      const modifiers = (itemData.OptionValue || []).map(optionName => {
        const modGroup = menuOptions.find(mg => mg.Name === optionName);
        return {
          groupId: modGroup?.backendId || "",
          required: false,
          min: modGroup?.min || 0,
          max: modGroup?.max || 1,
        };
      }).filter(mod => mod.groupId);

      const payload: Partial<TenantMenuItem> = {
        name: itemData.Name,
        categoryIds,
        description: itemData.Description || "",
        variants,
        modifiers,
        isActive: itemData.Status === "Active",
        featured: itemData.Featured === "Active",
        priority: itemData.Priority || 1,
        stockQty: parseInt(itemData.StockQty) || 0,
        minStockThreshold: itemData.MinimumQuantity || 0,
      };

      const response = await MenuItemService.updateItem(editingItem.backendId, payload);
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

      // Map local IDs to backend IDs
      const idsToDelete = selectedItems
        .map((n) => menuItems.find((item) => item.ID === n)?.backendId)
        .filter((id): id is string => typeof id === "string" && id.length > 0);

      // Delete each item
      for (const id of idsToDelete) {
        const resp = await MenuItemService.deleteItem(id);
        if (!resp.success) {
          throw new Error(resp.message || `Failed to delete item ${id}`);
        }
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

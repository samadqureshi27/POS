"use client";
import { useState, useEffect, useCallback } from "react";
import { MenuService } from "@/lib/services/menu-service";
import { MenuCategoryService } from "@/lib/services/menu-category-service";
import { RecipeService } from "@/lib/services/recipe-service";
import { MenuItem, MenuItemOption, ToastMessage } from "@/lib/types/menu";

export const useMenuItemData = () => {
  // State management
  const [menuItems, setMenuItems] = useState<MenuItemOption[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemOption | null>(null);

  // Initialize data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadMenuItems(),
      loadCategories(),
      loadRecipes()
    ]);
  };

  const loadCategories = useCallback(async () => {
    try {
      const response = await MenuCategoryService.listCategories();
      if (response.success && response.data) {
        let categoriesArray = response.data;
        if (!Array.isArray(categoriesArray)) {
          categoriesArray = (response.data as any).categories ||
                          (response.data as any).data ||
                          (response.data as any).items || [];
        }
        console.log("✅ Loaded categories for menu items:", categoriesArray.length);
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  const loadRecipes = useCallback(async () => {
    try {
      const response = await RecipeService.listRecipes();
      if (response.success && response.data) {
        let recipesArray = response.data;
        if (!Array.isArray(recipesArray)) {
          recipesArray = (response.data as any).recipes ||
                        (response.data as any).data ||
                        (response.data as any).items || [];
        }
        console.log("✅ Loaded recipes for menu items:", recipesArray.length);
        setRecipes(recipesArray);
      }
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  }, []);

  const loadMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await MenuService.listMenuItems();
      console.log("📦 Raw response for menu items:", response);

      if (response.success) {
        let itemsArray = response.data;

        if (!Array.isArray(itemsArray)) {
          console.warn("Response data is not an array, checking for nested data...");
          if (response.data && typeof response.data === 'object') {
            itemsArray = (response.data as any).items ||
                        (response.data as any).data ||
                        (response.data as any).menuItems || [];
          } else {
            itemsArray = [];
          }
        }

        console.log("✅ Loaded menu items:", itemsArray.length);

        // Transform menu items to match the expected format
        const transformedItems = itemsArray.map((item: any) => {
          // Find category and recipe names
          const category = categories.find(c => c._id === item.categoryId);
          const recipe = recipes.find(r => r._id === item.recipeId);

          return {
            ID: item._id || item.id,
            Name: item.name,
            Code: item.code || "",
            Status: item.isActive === false ? "Inactive" : "Active",
            Description: item.description || "",
            Category: category?.name || "",
            CategoryId: item.categoryId || "",
            Recipe: recipe?.name || "",
            RecipeId: item.recipeId || "",
            BasePrice: item.pricing?.basePrice || 0,
            Currency: item.pricing?.currency || "SAR",
            PriceIncludesTax: item.pricing?.priceIncludesTax || false,
            Tags: item.tags || [],
            DisplayOrder: item.displayOrder || 0,
            ImageUrl: item.media?.[0]?.url || "",
            _raw: item, // Store raw data for editing
          };
        });
        setMenuItems(transformedItems);
      } else {
        console.error("Failed to load menu items:", response.message);
        showToast(response.message || "Failed to load menu items", "error");
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      showToast("Failed to load menu items", "error");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [categories, recipes]);

  // Reload menu items when categories or recipes change
  useEffect(() => {
    if (categories.length > 0 || recipes.length > 0) {
      loadMenuItems();
    }
  }, [categories, recipes]);

  // Computed values
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.Code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || item.Status === statusFilter;
    const matchesCategory = categoryFilter === "" || item.CategoryId === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;

  // Get unique categories from menu items
  const availableCategories = [...new Set(
    menuItems
      .map(item => ({ id: item.CategoryId, name: item.Category }))
      .filter(cat => cat.id)
  )];

  // Statistics
  const menuItemStats = {
    total: menuItems.length,
    active: menuItems.filter(item => item.Status === "Active").length,
    inactive: menuItems.filter(item => item.Status === "Inactive").length,
    byCategory: availableCategories.reduce((acc, category) => {
      acc[category.name] = menuItems.filter(item => item.CategoryId === category.id).length;
      return acc;
    }, {} as Record<string, number>)
  };

  // Utility functions
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // CRUD Operations
  const createMenuItem = useCallback(async (itemData: any) => {
    try {
      setActionLoading(true);
      console.log("📤 Creating menu item with data:", itemData);

      const response = await MenuService.createMenuItem(itemData);
      if (response.success && response.data) {
        await loadMenuItems();
        showToast(response.message || "Menu item created successfully", "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to create menu item");
      }
    } catch (error: any) {
      console.error("Error creating menu item:", error);
      showToast(error.message || "Failed to create menu item", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadMenuItems]);

  const updateMenuItem = useCallback(async (id: string, itemData: any) => {
    try {
      setActionLoading(true);
      console.log("📤 Updating menu item:", id, itemData);

      const response = await MenuService.updateMenuItem(id, itemData);
      if (response.success && response.data) {
        await loadMenuItems();
        showToast(response.message || "Menu item updated successfully", "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to update menu item");
      }
    } catch (error: any) {
      console.error("Error updating menu item:", error);
      showToast(error.message || "Failed to update menu item", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadMenuItems]);

  const deleteMenuItems = useCallback(async (itemIds: string[]) => {
    if (itemIds.length === 0) return { success: false };

    try {
      setActionLoading(true);
      const deletePromises = itemIds.map(id => MenuService.deleteMenuItem(id));
      const results = await Promise.all(deletePromises);

      const allSuccessful = results.every((result) => result.success);

      if (allSuccessful) {
        await loadMenuItems();
        setSelectedItems([]);
        showToast(`${itemIds.length} menu item(s) deleted successfully`, "success");
        return { success: true };
      } else {
        const failedCount = results.filter((r) => !r.success).length;
        throw new Error(`Failed to delete ${failedCount} of ${itemIds.length} menu items`);
      }
    } catch (error: any) {
      console.error("Error deleting menu items:", error);
      showToast(error.message || "Failed to delete menu items", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadMenuItems]);

  // Selection handlers
  const handleSelectItem = useCallback((itemId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, itemId]
        : prev.filter((id) => id !== itemId)
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
  }, [filteredItems]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Modal handlers
  const openAddModal = useCallback(() => {
    if (selectedItems.length > 0) return;
    setEditingItem(null);
    setIsModalOpen(true);
  }, [selectedItems.length]);

  const openEditModal = useCallback(async (item: MenuItemOption) => {
    try {
      console.log("🔄 openEditModal called with item:", item);
      const itemId = item.ID;
      const response = await MenuService.getMenuItem(itemId);

      if (response.success && response.data) {
        const fullItem = {
          ...item,
          _raw: response.data,
        };
        setEditingItem(fullItem);
      } else {
        setEditingItem(item);
      }
    } catch (error) {
      console.error("Error fetching menu item details:", error);
      setEditingItem(item);
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const handleModalSubmit = useCallback(async (data: any) => {
    let result;

    if (editingItem) {
      result = await updateMenuItem(editingItem.ID, data);
    } else {
      result = await createMenuItem(data);
    }

    if (result.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setSelectedItems([]);
    }

    return result;
  }, [editingItem, updateMenuItem, createMenuItem]);

  // Filter handlers
  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const updateStatusFilter = useCallback((status: "" | "Active" | "Inactive") => {
    setStatusFilter(status);
  }, []);

  const updateCategoryFilter = useCallback((category: string) => {
    setCategoryFilter(category);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, []);

  // Return all data and functions
  return {
    // Data
    menuItems,
    categories,
    recipes,
    filteredItems,
    selectedItems,
    loading,
    actionLoading,
    toast,

    // Filter states
    searchTerm,
    statusFilter,
    categoryFilter,

    // Modal states
    isModalOpen,
    editingItem,

    // Computed values
    isAllSelected,
    availableCategories,
    menuItemStats,

    // CRUD operations
    createMenuItem,
    updateMenuItem,
    deleteMenuItems: () => deleteMenuItems(selectedItems),

    // Selection handlers
    handleSelectItem,
    handleSelectAll,
    clearSelection,

    // Modal handlers
    openAddModal,
    openEditModal,
    closeModal,
    handleModalSubmit,

    // Filter handlers
    updateSearchTerm,
    updateStatusFilter,
    updateCategoryFilter,
    clearFilters,

    // Utility functions
    showToast,
    refreshData,

    // Toast handler
    dismissToast: () => setToast(null),
  };
};

"use client";
import { useState, useEffect, useCallback } from "react";
import { MenuCategoryService } from "@/lib/services/menu-category-service";
import { MenuCategory, MenuCategoryOption, ToastMessage } from "@/lib/types/menu";

export const useCategoryData = () => {
  // State management
  const [categories, setCategories] = useState<MenuCategoryOption[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [parentFilter, setParentFilter] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuCategoryOption | null>(null);

  // Initialize data
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await MenuCategoryService.listCategories();
      console.log("📦 Raw response for categories:", response);

      if (response.success) {
        let categoriesArray = response.data;

        if (!Array.isArray(categoriesArray)) {
          console.warn("Response data is not an array, checking for nested data...");
          if (response.data && typeof response.data === 'object') {
            categoriesArray = (response.data as any).categories ||
                            (response.data as any).data ||
                            (response.data as any).items || [];
          } else {
            categoriesArray = [];
          }
        }

        console.log("✅ Loaded categories:", categoriesArray.length);

        // Transform categories to match the expected format
        const transformedCategories = categoriesArray.map((cat: any) => ({
          ID: cat._id || cat.id,
          Name: cat.name,
          Code: cat.code || "",
          Status: cat.isActive === false ? "Inactive" : "Active",
          Description: cat.description || "",
          ParentCategory: cat.parentId || "",
          DisplayOrder: cat.displayOrder || 0,
          _raw: cat, // Store raw data for editing
        }));
        setCategories(transformedCategories);
      } else {
        console.error("Failed to load categories:", response.message);
        showToast(response.message || "Failed to load categories", "error");
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Failed to load categories", "error");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Computed values
  const filteredItems = categories.filter((item) => {
    const matchesSearch = item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.Code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || item.Status === statusFilter;
    const matchesParent = parentFilter === "" || item.ParentCategory === parentFilter;
    return matchesSearch && matchesStatus && matchesParent;
  });

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;

  // Get unique parent categories
  const parentCategories = categories.filter(cat => !cat.ParentCategory);

  // Statistics
  const categoryStats = {
    total: categories.length,
    active: categories.filter(item => item.Status === "Active").length,
    inactive: categories.filter(item => item.Status === "Inactive").length,
    topLevel: parentCategories.length,
  };

  // Utility functions
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // CRUD Operations
  const createCategory = useCallback(async (itemData: any) => {
    try {
      setActionLoading(true);
      console.log("📤 Creating category with data:", itemData);

      const response = await MenuCategoryService.createCategory(itemData);
      if (response.success && response.data) {
        await loadCategories();
        showToast(response.message || "Category created successfully", "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to create category");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      showToast(error.message || "Failed to create category", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadCategories]);

  const updateCategory = useCallback(async (id: string, itemData: any) => {
    try {
      setActionLoading(true);
      console.log("📤 Updating category:", id, itemData);

      const response = await MenuCategoryService.updateCategory(id, itemData);
      if (response.success && response.data) {
        await loadCategories();
        showToast(response.message || "Category updated successfully", "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to update category");
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      showToast(error.message || "Failed to update category", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadCategories]);

  const deleteCategories = useCallback(async (itemIds: string[]) => {
    if (itemIds.length === 0) return { success: false };

    try {
      setActionLoading(true);
      const deletePromises = itemIds.map(id => MenuCategoryService.deleteCategory(id));
      const results = await Promise.all(deletePromises);

      const allSuccessful = results.every((result) => result.success);

      if (allSuccessful) {
        await loadCategories();
        setSelectedItems([]);
        showToast(`${itemIds.length} category(ies) deleted successfully`, "success");
        return { success: true };
      } else {
        const failedCount = results.filter((r) => !r.success).length;
        throw new Error(`Failed to delete ${failedCount} of ${itemIds.length} categories`);
      }
    } catch (error: any) {
      console.error("Error deleting categories:", error);
      showToast(error.message || "Failed to delete categories", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadCategories]);

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

  const openEditModal = useCallback(async (item: MenuCategoryOption) => {
    try {
      console.log("🔄 openEditModal called with item:", item);
      const categoryId = item.ID;
      const response = await MenuCategoryService.getCategory(categoryId);

      if (response.success && response.data) {
        const fullCategory = {
          ...item,
          _raw: response.data,
        };
        setEditingItem(fullCategory);
      } else {
        setEditingItem(item);
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
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
      result = await updateCategory(editingItem.ID, data);
    } else {
      result = await createCategory(data);
    }

    if (result.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setSelectedItems([]);
    }

    return result;
  }, [editingItem, updateCategory, createCategory]);

  // Filter handlers
  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const updateStatusFilter = useCallback((status: "" | "Active" | "Inactive") => {
    setStatusFilter(status);
  }, []);

  const updateParentFilter = useCallback((parent: string) => {
    setParentFilter(parent);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("");
    setParentFilter("");
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadCategories();
  }, [loadCategories]);

  // Return all data and functions
  return {
    // Data
    categories,
    filteredItems,
    selectedItems,
    loading,
    actionLoading,
    toast,

    // Filter states
    searchTerm,
    statusFilter,
    parentFilter,

    // Modal states
    isModalOpen,
    editingItem,

    // Computed values
    isAllSelected,
    parentCategories,
    categoryStats,

    // CRUD operations
    createCategory,
    updateCategory,
    deleteCategories: () => deleteCategories(selectedItems),

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
    updateParentFilter,
    clearFilters,

    // Utility functions
    showToast,
    refreshData,

    // Toast handler
    dismissToast: () => setToast(null),
  };
};

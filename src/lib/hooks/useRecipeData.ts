"use client";
import { useState, useEffect, useCallback } from "react";
import MenuAPI from "@/lib/util/recipeApi";
import { recipeOptionsApi } from "@/lib/util/recipe-options-api";
import { useIngredientsData } from "./useIngredientsData";
import {
  RecipeOption,
  Ingredient,
  ToastMessage,
  FilterOptions,
  RecipePayload
} from "../types/recipes";

export const useRecipeData = () => {
  // Get ingredients data from ingredients hook and transform to match expected format
  const { items: rawIngredients } = useIngredientsData();

  // Transform ingredients to match expected format (string ID to number ID)
  const ingredients: Ingredient[] = rawIngredients.map(item => ({
    ...item,
    ID: parseInt(item.ID.replace('#', '')) || 0
  }));

  // State management
  const [recipeOptions, setRecipeOptions] = useState<RecipeOption[]>([]);
  const [availableRecipeOptions, setAvailableRecipeOptions] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecipeOption | null>(null);

  // Initialize data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadRecipeOptions(),
      loadAvailableRecipeOptions()
    ]);
  };


  const loadAvailableRecipeOptions = useCallback(async () => {
    try {
      const response = await recipeOptionsApi.getRecipeOptions();
      if (response.success) {
        // Map the response data to match expected format
        const optionsWithDefaults = response.data.map(option => ({
          ID: option.ID,
          Name: option.Name,
          Status: option.Status || "Active" as "Active" | "Inactive",
          Description: option.Description || "",
          Priority: option.Priority || 0
        }));
        setAvailableRecipeOptions(optionsWithDefaults);
      } else {
        throw new Error(response.message || "Failed to fetch recipe options");
      }
    } catch (error) {
      console.error("Error fetching available recipe options:", error);
      showToast("Failed to load recipe options", "error");
    }
  }, []);

  const loadRecipeOptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getRecipeOption();
      if (response.success) {
        // Ensure all recipes have the required Description field
        const recipesWithDefaults = response.data.map(recipe => ({
          ...recipe,
          Description: recipe.Description || ""
        }));
        setRecipeOptions(recipesWithDefaults);
      } else {
        throw new Error(response.message || "Failed to fetch recipes");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      showToast("Failed to load recipes", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Computed values
  const filteredItems = recipeOptions.filter((item) => {
    const matchesSearch = item.Name.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesStatus = statusFilter === "" || item.Status === statusFilter;
    const matchesCategory = categoryFilter === "" || item.Category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;

  // Get unique categories from existing recipes
  const availableCategories = [...new Set(
    recipeOptions
      .map(recipe => recipe.Category)
      .filter((category): category is string => Boolean(category))
  )];

  // Statistics
  const recipeStats = {
    total: recipeOptions.length,
    active: recipeOptions.filter(item => item.Status === "Active").length,
    inactive: recipeOptions.filter(item => item.Status === "Inactive").length,
    byCategory: availableCategories.reduce((acc, category) => {
      acc[category] = recipeOptions.filter(item => item.Category === category).length;
      return acc;
    }, {} as Record<string, number>)
  };

  // Utility functions
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // CRUD Operations
  const createRecipe = useCallback(async (itemData: RecipePayload) => {
    try {
      setActionLoading(true);
      
      // Ensure Description is provided
      const recipeData: RecipePayload = {
        ...itemData,
        Description: itemData.Description || ""
      };
      
      const response = await MenuAPI.createRecipeOption(recipeData);
      if (response.success) {
        setRecipeOptions((prevItems) => [...prevItems, response.data]);
        showToast(response.message || "Recipe created successfully", "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to create recipe");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      showToast("Failed to create recipe", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const updateRecipe = useCallback(async (id: number, itemData: RecipePayload) => {
    try {
      setActionLoading(true);
      
      // Ensure Description is provided
      const recipeData: RecipePayload = {
        ...itemData,
        Description: itemData.Description || ""
      };
      
      const response = await MenuAPI.updateRecipeOption(id, recipeData);
      if (response.success) {
        setRecipeOptions((prevItems) =>
          prevItems.map((item) =>
            item.ID === id ? response.data : item
          )
        );
        showToast(response.message || "Recipe updated successfully", "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to update recipe");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      showToast("Failed to update recipe", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const deleteRecipes = useCallback(async (itemIds: number[]) => {
    if (itemIds.length === 0) return { success: false };

    try {
      setActionLoading(true);
      const response = await MenuAPI.bulkDeleteRecipeOption(itemIds);
      if (response.success) {
        setRecipeOptions((prev) => {
          const remaining = prev.filter((i) => !itemIds.includes(i.ID));
          // Reassign IDs sequentially
          return remaining.map((item, idx) => ({ ...item, ID: idx + 1 }));
        });
        setSelectedItems([]);
        showToast(
          response.message || `${itemIds.length} recipe(s) deleted successfully`,
          "success"
        );
        return { success: true };
      } else {
        throw new Error(response.message || "Failed to delete recipes");
      }
    } catch (error) {
      console.error("Error deleting recipes:", error);
      showToast("Failed to delete recipes", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  // Selection handlers
  const handleSelectItem = useCallback((itemId: number, checked: boolean) => {
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

  const openEditModal = useCallback((item: RecipeOption) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const handleModalSubmit = useCallback(async (data: RecipePayload) => {
    let result;
    
    if (editingItem) {
      result = await updateRecipe(editingItem.ID, data);
    } else {
      result = await createRecipe(data);
    }

    if (result.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setSelectedItems([]);
    }

    return result;
  }, [editingItem, updateRecipe, createRecipe]);

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
    recipeOptions,
    ingredients,
    availableRecipeOptions,
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
    recipeStats,

    // CRUD operations
    createRecipe,
    updateRecipe,
    deleteRecipes: () => deleteRecipes(selectedItems),

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
    loadIngredients,
    loadRecipeOptions,

    // Toast handler
    dismissToast: () => setToast(null),
  };
};
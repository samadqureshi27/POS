"use client";
import { useState, useEffect, useCallback } from "react";
import { RecipeService } from "@/lib/services/recipe-service";
import { InventoryService } from "@/lib/services/inventory-service";
import {
  RecipeOption,
  Ingredient,
  ToastMessage,
  FilterOptions,
  RecipePayload
} from "../types/recipes";

export const useRecipeData = () => {
  // Fetch inventory items from items-management
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);

  // Transform inventory to ingredients format
  const ingredients: Ingredient[] = inventoryItems.map((item, index) => ({
    ID: item._id || item.id || index,
    Name: item.name,
    Unit: item.baseUnit || "pc",
    _id: item._id || item.id,
    name: item.name,
    baseUnit: item.baseUnit,
    sku: item.sku,
    type: item.type,
    quantity: item.quantity,
    reorderPoint: item.reorderPoint,
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
      loadAvailableRecipeOptions(),
      loadInventoryItems()
    ]);
  };

  const loadInventoryItems = useCallback(async () => {
    try {
      const response = await InventoryService.listItems();
      if (response.success && response.data) {
        console.log("✅ Loaded inventory items for recipes:", response.data.length, "items");
        setInventoryItems(response.data);
      } else {
        console.error("Failed to load inventory:", response.message);
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
  }, []);


  const loadAvailableRecipeOptions = useCallback(async () => {
    try {
      const response = await RecipeService.listRecipes();
      console.log("📦 Raw response for available recipes:", response);

      if (response.success) {
        // Handle different response formats
        let recipesArray = response.data;

        // If data is not an array, it might be wrapped in another property
        if (!Array.isArray(recipesArray)) {
          console.warn("Response data is not an array, checking for nested data...");
          // Check common API response patterns
          if (response.data && typeof response.data === 'object') {
            recipesArray = (response.data as any).recipes ||
                          (response.data as any).data ||
                          (response.data as any).items || [];
          } else {
            recipesArray = [];
          }
        }

        console.log("✅ Loaded available recipe options:", recipesArray.length);

        if (recipesArray.length === 0) {
          console.warn("No recipes found in response");
          setAvailableRecipeOptions([]);
          return;
        }

        // Use the same recipe data - filter for sub recipes in the modal
        const transformedRecipes = recipesArray.map((recipe: any) => ({
          ID: recipe._id || recipe.id,
          _id: recipe._id,
          Name: recipe.name,
          name: recipe.name, // Also keep lowercase for compatibility
          Status: recipe.isActive === false ? "Inactive" : "Active",
          Description: recipe.description || "",
          type: recipe.type || "sub",
          Priority: 0,
          price: recipe.totalCost || 0,
          OptionValue: "",
          OptionPrice: 0,
          IngredientValue: "",
          IngredientPrice: 0,
          Ingredients: recipe.ingredients || [],
        }));
        setAvailableRecipeOptions(transformedRecipes);
      } else {
        console.error("Failed to load recipe options:", response.message);
        setAvailableRecipeOptions([]);
      }
    } catch (error) {
      console.error("Error fetching available recipe options:", error);
      setAvailableRecipeOptions([]);
    }
  }, []);

  const loadRecipeOptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await RecipeService.listRecipes();
      console.log("📦 Raw response for recipes:", response);

      if (response.success) {
        // Handle different response formats
        let recipesArray = response.data;

        // If data is not an array, it might be wrapped in another property
        if (!Array.isArray(recipesArray)) {
          console.warn("Response data is not an array, checking for nested data...");
          // Check common API response patterns
          if (response.data && typeof response.data === 'object') {
            recipesArray = (response.data as any).recipes ||
                          (response.data as any).data ||
                          (response.data as any).items || [];
          } else {
            recipesArray = [];
          }
        }

        console.log("✅ Loaded real recipes:", recipesArray.length);

        if (recipesArray.length === 0) {
          console.warn("No recipes found - this is normal if you haven't created any yet");
          setRecipeOptions([]);
          setLoading(false);
          return;
        }

        // Transform recipes to match the expected format
        const transformedRecipes = recipesArray.map((recipe: any) => ({
          ID: recipe._id || recipe.id,
          _id: recipe._id,
          Name: recipe.name,
          Status: recipe.isActive === false ? "Inactive" : "Active",
          Description: recipe.description || "",
          type: recipe.type || "sub",
          Priority: 0,
          price: recipe.totalCost || 0,
          OptionValue: "",
          OptionPrice: 0,
          IngredientValue: "",
          IngredientPrice: 0,
          Ingredients: recipe.ingredients || [], // Include ingredients for display
          totalCost: recipe.totalCost || 0,
        }));
        setRecipeOptions(transformedRecipes);
      } else {
        console.error("Failed to load recipes:", response.message);
        showToast(response.message || "Failed to load recipes", "error");
        setRecipeOptions([]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      showToast("Failed to load recipes", "error");
      setRecipeOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Computed values
  const filteredItems = recipeOptions.filter((item) => {
    const itemName = item.Name || item.name || "";
    const matchesSearch = itemName.toLowerCase().includes(
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
  const createRecipe = useCallback(async (itemData: any) => {
    try {
      setActionLoading(true);

      console.log("📤 Creating recipe with data:", itemData);

      const response = await RecipeService.createRecipe(itemData);
      if (response.success && response.data) {
        await Promise.all([
          loadRecipeOptions(), // Reload all recipes
          loadAvailableRecipeOptions() // Reload available recipes for dropdown
        ]);
        showToast(response.message || "Recipe created successfully", "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to create recipe");
      }
    } catch (error: any) {
      console.error("Error creating recipe:", error);
      showToast(error.message || "Failed to create recipe", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadRecipeOptions, loadAvailableRecipeOptions]);

  const updateRecipe = useCallback(async (id: string, itemData: any) => {
    try {
      setActionLoading(true);

      console.log("📤 Updating recipe:", id, itemData);

      const response = await RecipeService.updateRecipe(id, itemData);
      if (response.success && response.data) {
        await Promise.all([
          loadRecipeOptions(), // Reload all recipes
          loadAvailableRecipeOptions() // Reload available recipes for dropdown
        ]);
        showToast(response.message || "Recipe updated successfully", "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to update recipe");
      }
    } catch (error: any) {
      console.error("Error updating recipe:", error);
      showToast(error.message || "Failed to update recipe", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadRecipeOptions, loadAvailableRecipeOptions]);

  const deleteRecipes = useCallback(async (itemIds: number[]) => {
    if (itemIds.length === 0) return { success: false };

    try {
      setActionLoading(true);

      // Find the actual recipe IDs (_id) from the selected numeric IDs
      const recipesToDelete = recipeOptions.filter((recipe) =>
        itemIds.includes(recipe.ID)
      );

      console.log("🗑️ Deleting recipes:", recipesToDelete);

      // Delete each recipe using RecipeService
      const deletePromises = recipesToDelete.map(async (recipe) => {
        const recipeId = recipe._id || recipe.ID.toString();
        return await RecipeService.deleteRecipe(recipeId);
      });

      const results = await Promise.all(deletePromises);

      // Check if all deletions were successful
      const allSuccessful = results.every((result) => result.success);

      if (allSuccessful) {
        await loadRecipeOptions(); // Reload all recipes
        setSelectedItems([]);
        showToast(
          `${itemIds.length} recipe(s) deleted successfully`,
          "success"
        );
        return { success: true };
      } else {
        const failedCount = results.filter((r) => !r.success).length;
        throw new Error(
          `Failed to delete ${failedCount} of ${itemIds.length} recipes`
        );
      }
    } catch (error: any) {
      console.error("Error deleting recipes:", error);
      showToast(error.message || "Failed to delete recipes", "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [showToast, recipeOptions, loadRecipeOptions]);

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

  const openEditModal = useCallback(async (item: RecipeOption) => {
    try {
      console.log("🔄 openEditModal called with item:", item);

      // Fetch full recipe details including ingredients
      const recipeId = item._id || item.ID.toString();
      console.log("📡 Fetching recipe details for ID:", recipeId);

      const response = await RecipeService.getRecipe(recipeId);
      console.log("📦 Recipe details response:", response);

      if (response.success && response.data) {
        console.log("✅ Recipe data received:", response.data);
        console.log("  - Ingredients count:", response.data.ingredients?.length || 0);
        console.log("  - Ingredients:", response.data.ingredients);

        // Merge the full recipe data with the item
        const fullRecipe = {
          ...item,
          ingredients: response.data.ingredients || [],
          description: response.data.description,
        };
        console.log("🔀 Merged full recipe:", fullRecipe);
        setEditingItem(fullRecipe as any);
      } else {
        console.error("❌ Failed to fetch recipe details:", response.message);
        setEditingItem(item);
      }
    } catch (error) {
      console.error("❌ Error fetching recipe details:", error);
      setEditingItem(item);
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const handleModalSubmit = useCallback(async (data: RecipePayload) => {
    let result;

    if (editingItem) {
      // Use _id for API call, not the transformed ID
      const recipeId = editingItem._id || editingItem.ID.toString();
      result = await updateRecipe(recipeId, data);
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
    loadRecipeOptions,

    // Toast handler
    dismissToast: () => setToast(null),
  };
};
"use client";
import { useDataManager } from './useDataManager';
import { RecipeService } from "@/lib/services/recipe-service";
import { InventoryService } from "@/lib/services/inventory-service";
import { RecipeOption, Ingredient, RecipePayload } from "../types/recipes";
import { useMemo } from "react";
import { logError } from "@/lib/util/logger";

export const useRecipeData = () => {
  const hook = useDataManager<any, RecipeOption>({
    service: RecipeService,
    entityName: 'recipe',
    listMethod: 'listRecipes',
    getMethod: 'getRecipe',
    createMethod: 'createRecipe',
    updateMethod: 'updateRecipe',
    deleteMethod: 'deleteRecipe',
    transformData: (recipe: any) => ({
      ID: recipe._id || recipe.id,
      _id: recipe._id,
      Name: recipe.name,
      Status: (recipe.isActive === false ? "Inactive" : "Active") as "Active" | "Inactive",
      Description: recipe.description || "",
      type: recipe.type || "sub",
      Priority: 0,
      price: recipe.totalCost || 0,
      OptionValue: [] as string[],
      OptionPrice: [] as number[],
      IngredientValue: [] as string[],
      IngredientPrice: [] as number[],
      Ingredients: recipe.ingredients || [],
      ingredients: recipe.ingredients || [],
      totalCost: recipe.totalCost || 0,
    }),
    extractDataArray: (response) => {
      if (Array.isArray(response)) return response;
      return response.recipes || response.data || response.items || [];
    },
    customFilter: (item, filters) => {
      const itemName = item.Name || (item as any).name || "";
      const matchesSearch = itemName.toLowerCase().includes(filters.searchTerm?.toLowerCase() || '');
      const matchesStatus = !filters.statusFilter || item.Status === filters.statusFilter;
      const matchesCategory = !filters.categoryFilter || (item as any).Category === filters.categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    },
    additionalData: {
      inventoryItems: async () => {
        const response = await InventoryService.listItems();
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      },
      availableRecipeOptions: async () => {
        const response = await RecipeService.listRecipes();
        if (response.success) {
          let recipesArray = response.data;
          if (!Array.isArray(recipesArray)) {
            recipesArray = (response.data as any).recipes ||
                          (response.data as any).data ||
                          (response.data as any).items || [];
          }
          return recipesArray.map((recipe: any) => ({
            ID: recipe._id || recipe.id,
            _id: recipe._id,
            Name: recipe.name,
            name: recipe.name,
            Status: (recipe.isActive === false ? "Inactive" : "Active") as "Active" | "Inactive",
            Description: recipe.description || "",
            type: recipe.type || "sub",
            Priority: 0,
            price: recipe.totalCost || 0,
            OptionValue: [] as string[],
            OptionPrice: [] as number[],
            IngredientValue: [] as string[],
            IngredientPrice: [] as number[],
            Ingredients: recipe.ingredients || [],
            ingredients: recipe.ingredients || [],
          }));
        }
        return [];
      },
    },
  });

  // Transform inventory to ingredients format
  const ingredients: Ingredient[] = useMemo(() => {
    const inventoryItems = hook.additionalDataValues?.inventoryItems || [];
    return inventoryItems.map((item: any, index: number) => ({
      ID: item._id || item.id || index,
      Name: item.name,
      Status: "Active" as "Active" | "Inactive",
      Description: item.description || "",
      Unit: item.baseUnit || "pc",
      Threshold: item.reorderPoint || 0,
      Priority: 0,
    }));
  }, [hook.additionalDataValues?.inventoryItems]);

  // Computed values
  const availableCategories = useMemo(() =>
    [...new Set(
      hook.items
        .map((recipe: any) => recipe.Category)
        .filter((category): category is string => Boolean(category))
    )],
    [hook.items]
  );

  const recipeStats = useMemo(() => ({
    total: hook.items.length,
    active: hook.items.filter(item => item.Status === "Active").length,
    inactive: hook.items.filter(item => item.Status === "Inactive").length,
    byCategory: availableCategories.reduce((acc, category) => {
      acc[category] = hook.items.filter((item: any) => item.Category === category).length;
      return acc;
    }, {} as Record<string, number>)
  }), [hook.items, availableCategories]);

  // Custom delete handler for numeric IDs
  const deleteRecipes = async (itemIds: number[]) => {
    if (itemIds.length === 0) return { success: false };

    const recipesToDelete = hook.items.filter((recipe) =>
      itemIds.includes(recipe.ID as any)
    );

    const recipeIdsToDelete = recipesToDelete.map(recipe => recipe._id || recipe.ID.toString());
    return hook.delete(recipeIdsToDelete as any);
  };

  // Custom openEditModal to handle recipe details fetching
  const openEditModal = async (item: RecipeOption) => {
    try {
      const recipeId = item._id || item.ID.toString();
      const response = await RecipeService.getRecipe(recipeId, false);

      if (response.success && response.data) {
        const recipeData = response.data.recipe || response.data;
        const fullRecipe = {
          ...item,
          ingredients: recipeData.ingredients || [],
          description: recipeData.description,
        };
        hook.openEditModal(fullRecipe as any);
      } else {
        hook.openEditModal(item);
      }
    } catch (error) {
      logError("Error fetching recipe details", error, {
        component: "useRecipeData",
        action: "openEditModal",
        recipeId: item._id || item.ID,
      });
      hook.openEditModal(item);
    }
  };

  // Custom handleModalSubmit to handle recipe-specific ID format
  const handleModalSubmit = async (data: RecipePayload) => {
    if (hook.editingItem) {
      const recipeId = (hook.editingItem as any)._id || hook.editingItem.ID.toString();
      const result = await hook.update(recipeId as any, data);
      if (result.success) {
        hook.closeModal();
        hook.clearSelection();
      }
      return result;
    } else {
      const result = await hook.create(data);
      if (result.success) {
        hook.closeModal();
        hook.clearSelection();
      }
      return result;
    }
  };

  // Return with backwards-compatible API
  return {
    recipeOptions: hook.items,
    ingredients,
    availableRecipeOptions: hook.additionalDataValues?.availableRecipeOptions || [],
    filteredItems: hook.filteredItems,
    selectedItems: hook.selectedItems,
    loading: hook.loading,
    actionLoading: hook.actionLoading,
    toast: hook.toast,
    searchTerm: hook.searchTerm,
    statusFilter: hook.filters.statusFilter || "",
    categoryFilter: hook.filters.categoryFilter || "",
    isModalOpen: hook.isModalOpen,
    editingItem: hook.editingItem,
    isAllSelected: hook.isAllSelected,
    availableCategories,
    recipeStats,
    createRecipe: hook.create,
    updateRecipe: hook.update,
    deleteRecipes: () => deleteRecipes(hook.selectedItems as any),
    handleSelectItem: hook.handleSelectItem,
    handleSelectAll: hook.handleSelectAll,
    clearSelection: hook.clearSelection,
    openAddModal: hook.openAddModal,
    openEditModal,
    closeModal: hook.closeModal,
    handleModalSubmit,
    updateSearchTerm: hook.updateSearchTerm,
    updateStatusFilter: (status: "" | "Active" | "Inactive") => hook.updateFilter('statusFilter', status),
    updateCategoryFilter: (category: string) => hook.updateFilter('categoryFilter', category),
    clearFilters: hook.clearFilters,
    showToast: hook.showToast,
    refreshData: hook.refreshData,
    loadRecipeOptions: hook.refreshData,
    dismissToast: hook.dismissToast,
  };
};

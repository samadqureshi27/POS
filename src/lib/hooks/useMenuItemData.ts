"use client";
import { useDataManager } from './useDataManager';
import { MenuService } from "@/lib/services/menu-service";
import { MenuCategoryService } from "@/lib/services/menu-category-service";
import { RecipeService } from "@/lib/services/recipe-service";
import { MenuItemOption, extractId } from "@/lib/types/menu";
import { useMemo } from "react";

export const useMenuItemData = () => {
  const hook = useDataManager<any, MenuItemOption>({
    service: MenuService,
    entityName: 'menu item',
    listMethod: 'listMenuItems',
    getMethod: 'getMenuItem',
    createMethod: 'createMenuItem',
    updateMethod: 'updateMenuItem',
    deleteMethod: 'deleteMenuItem',
    transformData: (item, index, additionalData) => {
      const categories = additionalData?.categories || [];
      const recipes = additionalData?.recipes || [];

      const categoryId = extractId(item.categoryId);
      const recipeId = extractId(item.recipeId);

      const category = categories.find((c: any) => c._id === categoryId);
      const recipe = recipes.find((r: any) => r._id === recipeId);

      return {
        ID: item._id || item.id,
        Name: item.name,
        Code: item.code || "",
        Status: item.isActive === false ? "Inactive" : "Active",
        Description: item.description || "",
        Category: category?.name || "",
        CategoryId: categoryId,
        Recipe: recipe?.name || "",
        RecipeId: recipeId,
        BasePrice: item.pricing?.basePrice || 0,
        Currency: item.pricing?.currency || "SAR",
        PriceIncludesTax: item.pricing?.priceIncludesTax || false,
        Tags: item.tags || [],
        DisplayOrder: item.displayOrder || 0,
        ImageUrl: item.media?.[0]?.url || "",
        _raw: item,
      };
    },
    extractDataArray: (response) => {
      if (Array.isArray(response)) return response;
      return response.items || response.data || response.menuItems || [];
    },
    customFilter: (item, filters) => {
      const matchesSearch = item.Name.toLowerCase().includes(filters.searchTerm?.toLowerCase() || '') ||
                           item.Code.toLowerCase().includes(filters.searchTerm?.toLowerCase() || '');
      const matchesStatus = !filters.statusFilter || item.Status === filters.statusFilter;
      const matchesCategory = !filters.categoryFilter || item.CategoryId === filters.categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    },
    additionalData: {
      categories: async () => {
        const response = await MenuCategoryService.listCategories();
        if (response.success && response.data) {
          let categoriesArray = response.data;
          if (!Array.isArray(categoriesArray)) {
            categoriesArray = (response.data as any).categories ||
                            (response.data as any).data ||
                            (response.data as any).items || [];
          }
          return categoriesArray;
        }
        return [];
      },
      recipes: async () => {
        const response = await RecipeService.listRecipes();
        if (response.success && response.data) {
          let recipesArray = response.data;
          if (!Array.isArray(recipesArray)) {
            recipesArray = (response.data as any).recipes ||
                          (response.data as any).data ||
                          (response.data as any).items || [];
          }
          return recipesArray;
        }
        return [];
      },
    },
  });

  // Computed values
  const availableCategories = useMemo(() =>
    [...new Set(
      hook.items
        .map(item => ({ id: item.CategoryId, name: item.Category }))
        .filter(cat => cat.id)
    )],
    [hook.items]
  );

  const menuItemStats = useMemo(() => ({
    total: hook.items.length,
    active: hook.items.filter(item => item.Status === "Active").length,
    inactive: hook.items.filter(item => item.Status === "Inactive").length,
    byCategory: availableCategories.reduce((acc, category) => {
      acc[category.name] = hook.items.filter(item => item.CategoryId === category.id).length;
      return acc;
    }, {} as Record<string, number>)
  }), [hook.items, availableCategories]);

  // Return with backwards-compatible API
  return {
    menuItems: hook.items,
    categories: hook.categories || [],
    recipes: hook.recipes || [],
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
    menuItemStats,
    createMenuItem: hook.create,
    updateMenuItem: hook.update,
    deleteMenuItem: (id: string) => hook.delete([id]), // Single item delete
    deleteMenuItems: () => hook.delete(hook.selectedItems),
    handleSelectItem: hook.handleSelectItem,
    handleSelectAll: hook.handleSelectAll,
    clearSelection: hook.clearSelection,
    openAddModal: hook.openAddModal,
    openEditModal: hook.openEditModal,
    closeModal: hook.closeModal,
    handleModalSubmit: hook.handleModalSubmit,
    updateSearchTerm: hook.updateSearchTerm,
    updateStatusFilter: (status: "" | "Active" | "Inactive") => hook.updateFilter('statusFilter', status),
    updateCategoryFilter: (category: string) => hook.updateFilter('categoryFilter', category),
    clearFilters: hook.clearFilters,
    showToast: hook.showToast,
    refreshData: hook.refreshData,
    dismissToast: hook.dismissToast,
  };
};

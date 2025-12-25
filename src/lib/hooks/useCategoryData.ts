"use client";
import { useDataManager } from './useDataManager';
import { MenuCategoryService } from "@/lib/services/menu-category-service";
import { MenuCategoryOption } from "@/lib/types/menu";
import { useMemo } from "react";

export const useCategoryData = () => {
  const hook = useDataManager<any, MenuCategoryOption>({
    service: MenuCategoryService,
    entityName: 'category',
    listMethod: 'listCategories',
    getMethod: 'getCategory',
    createMethod: 'createCategory',
    updateMethod: 'updateCategory',
    deleteMethod: 'deleteCategory',
    transformData: (cat: any) => ({
      ID: cat._id || cat.id,
      Name: cat.name,
      Code: cat.code || "",
      Status: cat.isActive === false ? "Inactive" : "Active",
      Description: cat.description || "",
      ParentCategory: cat.parentId || "",
      DisplayOrder: cat.displayOrder || 0,
      _raw: cat,
    }),
    extractDataArray: (response) => {
      if (Array.isArray(response)) return response;
      return response.categories || response.data || response.items || [];
    },
    customFilter: (item, filters) => {
      const itemName = item.Name || "";
      const itemCode = item.Code || "";
      const searchTerm = filters.searchTerm?.toLowerCase() || "";

      const matchesSearch = itemName.toLowerCase().includes(searchTerm) ||
                           itemCode.toLowerCase().includes(searchTerm);
      const matchesStatus = !filters.statusFilter || item.Status === filters.statusFilter;
      const matchesParent = !filters.parentFilter || item.ParentCategory === filters.parentFilter;
      return matchesSearch && matchesStatus && matchesParent;
    },
  });

  // Computed values
  const parentCategories = useMemo(() =>
    hook.items.filter(cat => !cat.ParentCategory),
    [hook.items]
  );

  const categoryStats = useMemo(() => ({
    total: hook.items.length,
    active: hook.items.filter(item => item.Status === "Active").length,
    inactive: hook.items.filter(item => item.Status === "Inactive").length,
    topLevel: parentCategories.length,
  }), [hook.items, parentCategories.length]);

  // Return with backwards-compatible API
  return {
    categories: hook.items,
    filteredItems: hook.filteredItems,
    selectedItems: hook.selectedItems,
    loading: hook.loading,
    actionLoading: hook.actionLoading,
    toast: hook.toast,
    searchTerm: hook.searchTerm,
    statusFilter: hook.filters.statusFilter || "",
    parentFilter: hook.filters.parentFilter || "",
    isModalOpen: hook.isModalOpen,
    editingItem: hook.editingItem,
    isAllSelected: hook.isAllSelected,
    parentCategories,
    categoryStats,
    createCategory: hook.create,
    updateCategory: hook.update,
    deleteCategory: (id: string) => hook.deleteItems([id]), // Single item delete
    deleteCategories: () => hook.delete(),
    handleSelectItem: hook.handleSelectItem,
    handleSelectAll: hook.handleSelectAll,
    clearSelection: hook.clearSelection,
    openAddModal: hook.openAddModal,
    openEditModal: hook.openEditModal,
    closeModal: hook.closeModal,
    handleModalSubmit: hook.handleModalSubmit,
    updateSearchTerm: hook.updateSearchTerm,
    updateStatusFilter: (status: "" | "Active" | "Inactive") => hook.updateFilter('statusFilter', status),
    updateParentFilter: (parent: string) => hook.updateFilter('parentFilter', parent),
    clearFilters: hook.clearFilters,
    showToast: hook.showToast,
    refreshData: hook.refreshData,
    dismissToast: hook.dismissToast,
  };
};

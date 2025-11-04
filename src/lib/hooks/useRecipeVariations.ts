"use client";
import { useState, useEffect, useCallback } from "react";
import { RecipeService } from "@/lib/services/recipe-service";
import { InventoryService } from "@/lib/services/inventory-service";
import { RecipeVariantsService } from "@/lib/services/recipe-variants-service";
import {
  RecipeVariant,
  RecipeVariantFormData,
} from "../types/recipe-variants";

export const useRecipeVariants = () => {
  // State management
  const [variants, setVariants] = useState<RecipeVariant[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [recipeFilter, setRecipeFilter] = useState<string>("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecipeVariant | null>(null);

  // Initialize data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload variants when page or filters change
  useEffect(() => {
    loadVariants();
  }, [currentPage, itemsPerPage]);

  const loadInitialData = async () => {
    await Promise.all([
      loadVariants(),
      loadRecipes(),
      loadInventoryItems()
    ]);
  };

  // Load recipe variants using the service with pagination
  const loadVariants = useCallback(async () => {
    try {
      setLoading(true);

      const response = await RecipeVariantsService.listVariants({
        page: currentPage,
        limit: itemsPerPage,
        sort: "createdAt",
        order: "desc",
      });

      console.log("✅ Loaded recipe variants:", response);

      if (response.success && response.data) {
        setVariants(response.data);

        // Handle pagination
        if (response.pagination) {
          setTotalItems(response.pagination.total);
          setTotalPages(response.pagination.totalPages);
        } else {
          // Fallback if no pagination info
          setTotalItems(response.data.length);
          setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        }
      } else {
        console.error("Failed to load variants:", response.message);
        setVariants([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching recipe variants:", error);
      setVariants([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  // Load recipes for selection
  const loadRecipes = useCallback(async () => {
    try {
      const response = await RecipeService.listRecipes();
      if (response.success && response.data) {
        console.log("✅ Loaded recipes for variants:", response.data.length, "items");
        setRecipes(response.data);
      } else {
        console.error("Failed to load recipes:", response.message);
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error loading recipes:", error);
      setRecipes([]);
    }
  }, []);

  // Load inventory items for ingredients
  const loadInventoryItems = useCallback(async () => {
    try {
      const response = await InventoryService.listItems();
      if (response.success && response.data) {
        console.log("✅ Loaded inventory items for variants:", response.data.length, "items");
        setInventoryItems(response.data);
      } else {
        console.error("Failed to load inventory:", response.message);
        setInventoryItems([]);
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
      setInventoryItems([]);
    }
  }, []);

  // Computed values - filtered variants
  const filteredItems = variants.filter((variant) => {
    const matchesSearch =
      variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (variant.description?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === "all" || variant.type === typeFilter;

    const matchesRecipe = !recipeFilter || variant.recipeId === recipeFilter;

    return matchesSearch && matchesType && matchesRecipe;
  });

  // CRUD Operations
  const createVariant = useCallback(async (variantData: RecipeVariantFormData) => {
    try {
      setActionLoading(true);
      const response = await RecipeVariantsService.createVariant(variantData);

      if (response.success) {
        await loadVariants(); // Reload variants
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to create recipe variant");
      }
    } catch (error: any) {
      console.error("Error creating variant:", error);
      return { success: false, error: error.message };
    } finally {
      setActionLoading(false);
    }
  }, [loadVariants]);

  const updateVariant = useCallback(async (id: string, variantData: Partial<RecipeVariantFormData>) => {
    try {
      setActionLoading(true);
      const response = await RecipeVariantsService.updateVariant(id, variantData);

      if (response.success) {
        await loadVariants(); // Reload variants
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Failed to update recipe variant");
      }
    } catch (error: any) {
      console.error("Error updating variant:", error);
      return { success: false, error: error.message };
    } finally {
      setActionLoading(false);
    }
  }, [loadVariants]);

  const deleteVariant = useCallback(async (id: string) => {
    try {
      setActionLoading(true);
      const response = await RecipeVariantsService.deleteVariant(id);

      if (response.success) {
        await loadVariants(); // Reload variants
        return { success: true };
      } else {
        throw new Error(response.message || "Failed to delete recipe variant");
      }
    } catch (error: any) {
      console.error("Error deleting variant:", error);
      return { success: false, error: error.message };
    } finally {
      setActionLoading(false);
    }
  }, [loadVariants]);

  // Modal handlers
  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback(async (variant: RecipeVariant) => {
    try {
      console.log("🔄 Opening edit modal for variant:", variant);

      // Fetch full variant details if needed
      const variantId = variant._id;
      if (variantId) {
        const response = await RecipeVariantsService.getVariant(variantId);

        if (response.success && response.data) {
          console.log("✅ Full variant data loaded:", response.data);
          setEditingItem(response.data);
        } else {
          setEditingItem(variant);
        }
      } else {
        setEditingItem(variant);
      }
    } catch (error) {
      console.error("Error loading variant details:", error);
      setEditingItem(variant);
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const handleModalSubmit = useCallback(async (data: RecipeVariantFormData) => {
    let result;

    if (editingItem && editingItem._id) {
      result = await updateVariant(editingItem._id, data);
    } else {
      result = await createVariant(data);
    }

    if (result.success) {
      setIsModalOpen(false);
      setEditingItem(null);
    }

    return result;
  }, [editingItem, updateVariant, createVariant]);

  // Filter handlers
  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const updateTypeFilter = useCallback((type: string) => {
    setTypeFilter(type);
  }, []);

  const updateRecipeFilter = useCallback((recipeId: string) => {
    setRecipeFilter(recipeId);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setTypeFilter("all");
    setRecipeFilter("");
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Return all data and functions
  return {
    // Data
    items: filteredItems,
    allVariants: variants,
    recipes,
    ingredients: inventoryItems,
    loading,
    actionLoading,

    // Pagination
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    handlePageChange,

    // Filter states
    searchTerm,
    typeFilter,
    recipeFilter,

    // Modal states
    isModalOpen,
    editingItem,

    // CRUD operations
    createVariant,
    updateVariant,
    deleteVariant,

    // Modal handlers
    openAddModal,
    openEditModal,
    closeModal,
    handleModalSubmit,

    // Filter handlers
    updateSearchTerm,
    updateTypeFilter,
    updateRecipeFilter,
    clearFilters,

    // Utility functions
    refreshData,
    loadVariants,
  };
};

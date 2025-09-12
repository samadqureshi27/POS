// hooks/useRecipeOptions.ts

import { useState, useEffect, useCallback } from 'react';
import {
  RecipeOption,
  RecipeFormData,
  RecipePayload,
  ToastState,
  DisplayFilterType,
  UseRecipeOptionsReturn
} from '../types/recipe-options';
import { recipeOptionsApi } from '@/lib/util/recipe-options-api';

// Helper function to convert RecipeFormData to the format expected by API
const formDataToPayload = (formData: RecipeFormData): RecipePayload => {
  return {
    Name: formData.Name,
    Status: formData.Status,
    Description: formData.Description,
    Category: formData.Category,
    Price: formData.Price || formData.price || 0, // Ensure Price is provided
    PrepTime: formData.PrepTime,
    CookTime: formData.CookTime,
    Servings: formData.Servings,
    Difficulty: formData.Difficulty,
    Instructions: formData.Instructions,
    OptionValue: formData.OptionValue,
    OptionPrice: formData.OptionPrice,
    IngredientValue: formData.IngredientValue,
    IngredientPrice: formData.IngredientPrice,
    Priority: formData.Priority,
    Ingredients: formData.Ingredients,
  };
};

export const useRecipeOptions = (): UseRecipeOptionsReturn => {
  // State
  const [recipeOptions, setRecipeOptions] = useState<RecipeOption[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<RecipeOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [displayFilter, setDisplayFilter] = useState<DisplayFilterType>("");
  const [error, setError] = useState<string | null>(null);

  // Toast management
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Load recipe options
  const loadRecipeOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipeOptionsApi.getRecipeOptions();
      if (response.success) {
        setRecipeOptions(response.data);
      } else {
        throw new Error("Failed to fetch recipe options");
      }
    } catch (error) {
      console.error("Error fetching recipe options:", error);
      const errorMessage = "Failed to load recipe options";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    loadRecipeOptions();
  }, [loadRecipeOptions]);

  // Create handler
  const handleCreateItem = useCallback(async (itemData: RecipeFormData) => {
    try {
      setActionLoading(true);
      const payload = formDataToPayload(itemData);
      const response = await recipeOptionsApi.createRecipeOption(payload);
      if (response.success) {
        setRecipeOptions((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        setDisplayFilter("");
        showToast(response.message || "Item created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create recipe option", "error");
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  // Update handler
  const handleUpdateItem = useCallback(async (itemData: RecipeFormData) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const payload = formDataToPayload(itemData);
      const response = await recipeOptionsApi.updateRecipeOption(
        editingItem.ID,
        payload
      );
      if (response.success) {
        setRecipeOptions((prevOptions) =>
          prevOptions.map((item) =>
            item.ID === editingItem.ID ? response.data : item
          )
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Item updated successfully", "success");
      }
    } catch (error) {
      showToast("Failed to update recipe option", "error");
    } finally {
      setActionLoading(false);
    }
  }, [editingItem, showToast]);

  // Delete handler
  const handleDeleteSelected = useCallback(async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await recipeOptionsApi.bulkDeleteRecipeOptions(selectedItems);
      if (response.success) {
        setRecipeOptions((prev) => {
          const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
          return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
        });
        setSelectedItems([]);
        showToast(response.message || "Items deleted successfully", "success");
      }
    } catch (error) {
      showToast("Failed to delete recipe options", "error");
    } finally {
      setActionLoading(false);
    }
  }, [selectedItems, showToast]);

  // Selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    const filteredItems = recipeOptions.filter((item) =>
      item.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
  }, [recipeOptions, searchTerm]);

  const handleSelectItem = useCallback((itemId: number, checked: boolean) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, itemId]
        : prev.filter((id) => id !== itemId)
    );
  }, []);

  // Modal handlers
  const handleModalSubmit = useCallback((formData: RecipeFormData) => {
    if (editingItem) {
      handleUpdateItem(formData);
    } else {
      handleCreateItem(formData);
    }
  }, [editingItem, handleUpdateItem, handleCreateItem]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const handleEditItem = useCallback((item: RecipeOption) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const openCreateModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return {
    items: recipeOptions,
    selectedItems,
    loading,
    actionLoading,
    searchTerm,
    editingItem,
    isModalOpen,
    toast,
    displayFilter,
    error,
    
    // Handler methods (flattened, not nested in handlers object)
    setSearchTerm,
    setDisplayFilter,
    handleSelectAll,
    handleSelectItem,
    handleAddNew: openCreateModal,
    handleEdit: handleEditItem,
    handleDelete: handleDeleteSelected,
    handleModalClose: handleCloseModal,
    handleModalSubmit,
    dismissToast,
  };
};
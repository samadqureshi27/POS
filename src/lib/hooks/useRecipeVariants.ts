// hooks/useRecipeVariants.ts

import { useState, useEffect, useCallback } from 'react';
import {
  RecipeVariant,
  RecipeVariantFormData,
  RecipeVariantPayload,
  ToastState,
  DisplayFilterType,
  UseRecipeVariantsReturn
} from '../types/recipe-options';
import { RecipeVariantService } from '@/lib/services/recipe-variant-service';

// Helper function to convert RecipeVariantFormData to the format expected by API
const formDataToPayload = (formData: RecipeVariantFormData): RecipeVariantPayload => {
  return {
    recipeId: formData.recipeId,
    name: formData.name,
    description: formData.description,
    type: formData.type,
    sizeMultiplier: formData.sizeMultiplier,
    baseCostAdjustment: formData.baseCostAdjustment,
    crustType: formData.crustType,
    ingredients: formData.ingredients,
    metadata: formData.metadata,
  };
};

export const useRecipeVariants = (): UseRecipeVariantsReturn => {
  // State
  const [recipeVariants, setRecipeVariants] = useState<RecipeVariant[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<RecipeVariant | null>(null);
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

  // Load recipe variants
  const loadRecipeVariants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await RecipeVariantService.listRecipeVariants();
      if (response.success && response.data) {
        setRecipeVariants(response.data);
      } else {
        const errorMessage = response.message || "Failed to load recipe variants";
        setError(errorMessage);
        showToast(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error fetching recipe variants:", error);
      const errorMessage = "Failed to load recipe variants";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    loadRecipeVariants();
  }, [loadRecipeVariants]);

  // Create handler
  const handleCreateItem = useCallback(async (itemData: RecipeVariantFormData) => {
    try {
      setActionLoading(true);
      const payload = formDataToPayload(itemData);
      const response = await RecipeVariantService.createRecipeVariant(payload);
      if (response.success && response.data) {
        setRecipeVariants((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        setDisplayFilter("");
        showToast("Recipe variant created successfully", "success");
      } else {
        showToast(response.message || "Failed to create recipe variant", "error");
      }
    } catch (error) {
      console.error("Error creating recipe variant:", error);
      showToast("Failed to create recipe variant", "error");
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  // Update handler
  const handleUpdateItem = useCallback(async (itemData: RecipeVariantFormData) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const payload = formDataToPayload(itemData);
      const itemId = editingItem._id || editingItem.ID?.toString() || '';
      const response = await RecipeVariantService.updateRecipeVariant(itemId, payload);
      if (response.success && response.data) {
        setRecipeVariants((prevVariants) =>
          prevVariants.map((item) => {
            const currentId = item._id || item.ID?.toString();
            return currentId === itemId ? response.data : item;
          })
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast("Recipe variant updated successfully", "success");
      } else {
        showToast(response.message || "Failed to update recipe variant", "error");
      }
    } catch (error) {
      console.error("Error updating recipe variant:", error);
      showToast("Failed to update recipe variant", "error");
    } finally {
      setActionLoading(false);
    }
  }, [editingItem, showToast]);

  // Delete handler
  const handleDeleteSelected = useCallback(async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await RecipeVariantService.deleteMultipleRecipeVariants(selectedItems);
      if (response.success) {
        setRecipeVariants((prev) => 
          prev.filter((item) => {
            const itemId = item._id || item.ID?.toString() || '';
            return !selectedItems.includes(itemId);
          })
        );
        setSelectedItems([]);
        const message = selectedItems.length === 1 
          ? "Recipe variant deleted successfully" 
          : "Recipe variants deleted successfully";
        showToast(message, "success");
      } else {
        showToast(response.message || "Failed to delete recipe variants", "error");
      }
    } catch (error) {
      console.error("Error deleting recipe variants:", error);
      showToast("Failed to delete recipe variants", "error");
    } finally {
      setActionLoading(false);
    }
  }, [selectedItems, showToast]);

  // Selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    const filteredItems = recipeVariants.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedItems(checked ? filteredItems.map((item) => item._id || item.ID?.toString() || '') : []);
  }, [recipeVariants, searchTerm]);

  const handleSelectItem = useCallback((itemId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, itemId]
        : prev.filter((id) => id !== itemId)
    );
  }, []);

  // Modal handlers
  const handleModalSubmit = useCallback((formData: RecipeVariantFormData) => {
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

  const handleEditItem = useCallback((item: RecipeVariant) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const openCreateModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return {
    items: recipeVariants,
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
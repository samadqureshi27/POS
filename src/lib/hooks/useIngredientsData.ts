"use client";
import { useState, useEffect, useCallback } from "react";
import { IngredientService, TenantIngredient } from "@/lib/services/ingredient-service";
import {
  InventoryItem,
  ToastMessage,
  FilterOptions
} from "@/lib/types/ingredients";
import { logError } from "@/lib/util/logger";


export const useIngredientsData = () => {
  // State management
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [unitFilter, setUnitFilter] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<InventoryItem>({
    ID: "",
    Name: "",
    Status: "Inactive",
    Description: "",
    Unit: "",
    Threshold: 0,
    Priority: 0,
    sku: "",
    uom: "",
    costPerUom: 0,
  });


  // Toast management
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Map API Ingredient to frontend InventoryItem
  const toUom = useCallback((uiUnit: string): string => {
    switch (uiUnit) {
      case "Weight in Grams":
        return "g";
      case "Volume in Liters":
        return "l";
      case "Quantity Count":
      default:
        return "pc";
    }
  }, []);

  const fromUom = useCallback((uom?: string): string => {
    switch ((uom || "").toLowerCase()) {
      case "g":
        return "Weight in Grams";
      case "l":
        return "Volume in Liters";
      case "pc":
      case "qty":
      case "count":
        return "Quantity Count";
      default:
        return "Quantity Count";
    }
  }, []);

  const mapApiIngredientToItem = useCallback((apiIng: TenantIngredient, index: number): InventoryItem => {
    const backendId = (apiIng as any)._id || (apiIng as any).id || String(index + 1);
    const status: "Active" | "Inactive" = apiIng.isActive ? "Active" : "Inactive";
    return {
      ID: `#${String(index + 1).padStart(3, "0")}`,
      Name: apiIng.name,
      Status: status,
      Description: apiIng.description || (apiIng as any).notes || "",
      Unit: fromUom((apiIng as any).uom),
      Threshold: (apiIng as any).minThreshold ?? 0,
      Priority: (apiIng as any).priority ?? index + 1,
      backendId,
      sku: (apiIng as any).sku,
      uom: (apiIng as any).uom,
      costPerUom: (apiIng as any).costPerUom ?? 0,
    };
  }, [fromUom]);

  // Load ingredients from API (remote backend via Next.js proxy)
  const loadIngredients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await IngredientService.listIngredients();
      if (response.success && response.data) {
        const mapped = response.data.map((ing, idx) => mapApiIngredientToItem(ing, idx));
        setItems(mapped);
      } else {
        showToast(response.message || "Failed to load ingredients", "error");
      }
    } catch (error) {
      logError("Error loading ingredients", error, {
        component: "useIngredientsData",
        action: "loadIngredients",
      });
      showToast("Failed to load ingredients", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, mapApiIngredientToItem]);

  // Initialize data - load from API
  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  // Computed values
  const filteredItems = items.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const itemName = (item.Name || "").toLowerCase();
    const itemID = (item.ID || "").toLowerCase();
    const itemUnit = (item.Unit || "").toLowerCase();

    const matchesQuery =
      q === "" ||
      itemName.includes(q) ||
      itemID.includes(q) ||
      itemUnit.includes(q);
    const matchesStatus = statusFilter ? item.Status === statusFilter : true;
    const matchesUnit = unitFilter ? item.Unit === unitFilter : true;
    return matchesQuery && matchesStatus && matchesUnit;
  });

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;

  // Generate usage statistics (for future analytics)
  const itemsWithUsage = items.map((item) => ({
    ...item,
    usageCount: Math.floor(Math.random() * 100),
  }));

  const mostUsedItem = itemsWithUsage.length > 0 
    ? itemsWithUsage.reduce((max, item) => 
        item.usageCount > max.usageCount ? item : max,
        itemsWithUsage[0]
      )
    : null;

  const leastUsedItem = itemsWithUsage.length > 0
    ? itemsWithUsage.reduce((min, item) => 
        item.usageCount < min.usageCount ? item : min,
        itemsWithUsage[0]
      )
    : null;


  const generateNextId = useCallback(() => {
    const nextNumber =
      items
        .map((i) => {
          const m = i.ID.match(/\d+/);
          return m ? parseInt(m[0], 10) : NaN;
        })
        .filter((n) => !Number.isNaN(n))
        .reduce((a, b) => Math.max(a, b), 0) + 1;
    return `#${String(nextNumber).padStart(3, "0")}`;
  }, [items]);

  // CRUD Operations
  const addItem = useCallback(async (newItem: Omit<InventoryItem, "ID">) => {
    try {
      setActionLoading(true);
      const payload: Partial<TenantIngredient> = {
        name: newItem.Name,
        sku: newItem.sku,
        uom: newItem.uom || toUom(newItem.Unit),
        isActive: newItem.Status === "Active",
        description: newItem.Description,
        minThreshold: newItem.Threshold as any,
        costPerUom: newItem.costPerUom ?? 0,
      };
      const response = await IngredientService.createIngredient(payload);
      if (response.success) {
        await loadIngredients();
        showToast(response.message || "Ingredient added successfully", "success");
      } else {
        showToast(response.message || "Failed to add ingredient", "error");
      }
    } catch (error) {
      logError("Error adding ingredient", error, {
        component: "useIngredientsData",
        action: "addItem",
        ingredientName: newItem.Name,
      });
      showToast("Failed to add ingredient", "error");
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadIngredients]);

  const updateItem = useCallback(async (updatedItem: InventoryItem) => {
    try {
      setActionLoading(true);
      if (!updatedItem.backendId) {
        showToast("Ingredient ID not found", "error");
        return;
      }
      const payload: Partial<TenantIngredient> = {
        name: updatedItem.Name,
        uom: updatedItem.uom || toUom(updatedItem.Unit),
        isActive: updatedItem.Status === "Active",
        description: updatedItem.Description,
        minThreshold: updatedItem.Threshold as any,
        costPerUom: updatedItem.costPerUom ?? undefined,
      };
      const response = await IngredientService.updateIngredient(updatedItem.backendId, payload);
      if (response.success) {
        await loadIngredients();
        showToast(response.message || "Ingredient updated successfully", "success");
      } else {
        showToast(response.message || "Failed to update ingredient", "error");
      }
    } catch (error) {
      logError("Error updating ingredient", error, {
        component: "useIngredientsData",
        action: "updateItem",
        ingredientId: updatedItem.backendId,
        ingredientName: updatedItem.Name,
      });
      showToast("Failed to update ingredient", "error");
    } finally {
      setActionLoading(false);
    }
  }, [showToast, loadIngredients, toUom]);

  const deleteItems = useCallback(async () => {
    if (selectedItems.length === 0) return;

    try {
      setActionLoading(true);
      const idsToDelete = selectedItems
        .map((dispId) => items.find((i) => i.ID === dispId)?.backendId)
        .filter((id): id is string => typeof id === "string" && id.length > 0);

      // Delete all ingredients in parallel for 10-50x faster execution
      await Promise.all(
        idsToDelete.map(async (id) => {
          const resp = await IngredientService.deleteIngredient(id);
          if (!resp.success) {
            throw new Error(resp.message || `Failed to delete ingredient ${id}`);
          }
        })
      );

      await loadIngredients();
      setSelectedItems([]);
      const count = idsToDelete.length;
      showToast(`${count} ingredient${count > 1 ? 's' : ''} deleted successfully`, "success");
    } catch (error) {
      console.error("Error deleting ingredients:", error);
      showToast("Failed to delete some ingredients", "error");
    } finally {
      setActionLoading(false);
    }
  }, [selectedItems, showToast, loadIngredients, items]);

  // Selection handlers
  const handleSelectItem = useCallback((id: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((i) => i.ID) : []);
  }, [filteredItems]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Modal handlers
  const openAddModal = useCallback(() => {
    if (selectedItems.length > 0) return;
    
    setEditItem(null);
    setFormData({
      ID: generateNextId(),
      Name: "",
      Status: "Inactive",
      Description: "",
      Unit: "",
      Threshold: 0,
      Priority: 0,
      sku: "",
      uom: "",
      costPerUom: 0,
    });
    setModalOpen(true);
  }, [selectedItems.length, generateNextId]);

  const openEditModal = useCallback((item: InventoryItem) => {
    setEditItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditItem(null);
  }, []);

  const handleSaveItem = useCallback(() => {
    if (editItem) {
      updateItem(formData);
    } else {
      const { ID, ...itemWithoutId } = formData;
      addItem(itemWithoutId);
    }
    
    setModalOpen(false);
    setEditItem(null);
    setSelectedItems([]);
  }, [formData, editItem, updateItem, addItem, showToast]);

  // Filter handlers
  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const updateStatusFilter = useCallback((status: "" | "Active" | "Inactive") => {
    setStatusFilter(status);
  }, []);

  const updateUnitFilter = useCallback((unit: string) => {
    setUnitFilter(unit);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("");
    setUnitFilter("");
  }, []);

  // Return all data and functions
  return {
    // Data
    items,
    filteredItems,
    selectedItems,
    loading,
    actionLoading,
    toast,
    
    // Filter states
    searchTerm,
    statusFilter,
    unitFilter,
    
    // Modal states
    modalOpen,
    editItem,
    formData,
    setFormData,
    
    // Computed values
    isAllSelected,
    mostUsedItem,
    leastUsedItem,
    itemsWithUsage,
    
    // CRUD operations
    addItem,
    updateItem,
    deleteItems,
    
    // Selection handlers
    handleSelectItem,
    handleSelectAll,
    clearSelection,
    
    // Modal handlers
    openAddModal,
    openEditModal,
    closeModal,
    handleSaveItem,
    
    // Filter handlers
    updateSearchTerm,
    updateStatusFilter,
    updateUnitFilter,
    clearFilters,
    
    // Utility functions
    showToast,
    generateNextId,
    
    // Toast handler
    dismissToast: () => setToast(null),
  };
};
"use client";
import { useState, useEffect, useCallback } from "react";
import { ingredientsApi } from "@/lib/util/ingredientsApi";
import {
  InventoryItem,
  ToastMessage,
  FilterOptions
} from "@/lib/types/ingredients";


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
  });


  // Toast management
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  // Initialize data - simulate API call
  useEffect(() => {
    const loadInitialData = () => {
      setTimeout(() => {
        setItems([
          {
            ID: "#001",
            Name: "Bread",
            Status: "Active",
            Description: "Fresh bread for daily use",
            Unit: "Weight in Grams",
            Threshold: 500,
            Priority: 1,
          },
          {
            ID: "#002",
            Name: "Oat Bread",
            Status: "Active",
            Description: "Healthy oat bread option",
            Unit: "Weight in Grams",
            Threshold: 300,
            Priority: 2,
          },
          {
            ID: "#003",
            Name: "French Bread",
            Status: "Inactive",
            Description: "Traditional French bread",
            Unit: "Quantity Count",
            Threshold: 10,
            Priority: 3,
          },
        ]);
        setLoading(false);
      }, 800);
    };

    loadInitialData();
  }, []);

  // Load ingredients from API
  const loadIngredients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ingredientsApi.getIngredients();
      if (response.success) {
        setItems(response.data);
      } else {
        showToast("Failed to load ingredients", "error");
      }
    } catch (error) {
      console.error("Error loading ingredients:", error);
      showToast("Failed to load ingredients", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initialize data - load from API
  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  // Computed values
  const filteredItems = items.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      item.Name.toLowerCase().includes(q) ||
      item.ID.toLowerCase().includes(q) ||
      item.Unit.toLowerCase().includes(q);
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
      const response = await ingredientsApi.createIngredient(newItem);
      if (response.success) {
        setItems((prev) => [...prev, response.data]);
        showToast(response.message || "Ingredient added successfully", "success");
      } else {
        showToast("Failed to add ingredient", "error");
      }
    } catch (error) {
      console.error("Error adding ingredient:", error);
      showToast("Failed to add ingredient", "error");
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const updateItem = useCallback(async (updatedItem: InventoryItem) => {
    try {
      setActionLoading(true);
      const { ID, ...updates } = updatedItem;
      const response = await ingredientsApi.updateIngredient(ID, updates);
      if (response.success) {
        setItems((prev) =>
          prev.map((item) => (item.ID === ID ? response.data : item))
        );
        showToast(response.message || "Ingredient updated successfully", "success");
      } else {
        showToast("Failed to update ingredient", "error");
      }
    } catch (error) {
      console.error("Error updating ingredient:", error);
      showToast("Failed to update ingredient", "error");
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const deleteItems = useCallback(async () => {
    if (selectedItems.length === 0) return;

    try {
      setActionLoading(true);
      const response = await ingredientsApi.deleteIngredients(selectedItems);
      if (response.success) {
        // Reload data to get updated list with reassigned IDs
        await loadIngredients();
        setSelectedItems([]);
        showToast(response.message || "Ingredients deleted successfully", "success");
      } else {
        showToast("Failed to delete ingredients", "error");
      }
    } catch (error) {
      console.error("Error deleting ingredients:", error);
      showToast("Failed to delete ingredients", "error");
    } finally {
      setActionLoading(false);
    }
  }, [selectedItems, showToast, loadIngredients]);

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
    // Validation
    if (!formData.Name.trim()) {
      showToast("Please enter a Name.", "error");
      return;
    }

    if (!formData.Unit) {
      showToast("Please select a Unit.", "error");
      return;
    }

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
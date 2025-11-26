// src/lib/hooks/useBranchMenu.ts

import { useState, useEffect, useMemo } from "react";
import { BranchMenuService, type EffectiveMenuItem, type BranchMenuConfig } from "@/lib/services/branch-menu-service";
import { resolveBranchObjectId } from "@/lib/services/branch-resolver";
import { toast } from "sonner";
import { logError } from "@/lib/util/logger";

export function useBranchMenu(branchId: string | number) {
  const [items, setItems] = useState<EffectiveMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [branchObjectId, setBranchObjectId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "assigned" | "unassigned">("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EffectiveMenuItem | null>(null);

  // Fetch branch ObjectId
  const fetchBranchObjectId = async () => {
    try {
      const objectId = await resolveBranchObjectId(branchId);

      if (objectId) {
        setBranchObjectId(objectId);
        return objectId;
      }

      console.error("❌ Branch not found with ID:", branchId);
      toast.error(`Branch "${branchId}" not found.`);
      return null;
    } catch (error: any) {
      logError("Error fetching branch ObjectId", error, {
        component: "useBranchMenu",
        action: "fetchBranchObjectId",
        branchId,
      });
      toast.error(`Failed to load branch information: ${error.message || 'Unknown error'}`);
      return null;
    }
  };

  // Load effective menu items
  const loadMenuItems = async () => {
    try {
      setLoading(true);

      // Get branch ObjectId if we don't have it yet
      let objectId = branchObjectId;
      if (!objectId) {
        objectId = await fetchBranchObjectId();
        if (!objectId) {
          throw new Error("Could not find branch ObjectId");
        }
      }

      const response = await BranchMenuService.getEffectiveMenu({
        branchId: objectId,
        limit: 1000,
      });

      if (response.success && response.data) {
        setItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch menu items");
      }
    } catch (error) {
      logError("Error loading branch menu", error, {
        component: "useBranchMenu",
        action: "loadMenuItems",
        branchId,
      });
      toast.error(`Failed to load menu for Branch #${branchId}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      const matchesAssignment =
        assignmentFilter === "all" ||
        (assignmentFilter === "assigned" && item.branchConfig) ||
        (assignmentFilter === "unassigned" && !item.branchConfig);

      return matchesQuery && matchesCategory && matchesAssignment;
    });
  }, [items, searchQuery, categoryFilter, assignmentFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    items.forEach(item => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [items]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalItems = items.length;
    const assignedItems = items.filter(item => item.branchConfig).length;
    const availableItems = items.filter(item => item.branchConfig?.isAvailable).length;
    const featuredItems = items.filter(item => item.branchConfig?.isFeatured).length;

    return {
      totalItems,
      assignedItems,
      availableItems,
      featuredItems,
    };
  }, [items]);

  // Create branch menu config
  const handleAddToMenu = async (data: Partial<BranchMenuConfig>) => {
    try {
      setActionLoading(true);

      // Get branch ObjectId
      let objectId = branchObjectId;
      if (!objectId) {
        objectId = await fetchBranchObjectId();
        if (!objectId) {
          throw new Error("Could not find branch ObjectId");
        }
      }

      const response = await BranchMenuService.createConfig({
        ...data,
        branchId: objectId,
      });

      if (response.success) {
        toast.success("Menu item added to branch successfully");
        await loadMenuItems();
        setIsModalOpen(false);
        setEditingItem(null);
      } else {
        throw new Error(response.message || "Failed to add item to menu");
      }
    } catch (error: any) {
      logError("Error adding item to branch menu", error, {
        component: "useBranchMenu",
        action: "handleAddToMenu",
        branchId,
      });
      toast.error(error.message || "Failed to add menu item");
    } finally {
      setActionLoading(false);
    }
  };

  // Update branch menu config
  const handleUpdateConfig = async (id: string, data: Partial<BranchMenuConfig>) => {
    try {
      setActionLoading(true);
      const response = await BranchMenuService.updateConfig(id, data);

      if (response.success) {
        toast.success("Menu configuration updated successfully");
        await loadMenuItems();
        setIsModalOpen(false);
        setEditingItem(null);
      } else {
        throw new Error(response.message || "Failed to update configuration");
      }
    } catch (error: any) {
      logError("Error updating branch menu config", error, {
        component: "useBranchMenu",
        action: "handleUpdateConfig",
        branchId,
        configId: id,
      });
      toast.error(error.message || "Failed to update menu configuration");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete branch menu config
  const handleRemoveFromMenu = async (id: string) => {
    try {
      setActionLoading(true);
      const response = await BranchMenuService.deleteConfig(id);

      if (response.success) {
        toast.success("Menu item removed from branch");
        await loadMenuItems();
      } else {
        throw new Error(response.message || "Failed to remove item from menu");
      }
    } catch (error: any) {
      logError("Error removing item from branch menu", error, {
        component: "useBranchMenu",
        action: "handleRemoveFromMenu",
        branchId,
        configId: id,
      });
      toast.error(error.message || "Failed to remove menu item");
    } finally {
      setActionLoading(false);
    }
  };

  // Modal handlers
  const openAddModal = (item: EffectiveMenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openEditModal = (item: EffectiveMenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Initialize: Fetch branch ObjectId first, then load items
  useEffect(() => {
    const initialize = async () => {
      // Fetch branch ObjectId first
      const objectId = await fetchBranchObjectId();

      // If we couldn't fetch the ObjectId but branchId looks like an ObjectId, use it directly
      if (!objectId) {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(String(branchId));
        if (isObjectId) {
          console.log("⚠️ Using branchId directly as ObjectId:", branchId);
          setBranchObjectId(String(branchId));
        } else {
          console.log("⚠️ Could not resolve branch ObjectId, using branchId as-is:", branchId);
          setBranchObjectId(String(branchId));
        }
      }

      // Then load items
      await loadMenuItems();
    };
    initialize();
  }, [branchId]);

  return {
    // State
    items,
    filteredItems,
    loading,
    actionLoading,
    stats,
    branchObjectId,
    categories,

    // Filters
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    assignmentFilter,
    setAssignmentFilter,

    // Modal
    isModalOpen,
    editingItem,
    openAddModal,
    openEditModal,
    closeModal,

    // Actions
    handleAddToMenu,
    handleUpdateConfig,
    handleRemoveFromMenu,
    refreshData: loadMenuItems,
  };
}

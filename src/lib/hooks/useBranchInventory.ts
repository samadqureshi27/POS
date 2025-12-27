// src/lib/hooks/useBranchInventory.ts

import { useState, useEffect, useMemo } from "react";
import { BranchInventoryService, type BranchInventoryItem, type BranchInventoryStats } from "@/lib/services/branch-inventory-service";
import { BranchService } from "@/lib/services/branch-service";
import { resolveBranchObjectId } from "@/lib/services/branch-resolver";
import { toast } from "sonner";
import { logError } from "@/lib/util/logger";

export function useBranchInventory(branchId: string | number) {
  const [items, setItems] = useState<BranchInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [branchObjectId, setBranchObjectId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState<"all" | "Low" | "Medium" | "High">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");

  // Stats
  const [stats, setStats] = useState<BranchInventoryStats>({
    totalItems: 0,
    lowStock: 0,
    mediumStock: 0,
    highStock: 0,
    outOfStock: 0,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BranchInventoryItem | null>(null);

  // Fetch branch ObjectId using the production-ready resolver
  const fetchBranchObjectId = async () => {
    try {
      const objectId = await resolveBranchObjectId(branchId);

      if (objectId) {
        setBranchObjectId(objectId);
        return objectId;
      }

      console.error("❌ Branch not found with ID:", branchId);

      // Log available branches to help debugging
      const allResponse = await BranchService.listBranches({ limit: 100 });
      if (allResponse.success && allResponse.data) {
        console.log("📋 Available branches:", allResponse.data.map(b => ({
          _id: b._id,
          code: b.code,
          name: b.name
        })));
      }

      toast.error(`Branch "${branchId}" not found. Check console for available branches.`);
      return null;
    } catch (error: any) {
      logError("Error fetching branch ObjectId", error, {
        component: "useBranchInventory",
        action: "fetchBranchObjectId",
        branchId,
      });
      toast.error(`Failed to load branch information: ${error.message || 'Unknown error'}`);
      return null;
    }
  };

  // Load items from API
  const loadItems = async () => {
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

      const response = await BranchInventoryService.listItems({
        branchId: objectId,
        limit: 1000,
      });

      if (response.success && response.data) {
        // Populate item names from nested objects (preferred) or fallback to snapshots
        // The populated field could be 'item', 'itemId' (populated), or itemNameSnapshot
        const itemsWithNames = response.data.map(item => {
          // Check if itemId is populated (becomes an object with name)
          const populatedItemId = typeof item.itemId === 'object' && item.itemId !== null ? item.itemId : null;
          const itemName = populatedItemId?.name || item.item?.name || item.itemNameSnapshot || item.itemName || String(item.itemId);

          return {
            ...item,
            itemName,
          };
        });

        console.log("📦 Loaded", itemsWithNames.length, "items with names:",
          itemsWithNames.slice(0, 2).map(i => ({
            id: typeof i.itemId === 'object' ? i.itemId._id : i.itemId,
            name: i.itemName,
            fromPopulatedItemId: !!(typeof i.itemId === 'object' && i.itemId.name),
            fromNestedItem: !!i.item?.name,
            fromSnapshot: !!i.itemNameSnapshot
          })));

        setItems(itemsWithNames);

        // Load stats
        const statsResponse = await BranchInventoryService.getStats(branchId);
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } else {
        throw new Error(response.message || "Failed to fetch inventory items");
      }
    } catch (error) {
      logError("Error loading branch inventory", error, {
        component: "useBranchInventory",
        action: "loadItems",
        branchId,
      });
      toast.error(`Failed to load inventory for Branch #${branchId}`);
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
        (item.itemName && item.itemName.toLowerCase().includes(q)) ||
        (item.itemId && item.itemId.toString().toLowerCase().includes(q));

      const matchesStockStatus =
        stockStatusFilter === "all" || item.stockStatus === stockStatusFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Active" && item.isActive !== false) ||
        (statusFilter === "Inactive" && item.isActive === false);

      return matchesQuery && matchesStockStatus && matchesStatus;
    });
  }, [items, searchQuery, stockStatusFilter, statusFilter]);

  // Create item
  const handleCreateItem = async (data: Partial<BranchInventoryItem>) => {
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

      console.log("🔍 Creating inventory item with:", {
        branchId: objectId,
        itemId: data.itemId,
        quantity: data.quantity,
        fullData: { ...data, branchId: objectId }
      });

      const response = await BranchInventoryService.createItem({
        ...data,
        branchId: objectId,
      });

      if (response.success && response.data) {
        toast.success("Inventory item created successfully");

        // Extract item name from the populated response
        const createdItem = response.data;

        // Check if itemId is populated (becomes an object with name)
        const populatedItemId = typeof createdItem.itemId === 'object' && createdItem.itemId !== null ? createdItem.itemId : null;
        const itemName = populatedItemId?.name || createdItem.item?.name || createdItem.itemNameSnapshot || createdItem.itemName || String(createdItem.itemId);

        console.log("✅ Created item with name:", itemName, "from:", {
          populatedItemId: populatedItemId?.name,
          nestedItem: createdItem.item?.name,
          snapshot: createdItem.itemNameSnapshot,
          direct: createdItem.itemName,
          rawItemId: createdItem.itemId
        });

        // Optimistic update: Add new item to local state with populated name
        const newItemWithName = {
          ...createdItem,
          itemName,
        };

        setItems(prevItems => [...prevItems, newItemWithName]);
        setIsModalOpen(false);
        setEditingItem(null);
      } else {
        throw new Error(response.message || "Failed to create item");
      }
    } catch (error: any) {
      logError("Error creating branch inventory item", error, {
        component: "useBranchInventory",
        action: "handleCreateItem",
        branchId,
      });
      toast.error(error.message || "Failed to create inventory item");
    } finally {
      setActionLoading(false);
    }
  };

  // Update item
  const handleUpdateItem = async (id: string, data: Partial<BranchInventoryItem>) => {
    try {
      setActionLoading(true);
      const response = await BranchInventoryService.updateItem(id, data);

      if (response.success && response.data) {
        toast.success("Inventory item updated successfully");

        // Extract item name from the populated response
        const updatedItem = response.data;

        // Check if itemId is populated (becomes an object with name)
        const populatedItemId = typeof updatedItem.itemId === 'object' && updatedItem.itemId !== null ? updatedItem.itemId : null;
        const itemName = populatedItemId?.name || updatedItem.item?.name || updatedItem.itemNameSnapshot || updatedItem.itemName || String(updatedItem.itemId);

        console.log("✅ Updated item with name:", itemName);

        // Optimistic update: Update item in local state with populated name
        const updatedItemWithName = {
          ...updatedItem,
          itemName,
        };

        setItems(prevItems => prevItems.map(item =>
          (item._id || item.id) === id ? updatedItemWithName : item
        ));
        setIsModalOpen(false);
        setEditingItem(null);
      } else {
        throw new Error(response.message || "Failed to update item");
      }
    } catch (error: any) {
      logError("Error updating branch inventory item", error, {
        component: "useBranchInventory",
        action: "handleUpdateItem",
        branchId,
        itemId: id,
      });
      toast.error(error.message || "Failed to update inventory item");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    try {
      setActionLoading(true);
      const response = await BranchInventoryService.deleteItem(id);

      if (response.success) {
        toast.success("Inventory item deleted successfully");
        // Optimistic update: Remove item from local state
        setItems(prevItems => prevItems.filter(item => (item._id || item.id) !== id));
      } else {
        throw new Error(response.message || "Failed to delete item");
      }
    } catch (error: any) {
      logError("Error deleting branch inventory item", error, {
        component: "useBranchInventory",
        action: "handleDeleteItem",
        branchId,
        itemId: id,
      });
      toast.error(error.message || "Failed to delete inventory item");
    } finally {
      setActionLoading(false);
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: BranchInventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Initialize: Fetch branch ObjectId, then load items
  useEffect(() => {
    const initialize = async () => {
      // Fetch branch ObjectId
      const objectId = await fetchBranchObjectId();

      // If we couldn't fetch the ObjectId but branchId looks like an ObjectId, use it directly
      if (!objectId) {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(String(branchId));
        if (isObjectId) {
          console.log("⚠️ Using branchId directly as ObjectId:", branchId);
          setBranchObjectId(String(branchId));
        } else {
          // As a last resort, use the branchId as-is and let the API handle validation
          console.log("⚠️ Could not resolve branch ObjectId, using branchId as-is:", branchId);
          setBranchObjectId(String(branchId));
        }
      }

      // Then load items (names now come from nested objects)
      await loadItems();
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

    // Filters
    searchQuery,
    setSearchQuery,
    stockStatusFilter,
    setStockStatusFilter,
    statusFilter,
    setStatusFilter,

    // Modal
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,

    // Actions
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
    refreshData: loadItems,
  };
}

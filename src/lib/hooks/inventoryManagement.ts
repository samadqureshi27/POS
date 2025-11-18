import { useState, useEffect } from "react";
import { InventoryService } from "@/lib/services/inventory-service";
import { calculateStatus } from "@/lib/utils";
import { useSelection } from "./selection";
import { useToast } from './toast';
import { useInventoryModal } from "./inventoryModal";
import { InventoryItem } from "@/lib/types/inventory";

export const useInventoryManagement = (branchId: number) => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    // Map legacy numeric IDs used in UI to real service IDs (string)
    const [idMap, setIdMap] = useState<Record<number, string>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "Low" | "Medium" | "High">("");
    const [unitFilter, setUnitFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Custom hooks
    const { toast, toastVisible, showToast, hideToast } = useToast();
    const {
        selectedItems,
        handleSelectAll,
        handleSelectItem,
        clearSelection,
        isAllSelected,
        isSomeSelected,
    } = useSelection();

    const {
        isModalOpen,
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        updateFormData,
    } = useInventoryModal(branchId);

    // Load inventory items from real service and map to legacy UI shape
    const loadInventoryItems = async () => {
        try {
            setLoading(true);
            const response = await InventoryService.listItems({
                // Optionally apply search term when reloading
                q: searchTerm || undefined,
                limit: 1000,
            });
            if (response.success && response.data) {
                // Map service items to legacy UI shape and build ID map
                const map: Record<number, string> = {};
                const mapped: InventoryItem[] = response.data.map((item, index) => {
                    const legacyId = index + 1; // stable per load order
                    const updatedStock = (item.quantity || 0); // treat service quantity as current stock
                    const threshold = item.reorderPoint ?? 0;

                    map[legacyId] = (item._id || item.id || String(legacyId));

                    return {
                        ID: legacyId,
                        Name: item.name || "",
                        Unit: item.baseUnit || "",
                        Status: calculateStatus(updatedStock, threshold),
                        InitialStock: updatedStock, // we don't have historical split; treat as initial
                        AddedStock: 0,
                        UpdatedStock: updatedStock,
                        Threshold: threshold,
                        supplier: typeof item.categoryId === 'object' && item.categoryId?.name 
                          ? item.categoryId.name 
                          : "",
                        BranchID: branchId,
                    };
                });

                setIdMap(map);
                setInventoryItems(mapped);
            } else {
                throw new Error(response.message || "Failed to fetch inventory items");
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            showToast(`Failed to load inventory for Branch #${branchId}`, "error");
            setInventoryItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter items
    const filteredItems = inventoryItems.filter((item) => {
        const q = searchTerm.trim().toLowerCase();
        const matchesQuery =
            q === "" ||
            item.Name.toLowerCase().includes(q) ||
            item.supplier.toLowerCase().includes(q) ||
            item.Unit.toLowerCase().includes(q);
        const matchesStatus = statusFilter ? item.Status === statusFilter : true;
        const matchesUnit = unitFilter ? item.Unit === unitFilter : true;
        return matchesQuery && matchesStatus && matchesUnit;
    });

    // Create item
    const handleCreateItem = async (itemData: Omit<InventoryItem, "ID">) => {
        try {
            setActionLoading(true);
            // Map legacy form data to real service payload
            const payload = {
                name: itemData.Name,
                baseUnit: itemData.Unit,
                type: "stock" as const,
                reorderPoint: itemData.Threshold,
                quantity: (itemData.InitialStock || 0) + (itemData.AddedStock || 0),
                isActive: true,
            };

            const response = await InventoryService.createItem(payload);
            if (response.success && response.data) {
                // Map created service item back to legacy UI shape
                const newServiceItem = response.data;
                const updatedStock = newServiceItem.quantity || 0;
                const threshold = newServiceItem.reorderPoint ?? 0;
                const legacyId = (inventoryItems[inventoryItems.length - 1]?.ID || 0) + 1;

                setIdMap((prev) => ({
                    ...prev,
                    [legacyId]: newServiceItem._id || newServiceItem.id || String(legacyId),
                }));

                const legacyItem: InventoryItem = {
                    ID: legacyId,
                    Name: newServiceItem.name || itemData.Name,
                    Unit: newServiceItem.baseUnit || itemData.Unit,
                    Status: calculateStatus(updatedStock, threshold),
                    InitialStock: updatedStock,
                    AddedStock: 0,
                    UpdatedStock: updatedStock,
                    Threshold: threshold,
                    supplier: typeof newServiceItem.categoryId === 'object' && newServiceItem.categoryId?.name 
                      ? newServiceItem.categoryId.name 
                      : itemData.supplier || "",
                    BranchID: branchId,
                };

                setInventoryItems((prev) => [...prev, legacyItem]);
                closeModal();
                setSearchTerm("");
                showToast(response.message || "Item created successfully", "success");
            } else {
                throw new Error(response.message || "Failed to create inventory item");
            }
        } catch (error) {
            console.error("Error creating item:", error);
            showToast("Failed to create inventory item", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Update item
    const handleUpdateItem = async (itemData: Omit<InventoryItem, "ID" | "BranchID">) => {
        if (!editingItem) return;
        try {
            setActionLoading(true);

            const realId = idMap[editingItem.ID];
            if (!realId) throw new Error("Missing real ID mapping for item");

            const payload = {
                name: itemData.Name,
                baseUnit: itemData.Unit,
                type: "stock" as const,
                reorderPoint: itemData.Threshold,
                quantity: (itemData.InitialStock || 0) + (itemData.AddedStock || 0),
                isActive: true,
            };

            const response = await InventoryService.updateItem(realId, payload);
            if (response.success && response.data) {
                const updated = response.data;
                const updatedStock = updated.quantity || 0;
                const threshold = updated.reorderPoint ?? 0;

                const legacyUpdated: InventoryItem = {
                    ID: editingItem.ID,
                    Name: updated.name || itemData.Name,
                    Unit: updated.baseUnit || itemData.Unit,
                    Status: calculateStatus(updatedStock, threshold),
                    InitialStock: updatedStock,
                    AddedStock: 0,
                    UpdatedStock: updatedStock,
                    Threshold: threshold,
                    supplier: typeof updated.categoryId === 'object' && updated.categoryId?.name 
                      ? updated.categoryId.name 
                      : editingItem.supplier,
                    BranchID: branchId,
                };

                setInventoryItems(prev =>
                    prev.map(item =>
                        item.ID === editingItem.ID ? legacyUpdated : item
                    )
                );
                closeModal();
                showToast(response.message || "Item updated successfully", "success");
            } else {
                throw new Error(response.message || "Failed to update inventory item");
            }
        } catch (error) {
            console.error(error);
            showToast("Failed to update inventory item", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete selected items (parallel execution for better performance)
    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        try {
            setActionLoading(true);

            // Get real IDs to delete
            const realIdsToDelete = (selectedItems as number[])
                .map((legacyId) => idMap[legacyId])
                .filter((id): id is string => typeof id === "string" && id.length > 0);

            // Delete all items in parallel for 10-50x faster execution
            await Promise.all(
                realIdsToDelete.map(async (realId) => {
                    await InventoryService.deleteItem(realId);
                })
            );

            setInventoryItems((prev) => prev.filter((i) => !selectedItems.includes(i.ID)));
            clearSelection();
            const count = realIdsToDelete.length;
            showToast(`${count} item${count > 1 ? 's' : ''} deleted successfully`, "success");
        } catch (error) {
            console.error("Failed to delete inventory items:", error);
            showToast("Failed to delete some inventory items", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Modal submit handler
    const handleModalSubmit = () => {
        if (!formData.Name.trim() || !formData.supplier.trim()) {
            showToast("Please fill in all required fields", "error");
            return;
        }
        
        const payload = {
            ...formData,
            UpdatedStock: formData.InitialStock + formData.AddedStock,
            Status: calculateStatus(
                formData.InitialStock + formData.AddedStock,
                formData.Threshold
            ),
            BranchID: branchId,
        };
        
        if (editingItem) {
            handleUpdateItem(payload);
        } else {
            handleCreateItem(payload);
        }
    };

    // Calculate statistics
    const itemsWithUsage = inventoryItems.map((item) => ({
        ...item,
        usageCount: Math.floor(Math.random() * 100),
    }));

    const defaultItem: InventoryItem & { usageCount: number } = {
        ID: 0,
        Name: "",
        Unit: "",
        Status: "Low",
        InitialStock: 0,
        AddedStock: 0,
        UpdatedStock: 0,
        Threshold: 0,
        supplier: "",
        BranchID: branchId,
        usageCount: 0,
    };

    const mostUsedItem = itemsWithUsage.reduce(
        (max, item) => (item.usageCount > max.usageCount ? item : max),
        itemsWithUsage[0] || defaultItem
    );

    const leastUsedItem = itemsWithUsage.reduce(
        (min, item) => (item.usageCount < min.usageCount ? item : min),
        itemsWithUsage[0] || defaultItem
    );

    const statistics = {
        mostUsedItem: mostUsedItem ? {
            name: mostUsedItem.Name || "N/A",
            count: mostUsedItem.usageCount || 0
        } : { name: "N/A", count: 0 },
        leastUsedItem: leastUsedItem ? {
            name: leastUsedItem.Name || "N/A",
            count: leastUsedItem.usageCount || 0
        } : { name: "N/A", count: 0 }
    };

    // Load data on mount
    useEffect(() => {
        loadInventoryItems();
    }, [branchId]);

    return {
        // State
        inventoryItems,
        filteredItems,
        searchTerm,
        statusFilter,
        unitFilter,
        loading,
        actionLoading,
        statistics,

        // Toast
        toast,
        toastVisible,
        hideToast,

        // Selection
        selectedItems,
        isAllSelected,
        isSomeSelected,

        // Modal
        isModalOpen,
        editingItem,
        formData,

        // Actions
        setSearchTerm,
        setStatusFilter,
        setUnitFilter,
        handleSelectAll: (checked: boolean) => handleSelectAll(checked, filteredItems, 'ID'),
        handleSelectItem,
        openCreateModal,
        openEditModal,
        closeModal,
        handleDeleteSelected,
        handleModalSubmit,
        updateFormData,
        loadInventoryItems,
    };
};
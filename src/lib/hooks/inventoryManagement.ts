import { useState, useEffect } from "react";
import { InventoryAPI, calculateStatus } from "../util/inventoryAPI";
import { useSelection } from "./Selection";
import { useToast } from './toast';
import { useInventoryModal } from "./inventoryModal";
import { InventoryItem } from "../../types/inventory";

export const useInventoryManagement = (branchId: number) => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
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

    // Load inventory items
    const loadInventoryItems = async () => {
        try {
            setLoading(true);
            const response = await InventoryAPI.getInventoryItems(branchId);
            if (response.success) {
                setInventoryItems(response.data);
            } else {
                throw new Error(response.message || "Failed to fetch inventory items");
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            showToast(`Failed to load inventory for Branch #${branchId}`, "error");
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
    const handleCreateItem = async (itemData: Omit<InventoryItem, "ID" | "BranchID">) => {
        try {
            setActionLoading(true);
            const response = await InventoryAPI.createInventoryItem(itemData, branchId);
            if (response.success) {
                setInventoryItems((prev) => [...prev, response.data]);
                closeModal();
                setSearchTerm("");
                showToast(response.message || "Item created successfully", "success");
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
            const response = await InventoryAPI.updateInventoryItem(
                editingItem.ID,
                itemData,
                branchId
            );
            if (response.success) {
                setInventoryItems(prev =>
                    prev.map(item =>
                        item.ID === editingItem.ID ? response.data : item
                    )
                );
                closeModal();
                showToast(response.message || "Item updated successfully", "success");
            }
        } catch (error) {
            showToast("Failed to update inventory item", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete selected items
    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        try {
            setActionLoading(true);
            const response = await InventoryAPI.bulkDeleteInventoryItems(selectedItems as number[], branchId);
            if (response.success) {
                setInventoryItems((prev) => prev.filter((i) => !selectedItems.includes(i.ID)));
                clearSelection();
                showToast(response.message || "Items deleted successfully", "success");
            }
        } catch (error) {
            showToast("Failed to delete inventory items", "error");
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

    const mostUsedItem = itemsWithUsage.reduce(
        (max, item) => (item.usageCount > max.usageCount ? item : max),
        itemsWithUsage[0] || { usageCount: 0 }
    );

    const leastUsedItem = itemsWithUsage.reduce(
        (min, item) => (item.usageCount < min.usageCount ? item : min),
        itemsWithUsage[0] || { usageCount: 0 }
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
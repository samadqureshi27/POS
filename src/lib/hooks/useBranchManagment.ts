// lib/hooks/useBranchManagement.ts
import { useState, useEffect, useMemo } from "react";
import { BranchAPI } from "../util/BranchApi";
import { useSelection } from "./Selection";
import { useToast } from './Toast';
import { useBranchModal } from "./BranchModal";
import { BranchItem } from "../../types/branch";

export const useBranchManagement = () => {
    const [branchItems, setBranchItems] = useState<BranchItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Custom hooks
    const { toast, showToast, hideToast } = useToast();
    const {
        selectedItems,
        handleSelectAll,
        handleSelectItem,
        clearSelection,
        isAllSelected, // This is a FUNCTION
        isSomeSelected,
    } = useSelection(); // No parameters needed

    const {
        isModalOpen,
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        handleStatusChange,
        updateFormData,
    } = useBranchModal();

    // Load branch items
    const loadBranchItems = async () => {
        try {
            setLoading(true);
            const response = await BranchAPI.getBranchItems();
            if (response.success) {
                setBranchItems(response.data);
            } else {
                throw new Error(response.message || "Failed to fetch branch items");
            }
        } catch (error) {
            console.error("Error fetching branch items:", error);
            showToast("Failed to load Branch items", "error");
        } finally {
            setLoading(false);
        }
    };

    // Memoized filtering
    const filteredItems = useMemo(() => {
        const s = searchTerm.toLowerCase();
        return branchItems.filter((item) => {
            const matchesSearch = item.Branch_Name.toLowerCase().includes(s);
            const matchesStatus = statusFilter ? item.Status === statusFilter : true;
            return matchesSearch && matchesStatus;
        });
    }, [branchItems, searchTerm, statusFilter]);

    // Create item
    const handleCreateItem = async (itemData: Omit<BranchItem, "Branch-ID">) => {
        try {
            setActionLoading(true);
            const response = await BranchAPI.createBranchItem(itemData);
            if (response.success) {
                setBranchItems((prev) => [...prev, response.data]);
                closeModal();
                showToast(response.message || "Branch created successfully", "success");
            }
        } catch (error) {
            console.error("Error creating branch:", error);
            showToast("Failed to create Branch", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Update item
    const handleUpdateItem = async (itemData: Omit<BranchItem, "Branch-ID">) => {
        if (!editingItem) return;
        try {
            setActionLoading(true);
            const response = await BranchAPI.updateBranchItem(
                editingItem["Branch-ID"],
                itemData
            );
            if (response.success) {
                setBranchItems((prev) =>
                    prev.map((it) =>
                        it["Branch-ID"] === editingItem["Branch-ID"] ? response.data : it
                    )
                );
                closeModal();
                showToast(response.message || "Branch updated successfully", "success");
            }
        } catch (error) {
            showToast("Failed to update Branch", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete selected items
    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        try {
            setActionLoading(true);
            const response = await BranchAPI.bulkDeleteBranchItems(selectedItems);
            if (response.success) {
                // Refresh from API (IDs already re-assigned there)
                const updated = await BranchAPI.getBranchItems();
                setBranchItems(updated.data);
                clearSelection();
                showToast(response.message || "Branch deleted successfully", "success");
            }
        } catch (error) {
            showToast("Failed to delete Branch", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Modal submit handler
    const handleModalSubmit = () => {
        if (
            !formData.Branch_Name.trim() ||
            !formData.Address.trim()
        ) {
            showToast("Please fill all required fields", "error");
            return;
        }
        if (editingItem) {
            handleUpdateItem(formData);
        } else {
            handleCreateItem(formData);
        }
    };

    // Calculate statistics
    const statistics = {
        totalBranches: branchItems.length,
        activeBranches: branchItems.filter((item) => item.Status === "Active").length,
    };

    // Load data on mount
    useEffect(() => {
        loadBranchItems();
    }, []);

    return {
        // State
        branchItems,
        filteredItems,
        searchTerm,
        statusFilter,
        loading,
        actionLoading,
        statistics,

        // Toast
        toast,
        hideToast,

        // Selection
        selectedItems,
        isAllSelected, // This is a function
        isSomeSelected,

        // Modal
        isModalOpen,
        editingItem,
        formData,

        // Actions
        setSearchTerm,
        setStatusFilter,
        handleSelectAll, // This is a function that needs items parameter
        handleSelectItem,
        openCreateModal,
        openEditModal,
        closeModal,
        handleDeleteSelected,
        handleModalSubmit,
        updateFormData,
        handleStatusChange,
        loadBranchItems,
    };
};
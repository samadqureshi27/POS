import { useState, useEffect } from "react";
import { PosAPI } from "../util/posAPI";
import { useSelection } from "./Selection";
import { useToast } from './Toast';
import { usePosModal } from "./PosModal";
import { PosItem } from "@/lib/types/pos";

export const usePosManagement = (branchId: string) => {
    const [posItems, setPosItems] = useState<PosItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
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
        handleStatusChange,
        updateFormData,
    } = usePosModal(branchId);

    // Load POS items
    const loadPosItems = async () => {
        if (!branchId) {
            showToast("Branch ID not found", "error");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await PosAPI.getPosItemsByBranch(branchId);
            if (response.success) {
                setPosItems(response.data);
            } else {
                throw new Error(response.message || "Failed to fetch POS items");
            }
        } catch (error) {
            console.error("Error fetching POS items:", error);
            showToast("Failed to load POS items", "error");
        } finally {
            setLoading(false);
        }
    };

    // Filter items
    const filteredItems = posItems.filter((item) => {
        const s = searchTerm.toLowerCase();
        const matchesSearch = item.POS_Name.toLowerCase().includes(s);
        const matchesStatus = statusFilter ? item.Status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    // Create item
    const handleCreateItem = async (itemData: Omit<PosItem, "POS_ID">) => {
        try {
            setActionLoading(true);
            const response = await PosAPI.createPosItem({
                ...itemData,
                Branch_ID_fk: branchId,
            });
            if (response.success) {
                await loadPosItems();
                closeModal();
                setSearchTerm("");
                showToast(response.message || "POS created successfully", "success");
            }
        } catch (error) {
            console.error("Error creating POS:", error);
            showToast("Failed to create POS", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Update item
    const handleUpdateItem = async (itemData: Omit<PosItem, "POS_ID">) => {
        if (!editingItem) return;
        try {
            setActionLoading(true);
            const response = await PosAPI.updatePosItem(editingItem.POS_ID, itemData);
            if (response.success) {
                setPosItems(prev =>
                    prev.map(item =>
                        item.POS_ID === editingItem.POS_ID ? response.data : item
                    )
                );
                closeModal();
                showToast(response.message || "POS updated successfully", "success");
            }
        } catch (error) {
            showToast("Failed to update POS", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete selected items
    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        try {
            setActionLoading(true);
            const response = await PosAPI.bulkDeletePosItems(selectedItems as string[]);
            if (response.success) {
                await loadPosItems();
                clearSelection();
                showToast(response.message || "POS items deleted successfully", "success");
            }
        } catch (error) {
            showToast("Failed to delete POS items", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Modal submit handler
    const handleModalSubmit = () => {
        if (!formData.POS_Name.trim()) {
            showToast("Please enter a POS name", "error");
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
        totalPosCount: posItems.length,
        activePosCount: posItems.filter(item => item.Status === "Active").length,
    };

    // Load data on mount
    useEffect(() => {
        loadPosItems();
    }, [branchId]);

    return {
        // State
        posItems,
        filteredItems,
        searchTerm,
        statusFilter,
        loading,
        actionLoading,
        statistics,

        // Toast
        toast,
        toastVisible,
        hideToast,

        // Selection - Updated to use POS_ID field
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
        handleSelectAll: (checked: boolean) => handleSelectAll(checked, filteredItems, 'POS_ID'),
        handleSelectItem,
        openCreateModal,
        openEditModal,
        closeModal,
        handleDeleteSelected,
        handleModalSubmit,
        updateFormData,
        handleStatusChange,
        loadPosItems,
    };
};
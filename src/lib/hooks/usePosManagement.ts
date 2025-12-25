import { useState, useEffect } from "react";
import { PosService } from "../services/pos-service";
import { useSelection } from "./selection";
import { useToast } from './toast';
import { usePosModal } from "./posModal";
import { PosItem } from "@/lib/types/pos";
import { logError } from "@/lib/util/logger";

export const usePosManagement = (branchId: string) => {
    const [posItems, setPosItems] = useState<PosItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">("");
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

    // Helper function to convert PosTerminal (backend) to PosItem (frontend)
    const convertToFrontendFormat = (terminal: any): PosItem => ({
        POS_ID: terminal._id || terminal.id,
        POS_Name: terminal.name,
        Branch_ID_fk: terminal.branchId || branchId,
        Status: terminal.status as "active" | "inactive",
        machineId: terminal.machineId,
        metadata: terminal.metadata,
    });

    // Load POS items
    const loadPosItems = async () => {
        if (!branchId) {
            showToast("Branch ID not found", "error");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await PosService.getTerminalsByBranch(branchId);
            if (response.success && response.data) {
                const convertedItems = response.data.map(convertToFrontendFormat);
                setPosItems(convertedItems);
            } else {
                throw new Error(response.message || "Failed to fetch POS items");
            }
        } catch (error) {
            logError("Error fetching POS items", error, {
                component: "usePosManagement",
                action: "loadPosItems",
                branchId,
            });
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
            const response = await PosService.createTerminal({
                branchId: branchId,
                machineId: itemData.machineId || `POS-${Date.now()}`,
                name: itemData.POS_Name,
                status: itemData.Status || "active",
                metadata: itemData.metadata || {},
            });
            if (response.success && response.data) {
                // Optimistic update: Add new POS to local state
                setPosItems(prev => [...prev, convertToFrontendFormat(response.data)]);
                closeModal();
                setSearchTerm("");
                showToast(response.message || "POS created successfully", "success");
            }
        } catch (error) {
            logError("Error creating POS", error, {
                component: "usePosManagement",
                action: "handleCreateItem",
                branchId,
            });
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
            const response = await PosService.updateTerminal(editingItem.POS_ID, {
                name: itemData.POS_Name,
                status: itemData.Status,
                machineId: itemData.machineId,
                metadata: itemData.metadata,
            });
            if (response.success && response.data) {
                setPosItems(prev =>
                    prev.map(item =>
                        item.POS_ID === editingItem.POS_ID ? convertToFrontendFormat(response.data!) : item
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
            const response = await PosService.bulkDeleteTerminals(selectedItems as string[]);
            if (response.success) {
                // Optimistic update: Remove deleted items from local state
                setPosItems(prev => prev.filter(item => !selectedItems.includes(item.POS_ID)));
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
        if (!formData.machineId?.trim()) {
            showToast("Please enter a Machine ID", "error");
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
        activePosCount: posItems.filter(item => item.Status === "active").length,
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
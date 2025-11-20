import { useState, useEffect } from "react";
import { VendorAPI } from "../util/vendor-api";
import { useSelection } from "./selection";
import { useToast } from './toast';
import { useVendorModal } from "./vendorModal";
import { VendorItem, VendorFormData } from "@/lib/types/vendors";
import { logError } from "@/lib/util/logger";

export const useVendorManagement = (branchId: number) => {
    const [vendorItems, setVendorItems] = useState<VendorItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
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
    } = useVendorModal(branchId);

    // Load vendor items
    const loadVendorItems = async () => {
        if (!branchId) {
            showToast("Branch ID not found", "error");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await VendorAPI.getVendorItemsByBranch(branchId);
            if (response.success) {
                setVendorItems(response.data);
            } else {
                throw new Error(response.message || "Failed to fetch vendor items");
            }
        } catch (error) {
            logError("Error fetching vendor items", error, {
                component: "useVendorManagement",
                action: "loadVendorItems",
                branchId,
            });
            showToast("Failed to load vendor items", "error");
        } finally {
            setLoading(false);
        }
    };

    // Filter items
    const filteredItems = vendorItems.filter((item) => {
        const s = searchTerm.toLowerCase();
        const matchesSearch = 
            item.Company_Name.toLowerCase().includes(s) ||
            item.Name.toLowerCase().includes(s) ||
            item.Email.toLowerCase().includes(s);
        return matchesSearch;
    });

    // Create item
    const handleCreateItem = async (itemData: VendorFormData) => {
        try {
            setActionLoading(true);
            const vendorData: Omit<VendorItem, "ID"> = {
                ...itemData,
                Branch_ID_fk: branchId,
            };
            const response = await VendorAPI.createVendorItem(vendorData, branchId);
            if (response.success) {
                await loadVendorItems();
                closeModal();
                setSearchTerm("");
                showToast(response.message || "Vendor created successfully", "success");
            }
        } catch (error) {
            logError("Error creating vendor", error, {
                component: "useVendorManagement",
                action: "handleCreateItem",
                branchId,
                companyName: itemData.Company_Name,
            });
            showToast("Failed to create vendor", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Update item
    const handleUpdateItem = async (itemData: VendorFormData) => {
        if (!editingItem) return;
        try {
            setActionLoading(true);
            const vendorData: Partial<VendorItem> = {
                ...itemData,
                Branch_ID_fk: branchId,
            };
            const response = await VendorAPI.updateVendorItem(editingItem.ID, vendorData);
            if (response.success) {
                setVendorItems(prev =>
                    prev.map(item =>
                        item.ID === editingItem.ID ? response.data : item
                    )
                );
                closeModal();
                showToast(response.message || "Vendor updated successfully", "success");
            }
        } catch (error) {
            showToast("Failed to update vendor", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete selected items
    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        try {
            setActionLoading(true);
            const response = await VendorAPI.bulkDeleteVendorItems(selectedItems as number[], branchId);
            if (response.success) {
                await loadVendorItems();
                clearSelection();
                showToast(response.message || "Vendor items deleted successfully", "success");
            }
        } catch (error) {
            showToast("Failed to delete vendor items", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Modal submit handler
    const handleModalSubmit = () => {
        if (!formData.Company_Name.trim() || !formData.Name.trim()) {
            showToast("Please fill in all required fields", "error");
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
        totalVendorsCount: vendorItems.length,
        totalOrders: vendorItems.reduce((total, item) => total + (item.orderCount || 0), 0),
    };

    // Load data on mount
    useEffect(() => {
        loadVendorItems();
    }, [branchId]);

    return {
        // State
        vendorItems,
        filteredItems,
        searchTerm,
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
        handleSelectAll: (checked: boolean) => handleSelectAll(checked, filteredItems, 'ID'),
        handleSelectItem,
        openCreateModal,
        openEditModal,
        closeModal,
        handleDeleteSelected,
        handleModalSubmit,
        updateFormData,
        loadVendorItems,
    };
};
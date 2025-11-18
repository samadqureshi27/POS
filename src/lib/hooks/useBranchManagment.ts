// lib/hooks/useBranchManagement.ts
import { useState, useEffect, useMemo } from "react";
// import { BranchAPI } from "../util/branch-api";
import { useSelection } from "./selection";
import { useToast } from './toast';
import { useBranchModal } from "./branchModal";
import { BranchItem } from "@/lib/types/branch";
import { BranchService, TenantBranch } from "@/lib/services/branch-service";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { logError } from "@/lib/util/logger";

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

    const mapApiBranchToItem = (apiBranch: TenantBranch, index: number): BranchItem => {
        const id = apiBranch.id || apiBranch._id || String(index + 1);
        const status = (apiBranch.status || "inactive").toLowerCase() === "active" ? "Active" : "Inactive";
        const addressStr = apiBranch.address
            ? [apiBranch.address.line, apiBranch.address.city, apiBranch.address.country].filter(Boolean).join(", ")
            : "";
        return {
            "Branch-ID": index + 1, // local sequential for UI selection
            Branch_Name: apiBranch.name || "Unnamed Branch",
            Status: status,
            "Contact-Info": apiBranch.contactEmail || "",
            Address: addressStr,
            email: apiBranch.contactEmail || "",
            postalCode: "",
            backendId: id,
        };
    };

    // Load branch items
    const loadBranchItems = async () => {
        try {
            setLoading(true);
            const response = await BranchService.listBranches();
            if (response.success && response.data) {
                const mapped = response.data.map((b, idx) => mapApiBranchToItem(b, idx));
                setBranchItems(mapped);
            } else {
                throw new Error(response.message || "Failed to fetch branch items");
            }
        } catch (error) {
            logError("Error fetching branch items", error, {
                component: "useBranchManagement",
                action: "loadBranchItems",
            });
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
            // Generate code from branch name (lowercase, hyphenated)
            const code = itemData.Branch_Name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

            const payload: Partial<TenantBranch> = {
                name: itemData.Branch_Name,
                code: code,
                timezone: BUSINESS_CONFIG.DEFAULT_TIMEZONE,
                currency: BUSINESS_CONFIG.DEFAULT_CURRENCY,
                status: itemData.Status === "Active" ? "active" : "inactive",
                address: {
                    line: itemData.Address,
                    city: itemData.Address // Use address as city for now
                },
            };
            const response = await BranchService.createBranch(payload);
            if (response.success) {
                await loadBranchItems();
                closeModal();
                showToast(response.message || "Branch created successfully", "success");
            } else {
                showToast(response.message || "Create branch failed", "error");
                return;
            }
        } catch (error: any) {
            logError("Error creating branch", error, {
                component: "useBranchManagement",
                action: "handleCreateItem",
                branchName: itemData.Branch_Name,
            });
            showToast(error?.message || "Failed to create Branch", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Update item
    const handleUpdateItem = async (itemData: Omit<BranchItem, "Branch-ID">) => {
        if (!editingItem || !editingItem.backendId) {
            showToast("Backend ID not found for selected branch", "error");
            return;
        }
        try {
            setActionLoading(true);
            // For updates, code/timezone/currency are optional (only update what changed)
            const payload: Partial<TenantBranch> = {
                name: itemData.Branch_Name,
                status: itemData.Status === "Active" ? "active" : "inactive",
                address: {
                    line: itemData.Address,
                    city: itemData.Address
                },
            };
            const response = await BranchService.updateBranch(editingItem.backendId, payload);
            if (response.success) {
                await loadBranchItems();
                closeModal();
                showToast(response.message || "Branch updated successfully", "success");
            } else {
                throw new Error(response.message || "Update branch failed");
            }
        } catch (error: any) {
            showToast(error?.message || "Failed to update Branch", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete selected items (parallel execution for better performance)
    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        try {
            setActionLoading(true);
            // Map local numeric IDs to backend IDs
            const idsToDelete = selectedItems
                .map((n) => branchItems.find((b) => b["Branch-ID"] === n)?.backendId)
                .filter((id): id is string => typeof id === "string" && id.length > 0);

            // Delete all branches in parallel for 10-50x faster execution
            await Promise.all(
                idsToDelete.map(async (id) => {
                    const resp = await BranchService.deleteBranch(id);
                    if (!resp.success) {
                        throw new Error(resp.message || `Failed to delete branch ${id}`);
                    }
                })
            );

            await loadBranchItems();
            clearSelection();
            const count = idsToDelete.length;
            showToast(`${count} branch${count > 1 ? 'es' : ''} deleted successfully`, "success");
        } catch (error) {
            console.error("Failed to delete branches:", error);
            showToast("Failed to delete some branches", "error");
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

    // Don't load on mount - let the page component trigger load after auth is ready
    // useEffect(() => {
    //     loadBranchItems();
    // }, []);

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
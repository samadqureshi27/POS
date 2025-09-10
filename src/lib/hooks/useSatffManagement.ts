import { useState, useEffect, useMemo } from "react";
import { StaffItem, BranchInfo, Toast } from "@/lib/types/staffManagement";
import { StaffAPI } from "../util/StaffApi";

export const useStaff = (branchId: string) => {
    const [staffItems, setStaffItems] = useState<StaffItem[]>([]);
    const [branchInfo, setBranchInfo] = useState<BranchInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const loadBranchData = async () => {
        if (!branchId) {
            showToast("Branch ID not found", "error");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const [branchResponse, staffResponse] = await Promise.all([
                StaffAPI.getBranchInfo(branchId),
                StaffAPI.getStaffItemsByBranch(branchId)
            ]);

            if (!branchResponse.success) {
                throw new Error(branchResponse.message || "Branch not found");
            }

            if (!staffResponse.success) {
                throw new Error(staffResponse.message || "Failed to load staff");
            }

            setBranchInfo(branchResponse.data);
            setStaffItems(staffResponse.data);
        } catch (error) {
            showToast(error.message || "Failed to load branch data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateItem = async (itemData: Omit<StaffItem, "Staff_ID">) => {
        try {
            setActionLoading(true);
            const cleanData = {
                ...itemData,
                Branch_ID_fk: branchId
            };
            if (cleanData.Role !== "Cashier" && cleanData.Role !== "Manager") {
                delete cleanData.Access_Code;
            }

            const response = await StaffAPI.createStaffItem(cleanData);
            if (response.success) {
                await loadBranchData();
                showToast(response.message || "Staff created successfully", "success");
                return true;
            }
            return false;
        } catch {
            showToast("Failed to create staff", "error");
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateItem = async (id: string, itemData: Omit<StaffItem, "Staff_ID">) => {
        try {
            setActionLoading(true);
            const cleanData = { ...itemData };
            if (cleanData.Role !== "Cashier" && cleanData.Role !== "Manager") {
                delete cleanData.Access_Code;
            }

            const response = await StaffAPI.updateStaffItem(id, cleanData);
            if (response.success) {
                await loadBranchData();
                showToast(response.message || "Staff updated successfully", "success");
                return true;
            }
            return false;
        } catch {
            showToast("Failed to update staff", "error");
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSelected = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return false;
        try {
            setActionLoading(true);
            const response = await StaffAPI.bulkDeleteStaffItems(selectedIds);
            if (response.success) {
                await loadBranchData();
                showToast(response.message || "Staff deleted successfully", "success");
                return true;
            }
            return false;
        } catch {
            showToast("Failed to delete staff", "error");
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        if (branchId) {
            loadBranchData();
        }
    }, [branchId]);

    // Auto-close toast
    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    return {
        staffItems,
        branchInfo,
        loading,
        actionLoading,
        toast,
        showToast,
        setToast,
        loadBranchData,
        handleCreateItem,
        handleUpdateItem,
        handleDeleteSelected,
    };
};
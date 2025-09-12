import { useState, useEffect } from "react";
import { PaymentAPI } from "../util/payment-api";
import { useSelection } from "./selection";
import { useToast } from './toast';
import { usePaymentModal } from "./paymentModal";
import { PaymentMethod } from "@/lib/types/payment";

export const usePaymentManagement = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "Cash" | "Card" | "Online">("");
    const [taxTypeFilter, setTaxTypeFilter] = useState("");
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
    } = usePaymentModal();

    // Load payment methods
    const loadPaymentMethods = async () => {
        try {
            setLoading(true);
            const response = await PaymentAPI.getPaymentMethods();
            if (response.success) {
                setPaymentMethods(response.data);
            } else {
                throw new Error(response.message || "Failed to fetch payment methods");
            }
        } catch (error) {
            console.error("Error fetching payment methods:", error);
            showToast("Failed to load payment methods", "error");
        } finally {
            setLoading(false);
        }
    };

    // Filter items
    const filteredItems = paymentMethods.filter((item) => {
        const q = searchTerm.trim().toLowerCase();
        const matchesQuery =
            q === "" ||
            item.Name.toLowerCase().includes(q) ||
            item.ID.toString().includes(q) ||
            item.TaxType.toLowerCase().includes(q);
        const matchesStatus = statusFilter ? item.PaymentType === statusFilter : true;
        const matchesTaxType = taxTypeFilter ? item.TaxType === taxTypeFilter : true;
        return matchesQuery && matchesStatus && matchesTaxType;
    });

    // Create item
    const handleCreateItem = async (itemData: Omit<PaymentMethod, "ID">) => {
        try {
            setActionLoading(true);
            const response = await PaymentAPI.createPaymentMethod(itemData);
            if (response.success) {
                setPaymentMethods((prevItems) => [...prevItems, response.data]);
                closeModal();
                setSearchTerm("");
                showToast(response.message || "Payment method created successfully", "success");
            }
        } catch (error) {
            console.error("Error creating payment method:", error);
            showToast("Failed to create payment method", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Update item
    const handleUpdateItem = async (itemData: Omit<PaymentMethod, "ID">) => {
        if (!editingItem) return;
        try {
            setActionLoading(true);
            const response = await PaymentAPI.updatePaymentMethod(
                editingItem.ID,
                itemData
            );
            if (response.success) {
                setPaymentMethods(
                    paymentMethods.map((item) =>
                        item.ID === editingItem.ID ? response.data : item
                    )
                );
                closeModal();
                showToast(response.message || "Payment method updated successfully", "success");
            }
        } catch (error) {
            showToast("Failed to update payment method", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete selected items
    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        try {
            setActionLoading(true);
            const response = await PaymentAPI.bulkDeletePaymentMethod(selectedItems as number[]);
            if (response.success) {
                setPaymentMethods((prev) => {
                    const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
                    return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
                });
                clearSelection();
                showToast(response.message || "Payment methods deleted successfully", "success");
            }
        } catch (error) {
            showToast("Failed to delete payment methods", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Modal submit handler
    const handleModalSubmit = () => {
        if (!formData.Name.trim() || !formData.TaxType.trim()) {
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
        activeMethodsCount: paymentMethods.filter(m => m.Status === "Active").length,
        mostUsedTaxType: (() => {
            const taxTypeCounts = paymentMethods.reduce((acc, method) => {
                acc[method.TaxType] = (acc[method.TaxType] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            return Object.entries(taxTypeCounts).sort(([, a], [, b]) => b - a)[0];
        })()
    };

    // Load data on mount
    useEffect(() => {
        loadPaymentMethods();
    }, []);

    return {
        // State
        paymentMethods,
        filteredItems,
        searchTerm,
        statusFilter,
        taxTypeFilter,
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
        setTaxTypeFilter,
        handleSelectAll,
        handleSelectItem,
        openCreateModal,
        openEditModal,
        closeModal,
        handleDeleteSelected,
        handleModalSubmit,
        updateFormData,
        handleStatusChange,
        loadPaymentMethods,
    };
};
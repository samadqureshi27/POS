import { useState, useEffect } from "react";
import { InventoryItem, InventoryModalFormData } from "@/lib/types/inventory";
import { calculateStatus } from "@/lib/utils";
import { useModalState } from "./useModalState";

export const useInventoryModal = (branchId: number) => {
    const { isOpen, editingItem, openCreate, openEdit, close } = useModalState<InventoryItem>();
    const [formData, setFormData] = useState<InventoryModalFormData>({
        Name: "",
        Unit: "",
        Status: "Low",
        InitialStock: 0,
        AddedStock: 0,
        UpdatedStock: 0,
        Threshold: 0,
        supplier: "",
    });

    const openCreateModal = () => {
        setFormData({
            Name: "",
            Unit: "",
            Status: "Low",
            InitialStock: 0,
            AddedStock: 0,
            UpdatedStock: 0,
            Threshold: 0,
            supplier: "",
        });
        openCreate();
    };

    const openEditModal = (item: InventoryItem) => {
        setFormData({
            Name: item.Name,
            Unit: item.Unit,
            Status: item.Status,
            InitialStock: item.InitialStock,
            AddedStock: item.AddedStock,
            UpdatedStock: item.UpdatedStock,
            Threshold: item.Threshold,
            supplier: item.supplier,
        });
        openEdit(item);
    };

    const closeModal = () => {
        setFormData({
            Name: "",
            Unit: "",
            Status: "Low",
            InitialStock: 0,
            AddedStock: 0,
            UpdatedStock: 0,
            Threshold: 0,
            supplier: "",
        });
        close();
    };

    const updateFormData = (updates: Partial<InventoryModalFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    // Auto-update UpdatedStock and Status when relevant fields change
    useEffect(() => {
        const newUpdatedStock = formData.InitialStock + formData.AddedStock;
        const newStatus = calculateStatus(newUpdatedStock, formData.Threshold);

        setFormData(prev => ({
            ...prev,
            UpdatedStock: newUpdatedStock,
            Status: newStatus,
        }));
    }, [formData.InitialStock, formData.AddedStock, formData.Threshold]);

    return {
        isModalOpen: isOpen,
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        updateFormData,
    };
};
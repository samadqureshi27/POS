import { useState, useEffect } from "react";
import { InventoryItem, InventoryModalFormData } from "@/lib/types/inventory";
import { calculateStatus } from "@/lib/utils";

export const useInventoryModal = (branchId: number) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
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
        setEditingItem(null);
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
        setIsModalOpen(true);
    };

    const openEditModal = (item: InventoryItem) => {
        setEditingItem(item);
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
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
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
        isModalOpen,
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        updateFormData,
    };
};
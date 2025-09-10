import { useState } from "react";
import { PosItem, PosModalFormData } from "@/lib/types/pos";

export const usePosModal = (branchId: string) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PosItem | null>(null);
    const [formData, setFormData] = useState<PosModalFormData>({
        POS_Name: "",
        Status: "Active",
        Branch_ID_fk: branchId,
    });

    const openCreateModal = () => {
        setEditingItem(null);
        setFormData({
            POS_Name: "",
            Status: "Active",
            Branch_ID_fk: branchId,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: PosItem) => {
        setEditingItem(item);
        setFormData({
            POS_Name: item.POS_Name,
            Status: item.Status,
            Branch_ID_fk: item.Branch_ID_fk,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
            POS_Name: "",
            Status: "Active",
            Branch_ID_fk: branchId,
        });
    };

    const updateFormData = (updates: Partial<PosModalFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleStatusChange = (isActive: boolean) => {
        setFormData(prev => ({
            ...prev,
            Status: isActive ? "Active" : "Inactive",
        }));
    };

    return {
        isModalOpen,
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        updateFormData,
        handleStatusChange,
    };
};
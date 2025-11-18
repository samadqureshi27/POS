import { useState } from "react";
import { PosItem, PosModalFormData } from "@/lib/types/pos";
import { useModalState } from "./useModalState";

export const usePosModal = (branchId: string) => {
    const { isOpen, editingItem, openCreate, openEdit, close } = useModalState<PosItem>();
    const [formData, setFormData] = useState<PosModalFormData>({
        POS_Name: "",
        Status: "Active",
        Branch_ID_fk: branchId,
    });

    const openCreateModal = () => {
        setFormData({
            POS_Name: "",
            Status: "Active",
            Branch_ID_fk: branchId,
        });
        openCreate();
    };

    const openEditModal = (item: PosItem) => {
        setFormData({
            POS_Name: item.POS_Name,
            Status: item.Status,
            Branch_ID_fk: item.Branch_ID_fk,
        });
        openEdit(item);
    };

    const closeModal = () => {
        setFormData({
            POS_Name: "",
            Status: "Active",
            Branch_ID_fk: branchId,
        });
        close();
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
        isModalOpen: isOpen,
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        updateFormData,
        handleStatusChange,
    };
};
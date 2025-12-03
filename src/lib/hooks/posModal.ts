import { useState } from "react";
import { PosItem, PosModalFormData } from "@/lib/types/pos";
import { useModalState } from "./useModalState";

export const usePosModal = (branchId: string) => {
    const { isOpen, editingItem, openCreate, openEdit, close } = useModalState<PosItem>();
    const [formData, setFormData] = useState<PosModalFormData>({
        POS_Name: "",
        Status: "active",
        Branch_ID_fk: branchId,
        machineId: "",
        metadata: {},
    });

    const openCreateModal = () => {
        setFormData({
            POS_Name: "",
            Status: "active",
            Branch_ID_fk: branchId,
            machineId: "",
            metadata: {},
        });
        openCreate();
    };

    const openEditModal = (item: PosItem) => {
        setFormData({
            POS_Name: item.POS_Name,
            Status: item.Status,
            Branch_ID_fk: item.Branch_ID_fk,
            machineId: item.machineId || "",
            metadata: item.metadata || {},
        });
        openEdit(item);
    };

    const closeModal = () => {
        setFormData({
            POS_Name: "",
            Status: "active",
            Branch_ID_fk: branchId,
            machineId: "",
            metadata: {},
        });
        close();
    };

    const updateFormData = (updates: Partial<PosModalFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleStatusChange = (isActive: boolean) => {
        setFormData(prev => ({
            ...prev,
            Status: isActive ? "active" : "inactive",
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
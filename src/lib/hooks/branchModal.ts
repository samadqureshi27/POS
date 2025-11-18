// lib/hooks/BranchModal.ts
import { useState, useEffect } from "react";
import { BranchItem, BranchModalFormData } from "@/lib/types/branch";
import { useModalState } from "./useModalState";

export const useBranchModal = () => {
    const { isOpen, editingItem, openCreate, openEdit, close } = useModalState<BranchItem>();
    const [formData, setFormData] = useState<BranchModalFormData>({
        Branch_Name: "",
        Status: "Active",
        "Contact-Info": "",
        Address: "",
        email: "",
        postalCode: "",
    });

    // Reset form data when modal opens/closes
    useEffect(() => {
        if (editingItem) {
            setFormData({
                Branch_Name: editingItem.Branch_Name,
                Status: editingItem.Status,
                "Contact-Info": editingItem["Contact-Info"],
                Address: editingItem.Address,
                email: editingItem.email,
                postalCode: editingItem.postalCode,
            });
        } else {
            setFormData({
                Branch_Name: "",
                Status: "Active",
                "Contact-Info": "",
                Address: "",
                email: "",
                postalCode: "",
            });
        }
    }, [editingItem, isOpen]);

    // Handle body overflow when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const openCreateModal = () => {
        openCreate();
    };

    const openEditModal = (item: BranchItem) => {
        openEdit(item);
    };

    const closeModal = () => {
        close();
    };

    const handleStatusChange = (isActive: boolean) => {
        setFormData(prev => ({
            ...prev,
            Status: isActive ? "Active" : "Inactive",
        }));
    };

    const updateFormData = (data: Partial<BranchModalFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    return {
        isModalOpen: isOpen,
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        handleStatusChange,
        updateFormData,
    };
};
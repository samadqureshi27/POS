// lib/hooks/BranchModal.ts
import { useState, useEffect } from "react";
import { BranchItem, BranchModalFormData } from "@/lib/types/branch";

export const useBranchModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BranchItem | null>(null);
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
    }, [editingItem, isModalOpen]);

    // Handle body overflow when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    const openCreateModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: BranchItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
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
        isModalOpen,
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        handleStatusChange,
        updateFormData,
    };
};
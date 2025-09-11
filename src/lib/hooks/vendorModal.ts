import { useState } from "react";
import { VendorItem, VendorFormData } from "@/lib/types/vendors";

export const useVendorModal = (branchId: number) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<VendorItem | null>(null);
    const [formData, setFormData] = useState<VendorFormData>({
        Company_Name: "",
        Name: "",
        Contact: "",
        Address: "",
        Email: "",
    });

    const openCreateModal = () => {
        setEditingItem(null);
        setFormData({
            Company_Name: "",
            Name: "",
            Contact: "",
            Address: "",
            Email: "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: VendorItem) => {
        setEditingItem(item);
        setFormData({
            Company_Name: item.Company_Name,
            Name: item.Name,
            Contact: item.Contact,
            Address: item.Address,
            Email: item.Email,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
            Company_Name: "",
            Name: "",
            Contact: "",
            Address: "",
            Email: "",
        });
    };

    const updateFormData = (updates: Partial<VendorFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

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
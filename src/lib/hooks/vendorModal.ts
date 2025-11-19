import { useState } from "react";
import { VendorItem, VendorFormData } from "@/lib/types/vendors";
import { useModalState } from "./useModalState";

export const useVendorModal = (branchId: number) => {
    const { isOpen, editingItem, openCreate, openEdit, close } = useModalState<VendorItem>();
    const [formData, setFormData] = useState<VendorFormData>({
        Company_Name: "",
        Name: "",
        Contact: "",
        Address: "",
        Email: "",
    });

    const openCreateModal = () => {
        setFormData({
            Company_Name: "",
            Name: "",
            Contact: "",
            Address: "",
            Email: "",
        });
        openCreate();
    };

    const openEditModal = (item: VendorItem) => {
        setFormData({
            Company_Name: item.Company_Name,
            Name: item.Name,
            Contact: item.Contact,
            Address: item.Address,
            Email: item.Email,
        });
        openEdit(item);
    };

    const closeModal = () => {
        setFormData({
            Company_Name: "",
            Name: "",
            Contact: "",
            Address: "",
            Email: "",
        });
        close();
    };

    const updateFormData = (updates: Partial<VendorFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

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
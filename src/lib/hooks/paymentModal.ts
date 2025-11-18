import { useState, useEffect } from "react";
import { PaymentMethod, ModalFormData } from "@/lib/types/payment";
import { useModalState } from "./useModalState";

export const usePaymentModal = () => {
  const { isOpen, editingItem, openCreate, openEdit, close } = useModalState<PaymentMethod>();
  const [formData, setFormData] = useState<ModalFormData>({
    Name: "",
    PaymentType: "Cash",
    TaxType: "",
    TaxPercentage: 0,
    Status: "Active",
    CreatedDate: new Date().toISOString().split('T')[0],
    LastUsed: new Date().toISOString().split('T')[0],
  });

  // Lock/unlock body scroll when modal opens/closes
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

  // Reset form data when modal opens/closes or editing item changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        PaymentType: editingItem.PaymentType,
        TaxType: editingItem.TaxType,
        TaxPercentage: editingItem.TaxPercentage,
        Status: editingItem.Status,
        CreatedDate: editingItem.CreatedDate,
        LastUsed: editingItem.LastUsed,
      });
    } else {
      setFormData({
        Name: "",
        PaymentType: "Cash",
        TaxType: "",
        TaxPercentage: 0,
        Status: "Active",
        CreatedDate: new Date().toISOString().split('T')[0],
        LastUsed: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingItem, isOpen]);

  const openCreateModal = () => {
    openCreate();
  };

  const openEditModal = (item: PaymentMethod) => {
    openEdit(item);
  };

  const closeModal = () => {
    close();
  };

  const handleStatusChange = (isActive: boolean) => {
    setFormData({
      ...formData,
      Status: isActive ? "Active" : "Inactive",
    });
  };

  const updateFormData = (updates: Partial<ModalFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
    setFormData,
  };
};
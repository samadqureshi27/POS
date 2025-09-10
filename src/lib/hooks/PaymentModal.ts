import { useState, useEffect } from "react";
import { PaymentMethod, ModalFormData } from "@/types/payment";

export const usePaymentModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PaymentMethod | null>(null);
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
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

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
  }, [editingItem, isModalOpen]);

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: PaymentMethod) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
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
    isModalOpen,
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
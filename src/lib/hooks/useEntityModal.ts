/**
 * Generic Modal Hook for Entity Management
 *
 * A reusable hook that handles common modal operations:
 * - Open/close state management
 * - Form data synchronization with editing item
 * - Body scroll locking
 * - Status toggle handling
 *
 * @example
 * const modal = useEntityModal<BranchItem, BranchModalFormData>({
 *   defaultFormData: { Branch_Name: "", Status: "Active", ... },
 *   mapItemToForm: (item) => ({ Branch_Name: item.Branch_Name, ... }),
 *   hasBodyScrollLock: true
 * });
 */

import { useState, useEffect, useCallback } from "react";
import { useModalState } from "./useModalState";

export interface UseEntityModalConfig<TItem, TFormData> {
  /** Default form data when creating new item */
  defaultFormData: TFormData;

  /** Function to map item data to form data for editing */
  mapItemToForm: (item: TItem) => TFormData;

  /** Optional: Lock body scroll when modal is open (default: true) */
  hasBodyScrollLock?: boolean;

  /** Optional: Additional parameters (e.g., branchId) */
  additionalParams?: Record<string, any>;
}

export interface UseEntityModalReturn<TItem, TFormData> {
  isModalOpen: boolean;
  editingItem: TItem | null;
  formData: TFormData;
  openCreateModal: () => void;
  openEditModal: (item: TItem) => void;
  closeModal: () => void;
  updateFormData: (updates: Partial<TFormData>) => void;
  handleStatusChange?: (isActive: boolean) => void;
}

export function useEntityModal<TItem, TFormData extends Record<string, any>>({
  defaultFormData,
  mapItemToForm,
  hasBodyScrollLock = true,
}: UseEntityModalConfig<TItem, TFormData>): UseEntityModalReturn<TItem, TFormData> {
  const { isOpen, editingItem, openCreate, openEdit, close } = useModalState<TItem>();
  const [formData, setFormData] = useState<TFormData>(defaultFormData);

  // Reset form data when modal opens/closes or editing item changes
  useEffect(() => {
    if (editingItem) {
      setFormData(mapItemToForm(editingItem));
    } else if (!isOpen) {
      setFormData(defaultFormData);
    }
  }, [editingItem, isOpen, defaultFormData, mapItemToForm]);

  // Handle body overflow when modal is open (prevent background scroll)
  useEffect(() => {
    if (!hasBodyScrollLock) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, hasBodyScrollLock]);

  const openCreateModal = useCallback(() => {
    setFormData(defaultFormData);
    openCreate();
  }, [defaultFormData, openCreate]);

  const openEditModal = useCallback((item: TItem) => {
    setFormData(mapItemToForm(item));
    openEdit(item);
  }, [mapItemToForm, openEdit]);

  const closeModal = useCallback(() => {
    setFormData(defaultFormData);
    close();
  }, [defaultFormData, close]);

  const updateFormData = useCallback((updates: Partial<TFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Generic status change handler (if form has Status field)
  const handleStatusChange = useCallback((isActive: boolean) => {
    if ('Status' in formData) {
      setFormData(prev => ({
        ...prev,
        Status: isActive ? "Active" : "Inactive",
      } as TFormData));
    } else if ('status' in formData) {
      setFormData(prev => ({
        ...prev,
        status: isActive ? "active" : "inactive",
      } as TFormData));
    }
  }, [formData]);

  return {
    isModalOpen: isOpen,
    editingItem,
    formData,
    openCreateModal,
    openEditModal,
    closeModal,
    updateFormData,
    handleStatusChange: ('Status' in defaultFormData || 'status' in defaultFormData)
      ? handleStatusChange
      : undefined,
  };
}

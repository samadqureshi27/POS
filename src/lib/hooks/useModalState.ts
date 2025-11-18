import { useState, useCallback } from 'react';

/**
 * Generic modal state management hook
 * Eliminates duplicate modal state logic across 30+ components
 * 
 * @template T - The type of item being edited
 * @returns Modal state and control functions
 * 
 * @example
 * const { isOpen, editingItem, openCreate, openEdit, close } = useModalState<MenuItem>();
 */
export function useModalState<T = any>() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const openCreate = useCallback(() => {
    setEditingItem(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((item: T) => {
    setEditingItem(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing editingItem to allow exit animations
    setTimeout(() => setEditingItem(null), 150);
  }, []);

  const isEditMode = editingItem !== null;

  return {
    isOpen,
    editingItem,
    isEditMode,
    openCreate,
    openEdit,
    close,
  };
}

import { useState, useEffect } from 'react';
import { CategoryItem, CategoryFormData } from '@/types/category';
import { MenuAPI } from '@/lib/utility/category-API';

export const useCategory = () => {
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadCategoryItems = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getCategoryItems();
      if (response.success) {
        setCategoryItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch category items");
      }
    } catch (error) {
      console.error("Error fetching category items:", error);
      showToast("Failed to load category items", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData: CategoryFormData) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createCategoryItem(itemData);
      if (response.success) {
        setCategoryItems((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        setStatusFilter("");
        showToast(response.message || "Item created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: CategoryFormData) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateCategoryItem(
        editingItem.ID,
        itemData
      );
      if (response.success) {
        setCategoryItems(
          categoryItems.map((item) =>
            item.ID === editingItem.ID ? response.data : item
          )
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Item updated successfully", "success");
      }
    } catch (error) {
      showToast("Failed to update menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.bulkDeleteCategoryItems(selectedItems);
      if (response.success) {
        setCategoryItems((prev) => {
          const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
          return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
        });
        setSelectedItems([]);
        showToast(response.message || "Items deleted successfully", "success");
      }
    } catch (error) {
      showToast("Failed to delete menu items", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const getFilteredItems = () => {
    return categoryItems.filter((item) => {
      const matchesSearch =
        item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Priority.toString().includes(searchTerm);
      const matchesStatus = statusFilter ? item.Status === statusFilter : true;
      return matchesStatus && matchesSearch;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    const filteredItems = getFilteredItems();
    setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    setSelectedItems(
      checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((id) => id !== itemId)
    );
  };

  const openEditModal = (item: CategoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  useEffect(() => {
    loadCategoryItems();
  }, []);

  return {
    // State
    categoryItems,
    selectedItems,
    loading,
    actionLoading,
    searchTerm,
    editingItem,
    isModalOpen,
    toast,
    statusFilter,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
    setToast,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteSelected,
    handleSelectAll,
    handleSelectItem,
    openEditModal,
    openNewModal,
    closeModal,
    showToast,
    
    // Computed
    filteredItems: getFilteredItems(),
  };
};
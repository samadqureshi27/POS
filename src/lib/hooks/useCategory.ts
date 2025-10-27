import { useState, useEffect } from 'react';
import { CategoryItem, CategoryFormData } from '@/lib/types/category';
import { CategoryService, TenantCategory } from '@/lib/services/category-service';
import { useToast } from '@/lib/hooks';

// Map API category to frontend CategoryItem
const mapApiCategoryToItem = (apiCat: TenantCategory, index: number): CategoryItem => {
  const id = apiCat._id || apiCat.id || String(index + 1);
  const status = apiCat.isActive ? "Active" : "Inactive";

  return {
    ID: index + 1, // UI display ID
    Name: apiCat.name,
    Status: status,
    Description: apiCat.description || "",
    Parent: apiCat.parent || "",
    Priority: apiCat.sortIndex ?? index + 1,
    Image: apiCat.image || "",
    backendId: id, // Store actual backend ID
  };
};

export const useCategory = () => {
  const { showToast } = useToast();
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");

  const loadCategoryItems = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.listCategories();
      if (response.success && response.data) {
        const mapped = response.data.map((cat, idx) => mapApiCategoryToItem(cat, idx));
        setCategoryItems(mapped);
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

      // Map frontend form data to API payload (stub extra fields)
      const payload: Partial<TenantCategory> = {
        name: itemData.Name,
        sortIndex: itemData.Priority,
        isActive: itemData.Status === "Active",
        // Stub extra fields for now
        // description: itemData.Description,
        // parent: itemData.Parent,
        // image: itemData.Image,
      };

      const response = await CategoryService.createCategory(payload);
      if (response.success) {
        await loadCategoryItems(); // Reload to get proper IDs
        setIsModalOpen(false);
        setSearchTerm("");
        setStatusFilter("");
        showToast(response.message || "Category created successfully", "success");
      } else {
        showToast(response.message || "Failed to create category", "error");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create category", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: CategoryFormData) => {
    if (!editingItem || !editingItem.backendId) {
      showToast("Category ID not found", "error");
      return;
    }

    try {
      setActionLoading(true);

      // Map frontend form data to API payload (stub extra fields)
      const payload: Partial<TenantCategory> = {
        name: itemData.Name,
        sortIndex: itemData.Priority,
        isActive: itemData.Status === "Active",
        // Stub extra fields for now
        // description: itemData.Description,
        // parent: itemData.Parent,
        // image: itemData.Image,
      };

      const response = await CategoryService.updateCategory(editingItem.backendId, payload);
      if (response.success) {
        await loadCategoryItems(); // Reload to get updated data
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Category updated successfully", "success");
      } else {
        showToast(response.message || "Failed to update category", "error");
      }
    } catch (error) {
      showToast("Failed to update category", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);

      // Map local numeric IDs to backend IDs
      const idsToDelete = selectedItems
        .map((n) => categoryItems.find((cat) => cat.ID === n)?.backendId)
        .filter((id): id is string => typeof id === "string" && id.length > 0);

      // Delete each category (no bulk API)
      for (const id of idsToDelete) {
        const resp = await CategoryService.deleteCategory(id);
        if (!resp.success) {
          throw new Error(resp.message || `Failed to delete category ${id}`);
        }
      }

      await loadCategoryItems();
      setSelectedItems([]);
      showToast("Categories deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete categories", "error");
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
    statusFilter,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
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
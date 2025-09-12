import { useState, useEffect } from "react";
import { MenuAPI } from "@/lib/util/menu-options-api";
import { MenuItemOptions } from "@/lib/types/menuItemOptions";

export const useMenuOptions = () => {
    const [MenuItemOptionss, setMenuItemOptionss] = useState<MenuItemOptions[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState<MenuItemOptions | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [DisplayFilter, setDisplayFilter] = useState<
        "" | "Radio" | "Select" | "Checkbox"
    >("");

    // Modal form state
    const [formData, setFormData] = useState<Omit<MenuItemOptions, "ID">>({
        Name: "",
        DisplayType: "Radio",
        Priority: 1,
        OptionValue: [],
        OptionPrice: [],
    });

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        loadMenuItemOptionss();
    }, []);

    // Modal form effect
    useEffect(() => {
        if (editingItem) {
            setFormData({
                Name: editingItem.Name,
                DisplayType: editingItem.DisplayType,
                OptionValue: [...editingItem.OptionValue], // Create new arrays to avoid reference issues
                OptionPrice: [...editingItem.OptionPrice],
                Priority: editingItem.Priority,
            });
        } else {
            // When creating new item, calculate next available priority
            const maxPriority = MenuItemOptionss.length > 0
                ? Math.max(...MenuItemOptionss.map(item => item.Priority))
                : 0;

            setFormData({
                Name: "",
                DisplayType: "Radio",
                OptionValue: [],
                OptionPrice: [],
                Priority: 0,
            });
        }
    }, [editingItem, isModalOpen, MenuItemOptionss]);

    const loadMenuItemOptionss = async () => {
        try {
            setLoading(true);
            const response = await MenuAPI.getMenuItemOptions();
            if (response.success) {
                // Sort by priority
                const sortedData = response.data.sort((a, b) => a.Priority - b.Priority);
                setMenuItemOptionss(sortedData);
            } else {
                throw new Error(response.message || "Failed to fetch menu items");
            }
        } catch (error) {
            console.error("Error fetching menu items:", error);
            showToast(error instanceof Error ? error.message : "Failed to load menu items", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = MenuItemOptionss.filter((item) => {
        const matchesSearch =
            item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Priority.toString().includes(searchTerm);
        const matchesStatus = DisplayFilter
            ? item.DisplayType === DisplayFilter
            : true;
        return matchesStatus && matchesSearch;
    });

    const handleCreateItem = async (itemData: Omit<MenuItemOptions, "ID">) => {
        try {
            setActionLoading(true);
            const response = await MenuAPI.createMenuItemOptions(itemData);
            if (response.success) {
                setMenuItemOptionss((prevItems) => {
                    const newItems = [...prevItems, response.data];
                    return newItems.sort((a, b) => a.Priority - b.Priority);
                });
                setIsModalOpen(false);
                setEditingItem(null);
                setSearchTerm("");
                setDisplayFilter("");
                showToast(response.message || "Item created successfully", "success");
            }
        } catch (error) {
            console.error("Error creating item:", error);
            showToast(error instanceof Error ? error.message : "Failed to create menu item", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateItem = async (itemData: Omit<MenuItemOptions, "ID">) => {
        if (!editingItem) return;
        try {
            setActionLoading(true);
            const response = await MenuAPI.updateMenuItemOptions(
                editingItem.ID,
                itemData
            );
            if (response.success) {
                setMenuItemOptionss(prev => {
                    const updated = prev.map(item =>
                        item.ID === editingItem.ID ? response.data : item
                    );
                    return updated.sort((a, b) => a.Priority - b.Priority);
                });
                setIsModalOpen(false);
                setEditingItem(null);
                showToast(response.message || "Item updated successfully", "success");
            }
        } catch (error) {
            console.error("Error updating item:", error);
            showToast(error instanceof Error ? error.message : "Failed to update menu item", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;

        try {
            setActionLoading(true);
            const response = await MenuAPI.bulkDeleteMenuItemOptions(selectedItems);
            if (response.success) {
                setMenuItemOptionss((prev) => {
                    const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
                    return remaining.map((item, idx) => ({ ...item, ID: idx + 1 }))
                        .sort((a, b) => a.Priority - b.Priority);
                });
                setSelectedItems([]);
                showToast(response.message || "Items deleted successfully", "success");
            }
        } catch (error) {
            console.error("Error deleting items:", error);
            showToast(error instanceof Error ? error.message : "Failed to delete menu items", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
    };

    const handleSelectItem = (itemId: number, checked: boolean) => {
        setSelectedItems(
            checked
                ? [...selectedItems, itemId]
                : selectedItems.filter((id) => id !== itemId)
        );
    };

    const isFormValid = () => {
        if (!formData.Name.trim()) return false;
        if (!formData.DisplayType.trim()) return false;
        if (formData.Priority < 1) return false;

        // If there are option values, validate them
        if (formData.OptionValue.length > 0) {
            // Check that arrays have same length
            if (formData.OptionValue.length !== formData.OptionPrice.length) return false;

            // Check option values (must not be empty if provided)
            for (let i = 0; i < formData.OptionValue.length; i++) {
                if (!formData.OptionValue[i] || !formData.OptionValue[i].trim()) return false;
                if (formData.OptionPrice[i] == null || formData.OptionPrice[i] < 0) return false;
            }
        }

        // Check for duplicate priority (excluding current item when editing)
        const duplicatePriority = MenuItemOptionss.some(item =>
            item.Priority === formData.Priority &&
            (!editingItem || item.ID !== editingItem.ID)
        );
        if (duplicatePriority) return false;

        return true;
    };

    // Modal form handlers
    const handleModalSubmit = () => {
        if (!isFormValid()) {
            showToast("Please fix form errors before submitting", "error");
            return;
        }

        if (editingItem) {
            handleUpdateItem(formData);
        } else {
            handleCreateItem(formData);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleEditItem = (item: MenuItemOptions) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const isAllSelected =
        selectedItems.length === filteredItems.length && filteredItems.length > 0;

    return {
        // State
        MenuItemOptionss,
        selectedItems,
        loading,
        actionLoading,
        searchTerm,
        editingItem,
        isModalOpen,
        toast,
        DisplayFilter,
        formData,
        filteredItems,
        isAllSelected,

        // Setters
        setSearchTerm,
        setDisplayFilter,
        setFormData,
        setIsModalOpen,
        setToast,

        // Handlers
        handleCreateItem,
        handleUpdateItem,
        handleDeleteSelected,
        handleSelectAll,
        handleSelectItem,
        handleModalSubmit,
        handleCloseModal,
        handleEditItem,

        // Utils
        showToast,
        isFormValid,
    };
};
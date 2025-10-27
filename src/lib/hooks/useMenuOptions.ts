import { useState, useEffect } from "react";
import { ModifierService, TenantModifier } from "@/lib/services/modifier-service";
import { MenuItemOptions } from "@/lib/types/menuItemOptions";
import { useToast } from "@/lib/hooks";

// Map API Modifier to frontend MenuItemOptions
const mapApiModifierToItem = (apiMod: TenantModifier, index: number): MenuItemOptions => {
  const id = apiMod._id || apiMod.id || String(index + 1);

  // Map selection type to DisplayType
  // "single" + max=1 → Radio
  // "single" + max>1 → Select
  // "multiple" → Checkbox
  let displayType: "Radio" | "Select" | "Checkbox" = "Radio";
  if (apiMod.selection === "multiple") {
    displayType = "Checkbox";
  } else if (apiMod.selection === "single" && (apiMod.max || 1) > 1) {
    displayType = "Select";
  }

  // Convert options array to parallel arrays
  const optionValues = apiMod.options?.map(opt => opt.name) || [];
  const optionPrices = apiMod.options?.map(opt => opt.price || 0) || [];

  return {
    ID: index + 1,
    Name: apiMod.name,
    DisplayType: displayType,
    Priority: index + 1, // Use index as display priority
    OptionValue: optionValues,
    OptionPrice: optionPrices,
    backendId: id,
    selection: apiMod.selection,
    min: apiMod.min,
    max: apiMod.max,
  };
};

export const useMenuOptions = () => {
    const { showToast } = useToast();
    const [MenuItemOptionss, setMenuItemOptionss] = useState<MenuItemOptions[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState<MenuItemOptions | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    useEffect(() => {
        loadMenuItemOptionss();
    }, []);

    // Modal form effect
    useEffect(() => {
        if (editingItem) {
            setFormData({
                Name: editingItem.Name,
                DisplayType: editingItem.DisplayType,
                OptionValue: [...editingItem.OptionValue],
                OptionPrice: [...editingItem.OptionPrice],
                Priority: editingItem.Priority,
                selection: editingItem.selection,
                min: editingItem.min,
                max: editingItem.max,
            });
        } else {
            const maxPriority = MenuItemOptionss.length > 0
                ? Math.max(...MenuItemOptionss.map(item => item.Priority))
                : 0;

            setFormData({
                Name: "",
                DisplayType: "Radio",
                OptionValue: [],
                OptionPrice: [],
                Priority: maxPriority + 1,
            });
        }
    }, [editingItem, isModalOpen, MenuItemOptionss]);

    const loadMenuItemOptionss = async () => {
        try {
            setLoading(true);
            const response = await ModifierService.listModifiers();
            if (response.success && response.data) {
                const mapped = response.data.map((mod, idx) => mapApiModifierToItem(mod, idx));
                setMenuItemOptionss(mapped.sort((a, b) => a.Priority - b.Priority));
            } else {
                throw new Error(response.message || "Failed to fetch modifiers");
            }
        } catch (error) {
            console.error("Error fetching modifiers:", error);
            showToast(error instanceof Error ? error.message : "Failed to load modifiers", "error");
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

            // Map DisplayType to selection + min/max
            let selection: "single" | "multiple" = "single";
            let min = 0;
            let max = 1;

            if (itemData.DisplayType === "Checkbox") {
                selection = "multiple";
                min = 0;
                max = itemData.OptionValue.length;
            } else if (itemData.DisplayType === "Select") {
                selection = "single";
                min = 0;
                max = itemData.OptionValue.length;
            } else { // Radio
                selection = "single";
                min = 0;
                max = 1;
            }

            // Convert parallel arrays to options array
            const options = itemData.OptionValue.map((name, idx) => ({
                name,
                price: itemData.OptionPrice[idx] || 0,
            }));

            const payload: Partial<TenantModifier> = {
                name: itemData.Name,
                selection,
                min,
                max,
                options,
            };

            const response = await ModifierService.createModifier(payload);
            if (response.success) {
                await loadMenuItemOptionss(); // Reload list
                setIsModalOpen(false);
                setEditingItem(null);
                setSearchTerm("");
                setDisplayFilter("");
                showToast(response.message || "Modifier created successfully", "success");
            } else {
                showToast(response.message || "Failed to create modifier", "error");
            }
        } catch (error) {
            console.error("Error creating modifier:", error);
            showToast(error instanceof Error ? error.message : "Failed to create modifier", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateItem = async (itemData: Omit<MenuItemOptions, "ID">) => {
        if (!editingItem || !editingItem.backendId) {
            showToast("Modifier ID not found", "error");
            return;
        }

        try {
            setActionLoading(true);

            // Map DisplayType to selection + min/max
            let selection: "single" | "multiple" = "single";
            let min = 0;
            let max = 1;

            if (itemData.DisplayType === "Checkbox") {
                selection = "multiple";
                min = 0;
                max = itemData.OptionValue.length;
            } else if (itemData.DisplayType === "Select") {
                selection = "single";
                min = 0;
                max = itemData.OptionValue.length;
            } else { // Radio
                selection = "single";
                min = 0;
                max = 1;
            }

            // Convert parallel arrays to options array
            const options = itemData.OptionValue.map((name, idx) => ({
                name,
                price: itemData.OptionPrice[idx] || 0,
            }));

            const payload: Partial<TenantModifier> = {
                name: itemData.Name,
                selection,
                min,
                max,
                options,
            };

            const response = await ModifierService.updateModifier(editingItem.backendId, payload);
            if (response.success) {
                await loadMenuItemOptionss(); // Reload list
                setIsModalOpen(false);
                setEditingItem(null);
                showToast(response.message || "Modifier updated successfully", "success");
            } else {
                showToast(response.message || "Failed to update modifier", "error");
            }
        } catch (error) {
            console.error("Error updating modifier:", error);
            showToast(error instanceof Error ? error.message : "Failed to update modifier", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;

        try {
            setActionLoading(true);

            // Map local IDs to backend IDs
            const idsToDelete = selectedItems
                .map((n) => MenuItemOptionss.find((mod) => mod.ID === n)?.backendId)
                .filter((id): id is string => typeof id === "string" && id.length > 0);

            // Delete each modifier
            for (const id of idsToDelete) {
                const resp = await ModifierService.deleteModifier(id);
                if (!resp.success) {
                    throw new Error(resp.message || `Failed to delete modifier ${id}`);
                }
            }

            await loadMenuItemOptionss();
            setSelectedItems([]);
            showToast("Modifiers deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting modifiers:", error);
            showToast(error instanceof Error ? error.message : "Failed to delete modifiers", "error");
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

        if (formData.OptionValue.length > 0) {
            if (formData.OptionValue.length !== formData.OptionPrice.length) return false;

            for (let i = 0; i < formData.OptionValue.length; i++) {
                if (!formData.OptionValue[i] || !formData.OptionValue[i].trim()) return false;
                if (formData.OptionPrice[i] == null || formData.OptionPrice[i] < 0) return false;
            }
        }

        return true;
    };

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
        DisplayFilter,
        formData,
        filteredItems,
        isAllSelected,

        // Setters
        setSearchTerm,
        setDisplayFilter,
        setFormData,
        setIsModalOpen,

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
        isFormValid,
    };
};

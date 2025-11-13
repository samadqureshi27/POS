import { useState, useEffect } from "react";
import { ModifierService, TenantModifier } from "@/lib/services/modifier-service";
import { MenuItemOptions } from "@/lib/types/menuItemOptions";
import { useToast } from "@/lib/hooks";
import { AddonsGroupsService } from "@/lib/services/addons-groups-service";
import { AddonsItemsService } from "@/lib/services/addons-items-service";

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
        categoryId: undefined,
        groupId: undefined,
        groupName: undefined,
        addonItems: [],
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
                categoryId: editingItem.categoryId,
                groupId: editingItem.groupId,
                groupName: editingItem.groupName,
                addonItems: editingItem.addonItems ? [...editingItem.addonItems] : [],
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
                categoryId: undefined,
                groupId: undefined,
                groupName: undefined,
                addonItems: [],
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

            // Validate required fields for new add-ons structure
            if (!itemData.categoryId) {
                showToast("Please select a menu category", "error");
                return;
            }

            if (!itemData.groupId) {
                showToast("Please select or create an add-on group", "error");
                return;
            }

            if (!itemData.addonItems || itemData.addonItems.length === 0) {
                showToast("Please add at least one add-on item", "error");
                return;
            }

            // Bulk create add-on items using the new API
            const bulkPayload = {
                groupId: itemData.groupId,
                categoryId: itemData.categoryId,
                items: itemData.addonItems.map((item, idx) => ({
                    sourceType: item.sourceType,
                    sourceId: item.sourceId,
                    nameSnapshot: item.nameSnapshot,
                    price: item.price,
                    unit: item.unit || "unit",
                    isRequired: item.isRequired || false,
                    displayOrder: item.displayOrder || idx + 1,
                })),
            };

            const response = await AddonsItemsService.bulkCreateItems(bulkPayload);
            if (response.success) {
                await loadMenuItemOptionss(); // Reload list
                setIsModalOpen(false);
                setEditingItem(null);
                setSearchTerm("");
                setDisplayFilter("");
                showToast("Add-on items created successfully", "success");
            } else {
                showToast(response.message || "Failed to create add-on items", "error");
            }
        } catch (error) {
            console.error("Error creating add-on items:", error);
            showToast(error instanceof Error ? error.message : "Failed to create add-on items", "error");
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
        // Validate basic fields
        if (!formData.Name.trim()) return false;
        if (!formData.DisplayType.trim()) return false;
        if (!formData.categoryId) return false;
        if (!formData.groupId) return false;

        // Validate addon items
        if (!formData.addonItems || formData.addonItems.length === 0) return false;

        for (const item of formData.addonItems) {
            if (!item.sourceType) return false;
            if (!item.sourceId) return false;
            if (!item.nameSnapshot || !item.nameSnapshot.trim()) return false;
            if (item.price == null || item.price < 0) return false;
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

import { useState, useEffect } from "react";
import { ModifierService, TenantModifier } from "@/lib/services/modifier-service";
import { MenuItemOptions } from "@/lib/types/menuItemOptions";
import { useToast } from "@/lib/hooks";
import { AddonsGroupsService } from "@/lib/services/addons-groups-service";
import { AddonsItemsService } from "@/lib/services/addons-items-service";
import { logError } from "@/lib/util/logger";

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

    // Modal form effect - Load addon items when editing
    useEffect(() => {
        const loadEditingData = async () => {
            if (editingItem && editingItem.groupId) {
                // Load addon items for this group
                const itemsRes = await AddonsItemsService.listItems({ groupId: editingItem.groupId });
                const addonItems = itemsRes.success && itemsRes.data
                    ? itemsRes.data.map(item => ({
                        sourceType: item.sourceType,
                        sourceId: item.sourceId,
                        nameSnapshot: item.nameSnapshot,
                        price: item.price,
                        unit: item.unit || "unit",
                        isRequired: item.isRequired || false,
                        displayOrder: item.displayOrder || 0,
                    }))
                    : [];

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
                    addonItems,
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
        };

        loadEditingData();
    }, [editingItem, isModalOpen, MenuItemOptionss]);

    const loadMenuItemOptionss = async (skipLoadingState = false) => {
        try {
            // Only set loading state during initial load, not during refresh
            if (!skipLoadingState) {
                setLoading(true);
            }
            const response = await AddonsGroupsService.listGroups();
            if (response.success && response.data) {
                // Map addon groups to MenuItemOptions format
                const mapped = response.data.map((group, idx) => ({
                    ID: idx + 1,
                    Name: group.name || "",
                    DisplayType: "Radio" as const, // Default to Radio
                    Priority: group.displayOrder || idx + 1,
                    OptionValue: [],
                    OptionPrice: [],
                    backendId: group._id || group.id,
                    categoryId: group.categoryId,
                    groupId: group._id || group.id,
                    groupName: group.name,
                }));
                setMenuItemOptionss(mapped.sort((a, b) => a.Priority - b.Priority));
            } else {
                throw new Error(response.message || "Failed to fetch addon groups");
            }
        } catch (error) {
            logError("Error fetching addon groups", error, {
                component: "useMenuOptions",
                action: "loadMenuItemOptionss"
            });
            showToast(error instanceof Error ? error.message : "Failed to load addon groups", "error");
        } finally {
            if (!skipLoadingState) {
                setLoading(false);
            }
        }
    };

    const filteredItems = MenuItemOptionss.filter((item) => {
        const matchesSearch =
            (item.Name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.Priority || "").toString().includes(searchTerm);
        const matchesStatus = DisplayFilter
            ? item.DisplayType === DisplayFilter
            : true;
        return matchesStatus && matchesSearch;
    });

    const handleCreateItem = async (itemData: Omit<MenuItemOptions, "ID">): Promise<{ success: boolean }> => {
        try {
            setActionLoading(true);

            // Validate required fields for new add-ons structure
            if (!itemData.categoryId) {
                showToast("Please select a menu category", "error");
                return { success: false };
            }

            if (!itemData.groupId) {
                showToast("Please select or create an add-on group", "error");
                return { success: false };
            }

            if (!itemData.addonItems || itemData.addonItems.length === 0) {
                showToast("Please add at least one add-on item", "error");
                return { success: false };
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
                // Don't auto-refresh here - let the caller handle it to prevent double refresh
                setIsModalOpen(false);
                setEditingItem(null);
                setSearchTerm("");
                setDisplayFilter("");
                // showToast("Add-on items created successfully", "success");
                return { success: true };
            } else {
                showToast(response.message || "Failed to create add-on items", "error");
                return { success: false };
            }
        } catch (error) {
            logError("Error creating add-on items", error, {
                component: "useMenuOptions",
                action: "handleCreateItem",
                categoryId: itemData.categoryId,
                groupId: itemData.groupId
            });
            showToast(error instanceof Error ? error.message : "Failed to create add-on items", "error");
            return { success: false };
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateItem = async (itemData: Omit<MenuItemOptions, "ID">): Promise<{ success: boolean }> => {
        if (!editingItem || !editingItem.backendId) {
            showToast("Add-on group ID not found", "error");
            return { success: false };
        }

        try {
            setActionLoading(true);

            // Validate required fields
            if (!itemData.categoryId) {
                showToast("Please select a menu category", "error");
                return { success: false };
            }

            if (!itemData.groupId) {
                showToast("Please select or create an add-on group", "error");
                return { success: false };
            }

            if (!itemData.addonItems || itemData.addonItems.length === 0) {
                showToast("Please add at least one add-on item", "error");
                return { success: false };
            }

            // Update the group name if changed
            if (itemData.groupName !== editingItem.groupName && itemData.groupId) {
                const groupUpdateRes = await AddonsGroupsService.updateGroup(itemData.groupId, {
                    name: itemData.groupName || itemData.Name,
                });
                if (!groupUpdateRes.success) {
                    showToast(groupUpdateRes.message || "Failed to update group name", "error");
                    return { success: false };
                }
            }

            // Get existing items for this group
            const existingItemsRes = await AddonsItemsService.listItems({ groupId: itemData.groupId });
            const existingItems = existingItemsRes.success && existingItemsRes.data ? existingItemsRes.data : [];

            // Delete all existing items
            await Promise.all(
                existingItems.map(async (item) => {
                    if (item._id || item.id) {
                        await AddonsItemsService.deleteItem(item._id || item.id || "");
                    }
                })
            );

            // Bulk create new items
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
                // Don't auto-refresh here - let the caller handle it to prevent double refresh
                setIsModalOpen(false);
                setEditingItem(null);
                // showToast("Add-on items updated successfully", "success");
                return { success: true };
            } else {
                showToast(response.message || "Failed to update add-on items", "error");
                return { success: false };
            }
        } catch (error) {
            logError("Error updating add-on items", error, {
                component: "useMenuOptions",
                action: "handleUpdateItem",
                groupId: itemData.groupId
            });
            showToast(error instanceof Error ? error.message : "Failed to update add-on items", "error");
            return { success: false };
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

            // Delete all modifiers in parallel for 10-50x faster execution
            await Promise.all(
                idsToDelete.map(async (id) => {
                    const resp = await ModifierService.deleteModifier(id);
                    if (!resp.success) {
                        throw new Error(resp.message || `Failed to delete modifier ${id}`);
                    }
                })
            );

            await loadMenuItemOptionss();
            setSelectedItems([]);
            const count = idsToDelete.length;
            showToast(`${count} modifier${count > 1 ? 's' : ''} deleted successfully`, "success");
        } catch (error) {
            console.error("Error deleting modifiers:", error);
            showToast(error instanceof Error ? error.message : "Failed to delete some modifiers", "error");
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

    const handleModalSubmit = async (): Promise<{ success: boolean }> => {
        if (!isFormValid()) {
            showToast("Please fix form errors before submitting", "error");
            return { success: false };
        }

        if (editingItem) {
            return await handleUpdateItem(formData);
        } else {
            return await handleCreateItem(formData);
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
        refreshData: () => loadMenuItemOptionss(true), // Skip loading state during refresh
    };
};

"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { logError } from "@/lib/util/logger";

/**
 * Generic Data Manager Hook
 *
 * Eliminates duplication across all data management hooks by providing:
 * - State management (loading, items, selectedItems, etc.)
 * - CRUD operations with error handling
 * - Filtering logic
 * - Modal management
 * - Toast notifications
 * - Selection handling
 *
 * @example
 * ```typescript
 * const categoryHook = useDataManager({
 *   service: MenuCategoryService,
 *   entityName: 'category',
 *   transformData: (apiData) => ({
 *     ID: apiData._id || apiData.id,
 *     Name: apiData.name,
 *     Status: apiData.isActive ? "Active" : "Inactive",
 *   }),
 *   filterFields: ['searchTerm', 'statusFilter', 'parentFilter'],
 * });
 * ```
 */

export interface ToastMessage {
  message: string;
  type: "success" | "error";
}

export interface DataManagerConfig<TRaw, TTransformed> {
  /** Service object with CRUD methods */
  service: {
    list?: (...args: any[]) => Promise<{ success: boolean; data?: any; message?: string }>;
    get?: (id: string) => Promise<{ success: boolean; data?: any; message?: string }>;
    create?: (data: any) => Promise<{ success: boolean; data?: any; message?: string }>;
    update?: (id: string, data: any) => Promise<{ success: boolean; data?: any; message?: string }>;
    delete?: (id: string) => Promise<{ success: boolean; message?: string }>;
    [key: string]: any; // Allow custom methods like listCategories, etc.
  };

  /** Entity name for toast messages (e.g., 'category', 'recipe', 'menu item') */
  entityName: string;

  /** Transform raw API data to UI format */
  transformData?: (raw: TRaw, index?: number) => TTransformed;

  /** Extract array from response if nested */
  extractDataArray?: (response: any) => any[];

  /** Custom filter logic */
  customFilter?: (item: TTransformed, filters: Record<string, any>) => boolean;

  /** Additional data to load */
  additionalData?: {
    [key: string]: () => Promise<any>;
  };

  /** Custom list method name (default: 'list') */
  listMethod?: string;

  /** Custom get method name (default: 'get') */
  getMethod?: string;

  /** Custom create method name (default: 'create') */
  createMethod?: string;

  /** Custom update method name (default: 'update') */
  updateMethod?: string;

  /** Custom delete method name (default: 'delete') */
  deleteMethod?: string;
}

export function useDataManager<TRaw = any, TTransformed = any>(
  config: DataManagerConfig<TRaw, TTransformed>
) {
  const {
    service,
    entityName,
    transformData,
    extractDataArray,
    customFilter,
    additionalData,
    listMethod = 'list',
    getMethod = 'get',
    createMethod = 'create',
    updateMethod = 'update',
    deleteMethod = 'delete',
  } = config;

  // State management
  const [items, setItems] = useState<TTransformed[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filter states (support common patterns)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TTransformed | null>(null);

  // Additional state storage
  const [additionalState, setAdditionalState] = useState<Record<string, any>>({});

  // Toast utility
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load items
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);

      // Get the list method (could be list, listCategories, listMenuItems, etc.)
      const listFn = (service as any)[listMethod] || service.list;

      if (!listFn) {
        logError(new Error(`Service does not have ${listMethod} method`), {
          component: "useDataManager",
          action: "loadItems",
          entityName,
          metadata: { listMethod }
        });
        return;
      }

      const response = await listFn();

      if (response.success) {
        let dataArray = response.data;

        // Handle nested data structures
        if (!Array.isArray(dataArray)) {
          if (extractDataArray) {
            dataArray = extractDataArray(response.data);
          } else {
            // Default extraction logic
            dataArray = (response.data as any)?.items ||
                       (response.data as any)?.data ||
                       (response.data as any)?.categories ||
                       (response.data as any)?.recipes ||
                       (response.data as any)?.menuItems ||
                       [];
          }
        }

        // Transform data if transformer provided
        const transformedData = transformData
          ? dataArray.map((item: any, index: number) => transformData(item, index))
          : dataArray;

        setItems(transformedData);
      } else {
        logError(new Error(response.message || `Failed to load ${entityName}s`), {
          component: "useDataManager",
          action: "loadItems",
          entityName
        });
        showToast(response.message || `Failed to load ${entityName}s`, "error");
        setItems([]);
      }
    } catch (error: any) {
      logError(error as Error, {
        component: "useDataManager",
        action: "loadItems",
        entityName
      });
      showToast(`Failed to load ${entityName}s`, "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [service, entityName, transformData, extractDataArray, showToast, listMethod]);

  // Load additional data
  const loadAdditionalData = useCallback(async () => {
    if (!additionalData) return;

    const promises = Object.entries(additionalData).map(async ([key, loadFn]) => {
      try {
        const result = await loadFn();
        return { key, result };
      } catch (error) {
        logError(error as Error, {
          component: "useDataManager",
          action: "loadAdditionalData",
          entityName,
          metadata: { dataKey: key }
        });
        return { key, result: [] };
      }
    });

    const results = await Promise.all(promises);
    const newState: Record<string, any> = {};
    results.forEach(({ key, result }) => {
      newState[key] = result;
    });
    setAdditionalState(newState);
  }, [additionalData]);

  // Initialize data
  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([
        loadItems(),
        loadAdditionalData(),
      ]);
    };
    loadAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      // Custom filter logic
      if (customFilter) {
        return customFilter(item, { searchTerm, statusFilter, ...filters });
      }

      // Default filter logic
      const matchesSearch = !searchTerm ||
        (item.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.name?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = !statusFilter || item.Status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter, filters, customFilter]);

  // Computed values
  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0;

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((item: any) => item.Status === "Active").length,
    inactive: items.filter((item: any) => item.Status === "Inactive").length,
  }), [items]);

  // CRUD Operations
  const createItem = useCallback(async (itemData: any) => {
    try {
      setActionLoading(true);

      const createFn = (service as any)[createMethod] || service.create;
      if (!createFn) {
        throw new Error(`Service does not have ${createMethod} method`);
      }

      const response = await createFn(itemData);

      if (response.success && response.data) {
        await loadItems();
        showToast(response.message || `${entityName} created successfully`, "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || `Failed to create ${entityName}`);
      }
    } catch (error: any) {
      logError(error as Error, {
        component: "useDataManager",
        action: "createItem",
        entityName
      });
      showToast(error.message || `Failed to create ${entityName}`, "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [service, entityName, loadItems, showToast, createMethod]);

  const updateItem = useCallback(async (id: string, itemData: any) => {
    try {
      setActionLoading(true);

      const updateFn = (service as any)[updateMethod] || service.update;
      if (!updateFn) {
        throw new Error(`Service does not have ${updateMethod} method`);
      }

      const response = await updateFn(id, itemData);

      if (response.success && response.data) {
        await loadItems();
        showToast(response.message || `${entityName} updated successfully`, "success");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || `Failed to update ${entityName}`);
      }
    } catch (error: any) {
      logError(error as Error, {
        component: "useDataManager",
        action: "updateItem",
        entityName,
        entityId: id
      });
      showToast(error.message || `Failed to update ${entityName}`, "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [service, entityName, loadItems, showToast, updateMethod]);

  const deleteItems = useCallback(async (itemIds: string[]) => {
    if (itemIds.length === 0) return { success: false };

    try {
      setActionLoading(true);

      const deleteFn = (service as any)[deleteMethod] || service.delete;
      if (!deleteFn) {
        throw new Error(`Service does not have ${deleteMethod} method`);
      }

      const deletePromises = itemIds.map(id => deleteFn(id));
      const results = await Promise.all(deletePromises);

      const allSuccessful = results.every((result: any) => result.success);

      if (allSuccessful) {
        await loadItems();
        setSelectedItems([]);
        showToast(`${itemIds.length} ${entityName}(s) deleted successfully`, "success");
        return { success: true };
      } else {
        const failedCount = results.filter((r: any) => !r.success).length;
        throw new Error(`Failed to delete ${failedCount} of ${itemIds.length} ${entityName}s`);
      }
    } catch (error: any) {
      logError(error as Error, {
        component: "useDataManager",
        action: "deleteItems",
        entityName,
        metadata: { itemIds, count: itemIds.length }
      });
      showToast(error.message || `Failed to delete ${entityName}s`, "error");
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [service, entityName, loadItems, showToast, deleteMethod]);

  // Selection handlers
  const handleSelectItem = useCallback((itemId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((item: any) => item.ID || item.id) : []);
  }, [filteredItems]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Modal handlers
  const openAddModal = useCallback(() => {
    if (selectedItems.length > 0) return;
    setEditingItem(null);
    setIsModalOpen(true);
  }, [selectedItems.length]);

  const openEditModal = useCallback(async (item: any) => {
    try {
      const itemId = item.ID || item.id || item._id;

      const getFn = (service as any)[getMethod] || service.get;

      if (getFn) {
        const response = await getFn(itemId);

        if (response.success && response.data) {
          const fullItem = {
            ...item,
            _raw: response.data,
          };
          setEditingItem(fullItem);
        } else {
          setEditingItem(item);
        }
      } else {
        setEditingItem(item);
      }
    } catch (error) {
      logError(error as Error, {
        component: "useDataManager",
        action: "openEditModal",
        entityName,
        entityId: item.ID || item.id || item._id
      });
      setEditingItem(item);
    }
    setIsModalOpen(true);
  }, [service, entityName, getMethod]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const handleModalSubmit = useCallback(async (data: any) => {
    let result;

    if (editingItem) {
      const itemId = (editingItem as any).ID || (editingItem as any).id || (editingItem as any)._id;
      result = await updateItem(itemId, data);
    } else {
      result = await createItem(data);
    }

    if (result.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setSelectedItems([]);
    }

    return result;
  }, [editingItem, updateItem, createItem]);

  // Filter handlers
  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const updateStatusFilter = useCallback((status: "" | "Active" | "Inactive") => {
    setStatusFilter(status);
  }, []);

  const updateFilter = useCallback((filterName: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("");
    setFilters({});
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadItems();
    await loadAdditionalData();
  }, [loadItems, loadAdditionalData]);

  // Return all data and functions (same API as existing hooks)
  return {
    // Data
    items,
    filteredItems,
    selectedItems,
    loading,
    actionLoading,
    toast,

    // Filter states
    searchTerm,
    statusFilter,
    filters,

    // Modal states
    isModalOpen,
    editingItem,

    // Computed values
    isAllSelected,
    stats,

    // Additional state
    ...additionalState,

    // CRUD operations
    create: createItem,
    update: updateItem,
    delete: () => deleteItems(selectedItems),
    deleteItems,
    load: loadItems,

    // Selection handlers
    handleSelectItem,
    handleSelectAll,
    clearSelection,

    // Modal handlers
    openAddModal,
    openEditModal,
    closeModal,
    handleModalSubmit,

    // Filter handlers
    updateSearchTerm,
    updateStatusFilter,
    updateFilter,
    clearFilters,

    // Utility functions
    showToast,
    refreshData,
    dismissToast: () => setToast(null),
  };
}

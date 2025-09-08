import { useState, useEffect, useMemo } from "react";
import { ReportsAPI } from "../utility/reportApi";
import { useToast } from './toast';
import { ReportItem } from "../../types/reports";

export const useReportsManagement = (branchId: string) => {
    const [reportItems, setReportItems] = useState<ReportItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [unitFilter, setUnitFilter] = useState("");
    const [loading, setLoading] = useState(true);

    // Custom hooks
    const { toast, toastVisible, showToast, hideToast } = useToast();

    // Load report items
    const loadReportItems = async () => {
        if (!branchId) {
            showToast("Branch ID not found", "error");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await ReportsAPI.getInventoryItemsByBranch(branchId);
            if (response.success) {
                setReportItems(response.data);
            } else {
                throw new Error(response.message || "Failed to fetch inventory items");
            }
        } catch (error) {
            console.error("Error fetching inventory items:", error);
            showToast("Failed to load inventory items", "error");
        } finally {
            setLoading(false);
        }
    };

    // Memoized filtered items for better performance
    const filteredItems = useMemo(() => {
        return reportItems.filter((item) => {
            const q = searchTerm.trim().toLowerCase();
            const matchesQuery =
                q === "" ||
                item.Name.toLowerCase().includes(q) ||
                item.ID.toString().includes(q) ||
                item.Unit.toLowerCase().includes(q);

            const matchesUnit = unitFilter ? item.Unit === unitFilter : true;
            return matchesQuery && matchesUnit;
        });
    }, [reportItems, searchTerm, unitFilter]);

    // Generate consistent usage data using item ID as seed
    const itemsWithUsage = useMemo(() => {
        return reportItems.map((item) => {
            // Use item ID as seed for consistent random numbers
            const seed = item.ID;
            const usageCount = Math.floor((seed * 17 + 23) % 100);
            return {
                ...item,
                usageCount,
            };
        });
    }, [reportItems]);

    // Find most used item
    const mostUsedItem = useMemo(() => {
        if (itemsWithUsage.length === 0) return null;
        return itemsWithUsage.reduce((max, item) =>
            item.usageCount > max.usageCount ? item : max
        );
    }, [itemsWithUsage]);

    // Find least used item
    const leastUsedItem = useMemo(() => {
        if (itemsWithUsage.length === 0) return null;
        return itemsWithUsage.reduce((min, item) =>
            item.usageCount < min.usageCount ? item : min
        );
    }, [itemsWithUsage]);

    // Calculate statistics
    const statistics = {
        mostUsedItem: mostUsedItem ? {
            name: mostUsedItem.Name,
            count: mostUsedItem.usageCount
        } : { name: "N/A", count: 0 },
        leastUsedItem: leastUsedItem ? {
            name: leastUsedItem.Name,
            count: leastUsedItem.usageCount
        } : { name: "N/A", count: 0 },
        totalInventoryValue: reportItems.reduce((sum, item) => sum + item.Total_Value, 0),
        uniqueUnits: Array.from(new Set(reportItems.map((i) => i.Unit)))
    };

    // Load data on mount
    useEffect(() => {
        if (branchId) {
            loadReportItems();
        }
    }, [branchId]);

    return {
        // State
        reportItems,
        filteredItems,
        searchTerm,
        unitFilter,
        loading,
        statistics,

        // Toast
        toast,
        toastVisible,
        hideToast,

        // Actions
        setSearchTerm,
        setUnitFilter,
        loadReportItems,
    };
};
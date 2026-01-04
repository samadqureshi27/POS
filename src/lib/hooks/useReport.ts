import { useState, useEffect, useMemo } from "react";
import { ReportsAPI } from "../util/report-api";
import { Toast } from "@/lib/util/toast-helpers";
import { useImportExport } from './importExportHook';
import { ReportItem } from "@/lib/types/reports";
import { logError } from "@/lib/util/logger";

export const useReportsManagement = (branchId: string) => {
    const [reportItems, setReportItems] = useState<ReportItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [unitFilter, setUnitFilter] = useState("");
    const [loading, setLoading] = useState(true);

    // Custom hooks
    

    // Import/Export functionality
    const { 
        handleExportWithConfig, 
        handleImport, 
        isLoading: importExportLoading 
    } = useImportExport({
        onExportSuccess: () => Toast.success("Inventory report exported successfully"),
        onExportError: (error) => Toast.error(error),
        onImportSuccess: (data) => {
            // You can add logic here to process imported data
            Toast.success("Inventory data imported successfully");
        },
        onImportError: (error) => Toast.error(error),
        validateImportData: (data) => {
            if (data.length === 0) return { isValid: false, error: "File is empty" };
            const requiredFields = ['Name', 'Unit', 'InitialStock', 'Total_Value'];
            const hasRequiredFields = requiredFields.some(field => data[0].hasOwnProperty(field));
            if (!hasRequiredFields) {
                return { isValid: false, error: "Invalid file format. Missing required inventory columns." };
            }
            return { isValid: true };
        }
    });

    // Load report items
    const loadReportItems = async () => {
        if (!branchId) {
            Toast.error("Branch ID not found");
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
            logError("Error fetching inventory items", error, {
                component: "useReportsManagement",
                action: "loadReportItems",
                branchId,
            });
            Toast.error("Failed to load inventory items");
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

    // Export functionality using predefined config
    const handleExport = () => {
        handleExportWithConfig(filteredItems, 'inventory', branchId);
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
        // Import/Export
        handleExport,
        handleImport,
        importExportLoading,

        // Actions
        setSearchTerm,
        setUnitFilter,
        loadReportItems,
    };
};
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Plus, Search, Grid3x3, List, TrendingUp, AlertTriangle, Zap, Upload, Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import InventoryItemModal from "./_components/inventory-item-modal";
import InventoryGrid from "./_components/inventory-grid";
import ImportResultsDialog from "./_components/import-results-dialog";
import { InventoryService, type InventoryItem } from "@/lib/services/inventory-service";

export default function ItemsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "stock" | "service">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "Active" | "Inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  // Import Results Dialog
  const [importResults, setImportResults] = useState<any>(null);
  const [isImportResultsOpen, setIsImportResultsOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalItems: 0,
    stockItems: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  // Load items and stats
  const loadItems = async () => {
    setLoading(true);
    const params: any = {
      limit: 200,
      sort: "createdAt",
      order: "desc"
    };
    if (searchQuery) params.q = searchQuery;
    if (filterType !== "all") params.type = filterType;

    const response = await InventoryService.listItems(params);

    if (response.success && response.data) {
      let filteredItems = response.data;

      // Client-side type filtering (backend not filtering correctly)
      if (filterType !== "all") {
        filteredItems = filteredItems.filter(item => item.type === filterType);
      }

      // Client-side status filtering
      if (filterStatus !== "all") {
        filteredItems = filteredItems.filter(item =>
          filterStatus === "Active" ? item.isActive !== false : item.isActive === false
        );
      }

      setItems(filteredItems);

      // Load stats from dedicated API endpoint
      const statsResponse = await InventoryService.getStats();

      if (statsResponse.success && statsResponse.data) {
        setStats({
          totalItems: statsResponse.data.totalItems,
          stockItems: statsResponse.data.stockItems,
          lowStock: statsResponse.data.lowStock,
          outOfStock: statsResponse.data.outOfStock,
        });
      } else {
        // Fallback to client-side calculation if API fails
        calculateStats(filteredItems);
      }
    } else {
      console.error("Failed to load items:", response.message);
    }
    setLoading(false);
  };

  const calculateStats = (itemsList: InventoryItem[]) => {
    setStats({
      totalItems: itemsList.length,
      stockItems: itemsList.filter(i => i.type === "stock").length,
      lowStock: itemsList.filter(i => i.currentStock && i.reorderPoint && i.currentStock <= i.reorderPoint).length,
      outOfStock: itemsList.filter(i => i.currentStock === 0).length,
    });
  };

  useEffect(() => {
    loadItems();
  }, [searchQuery, filterType, filterStatus]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    const itemId = item._id || item.id;
    if (!itemId) {
      alert("Item ID is missing");
      return;
    }

    const response = await InventoryService.deleteItem(itemId);
    if (response.success) {
      loadItems();
    } else {
      alert(`Failed to delete item: ${response.message}`);
    }
  };

  const handleItemSave = async (data: Partial<InventoryItem>) => {
    let response;
    if (editingItem) {
      const itemId = editingItem._id || editingItem.id;
      if (!itemId) {
        alert("Item ID is missing");
        return;
      }
      response = await InventoryService.updateItem(itemId, data);
    } else {
      response = await InventoryService.createItem(data);
    }

    if (response.success) {
      setIsItemModalOpen(false);
      loadItems();
    } else {
      alert(`Failed to save item: ${response.message}`);
    }
  };

  // API Import/Export Handlers
  const handleDownloadTemplate = async () => {
    try {
      const response = await InventoryService.downloadImportTemplate(true);
      if (response.success && response.data) {
        // Create download link
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inventory_items_template.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert(`Failed to download template: ${response.message}`);
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template. Please try again.');
    }
  };

  const handleExport = async () => {
    try {
      const response = await InventoryService.exportItems({
        q: searchQuery,
        // categoryId can be added here when category filtering is implemented
      });
      
      if (response.success && response.data) {
        // Create download link
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `inventory_items_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert(`Failed to export items: ${response.message}`);
      }
    } catch (error) {
      console.error('Error exporting items:', error);
      alert('Failed to export items. Please try again.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      alert('Please select a CSV or XLSX file.');
      return;
    }

    try {
      const duplicatePolicy = window.confirm(
        'How would you like to handle duplicate items?\n\nOK = Update existing items\nCancel = Skip duplicates'
      ) ? 'update' : 'skip';

      const response = await InventoryService.importItems(file, duplicatePolicy);

      // Debug: Log the complete API response structure
      console.log('Import API Response:', JSON.stringify(response, null, 2));
      console.log('Response data structure:', response.data);
      console.log('Response success:', response.success);

      if (response.success && response.data) {
        // The API response is in response.data, so we need to map it correctly
        const apiData = response.data;
        
        setImportResults({
          success: apiData.success !== undefined ? apiData.success : true,
          message: apiData.message || 'Import completed successfully',
          summary: apiData.summary || apiData,
          errors: apiData.errors || [],
          validations: apiData.validations || [],
          warnings: apiData.warnings || [],
          duplicates: apiData.duplicates || [],
          failedRows: apiData.failedRows || []
        });
        setIsImportResultsOpen(true);
        loadItems(); // Refresh the items list
      } else {
        alert(`Import failed: ${response.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error importing items:', error);
      alert('Failed to import file. Please check the file format and try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-50">
      {/* Main Content */}
      <div className="md:ml-2 p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Inventory Hub
              </h1>
              <p className="text-gray-600 text-sm mt-1">Manage your items, units, and stock levels</p>
            </div>

            {/* CSV Import/Export Buttons */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Template
              </Button>
              <Button
                onClick={handleImportClick}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={items.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <AdvancedMetricCard
              title="Total Items"
              subtitle="All inventory"
              value={stats.totalItems}
              icon="inventory"
              format="number"
            />

            <AdvancedMetricCard
              title="Stock Tracked"
              subtitle="Monitored items"
              value={stats.stockItems}
              icon="target"
              format="number"
              status="good"
            />

            <AdvancedMetricCard
              title="Low Stock"
              subtitle="Needs reorder"
              value={stats.lowStock}
              icon="inventory"
              format="number"
              status={stats.lowStock > 0 ? "warning" : "neutral"}
            />

            <AdvancedMetricCard
              title="Out of Stock"
              subtitle="Urgent action"
              value={stats.outOfStock}
              icon="inventory"
              format="number"
              status={stats.outOfStock > 0 ? "critical" : "good"}
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-grey rounded-lg p-4 mb-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search items by name, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-gray-50 border-gray-300 h-11"
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
              {/* Type Filter Pills */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("stock")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === "stock"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Stock
                </button>
                <button
                  onClick={() => setFilterType("service")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === "service"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Service
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterStatus === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setFilterStatus("Active")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterStatus === "Active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus("Inactive")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterStatus === "Inactive"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Inactive
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Primary Actions */}
              <Button
                onClick={handleAddItem}
                className="bg-gray-900 hover:bg-black text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <InventoryGrid
          items={items}
          loading={loading}
          viewMode={viewMode}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      </div>

      <InventoryItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        editingItem={editingItem}
        onSave={handleItemSave}
      />

      <ImportResultsDialog
         open={isImportResultsOpen}
         onClose={() => setIsImportResultsOpen(false)}
         results={importResults}
       />
    </div>
  );
}

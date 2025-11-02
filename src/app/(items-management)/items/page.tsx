"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Plus, Upload, Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import InventoryItemModal from "./_components/inventory-item-modal";
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
      console.log('Loaded items from API:', filteredItems.map(item => ({
        name: item.name,
        type: item.type,
        trackStock: item.trackStock,
        quantity: item.quantity,
        reorderPoint: item.reorderPoint
      })));

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
      lowStock: itemsList.filter(i => i.quantity && i.reorderPoint && i.quantity <= i.reorderPoint).length,
      outOfStock: itemsList.filter(i => i.quantity === 0).length,
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
        <EnhancedActionBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search items by name, SKU, or barcode..."
          filters={[
            {
              options: [
                { label: "All", value: "all" },
                { label: "Stock", value: "stock" },
                { label: "Service", value: "service" },
              ],
              activeValue: filterType,
              onChange: (value) => setFilterType(value as "all" | "stock" | "service"),
            },
            {
              options: [
                { label: "All Status", value: "all" },
                { label: "Active", value: "Active", color: "green" },
                { label: "Inactive", value: "Inactive", color: "red" },
              ],
              activeValue: filterStatus,
              onChange: (value) => setFilterStatus(value as "all" | "Active" | "Inactive"),
            },
          ]}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={true}
          onPrimaryAction={handleAddItem}
          primaryActionLabel="Add Item"
          primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
        />

        {/* Inventory Grid */}
        <ResponsiveGrid<InventoryItem>
          items={items}
          loading={loading}
          loadingText="Loading inventory..."
          viewMode={viewMode}
          emptyIcon={<Package className="h-16 w-16 text-gray-300" />}
          emptyTitle="No items found"
          emptyDescription="Start by adding your first inventory item"
          getItemId={(item) => item._id || item.id || ""}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          columns={[
            {
              key: "name",
              header: "Item",
              render: (item) => (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.categoryId && (
                      <div className="text-xs text-gray-500">
                        {typeof item.categoryId === 'object' && item.categoryId.name
                          ? item.categoryId.name
                          : typeof item.categoryId === 'string' ? item.categoryId : ''}
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: "sku",
              header: "SKU",
              render: (item) => (
                <span className="text-gray-700 font-mono text-sm">{item.sku || "—"}</span>
              ),
            },
            {
              key: "type",
              header: "Type",
              render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.type === "stock"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {item.type}
                </span>
              ),
            },
            {
              key: "baseUnit",
              header: "Unit",
              render: (item) => <span className="text-gray-700">{item.baseUnit}</span>,
            },
            {
              key: "quantity",
              header: "Stock",
              render: (item) => (
                (item.type === "stock" || item.trackStock) ? (
                  <span className="text-gray-900 font-medium">{item.quantity || 0}</span>
                ) : (
                  <span className="text-gray-400">—</span>
                )
              ),
            },
            {
              key: "isActive",
              header: "Status",
              render: (item) => {
                const isActive = item.isActive !== false;
                return (
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isActive ? "text-green-600" : "text-red-600"}`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                );
              },
            },
          ]}
          renderGridCard={(item, actions) => {
            const itemStatus = item.isActive !== false ? { label: "Active", color: "text-green-600 bg-green-50" } : { label: "Inactive", color: "text-red-600 bg-red-50" };
            const stockStatus =
              item.type !== "stock" && !item.trackStock
                ? { label: "Not Tracked", color: "text-gray-600 bg-gray-50" }
                : item.quantity === 0
                ? { label: "Out of Stock", color: "text-red-600 bg-red-50" }
                : item.reorderPoint && item.quantity && item.quantity <= item.reorderPoint
                ? { label: "Low Stock", color: "text-yellow-600 bg-yellow-50" }
                : { label: "In Stock", color: "text-green-600 bg-green-50" };

            return (
              <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
                {/* Card Header - Icon */}
                <div className="relative h-32 bg-gray-50 flex items-center justify-center border-b border-gray-200">
                  <Package className="h-12 w-12 text-gray-300" />

                  {/* Type Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === "stock"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {item.type}
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 background-grey opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                    {actions}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
                  {item.sku && (
                    <p className="text-xs text-gray-500 font-mono mb-3">{item.sku}</p>
                  )}

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4">
                    {/* Item Status */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${itemStatus.color}`}>
                        {itemStatus.label}
                      </span>
                    </div>

                    {/* Stock Status */}
                    {item.trackStock && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Stock Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </div>
                    )}

                    {/* Category */}
                    {item.categoryId && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="text-gray-700 text-xs truncate max-w-[120px]">
                          {typeof item.categoryId === 'object' && item.categoryId.name
                            ? item.categoryId.name
                            : typeof item.categoryId === 'string' ? item.categoryId : ''}
                        </span>
                      </div>
                    )}

                    {/* Unit */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Unit:</span>
                      <span className="text-gray-900 font-medium">{item.baseUnit}</span>
                    </div>

                    {/* Current Stock Quantity */}
                    {(item.type === "stock" || item.trackStock) && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="text-gray-900 font-bold text-lg">{item.quantity || 0} {item.baseUnit}</span>
                      </div>
                    )}
                  </div>

                  {/* Reorder Point Info */}
                  {(item.type === "stock" || item.trackStock) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-600">
                          {item.reorderPoint ? 'Stock Level' : 'Current Stock'}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {item.quantity !== undefined ? item.quantity : 'N/A'} {item.baseUnit}
                          {item.reorderPoint && ` / ${item.reorderPoint} (threshold)`}
                        </span>
                      </div>

                      {/* Progress bar */}
                      {item.reorderPoint && (
                        <>
                          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                (item.quantity || 0) <= item.reorderPoint
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(((item.quantity || 0) / (item.reorderPoint * 2)) * 100, 100)}%`,
                              }}
                            ></div>
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-yellow-500"
                              style={{ left: '50%' }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span className="text-yellow-600">← Threshold</span>
                            <span>{item.reorderPoint * 2}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }}
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

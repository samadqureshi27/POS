"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Plus, Upload, Download, FileDown, Edit2, Trash2 } from "lucide-react";
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
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(21);
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
      // Use pagination parameters instead of loading everything
      page: currentPage,
      limit: itemsPerPage,
      sort: "createdAt",
      order: "desc"
    };
    if (searchQuery) params.q = searchQuery;
    if (filterType !== "all") params.type = filterType;

    const response = await InventoryService.listItems(params);

    if (response.success && response.data) {
      let filteredItems = response.data;
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
  }, [currentPage, searchQuery, filterType, filterStatus]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
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
          customActions={(item) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditItem(item)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteItem(item)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          // Pagination props
          showPagination={true}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={stats.totalItems}
          totalPages={Math.max(1, Math.ceil((stats.totalItems || 0) / itemsPerPage))}
          onPageChange={(page) => {
            setCurrentPage(page);
            // Smoothly scroll to top when page changes
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          columns={[
            {
              key: "name",
              header: "Item",
              render: (item) => (
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                    item.type === "stock"
                      ? "bg-green-50 border-green-200"
                      : "bg-purple-50 border-purple-200"
                  }`}>
                    <Package className={`h-5 w-5 ${
                      item.type === "stock" ? "text-green-600" : "text-purple-600"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
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
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  item.type === "stock"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {item.type}
                </span>
              ),
              className: "w-28",
            },
            {
              key: "baseUnit",
              header: "Unit",
              render: (item) => <span className="text-gray-700 font-medium">{item.baseUnit}</span>,
              className: "w-24",
            },
            {
              key: "quantity",
              header: "Stock",
              render: (item) => (
                (item.type === "stock" || item.trackStock) ? (
                  <span className="text-gray-900 font-semibold">{item.quantity || 0}</span>
                ) : (
                  <span className="text-gray-400">—</span>
                )
              ),
              className: "w-24",
            },
            {
              key: "isActive",
              header: "Status",
              render: (item) => {
                const isActive = item.isActive !== false;
                return (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                );
              },
              className: "w-28",
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
            const isActive = item.isActive !== false;

            return (
              <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
                {/* Card Header with Gradient Background */}
                <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                  item.type === "stock"
                    ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                    : "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                }`}>
                  <Package className={`h-14 w-14 ${
                    item.type === "stock" ? "text-green-400" : "text-purple-400"
                  }`} />

                  {/* Status Badge - Top Left */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                    isActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}>
                    {itemStatus.label}
                  </div>

                  {/* Type Badge - Top Right */}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                    item.type === "stock"
                      ? "bg-green-600 text-white"
                      : "bg-purple-600 text-white"
                  }`}>
                    {item.type}
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                    {actions}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Item Name */}
                  <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.name}>
                    {item.name}
                  </h3>

                  {/* SKU & Category */}
                  <div className="mb-3 min-h-[2.5rem] space-y-1">
                    {item.sku && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">SKU:</span> {item.sku}
                      </p>
                    )}
                    {item.categoryId ? (
                      <p className="text-xs text-gray-600 truncate">
                        <span className="font-medium">Category:</span> {typeof item.categoryId === 'object' && item.categoryId.name
                          ? item.categoryId.name
                          : typeof item.categoryId === 'string' ? item.categoryId : 'Uncategorized'}
                      </p>
                    ) : !item.sku && (
                      <p className="text-xs text-gray-400 italic">
                        No SKU or category assigned
                      </p>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 mb-3">
                    {/* Unit Badge */}
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${
                        item.type === "stock" ? "bg-green-100" : "bg-purple-100"
                      }`}>
                        <span className={`text-xs font-bold ${
                          item.type === "stock" ? "text-green-700" : "text-purple-700"
                        }`}>
                          {item.baseUnit?.slice(0, 3)}
                        </span>
                      </div>
                    </div>

                    {/* Stock Quantity */}
                    <div className="text-xs text-gray-500">
                      {(item.type === "stock" || item.trackStock) ? (
                        <div className="text-right">
                          <div className={`font-semibold ${
                            stockStatus.label === "Out of Stock" ? "text-red-600" :
                            stockStatus.label === "Low Stock" ? "text-yellow-600" :
                            "text-green-600"
                          }`}>
                            {item.quantity || 0} {item.baseUnit}
                          </div>
                        </div>
                      ) : (
                        <span className="italic">Service Item</span>
                      )}
                    </div>
                  </div>

                  {/* Stock Threshold Progress Bar */}
                  {(item.type === "stock" || item.trackStock) && item.reorderPoint && (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-600 font-medium">Stock Level</span>
                        <span className="text-gray-900 font-bold">
                          {item.quantity || 0} / {item.reorderPoint}
                        </span>
                      </div>
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
                        {/* Threshold marker */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-yellow-500"
                          style={{ left: '50%' }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span className="text-yellow-600 font-medium">Threshold</span>
                        <span>{item.reorderPoint * 2}</span>
                      </div>
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

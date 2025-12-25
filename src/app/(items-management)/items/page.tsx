"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Plus, Upload, Download, FileDown, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import { StatCardsGrid } from "@/components/ui/stat-cards-grid";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import InventoryItemModal from "./_components/inventory-item-modal";
import ImportResultsDialog from "./_components/import-results-dialog";
import { InventoryService, type InventoryItem } from "@/lib/services/inventory-service";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import { logError } from "@/lib/util/logger";

export default function ItemsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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

  // Confirmation Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [duplicatePolicyDialogOpen, setDuplicatePolicyDialogOpen] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalItems: 0,
    stockItems: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  // Load items and stats
  const loadItems = async (showLoadingSkeleton = true) => {
    if (showLoadingSkeleton) {
      setLoading(true);
    }
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
      logError("Failed to load items", new Error(response.message), {
        component: "ItemsManagement",
        action: "loadItems",
      });
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
    // Show loading skeleton only on initial load
    loadItems(isInitialLoad);
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
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

  const handleDeleteItem = (item: InventoryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const itemId = itemToDelete._id || itemToDelete.id;
    if (!itemId) {
      toast.error("Item ID is missing");
      return;
    }

    const response = await InventoryService.deleteItem(itemId);
    if (response.success) {
      toast.success(`Deleted "${itemToDelete.name}" successfully`, {
        duration: 5000,
        position: "top-right",
      });
      // Optimistic update: Remove item from local state
      setItems(prevItems => prevItems.filter(item => (item._id || item.id) !== itemId));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } else {
      toast.error(`Failed to delete item: ${response.message}`, {
        duration: 5000,
        position: "top-right",
      });
    }
  };

  const handleItemSave = async (data: Partial<InventoryItem>) => {
    console.log("🔥 handleItemSave called with data:", data);
    try {
      let response;
      if (editingItem) {
        const itemId = editingItem._id || editingItem.id;
        if (!itemId) {
          toast.error("Item ID is missing");
          return;
        }
        response = await InventoryService.updateItem(itemId, data);
      } else {
        response = await InventoryService.createItem(data);
      }

      console.log("API Response:", response);

      if (response.success) {
        // Show success toast FIRST
        const message = editingItem ? "Item updated successfully" : "Item added successfully";
        toast.success(message, {
          duration: 5000,
          position: "top-right",
        });

        // Close modal
        setIsItemModalOpen(false);

        // Reload items WITHOUT showing loading skeleton
        const params: any = {
          page: currentPage,
          limit: itemsPerPage,
          sort: "createdAt",
          order: "desc"
        };
        if (searchQuery) params.q = searchQuery;
        if (filterType !== "all") params.type = filterType;

        const itemsResponse = await InventoryService.listItems(params);

        if (itemsResponse.success && itemsResponse.data) {
          let filteredItems = itemsResponse.data;

          if (filterType !== "all") {
            filteredItems = filteredItems.filter(item => item.type === filterType);
          }

          if (filterStatus !== "all") {
            filteredItems = filteredItems.filter(item =>
              filterStatus === "Active" ? item.isActive !== false : item.isActive === false
            );
          }

          setItems(filteredItems);

          const statsResponse = await InventoryService.getStats();
          if (statsResponse.success && statsResponse.data) {
            setStats({
              totalItems: statsResponse.data.totalItems,
              stockItems: statsResponse.data.stockItems,
              lowStock: statsResponse.data.lowStock,
              outOfStock: statsResponse.data.outOfStock,
            });
          }
        }
      } else {
        toast.error(`Failed to save item: ${response.message}`);
      }
    } catch (error: any) {
      console.error("Error saving item:", error);
      toast.error(error?.message || "Failed to save item");
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
        toast.success('Template downloaded successfully');
      } else {
        toast.error(`Failed to download template: ${response.message}`);
      }
    } catch (error) {
      logError('Error downloading template', error, {
        component: "ItemsManagement",
        action: "handleDownloadTemplate",
      });
      toast.error('Failed to download template. Please try again.');
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
        toast.success('Items exported successfully');
      } else {
        toast.error(`Failed to export items: ${response.message}`);
      }
    } catch (error) {
      logError('Error exporting items', error, {
        component: "ItemsManagement",
        action: "handleExport",
      });
      toast.error('Failed to export items. Please try again.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast.error('Please select a CSV or XLSX file.');
      return;
    }

    // Store file and show duplicate policy dialog
    setPendingImportFile(file);
    setDuplicatePolicyDialogOpen(true);
  };

  const processImport = async (duplicatePolicy: 'update' | 'skip') => {
    if (!pendingImportFile) return;

    try {
      const response = await InventoryService.importItems(pendingImportFile, duplicatePolicy);

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
        toast.error(`Import failed: ${response.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      logError('Error importing items', error, {
        component: "ItemsManagement",
        action: "processImport",
      });
      toast.error('Failed to import file. Please check the file format and try again.');
    } finally {
      // Reset file input and pending file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setPendingImportFile(null);
    }
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showActionBar={true} />;
  }

  return (
    <PageContainer className="pt-6">
      <Toaster position="top-center" richColors expand={true} duration={3000} />
      <PageHeader
        title="Inventory Hub"
        titleClassName="text-2xl lg:text-3xl font-medium text-gray-800"
        subtitle="Manage your items, units, and stock levels"
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              onClick={handleDownloadTemplate}
              variant="filter"
              className="px-4"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Template
            </Button>
            <Button
              onClick={handleImportClick}
              variant="filter"
              className="px-4"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button
              onClick={handleExport}
              variant="filter"
              className="px-4"
              disabled={items.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </>
        }
      />

      {/* Stats Bar */}
      <StatCardsGrid>
        <AdvancedMetricCard
          title="Total Items"
          value={stats.totalItems}
          format="number"
        />

        <AdvancedMetricCard
          title="Stock Tracked"
          value={stats.stockItems}
          format="number"
        />

        <AdvancedMetricCard
          title="Low Stock"
          value={stats.lowStock}
          format="number"
        />

        <AdvancedMetricCard
          title="Out of Stock"
          value={stats.outOfStock}
          format="number"
        />
      </StatCardsGrid>

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
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${item.type === "stock"
                  ? "bg-green-50 border-green-200"
                  : "bg-purple-50 border-purple-200"
                  }`}>
                  <Package className={`h-5 w-5 ${item.type === "stock" ? "text-green-600" : "text-purple-600"
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
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.type === "stock"
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
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isActive
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
          const isStock = item.type === "stock" || item.trackStock;
          const status = isStock
            ? { label: "STOCK ITEM", color: "text-green-600 bg-green-50 border-green-100", bar: "bg-green-500" }
            : { label: "SERVICE ITEM", color: "text-purple-600 bg-purple-50 border-purple-100", bar: "bg-purple-500" };

          return (
            <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
              <div className={cn("h-0.5 w-full shrink-0 transition-colors", status.bar)} />

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    {item.sku || 'NO SKU'}
                  </span>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold tracking-widest border",
                    status.color
                  )}>
                    {status.label}
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <div className={cn(
                    "h-10 w-10 rounded-sm flex items-center justify-center shrink-0 border transition-colors",
                    isStock ? "bg-green-50/50 border-green-100/50 text-green-600" : "bg-purple-50/50 border-purple-100/50 text-purple-600"
                  )}>
                    <Package className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-gray-800 leading-tight truncate group-hover:text-black transition-colors" title={item.name}>
                        {item.name}
                      </h3>
                      <div className="flex lg:hidden items-center gap-1 shrink-0">
                        {actions}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight truncate">
                      {typeof item.categoryId === 'object' ? item.categoryId.name : item.categoryId || 'General'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Price</span>
                    <span className="text-sm font-bold text-gray-900 tracking-tight pr-2">
                      PKR {Number(item.sellingPrice || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    <div className="flex items-center gap-1">
                      {actions}
                    </div>
                  </div>

                  <div className="lg:hidden flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Inventory</span>
                    <span className={cn(
                      "text-xs font-bold font-mono",
                      isStock && (item.quantity || 0) <= (item.reorderPoint || 0) ? "text-red-600" : "text-gray-900"
                    )}>
                      {isStock ? `${item.quantity || 0} ${item.baseUnit || 'pcs'}` : 'SERVICE'}
                    </span>
                  </div>
                </div>

                {isStock && item.reorderPoint && (
                  <div className="mt-4">
                    <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          (item.quantity || 0) <= item.reorderPoint ? "bg-red-500" : "bg-green-500"
                        )}
                        style={{ width: `${Math.min(((item.quantity || 0) / (item.reorderPoint * 2)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />

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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item"
        description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      {/* Duplicate Policy Dialog */}
      <ConfirmDialog
        open={duplicatePolicyDialogOpen}
        onOpenChange={setDuplicatePolicyDialogOpen}
        title="Handle Duplicate Items"
        description="How would you like to handle duplicate items in the import file?"
        onConfirm={() => processImport('update')}
        onCancel={() => processImport('skip')}
        confirmText="Update Existing"
        cancelText="Skip Duplicates"
        variant="default"
      />
    </PageContainer>
  );
}

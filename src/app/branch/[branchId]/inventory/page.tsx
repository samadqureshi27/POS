"use client";

import React, { useState } from "react";
import { Package, Plus, Edit2, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { useBranchInventory } from "@/lib/hooks/useBranchInventory";
import BranchInventoryModal from "./_components/branch-inventory-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { BranchInventoryItem } from "@/lib/services/branch-inventory-service";

const BranchInventoryPage = () => {
  const params = useParams();
  const branchId = (params?.branchId as string) || "";

  const {
    // Data
    filteredItems,
    loading,
    actionLoading,
    stats,
    branchObjectId,

    // Filters
    searchQuery,
    setSearchQuery,
    stockStatusFilter,
    setStockStatusFilter,
    statusFilter,
    setStatusFilter,

    // Modal
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,

    // Actions
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
  } = useBranchInventory(branchId);

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(21);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BranchInventoryItem | null>(null);

  // Paginated items
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  const handleAddItem = () => {
    openCreateModal();
  };

  const handleEditItem = (item: BranchInventoryItem) => {
    openEditModal(item);
  };

  const handleDelete = (item: BranchInventoryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const itemId = itemToDelete._id || itemToDelete.id;
    if (!itemId) {
      return;
    }

    await handleDeleteItem(itemId);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showActionBar={true} />;
  }

  return (
    <PageContainer>
      <Toaster position="top-right" />

      <PageHeader
        title={`Inventory Management - Branch #${branchId}`}
        subtitle="Track and manage inventory items for this branch"
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdvancedMetricCard
          title="Total Items"
          subtitle="All inventory"
          value={stats.totalItems}
          icon="inventory"
          format="number"
        />

        <AdvancedMetricCard
          title="High Stock"
          subtitle="Well stocked"
          value={stats.highStock}
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

      {/* Action Bar */}
      <EnhancedActionBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search items by name or ID..."
        filters={[
          {
            options: [
              { label: "All", value: "all" },
              { label: "Low", value: "Low", color: "red" },
              { label: "Medium", value: "Medium", color: "yellow" },
              { label: "High", value: "High", color: "green" },
            ],
            activeValue: stockStatusFilter,
            onChange: (value) => setStockStatusFilter(value as "all" | "Low" | "Medium" | "High"),
          },
          {
            options: [
              { label: "All Status", value: "all" },
              { label: "Active", value: "Active", color: "green" },
              { label: "Inactive", value: "Inactive", color: "red" },
            ],
            activeValue: statusFilter,
            onChange: (value) => setStatusFilter(value as "all" | "Active" | "Inactive"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={handleAddItem}
        primaryActionLabel="Add Item"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
        primaryActionDisabled={!branchObjectId || loading}
      />

      {/* Inventory Grid */}
      <ResponsiveGrid<BranchInventoryItem>
        items={paginatedItems}
        loading={loading}
        loadingText="Loading inventory..."
        viewMode={viewMode}
        emptyIcon={<Package className="h-16 w-16 text-gray-300" />}
        emptyTitle="No items found"
        emptyDescription="Start by adding your first inventory item"
        getItemId={(item) => item._id || item.id || ""}
        onEdit={handleEditItem}
        onDelete={handleDelete}
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
              onClick={() => handleDelete(item)}
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
        totalItems={filteredItems.length}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        columns={[
          {
            key: "item",
            header: "Item",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                  item.stockStatus === "High"
                    ? "bg-green-50 border-green-200"
                    : item.stockStatus === "Medium"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <Package className={`h-5 w-5 ${
                    item.stockStatus === "High" ? "text-green-600" :
                    item.stockStatus === "Medium" ? "text-yellow-600" :
                    "text-red-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.itemName || `Item ${item.itemId}`}</div>
                  <div className="text-xs text-gray-500">ID: {item.itemId}</div>
                </div>
              </div>
            ),
          },
          {
            key: "quantity",
            header: "Quantity",
            render: (item) => (
              <span className="text-gray-900 font-semibold">{item.quantity || 0}</span>
            ),
            className: "w-28",
          },
          {
            key: "reorderPoint",
            header: "Reorder Point",
            render: (item) => (
              <span className="text-gray-700">{item.reorderPoint || 0}</span>
            ),
            className: "w-32",
          },
          {
            key: "stockStatus",
            header: "Stock Status",
            render: (item) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.stockStatus === "High"
                  ? "bg-green-100 text-green-700"
                  : item.stockStatus === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {item.stockStatus}
              </span>
            ),
            className: "w-32",
          },
          {
            key: "status",
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
          const isActive = item.isActive !== false;
          const stockStatus = item.stockStatus || "Low";

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                stockStatus === "High"
                  ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                  : stockStatus === "Medium"
                  ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
                  : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
              }`}>
                <Package className={`h-14 w-14 ${
                  stockStatus === "High" ? "text-green-400" :
                  stockStatus === "Medium" ? "text-yellow-400" :
                  "text-red-400"
                }`} />

                {/* Status Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {isActive ? "Active" : "Inactive"}
                </div>

                {/* Stock Status Badge - Top Right */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  stockStatus === "High"
                    ? "bg-green-600 text-white"
                    : stockStatus === "Medium"
                    ? "bg-yellow-600 text-white"
                    : "bg-red-600 text-white"
                }`}>
                  {stockStatus}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Item Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.itemName || `Item ${item.itemId}`}>
                  {item.itemName || `Item ${item.itemId}`}
                </h3>

                {/* Item ID */}
                <div className="mb-3 min-h-[1.5rem]">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Item ID:</span> {item.itemId}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 mb-3">
                  {/* Quantity Badge */}
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center h-7 px-3 rounded-lg ${
                      stockStatus === "High" ? "bg-green-100" :
                      stockStatus === "Medium" ? "bg-yellow-100" :
                      "bg-red-100"
                    }`}>
                      <span className={`text-xs font-bold ${
                        stockStatus === "High" ? "text-green-700" :
                        stockStatus === "Medium" ? "text-yellow-700" :
                        "text-red-700"
                      }`}>
                        Qty: {item.quantity || 0}
                      </span>
                    </div>
                  </div>

                  {/* Reorder Point */}
                  <div className="text-xs text-gray-500">
                    <div className="text-right">
                      <div className="text-gray-600 font-medium">
                        Reorder: {item.reorderPoint || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Progress Bar */}
                {(item.reorderPoint || item.minStock) && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-600 font-medium">Stock Level</span>
                      <span className="text-gray-900 font-bold">
                        {item.quantity || 0} / {item.reorderPoint || item.minStock || 0}
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          (item.quantity || 0) <= (item.reorderPoint || item.minStock || 0)
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(((item.quantity || 0) / ((item.reorderPoint || item.minStock || 0) * 2)) * 100, 100)}%`,
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
                      <span>{(item.reorderPoint || item.minStock || 0) * 2}</span>
                    </div>
                  </div>
                )}

                {/* Price Information */}
                {(item.costPerUnit || item.sellingPrice) && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-3 text-xs">
                    {item.costPerUnit && (
                      <div className="text-gray-600">
                        <span className="font-medium">Cost:</span> ${item.costPerUnit.toFixed(2)}
                      </div>
                    )}
                    {item.sellingPrice && (
                      <div className="text-gray-900 font-semibold">
                        <span className="font-medium">Price:</span> ${item.sellingPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />

      {/* Branch Inventory Modal */}
      <BranchInventoryModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        branchObjectId={branchObjectId}
        onClose={closeModal}
        onSave={async (data) => {
          if (editingItem) {
            const itemId = editingItem._id || editingItem.id;
            if (itemId) {
              await handleUpdateItem(itemId, data);
            }
          } else {
            await handleCreateItem(data);
          }
        }}
        actionLoading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item"
        description={`Are you sure you want to delete "${itemToDelete?.itemName || 'this item'}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </PageContainer>
  );
};

export default BranchInventoryPage;

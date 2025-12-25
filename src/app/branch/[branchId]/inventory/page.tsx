"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Edit2, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "sonner";
import { useBranchInventory } from "@/lib/hooks/useBranchInventory";
import BranchInventoryModal from "./_components/branch-inventory-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import type { BranchInventoryItem } from "@/lib/services/branch-inventory-service";
import { BranchService } from "@/lib/services/branch-service";

const BranchInventoryPage = () => {
  const params = useParams();
  const branchId = (params?.branchId as string) || "";

  // Branch name state
  const [branchName, setBranchName] = useState<string>("");

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

  // Fetch branch name
  useEffect(() => {
    const fetchBranchName = async () => {
      if (!branchId) return;

      try {
        const response = await BranchService.getBranch(branchId);
        if (response.success && response.data?.name) {
          setBranchName(response.data.name);
        }
      } catch (error) {
        console.error("Error fetching branch name:", error);
      }
    };

    fetchBranchName();
  }, [branchId]);

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
        title={`Inventory Management - ${branchName || `Branch #${branchId}`}`}
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
              { label: "Medium", value: "Medium", color: "blue" },
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
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${item.stockStatus === "High"
                    ? "bg-green-50 border-green-200"
                    : item.stockStatus === "Medium"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-red-50 border-red-200"
                  }`}>
                  <Package className={`h-5 w-5 ${item.stockStatus === "High" ? "text-green-600" :
                      item.stockStatus === "Medium" ? "text-yellow-600" :
                        "text-red-600"
                    }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.itemName || `Item ${item.itemId}`}</div>
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
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.stockStatus === "High"
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
                <span className={cn(
                  "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                  isActive ? "text-green-600 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"
                )}>
                  {isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              );
            },
            className: "w-28",
          },
        ]}
        renderGridCard={(item, actions) => {
          const isStock = item.stockStatus !== undefined; // Branch inventory items usually have stockStatus
          const status = item.stockStatus === "High"
            ? { label: "STOCK ITEM", color: "text-green-600 bg-green-50 border-green-100", bar: "bg-green-500" }
            : item.stockStatus === "Medium"
              ? { label: "LOW STOCK", color: "text-yellow-600 bg-yellow-50 border-yellow-100", bar: "bg-yellow-500" }
              : { label: "OUT OF STOCK", color: "text-red-600 bg-red-50 border-red-100", bar: "bg-red-500" };

          return (
            <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
              <div className={cn("h-0.5 w-full shrink-0", status.bar)} />

              <div className="p-4 flex flex-col flex-1">
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    ID: {item.itemId?.slice(-6).toUpperCase() || 'N/A'}
                  </span>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold tracking-widest border",
                    status.color
                  )}>
                    {status.label}
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex items-start gap-3 mb-6">
                  <div className={cn(
                    "h-10 w-10 rounded-sm flex items-center justify-center shrink-0 border transition-colors",
                    item.stockStatus === "High" ? "bg-green-50/50 border-green-100/50 text-green-600" :
                      item.stockStatus === "Medium" ? "bg-yellow-50/50 border-yellow-100/50 text-yellow-600" :
                        "bg-red-50/50 border-red-100/50 text-red-600"
                  )}>
                    <Package className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-gray-800 leading-tight truncate group-hover:text-black transition-colors" title={item.itemName}>
                        {item.itemName || `Item ${item.itemId}`}
                      </h3>
                      <div className="flex lg:hidden items-center gap-1 shrink-0">
                        {actions}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight truncate">
                      {(item as any).categoryId || 'Branch Inventory'}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Quantity</span>
                    <span className="text-sm font-bold text-gray-900 tracking-tight">
                      {item.quantity || 0} <span className="text-[10px] font-medium text-gray-400">pcs</span>
                    </span>
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    <div className="flex items-center gap-1">
                      {actions}
                    </div>
                  </div>

                  <div className="lg:hidden flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Value</span>
                    <span className="text-xs font-bold text-gray-900">
                      PKR {Number(item.sellingPrice || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {(item.reorderPoint || item.minStock) && (
                  <div className="mt-4">
                    <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          (item.quantity || 0) <= (item.reorderPoint || item.minStock || 0) ? "bg-red-500" : "bg-green-500"
                        )}
                        style={{ width: `${Math.min(((item.quantity || 0) / ((item.reorderPoint || item.minStock || 0) * 2)) * 100, 100)}%` }}
                      />
                    </div>
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

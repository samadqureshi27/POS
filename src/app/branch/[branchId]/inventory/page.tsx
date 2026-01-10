"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";

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
  const [itemsPerPage] = useState<number>(24);

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
    <PageContainer hasSubmenu={true}>


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
                <div className={`h-10 w-10 rounded-sm flex items-center justify-center border ${item.stockStatus === "High"
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
                  <div className="font-medium text-gray-900">
                    {item.itemName || `Item ${typeof item.itemId === 'object' ? item.itemId._id : item.itemId}`}
                  </div>
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
          const isActive = item.isActive !== false;

          const status = item.stockStatus === "High"
            ? { label: "HIGH STOCK", color: "text-green-600 bg-green-50 border-green-100", bar: "bg-green-500", iconBg: "bg-green-50/50 border-green-100/50 text-green-600" }
            : item.stockStatus === "Medium"
              ? { label: "MEDIUM STOCK", color: "text-amber-600 bg-amber-50 border-amber-100", bar: "bg-amber-500", iconBg: "bg-amber-50/50 border-amber-100/50 text-amber-600" }
              : { label: "LOW STOCK", color: "text-red-600 bg-red-50 border-red-100", bar: "bg-red-500", iconBg: "bg-red-50/50 border-red-100/50 text-red-600" };

          // Calculate threshold bar
          const quantity = item.quantity || 0;
          const reorderPoint = item.reorderPoint || item.minStock || 0;
          const hasThreshold = reorderPoint > 0;

          // Calculate fill percentage (max 100%)
          const fillPercentage = hasThreshold
            ? Math.min((quantity / (reorderPoint * 2)) * 100, 100)
            : 0;

          // Determine threshold status and color
          let thresholdColor = status.bar;

          if (hasThreshold && isActive) {
            if (quantity === 0) {
              thresholdColor = 'bg-red-500';
            } else if (quantity <= reorderPoint) {
              thresholdColor = 'bg-amber-500';
            } else {
              thresholdColor = 'bg-green-500';
            }
          }

          // Extract purchase unit from populated item data if available
          const purchaseUnit = typeof item.itemId === 'object' && item.itemId !== null
            ? (item.itemId as any).purchaseUnit
            : (item as any).item?.purchaseUnit || (item as any).purchaseUnit;

          const baseUnit = typeof item.itemId === 'object' && item.itemId !== null
            ? (item.itemId as any).baseUnit
            : (item as any).item?.baseUnit || (item as any).baseUnit || 'pcs';

          return (
            <div className={cn(
              "group relative border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200",
              isActive ? "bg-white" : "bg-gray-50/30 opacity-75"
            )}>
              {/* Threshold Bar - Dynamic based on stock level */}
              {hasThreshold && isActive ? (
                <div className="h-1 w-full shrink-0 bg-gray-100/80 relative overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-500 ease-out", thresholdColor)}
                    style={{ width: `${fillPercentage}%` }}
                  />
                  {/* Reorder point indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-gray-900/20"
                    style={{ left: '50%' }}
                  />
                </div>
              ) : (
                <div className={cn("h-0.5 w-full shrink-0", status.bar)} />
              )}

              <div className="p-4 flex flex-col flex-1">
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    {typeof item.itemId === 'string'
                      ? item.itemId.slice(-6).toUpperCase()
                      : typeof item.itemId === 'object' && item.itemId._id
                        ? item.itemId._id.slice(-6).toUpperCase()
                        : 'N/A'}
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
                    status.iconBg
                  )}>
                    <Package className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className={cn(
                        "text-sm font-bold leading-tight truncate group-hover:text-black transition-colors",
                        isActive ? "text-gray-800" : "text-gray-500"
                      )} title={item.itemName}>
                        {item.itemName || `Item ${typeof item.itemId === 'string' ? item.itemId : item.itemId?._id || 'Unknown'}`}
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

                {/* Footer Metrics */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Stock</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-gray-900 tracking-tight">
                        {item.quantity || 0} {baseUnit}
                      </span>
                      {purchaseUnit && purchaseUnit !== baseUnit && (
                        <span className="text-[10px] font-bold text-gray-400">
                          ({purchaseUnit})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    <div className="flex items-center gap-1">
                      {actions}
                    </div>
                  </div>

                  <div className="lg:hidden flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Reorder</span>
                    <span className="text-xs font-bold text-gray-900">
                      {item.reorderPoint || item.minStock || 0}
                    </span>
                  </div>
                </div>
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

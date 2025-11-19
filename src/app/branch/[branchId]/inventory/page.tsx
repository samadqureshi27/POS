"use client";

import React, { useState, useMemo } from "react";
import { Package, Plus, Edit2, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { useInventoryManagement } from "@/lib/hooks/inventoryManagement";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import InventoryModal from "./_components/inventory-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const InventoryManagementPage = () => {
  const params = useParams();
  const branchId = parseInt(params?.branchId as string) || 1;
  const { showToast } = useToast();

  const {
    // State
    inventoryItems,
    filteredItems,
    searchTerm,
    statusFilter,
    loading,
    actionLoading,
    statistics,
    // Selection
    selectedItems,
    // Modal
    isModalOpen,
    editingItem,
    formData,
    // Actions
    setSearchTerm,
    setStatusFilter,
    handleSelectAll,
    handleSelectItem,
    openCreateModal,
    openEditModal,
    closeModal,
    handleDeleteSelected,
    handleModalSubmit,
    updateFormData,
  } = useInventoryManagement(branchId);

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(21);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Calculate enhanced statistics
  const enhancedStats = useMemo(() => {
    const totalItems = inventoryItems.length;
    const lowStock = inventoryItems.filter(i => i.Status === "Low").length;
    const outOfStock = inventoryItems.filter(i => i.UpdatedStock === 0).length;
    const mediumStock = inventoryItems.filter(i => i.Status === "Medium").length;
    const highStock = inventoryItems.filter(i => i.Status === "High").length;

    return {
      totalItems,
      lowStock,
      outOfStock,
      mediumStock,
      highStock
    };
  }, [inventoryItems]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  const handleAddItem = () => {
    openCreateModal();
  };

  const handleEditItem = (item: any) => {
    openEditModal(item);
  };

  const handleDeleteItem = () => {
    if (selectedItems.length === 0) {
      showToast("Please select items to delete", "warning");
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    await handleDeleteSelected();
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showActionBar={true} hasSubmenu={true} />;
  }

  return (
    <PageContainer hasSubmenu={true}>
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
          value={enhancedStats.totalItems}
          icon="inventory"
          format="number"
        />

        <AdvancedMetricCard
          title="High Stock"
          subtitle="Well stocked"
          value={enhancedStats.highStock}
          icon="target"
          format="number"
          status="good"
        />

        <AdvancedMetricCard
          title="Low Stock"
          subtitle="Needs reorder"
          value={enhancedStats.lowStock}
          icon="inventory"
          format="number"
          status={enhancedStats.lowStock > 0 ? "warning" : "neutral"}
        />

        <AdvancedMetricCard
          title="Out of Stock"
          subtitle="Urgent action"
          value={enhancedStats.outOfStock}
          icon="inventory"
          format="number"
          status={enhancedStats.outOfStock > 0 ? "critical" : "good"}
        />
      </div>

      {/* Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search items by name, supplier, or unit..."
        filters={[
          {
            options: [
              { label: "All Status", value: "" },
              { label: "Low", value: "Low", color: "red" },
              { label: "Medium", value: "Medium", color: "default" },
              { label: "High", value: "High", color: "green" },
            ],
            activeValue: statusFilter,
            onChange: (value) => setStatusFilter(value as "" | "Low" | "Medium" | "High"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={handleAddItem}
        primaryActionLabel="Add Item"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
        secondaryActions={
          selectedItems.length > 0 ? (
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
              disabled={selectedItems.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          ) : undefined
        }
      />

      {/* Inventory Grid */}
      <ResponsiveGrid<any>
        items={paginatedItems}
        loading={loading}
        loadingText="Loading inventory..."
        viewMode={viewMode}
        emptyIcon={<Package className="h-16 w-16 text-gray-300" />}
        emptyTitle="No items found"
        emptyDescription="Start by adding your first inventory item"
        getItemId={(item) => item.ID}
        onEdit={handleEditItem}
        onDelete={(item) => {
          handleSelectItem(item.ID, true);
          setDeleteDialogOpen(true);
        }}
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
              onClick={() => {
                handleSelectItem(item.ID, true);
                setDeleteDialogOpen(true);
              }}
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
            key: "name",
            header: "Item",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                  item.Status === "High"
                    ? "bg-green-50 border-green-200"
                    : item.Status === "Medium"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <Package className={`h-5 w-5 ${
                    item.Status === "High" ? "text-green-600" :
                    item.Status === "Medium" ? "text-yellow-600" :
                    "text-red-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.Name}</div>
                  {item.supplier && (
                    <div className="text-xs text-gray-500">{item.supplier}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "unit",
            header: "Unit",
            render: (item) => (
              <span className="text-gray-700 font-medium">{item.Unit || "—"}</span>
            ),
            className: "w-24",
          },
          {
            key: "stock",
            header: "Stock",
            render: (item) => (
              <span className="text-gray-900 font-semibold">{item.UpdatedStock || 0}</span>
            ),
            className: "w-24",
          },
          {
            key: "threshold",
            header: "Threshold",
            render: (item) => (
              <span className="text-gray-700">{item.Threshold || 0}</span>
            ),
            className: "w-28",
          },
          {
            key: "status",
            header: "Status",
            render: (item) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.Status === "High"
                  ? "bg-green-100 text-green-700"
                  : item.Status === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {item.Status}
              </span>
            ),
            className: "w-28",
          },
        ]}
        renderGridCard={(item, actions) => {
          const stockStatus =
            item.UpdatedStock === 0
              ? { label: "Out of Stock", color: "text-red-600 bg-red-50" }
              : item.Status === "Low"
              ? { label: "Low Stock", color: "text-red-600 bg-red-50" }
              : item.Status === "Medium"
              ? { label: "Medium Stock", color: "text-yellow-600 bg-yellow-50" }
              : { label: "High Stock", color: "text-green-600 bg-green-50" };

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                item.Status === "High"
                  ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                  : item.Status === "Medium"
                  ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
                  : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
              }`}>
                <Package className={`h-14 w-14 ${
                  item.Status === "High" ? "text-green-400" :
                  item.Status === "Medium" ? "text-yellow-400" :
                  "text-red-400"
                }`} />

                {/* Status Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  item.Status === "High"
                    ? "bg-green-500 text-white"
                    : item.Status === "Medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {item.Status}
                </div>

                {/* Stock Badge - Top Right */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-gray-800 text-white">
                  {item.UpdatedStock} {item.Unit}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Item Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.Name}>
                  {item.Name}
                </h3>

                {/* Supplier */}
                <div className="mb-3 min-h-[1.5rem]">
                  {item.supplier && (
                    <p className="text-xs text-gray-600 truncate">
                      <span className="font-medium">Supplier:</span> {item.supplier}
                    </p>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 mb-3">
                  {/* Unit Badge */}
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center h-7 px-2 rounded-lg ${
                      item.Status === "High" ? "bg-green-100" :
                      item.Status === "Medium" ? "bg-yellow-100" :
                      "bg-red-100"
                    }`}>
                      <span className={`text-xs font-bold ${
                        item.Status === "High" ? "text-green-700" :
                        item.Status === "Medium" ? "text-yellow-700" :
                        "text-red-700"
                      }`}>
                        {item.Unit}
                      </span>
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div className="text-xs text-gray-500">
                    <div className="text-right">
                      <div className={`font-semibold ${
                        item.UpdatedStock === 0 ? "text-red-600" :
                        item.Status === "Low" ? "text-red-600" :
                        item.Status === "Medium" ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        Stock: {item.UpdatedStock}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Threshold Progress Bar */}
                {item.Threshold > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-600 font-medium">Stock Level</span>
                      <span className="text-gray-900 font-bold">
                        {item.UpdatedStock} / {item.Threshold}
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          item.UpdatedStock <= item.Threshold
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min((item.UpdatedStock / (item.Threshold * 2)) * 100, 100)}%`,
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
                      <span>{item.Threshold * 2}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        formData={formData}
        actionLoading={actionLoading}
        branchId={branchId}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        onFormDataChange={updateFormData}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Items"
        description={`Are you sure you want to delete ${selectedItems.length} item(s)? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </PageContainer>
  );
};

export default InventoryManagementPage;

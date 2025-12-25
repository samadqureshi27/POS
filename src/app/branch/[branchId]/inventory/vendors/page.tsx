"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Truck, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import VendorModal from "./_components/vendor-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useVendorManagement } from "@/lib/hooks/useVendors";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const VendorsPage = () => {
  const params = useParams();
  const branchId = parseInt(params?.branchId as string) || 1;
  const { showToast } = useToast();

  const {
    // State
    filteredItems,
    searchTerm,
    loading,
    actionLoading,
    statistics,
    // Selection
    selectedItems,
    isAllSelected,
    // Modal
    isModalOpen,
    editingItem,
    formData,
    // Actions
    setSearchTerm,
    handleSelectAll,
    handleSelectItem,
    openCreateModal,
    openEditModal,
    handleDeleteSelected,
    handleModalSubmit,
    updateFormData,
    closeModal,
  } = useVendorManagement(branchId);

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(21);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  // Enhanced action handlers
  const handleAddWithToast = () => {
    openCreateModal();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      showToast("Please select vendors to delete", "warning");
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    await handleDeleteSelected();
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={2} showActionBar={true} hasSubmenu={true} />;
  }

  if (!branchId) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Branch ID not found in URL parameters</p>
        </div>
      </div>
    );
  }

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      {/* Coming Soon Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center px-6 py-12 max-w-md">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <Truck className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Coming Soon</h1>
          <p className="text-lg text-gray-600 mb-2">Vendors & Suppliers</p>
          <p className="text-sm text-gray-500">
            This feature is currently under development and will be available soon.
          </p>
        </div>
      </div>

      {/* Original Content - Preserved but hidden */}
      <div className="hidden">
        <PageHeader
          title={`Vendors & Suppliers - Branch #${branchId}`}
          subtitle="Manage vendors and suppliers for inventory"
        />

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AdvancedMetricCard
            title="Total Vendors"
            subtitle="All suppliers"
            value={statistics.totalVendorsCount}
            icon="inventory"
            format="number"
          />

          <AdvancedMetricCard
            title="Active Orders"
            subtitle="Current orders"
            value={statistics.totalOrders}
            icon="target"
            format="number"
            status="good"
          />
        </div>

        {/* Action Bar */}
        <EnhancedActionBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search vendors by name or contact..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={true}
          onPrimaryAction={handleAddWithToast}
          primaryActionLabel="Add Vendor"
          primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
          secondaryActions={
            selectedItems.length > 0 ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteWithToast}
                className="h-[40px] px-4 rounded-sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedItems.length})
              </Button>
            ) : null
          }
        />

        {/* Vendors Grid */}
        <ResponsiveGrid<any>
          items={paginatedItems}
          loading={loading}
          loadingText="Loading vendors..."
          viewMode={viewMode}
          emptyIcon={<Truck className="h-16 w-16 text-gray-300" />}
          emptyTitle="No vendors found"
          emptyDescription="Start by adding your first vendor"
          getItemId={(item) => String(item.Vendor_ID)}
          onEdit={openEditModal}
          onDelete={(item) => {
            handleSelectItem(item.Vendor_ID, true);
            setDeleteDialogOpen(true);
          }}
          customActions={(item) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModal(item)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleSelectItem(item.Vendor_ID, true);
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
              header: "Vendor Name",
              render: (item) => (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm flex items-center justify-center border bg-blue-50/50 border-blue-100/50 text-blue-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900">{item.Vendor_Name}</div>
                    {item.Contact_Person && (
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate">{item.Contact_Person}</div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: "contact",
              header: "Contact",
              render: (item) => (
                <div className="text-sm font-bold text-gray-700">
                  {item.Phone_Number || item.Email || "—"}
                </div>
              ),
              className: "w-48",
            },
            {
              key: "orders",
              header: "Orders",
              render: (item) => (
                <span className="text-sm font-bold text-gray-900">
                  {item.Total_Orders || 0}
                </span>
              ),
              className: "w-24",
            },
          ]}
          renderGridCard={(item, actions) => {
            return (
              <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
                <div className="h-0.5 w-full shrink-0 bg-blue-500" />

                <div className="p-4 flex flex-col flex-1">
                  {/* ID & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-gray-400 tracking-wider">
                      VENDOR: {item.Vendor_ID?.toString().padStart(3, '0') || 'NEW'}
                    </span>
                    <div className="px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold tracking-widest border text-blue-600 bg-blue-50 border-blue-100">
                      ACTIVE
                    </div>
                  </div>

                  {/* Main Info */}
                  <div className="flex items-start gap-3 mb-6">
                    <div className="h-10 w-10 rounded-sm flex items-center justify-center shrink-0 border bg-blue-50/50 border-blue-100/50 text-blue-600 transition-colors">
                      <Truck className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-sm font-bold text-gray-800 leading-tight truncate group-hover:text-black transition-colors" title={item.Vendor_Name}>
                          {item.Vendor_Name}
                        </h3>
                        <div className="flex lg:hidden items-center gap-1 shrink-0">
                          {actions}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight truncate">
                        {item.Contact_Person || 'No Contact Person'}
                      </p>
                    </div>
                  </div>

                  {/* Footer Metrics */}
                  <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Orders</span>
                      <span className="text-sm font-bold text-gray-900 tracking-tight pr-2">
                        {item.Total_Orders || 0}
                      </span>
                    </div>

                    <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                      <div className="flex items-center gap-1">
                        {actions}
                      </div>
                    </div>

                    <div className="lg:hidden flex flex-col items-end">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Reference</span>
                      <span className="text-xs font-bold text-gray-900">
                        #{item.Vendor_ID}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        />

        {/* Vendor modal */}
        <VendorModal
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
          title="Delete Vendors"
          description={`Are you sure you want to delete ${selectedItems.length} vendor(s)? This action cannot be undone.`}
          onConfirm={confirmDelete}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      </div>
    </PageContainer>
  );
};

export default VendorsPage;

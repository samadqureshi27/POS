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
        onSecondaryAction={selectedItems.length > 0 ? handleDeleteWithToast : undefined}
        secondaryActionLabel="Delete Selected"
        secondaryActionDisabled={selectedItems.length === 0}
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
          handleSelectItem(item.Vendor_ID);
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
                handleSelectItem(item.Vendor_ID);
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
                <div className="h-10 w-10 rounded-lg flex items-center justify-center border bg-blue-50 border-blue-200">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.Vendor_Name}</div>
                  {item.Contact_Person && (
                    <div className="text-xs text-gray-500">{item.Contact_Person}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "contact",
            header: "Contact",
            render: (item) => (
              <div className="text-sm text-gray-700">
                {item.Phone_Number || item.Email || "—"}
              </div>
            ),
            className: "w-48",
          },
          {
            key: "orders",
            header: "Orders",
            render: (item) => (
              <span className="text-sm font-semibold text-gray-900">
                {item.Total_Orders || 0}
              </span>
            ),
            className: "w-24",
          },
        ]}
        renderGridCard={(item, actions) => {
          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className="relative h-28 flex items-center justify-center border-b-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <Truck className="h-14 w-14 text-blue-400" />

                {/* Orders Badge - Top Right */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-blue-600 text-white">
                  {item.Total_Orders || 0} Orders
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Vendor Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.Vendor_Name}>
                  {item.Vendor_Name}
                </h3>

                {/* Contact Details */}
                <div className="mb-3 min-h-[2.5rem] space-y-1">
                  {item.Contact_Person && (
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Contact:</span> {item.Contact_Person}
                    </p>
                  )}
                  {item.Phone_Number && (
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Phone:</span> {item.Phone_Number}
                    </p>
                  )}
                  {item.Email && (
                    <p className="text-xs text-gray-600 truncate">
                      <span className="font-medium">Email:</span> {item.Email}
                    </p>
                  )}
                </div>

                {/* Vendor Details */}
                {item.Address && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      <span className="font-medium">Address:</span> {item.Address}
                    </p>
                  </div>
                )}
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
    </PageContainer>
  );
};

export default VendorsPage;

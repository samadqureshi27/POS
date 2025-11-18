"use client";
import React, { useState, useMemo } from "react";
import { CreditCard, Plus, Edit2, Trash2 } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import PaymentModal from "./_components/payment-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { usePaymentManagement } from "@/lib/hooks/usePaymentManagement";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const PaymentManagementPage = () => {
  const { showToast } = useToast();
  const {
    // State
    filteredItems,
    searchTerm,
    statusFilter,
    taxTypeFilter,
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
    setStatusFilter,
    setTaxTypeFilter,
    handleSelectAll,
    handleSelectItem,
    openCreateModal,
    openEditModal,
    closeModal,
    handleDeleteSelected,
    handleModalSubmit,
    updateFormData,
    handleStatusChange,
  } = usePaymentManagement();

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
      showToast("Please select payment methods to delete", "warning");
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

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      <PageHeader
        title="Payment Management"
        subtitle="Manage payment methods and tax configurations"
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AdvancedMetricCard
          title="Active Methods"
          subtitle="Payment options"
          value={statistics.activeMethodsCount}
          icon="target"
          format="number"
          status="good"
        />

        <AdvancedMetricCard
          title="Most Used Tax"
          subtitle={`${statistics.mostUsedTaxType?.[1] || 0} methods`}
          value={statistics.mostUsedTaxType?.[0] || "N/A"}
          icon="inventory"
          format="text"
          status="neutral"
        />
      </div>

      {/* Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search payment methods..."
        filters={[
          {
            options: [
              { label: "All Tax Types", value: "" },
              { label: "Inclusive", value: "Inclusive", color: "green" },
              { label: "Exclusive", value: "Exclusive", color: "blue" },
            ],
            activeValue: taxTypeFilter,
            onChange: setTaxTypeFilter,
          },
          {
            options: [
              { label: "All Status", value: "" },
              { label: "Active", value: "Active", color: "green" },
              { label: "Inactive", value: "Inactive", color: "red" },
            ],
            activeValue: statusFilter,
            onChange: (value) => setStatusFilter(value as "" | "Active" | "Inactive"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={handleAddWithToast}
        primaryActionLabel="Add Payment Method"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
        onSecondaryAction={selectedItems.length > 0 ? handleDeleteWithToast : undefined}
        secondaryActionLabel="Delete Selected"
        secondaryActionDisabled={selectedItems.length === 0}
      />

      {/* Payment Methods Grid */}
      <ResponsiveGrid<any>
        items={paginatedItems}
        loading={loading}
        loadingText="Loading payment methods..."
        viewMode={viewMode}
        emptyIcon={<CreditCard className="h-16 w-16 text-gray-300" />}
        emptyTitle="No payment methods found"
        emptyDescription="Start by adding your first payment method"
        getItemId={(item) => String(item.ID)}
        onEdit={openEditModal}
        onDelete={(item) => {
          handleSelectItem(item.ID);
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
                handleSelectItem(item.ID);
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
            key: "id",
            header: "ID",
            render: (item) => (
              <span className="font-mono text-gray-700">{item.ID}</span>
            ),
            className: "w-20",
          },
          {
            key: "name",
            header: "Payment Method",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                  item.Status === "Active"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <CreditCard className={`h-5 w-5 ${
                    item.Status === "Active" ? "text-green-600" : "text-red-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.Name}</div>
                </div>
              </div>
            ),
          },
          {
            key: "taxType",
            header: "Tax Type",
            render: (item) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.Tax_Type === "Inclusive"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {item.Tax_Type}
              </span>
            ),
            className: "w-32",
          },
          {
            key: "taxRate",
            header: "Tax Rate",
            render: (item) => (
              <span className="text-sm font-semibold text-gray-900">
                {item.Tax_Rate}%
              </span>
            ),
            className: "w-28",
          },
          {
            key: "status",
            header: "Status",
            render: (item) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.Status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {item.Status}
              </span>
            ),
            className: "w-28",
          },
        ]}
        renderGridCard={(item, actions) => {
          const isActive = item.Status === "Active";
          const isInclusive = item.Tax_Type === "Inclusive";

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                isActive
                  ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                  : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
              }`}>
                <CreditCard className={`h-14 w-14 ${
                  isActive ? "text-green-400" : "text-red-400"
                }`} />

                {/* Status Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {item.Status}
                </div>

                {/* Tax Type Badge - Top Right */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isInclusive
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white"
                }`}>
                  {item.Tax_Type}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Payment Method Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.Name}>
                  {item.Name}
                </h3>

                {/* Tax Rate */}
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{item.Tax_Rate}%</span>
                    <span className="text-xs text-gray-500">Tax Rate</span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">ID:</span> {item.ID}
                  </p>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Payment modal */}
      <PaymentModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        formData={formData}
        actionLoading={actionLoading}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        onFormDataChange={updateFormData}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Payment Methods"
        description={`Are you sure you want to delete ${selectedItems.length} payment method(s)? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </PageContainer>
  );
};

export default PaymentManagementPage;

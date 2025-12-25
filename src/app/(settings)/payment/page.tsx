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
import { cn } from "@/lib/utils";
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
          format="number"
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
              { label: "All Types", value: "" },
              { label: "Cash", value: "Cash", color: "green" },
              { label: "Card", value: "Card", color: "blue" },
              { label: "Online", value: "Online", color: "purple" },
            ],
            activeValue: statusFilter,
            onChange: (value) => setStatusFilter(value as "" | "Cash" | "Card" | "Online"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={handleAddWithToast}
        primaryActionLabel="Add Payment Method"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
        secondaryActions={
          selectedItems.length > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteWithToast}
              disabled={selectedItems.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          ) : null
        }
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
          handleSelectItem(item.ID, true);
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
            key: "id",
            header: "ID",
            render: (item) => (
              <span className="font-mono text-[10px] font-bold text-gray-400 uppercase">{item.ID}</span>
            ),
            className: "w-20",
          },
          {
            key: "name",
            header: "Payment Method",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-sm flex items-center justify-center border",
                  item.Status === "Active" ? "bg-green-50/50 border-green-100/50 text-green-600" : "bg-red-50/50 border-red-100/50 text-red-600"
                )}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">{item.Name}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate">Payment Options</div>
                </div>
              </div>
            ),
          },
          {
            key: "taxType",
            header: "Tax Type",
            render: (item) => (
              <span className={cn(
                "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                item.Tax_Type === "Inclusive" ? "text-green-600 bg-green-50 border-green-100" : "text-blue-600 bg-blue-50 border-blue-100"
              )}>
                {item.Tax_Type?.toUpperCase()}
              </span>
            ),
            className: "w-32",
          },
          {
            key: "taxRate",
            header: "Tax Rate",
            render: (item) => (
              <span className="text-sm font-bold text-gray-900">
                {item.Tax_Rate}%
              </span>
            ),
            className: "w-28",
          },
          {
            key: "status",
            header: "Status",
            render: (item) => (
              <span className={cn(
                "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                item.Status === "Active" ? "text-green-600 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"
              )}>
                {item.Status?.toUpperCase()}
              </span>
            ),
            className: "w-28",
          },
        ]}
        renderGridCard={(item, actions) => {
          const isActive = item.Status === "Active";
          const isInclusive = item.Tax_Type === "Inclusive";
          const status = isActive
            ? { label: "ACTIVE", color: "text-green-600 bg-green-50 border-green-100", bar: "bg-green-500" }
            : { label: "INACTIVE", color: "text-red-600 bg-red-50 border-red-100", bar: "bg-red-500" };

          return (
            <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
              <div className={cn("h-0.5 w-full shrink-0", status.bar)} />

              <div className="p-4 flex flex-col flex-1">
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    METHOD: {item.ID?.toString().padStart(3, '0') || 'NEW'}
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
                    isActive ? "bg-green-50/50 border-green-100/50 text-green-600" : "bg-gray-50/50 border-gray-100/50 text-gray-400"
                  )}>
                    <CreditCard className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-gray-800 leading-tight truncate group-hover:text-black transition-colors" title={item.Name}>
                        {item.Name}
                      </h3>
                      <div className="flex lg:hidden items-center gap-1 shrink-0">
                        {actions}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight truncate">
                      {isInclusive ? 'Tax Inclusive' : 'Tax Exclusive'}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Rate</span>
                    <span className="text-sm font-bold text-gray-900 tracking-tight pr-2">
                      {item.Tax_Rate}%
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
                      #{item.ID}
                    </span>
                  </div>
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

"use client";
import React from "react";
import StatCard from "@/components/ui/summary-card";
import ActionBar from "@/components/ui/action-bar";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import PaymentModal from "./_components/payment-modal";
import PaymentTable from "./_components/payment-table";;
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { usePaymentManagement } from "@/lib/hooks/usePaymentManagement";

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
    closeModal, // ← Make sure this is destructured from the hook
    handleDeleteSelected,
    handleModalSubmit,
    updateFormData,
    handleStatusChange,
  } = usePaymentManagement();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openCreateModal();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      showToast("Please select payment methods to delete", "warning");
      return;
    }
    await handleDeleteSelected();
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={3} showActionBar={true} />;
  }

  return (
    <div className="p-6 px-4 bg-background min-h-screen">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-semibold mb-8 mt-20">
        Payment Management
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 max-w-[100vw] lg:grid-cols-2 gap-4 mb-8 lg:max-w-[50vw]">
        <StatCard
          title="Active Payment Methods"
          value={statistics.activeMethodsCount}
        />
        <StatCard
          title="Most Used Tax Type"
          value={statistics.mostUsedTaxType?.[0] || "N/A"}
          subtitle={`${statistics.mostUsedTaxType?.[1] || 0} methods`}
        />
      </div>

      {/* Action bar */}
      <ActionBar
        onAdd={handleAddWithToast}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteWithToast}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
      />

      {/* Payment table */}
      <PaymentTable
        paymentMethods={filteredItems}
        filteredItems={filteredItems}
        selectedItems={selectedItems.filter((id): id is number => typeof id === "number")}
        statusFilter={statusFilter}
        taxTypeFilter={taxTypeFilter}
        onStatusFilterChange={setStatusFilter}
        onTaxTypeFilterChange={setTaxTypeFilter}
        onSelectAll={(checked) => handleSelectAll(checked, filteredItems)}
        onSelectItem={handleSelectItem}
        onEditItem={openEditModal}
        isAllSelected={isAllSelected(filteredItems)}
      />

      {/* Payment modal */}
      <PaymentModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        formData={formData}
        actionLoading={actionLoading}
        onClose={closeModal} // ← Pass the actual close function
        onSubmit={handleModalSubmit}
        onFormDataChange={updateFormData}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default PaymentManagementPage;
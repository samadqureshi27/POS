"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import StatCard from "@/components/ui/summary-card";
import ActionBar from "@/components/ui/action-bar";
import { Toast } from '@/components/ui/toast';
import VendorModal from "./_components/vendor-modal";
import VendorTable from "./_components/vendor-table";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useVendorManagement } from "@/lib/hooks/useVendors"; 

const VendorsPage = () => {
  const params = useParams();
  const branchId = parseInt(params?.branchId as string) || 1;

  const {
    // State
    filteredItems,
    searchTerm,
    loading,
    actionLoading,
    statistics,
    // Toast
    toast,
    hideToast,
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

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={3} showActionBar={true} />;
  }

  if (!branchId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Branch ID not found in URL parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 bg-background min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <h1 className="text-3xl font-semibold mb-8 mt-20">
        Vendors & Suppliers - Branch #{branchId}
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 max-w-[100vw] lg:grid-cols-2 gap-4 mb-8 lg:max-w-[50vw]">
        <StatCard
          title="Total Vendors"
          value={statistics.totalVendorsCount.toString()}
        />
        <StatCard
          title="Active Orders"
          value={statistics.totalOrders.toString()}
        />
      </div>

      {/* Action bar */}
      <ActionBar
        onAdd={openCreateModal}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteSelected}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search vendors..."
      />

      {/* Vendor table */}
      <VendorTable
        vendorItems={filteredItems}
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={openEditModal}
        isAllSelected={isAllSelected(filteredItems)}
        branchId={branchId} // Add this missing prop
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
    </div>
  );
};

export default VendorsPage;
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import StatCard from "@/components/layout/ui/SummaryCard";
import ActionBar from "@/components/layout/ui/ActionBar";
import { Toast } from '@/components/layout/ui/Toast';
import VendorModal from "./_components/vendorModal";
import VendorTable from "./_components/vendorTable";
import LoadingSpinner from '@/components/layout/ui/Loader';
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
    return <LoadingSpinner message="Loading Vendors..."/>;
  }

  if (!branchId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Branch ID not found in URL parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 bg-gray-50 min-h-screen">
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
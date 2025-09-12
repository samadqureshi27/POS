// BranchManagementPage.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/layout/ui/summary-card";
import ActionBar from "@/components/layout/ui/action-bar";
import { Toast } from '@/components/layout/ui/toast';
import BranchModal from "./_components/branch-modal";
import BranchTable from "./_components/branch-table";
import LoadingSpinner from '@/components/layout/ui/loader';
import { useBranchManagement } from "@/lib/hooks/useBranchManagment";

const BranchManagementPage = () => {
  const router = useRouter();

  const {
    // State
    branchItems,
    filteredItems,
    searchTerm,
    statusFilter,
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
    setStatusFilter,
    handleSelectAll,
    handleSelectItem,
    openCreateModal,
    openEditModal,
    closeModal,
    handleDeleteSelected,
    handleModalSubmit,
    updateFormData,
    handleStatusChange,
  } = useBranchManagement();

  const handleCustomerClick = (branchId: number) => {
    console.log('Navigating to branch:', branchId);
    router.push(`/branch/${branchId}/pos`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading Branches..." />;
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-6 w-full px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold">Branch Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 max-w-[100vw] lg:grid-cols-2 gap-4 mb-8 lg:max-w-[50vw]">
        <StatCard
          title="Total Branches"
          value={statistics.totalBranches}
        />
        <StatCard
          title="Active Branches"
          value={statistics.activeBranches}
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
        searchPlaceholder="Search"
      />

      {/* Branch table */}
      <BranchTable
        branchItems={branchItems}
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onSelectAll={(checked) => handleSelectAll(checked, filteredItems)}
        onSelectItem={handleSelectItem}
        onEditItem={openEditModal}
        onItemClick={handleCustomerClick}
        isAllSelected={isAllSelected(filteredItems)}
      />

      {/* Branch modal */}
      <BranchModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        formData={formData}
        actionLoading={actionLoading}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        onFormDataChange={updateFormData}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default BranchManagementPage;
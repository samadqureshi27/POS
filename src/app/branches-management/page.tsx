// BranchManagementPage.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import StatCard from "@/components/ui/summary-card";
import ActionBar from "@/components/ui/action-bar";
import { Toast } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/sonner';
import { toast as sonnerToast } from 'sonner';
import BranchModal from "./_components/branch-modal";
import BranchTable from "./_components/branch-table";
import LoadingSpinner from '@/components/ui/loader';
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useBranchManagement } from "@/lib/hooks/useBranchManagment";

const BranchManagementPage = () => {
  const router = useRouter();
  
  // Auth check (no redirect): allow accessing this page for testing even if not logged in
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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
    const item = branchItems.find((b) => b["Branch-ID"] === branchId);
    const targetId = item?.backendId ?? String(branchId);
    console.log('Navigating to branch:', targetId);
    router.push(`/branch/${targetId}/pos`);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={2} />;
  }

  // Show loading while fetching branch data
  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={2} />;
  }

  return (
    <div className="p-6 bg-background min-h-screen mt-6 w-full px-4">
      <Toaster position="top-right" />

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold tracking-tight">Branch Management</h1>
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
        selectedItems={selectedItems.filter((item): item is number => typeof item === "number")}
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
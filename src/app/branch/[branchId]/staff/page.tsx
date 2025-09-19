"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import ActionBar from "@/components/ui/action-bar";
import StatCard from "@/components/ui/summary-card";
import StaffTable from "./_components/staff-table";
import StaffModal from "./_components/staffModal";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import { useStaff } from "@/lib/hooks/useSatffManagement";
import { useStaffModal } from "@/lib/hooks/useStaffModal";
import { useStaffFiltering } from "@/lib/hooks/useSatffFiltering";
import { useSelection } from "@/lib/hooks/selection";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
const EmployeeRecordsPage = () => {
  const params = useParams();
  const branchId = params?.branchId as string;
  const { showToast: globalShowToast } = useToast();

  // Core staff management hook
  const {
    staffItems,
    branchInfo,
    loading,
    actionLoading,
    showToast,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteSelected,
  } = useStaff(branchId);

  // Modal management hook
  const {
    editingItem,
    isModalOpen,
    formData,
    setFormData,
    openModal,
    closeModal,
    openEditModal,
    handleStatusChange,
    isFormValid,
  } = useStaffModal(branchId);

  // Filtering hook
  const {
    searchInput,
    setSearchInput,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    filteredItems,
  } = useStaffFiltering(staffItems);

  // Selection hook
  const {
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    clearSelection,
    isAllSelected,
    isSomeSelected,
  } = useSelection();

  // Handle modal submission
  const handleModalSubmit = async () => {
    const success = editingItem
      ? await handleUpdateItem(editingItem.Staff_ID, formData)
      : await handleCreateItem(formData);

    if (success) {
      closeModal();
      clearSelection();
    }
  };

  // Handle delete with selection clearing
  const handleDelete = async () => {
    const success = await handleDeleteSelected(selectedItems as string[]);
    if (success) {
      clearSelection();
    }
  };

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openModal();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      globalShowToast("Please select staff members to delete", "warning");
      return;
    }
    await handleDelete();
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={3} showActionBar={true} />;
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
    <div className="p-6 bg-background min-h-screen w-full mt-17">
      <Toaster position="top-right" />

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold">
          Staff Management - Branch #{branchId}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 max-w-[100vw] lg:grid-cols-2 gap-4 mb-8 lg:max-w-[50vw]">
        <StatCard
          title="Total Staff"
          value={staffItems.length}
        />
        <StatCard
          title="Active Staff"
          value={staffItems.filter((item) => item.Status === "Active").length}
        />
      </div>

      {/* Action Bar */}
      <ActionBar
        onAdd={handleAddWithToast}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteWithToast}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search staff..."
      />

      {/* Staff Table */}
      <StaffTable
        staffItems={staffItems}
        filteredItems={filteredItems}
        selectedItems={selectedItems as string[]}
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        isAllSelected={isAllSelected(filteredItems)}
        onSelectAll={(checked) => handleSelectAll(checked, filteredItems, 'Staff_ID')}
        onSelectItem={handleSelectItem}
        onEditItem={openEditModal}
        onStatusFilterChange={setStatusFilter}
        onRoleFilterChange={setRoleFilter}
        searchTerm={searchTerm}
      />

      {/* Staff Modal */}
      <StaffModal
        isOpen={isModalOpen}
        isEditing={!!editingItem}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleModalSubmit}
        onClose={closeModal}
        onStatusChange={handleStatusChange}
        actionLoading={actionLoading}
        isFormValid={isFormValid}
        showToast={showToast}
      />
    </div>
  );
};

export default EmployeeRecordsPage;
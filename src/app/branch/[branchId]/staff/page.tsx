"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import ActionBar from "@/components/layout/UI/ActionBar";
import StatCard from "@/components/layout/UI/SummaryCard";
import StaffTable from "./_components/staffTable";
import StaffModal from "./_components/staffModal";
<<<<<<< HEAD
import {Toast} from "../../../../components/layout/UI/Toast";
import { useStaff } from "@/lib/hooks/UseSatffManagement";
import { useStaffModal } from "@/lib/hooks/UseStaffModal";
import { useStaffFiltering } from "@/lib/hooks/UseSatffFiltering";
=======
import {Toast} from "@/components/layout/UI/Toast";
import { useStaff } from "@/lib/hooks/useSatffManagement";
import { useStaffModal } from "@/lib/hooks/useStaffModal";
import { useStaffFiltering } from "@/lib/hooks/useSatffFiltering";
>>>>>>> fa4c0c4c5551bd77636fd1d5b27ca4fad7662fa6
import { useSelection } from "@/lib/hooks/Selection";
import LoadingSpinner from '@/components/layout/UI/Loader';
const EmployeeRecordsPage = () => {
  const params = useParams();
  const branchId = params?.branchId as string;

  // Core staff management hook
  const {
    staffItems,
    branchInfo,
    loading,
    actionLoading,
    toast,
    showToast,
    setToast,
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

  if (loading) {
    <LoadingSpinner message="Loading Staff Management..."/>
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
    <div className="bg-gray-50 min-h-screen w-full mt-17">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
        onAdd={openModal}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDelete}
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
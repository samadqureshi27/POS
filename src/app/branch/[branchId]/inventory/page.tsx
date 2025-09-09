"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useInventoryManagement } from "../../../../lib/hooks/inventoryManagement";
import { Toast } from "@/components/layout/UI/Toast";
import ActionBar from "@/components/layout/UI/ActionBar";
import LoadingSpinner from "@/components/layout/UI/Loader";
import StatCard from "@/components/layout/UI/SummaryCard";
import InventoryModal from "./_components/inventoryModal";
import InventoryTable from "./_components/inventoryTable";
const InventoryManagementPage = () => {
  const params = useParams();
  const branchId = parseInt(params?.branchId as string) || 1;
  const {
    // State
    inventoryItems,
    filteredItems,
    searchTerm,
    statusFilter,
    unitFilter,
    loading,
    actionLoading,
    statistics,
    // Toast
    toast,
    toastVisible,
    hideToast,
    // Selection
    selectedItems,
    isAllSelected, // This is a function, not a boolean
    // Modal
    isModalOpen,
    editingItem,
    formData,
    // Actions
    setSearchTerm,
    setStatusFilter,
    setUnitFilter,
    handleSelectAll,
    handleSelectItem,
    openCreateModal,
    openEditModal,
    closeModal,
    handleDeleteSelected,
    handleModalSubmit,
    updateFormData,
  } = useInventoryManagement(branchId);

  if (loading) {
    return <LoadingSpinner message="Loading Inventory..." />;
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-17">
      {toast && toastVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold">
          Inventory Management - Branch #{branchId}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 max-w-[100vw] lg:grid-cols-2 gap-4 mb-8 lg:max-w-[50vw]">
        <StatCard
          title={`Most Used (${statistics.mostUsedItem.count} times)`}
          value={statistics.mostUsedItem.name}
        />
        <StatCard
          title={`Least Used (${statistics.leastUsedItem.count} times)`}
          value={statistics.leastUsedItem.name}
        />
      </div>

      {/* Action bar: add, delete, search */}
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

      {/* Inventory Table */}
      <InventoryTable
        inventoryItems={inventoryItems}
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        statusFilter={statusFilter}
        unitFilter={unitFilter}
        onStatusFilterChange={setStatusFilter}
        onUnitFilterChange={setUnitFilter}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={openEditModal}
        isAllSelected={isAllSelected(filteredItems)} // Fixed: Call the function with filteredItems
      />

      {/* Inventory Modal */}
      <InventoryModal
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
export default InventoryManagementPage;
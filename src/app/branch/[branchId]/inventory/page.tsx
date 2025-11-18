"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useInventoryManagement } from "@/lib/hooks/inventoryManagement";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import ActionBar from "@/components/ui/action-bar";
import StatCard from "@/components/ui/summary-card";
import InventoryModal from "./_components/inventory-modal";
import InventoryTable from "./_components/inventory-table";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
const InventoryManagementPage = () => {
  const params = useParams();
  const branchId = parseInt(params?.branchId as string) || 1;
  const { showToast } = useToast();
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

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openCreateModal();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      showToast("Please select items to delete", "warning");
      return;
    }
    await handleDeleteSelected();
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={2} showActionBar={true} />;
  }

  return (
    <PageContainer>
      <Toaster position="top-right" />

      <PageHeader
        title={`Inventory Management - Branch #${branchId}`}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
        onAdd={handleAddWithToast}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteWithToast}
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
    </PageContainer>
  );
};
export default InventoryManagementPage;
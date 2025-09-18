"use client";

import React from "react";
import { useCategory } from '@/lib/hooks/useCategory';
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import CategoryTable from './_components/category-table';
import CategoryModal from './_components/category-model';
import ActionBar from "@/components/ui/action-bar";

const CategoriesPage = () => {
  const { showToast } = useToast();
  const {
    // State
    selectedItems,
    loading,
    actionLoading,
    searchTerm,
    editingItem,
    isModalOpen,
    statusFilter,

    // Actions
    setSearchTerm,
    setStatusFilter,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteSelected,
    handleSelectAll,
    handleSelectItem,
    openEditModal,
    openNewModal,
    closeModal,

    // Computed
    filteredItems,
  } = useCategory();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openNewModal();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      showToast("Please select categories to delete", "warning");
      return;
    }
    await handleDeleteSelected();
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <div className="p-6 bg-background min-w-full h-full overflow-y-auto">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-semibold mt-14 mb-8">Categories</h1>

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

      {/* Table */}
      <CategoryTable
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        statusFilter={statusFilter}
        searchTerm={searchTerm}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onStatusFilterChange={setStatusFilter}
        onEdit={openEditModal}
      />

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        actionLoading={actionLoading}
        onClose={closeModal}
        onCreate={handleCreateItem}
        onUpdate={handleUpdateItem}
      />
    </div>
  );
};

export default CategoriesPage;
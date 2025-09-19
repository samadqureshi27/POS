"use client";
import React, { useEffect } from "react";
import ActionBar from "@/components/ui/action-bar";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import IngredientsTable from "./_components/ingredients-table";
import IngredientsModal from "./_components/ingredients-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useIngredientsData } from "@/lib/hooks/useIngredientsData";

const IngredientsManagementPage = () => {
  const { showToast: globalShowToast } = useToast();
  const {
    // Data
    filteredItems,
    selectedItems,
    loading,
    actionLoading,

    // Filter states
    searchTerm,
    statusFilter,

    // Modal states
    modalOpen,
    editItem,
    formData,
    setFormData,

    // Computed values
    isAllSelected,

    // CRUD operations
    deleteItems,

    // Selection handlers
    handleSelectItem,
    handleSelectAll,

    // Modal handlers
    openAddModal,
    openEditModal,
    closeModal,
    handleSaveItem: handleSaveItemOriginal,

    // Filter handlers
    updateSearchTerm,
    updateStatusFilter,
  } = useIngredientsData();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openAddModal();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      globalShowToast("Please select ingredients to delete", "warning");
      return;
    }
    await deleteItems();
    globalShowToast(`${selectedItems.length} ingredient(s) deleted successfully`, "success");
  };

  const handleSaveItem = () => {
    const wasEdit = !!editItem;
    handleSaveItemOriginal();
    if (wasEdit) {
      globalShowToast("Ingredient updated successfully", "success");
    } else {
      globalShowToast("Ingredient added successfully", "success");
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  // Show skeleton loading during initial load
  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <div className="p-6 bg-background min-w-full h-full overflow-y-auto">
      <Toaster position="top-right" />

      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold mt-14 mb-2">Ingredients</h1>
      </header>

      {/* Action Bar - Add, Delete, Search */}
      <ActionBar
        onAdd={handleAddWithToast}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteWithToast}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={updateSearchTerm}
        searchPlaceholder="Search ingredients..."
      />

      {/* Data Table with Filters */}
      <IngredientsTable
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={openEditModal}
        statusFilter={statusFilter}
        setStatusFilter={updateStatusFilter}
      />

      {/* Add/Edit Modal */}
      <IngredientsModal
        isOpen={modalOpen}
        editItem={editItem}
        formData={formData}
        setFormData={setFormData}
        onClose={closeModal}
        onSave={handleSaveItem}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default IngredientsManagementPage;
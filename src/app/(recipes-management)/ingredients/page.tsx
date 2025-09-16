"use client";
import React, { useEffect } from "react";
import ActionBar from "@/components/ui/action-bar";
import { Toast } from "@/components/ui/toast";
import LoadingSpinner from "@/components/ui/loader";
import IngredientsTable from "./_components/ingredients-table";
import IngredientsModal from "./_components/ingredients-modal";
import { useIngredientsData } from "@/lib/hooks/useIngredientsData";

const IngredientsManagementPage = () => {
  const {
    // Data
    filteredItems,
    selectedItems,
    loading,
    actionLoading,
    toast,
    
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
    handleSaveItem,
    
    // Filter handlers
    updateSearchTerm,
    updateStatusFilter,
    
    // Toast handler
    dismissToast,
  } = useIngredientsData();

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

  // Show loading spinner during initial load
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gray-50 min-w-full h-full overflow-y-auto">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={dismissToast}
        />
      )}

      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold mt-14 mb-2">Ingredients</h1>
        
      </header>

      {/* Action Bar - Add, Delete, Search */}
      <ActionBar
        onAdd={openAddModal}
        addDisabled={selectedItems.length > 0}
        onDelete={deleteItems}
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
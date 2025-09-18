"use client";

import React from "react";
import { Toast } from "@/components/ui/toast";
import { useMenuManagement } from "@/lib/hooks/useMenuManagement";
import ActionBar from "@/components/ui/action-bar";
import MenuTable from "./_components/menu-table";
import MenuModal from "./_components/MenuModal";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import { Toaster } from "@/components/ui/sonner";

const MenuManagementPage = () => {
  const {
    // State
    filteredItems,
    selectedItems,
    loading,
    statusFilter,
    categoryFilter,
    actionLoading,
    searchTerm,
    editingItem,
    isModalOpen,
    activeTab,
    preview,
    formData,
    fileInputRef,

    // Computed values
    isFormValid,
    categories,
    isAllSelected,

    // Toast
    toast,
    hideToast,

    // Handlers
    handleDeleteSelected,
    handleSelectAll,
    handleSelectItem,
    handleModalSubmit,
    handleStatusChange,
    handleCloseModal,
    handleStatusFilterChange,
    handleEditItem,
    handleAddItem,
    updateFormData,
    handleFormFieldChange,

    // Setters
    setSearchTerm,
    setCategoryFilter,
    setActiveTab,
    setPreview,
  } = useMenuManagement();

  // Loading state
  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <div className="p-6 bg-background min-w-full h-full overflow-y-hidden">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-semibold tracking-tight mt-14 mb-8">Menu Management</h1>

      <ActionBar
        onAdd={handleAddItem}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteSelected}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <MenuTable
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={handleEditItem}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        categories={categories}
      />

      <MenuModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        actionLoading={actionLoading}
        isFormValid={isFormValid}
        preview={preview}
        setPreview={setPreview}
        fileInputRef={fileInputRef}
        updateFormData={updateFormData}
        handleFormFieldChange={handleFormFieldChange}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default MenuManagementPage;
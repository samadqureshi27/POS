"use client";

import React from "react";
import { Toast } from "@/components/ui/toast";
import { useMenuManagement } from "@/lib/hooks/useMenuManagement";
import MenuActionBar from "./_components/menu-actionbar";
import MenuTable from "./_components/menu-table";
import MenuModal from "./_components/MenuModal";
import LoadingSpinner from "@/components/ui/loader";
import { ManagementPageSkeleton } from "@/app/(main)/dashboard/_components/ManagementPageSkeleton";
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
    return <ManagementPageSkeleton showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <div className="bg-gray-50 min-w-full h-full overflow-y-hidden">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-semibold tracking-tight mt-14 mb-8">Menu Management</h1>

      <MenuActionBar
        selectedItems={selectedItems}
        onAddClick={handleAddItem}
        onDeleteClick={handleDeleteSelected}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        actionLoading={actionLoading}
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
"use client";

import React from "react";
import { Toast } from "@/components/layout/ui/toast";
import { useMenuManagement } from "@/lib/hooks/useMenuManagement";
import MenuActionBar from "./_components/menu-actionbar";
import MenuTable from "./_components/menu-table";
import MenuModal from "./_components/MenuModal";
import LoadingSpinner from "@/components/layout/ui/loader";

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
    return <LoadingSpinner message="Loading Menu...." />
  }

  return (
    <div className="bg-gray-50 min-w-full h-full overflow-y-hidden">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <h1 className="text-3xl font-semibold mt-14 mb-8">Menu Management</h1>

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
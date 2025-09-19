"use client";

import React from "react";
import ActionBar from "@/components/ui/action-bar";
import { Toaster } from "@/components/ui/sonner";
import MenuTable from "./_components/menu-table";
import MenuModal from "./_components/menu-modal";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import { useMenuOptions } from "@/lib/hooks/useMenuOptions"; // Adjust path as needed

const CategoryPage = () => {
  const {
    // State
    loading,
    searchTerm,
    selectedItems,
    actionLoading,
    DisplayFilter,
    filteredItems,
    isModalOpen,
    editingItem,
    formData,
    isAllSelected,
    
    // Setters
    setSearchTerm,
    setDisplayFilter,
    setFormData,
    setIsModalOpen,
    
    // Handlers
    handleDeleteSelected,
    handleSelectAll,
    handleSelectItem,
    handleEditItem,
    handleModalSubmit,
    handleCloseModal,
    
    // Utils
    isFormValid,
  } = useMenuOptions();

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <div className="p-6 bg-background min-w-full h-full overflow-y-auto">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-semibold mt-14 mb-8 ">Menu Options</h1>

      {/* Action bar */}
      <ActionBar
        onAdd={() => setIsModalOpen(true)}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteSelected}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
      />

      {/* Table */}
      <MenuTable
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        searchTerm={searchTerm}
        DisplayFilter={DisplayFilter}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={handleEditItem}
        onDisplayFilterChange={setDisplayFilter}
      />

      {/* Modal */}
      <MenuModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleModalSubmit}
        onClose={handleCloseModal}
        isFormValid={isFormValid}
      />
    </div>
  );
};

export default CategoryPage;
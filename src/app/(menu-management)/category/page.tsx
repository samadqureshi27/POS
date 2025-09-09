"use client";

import React from "react";
import { useCategory } from '@/lib/hooks/UseCategory';
import {Toast} from "@/components/layout/UI/Toast";
import LoadingSpinner from "@/components/layout/UI/Loader";
import CategoryTable from './_components/category-table';
import CategoryModal from './_components/category-model';
import ActionBar from "@/components/layout/UI/ActionBar";

const CategoriesPage = () => {
  const {
    // State
    selectedItems,
    loading,
    actionLoading,
    searchTerm,
    editingItem,
    isModalOpen,
    toast,
    statusFilter,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
    setToast,
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

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gray-50 min-w-full h-full overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mt-14 mb-8">Categories</h1>

      {/* Action bar */}
      <ActionBar
        onAdd={openNewModal}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteSelected}
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
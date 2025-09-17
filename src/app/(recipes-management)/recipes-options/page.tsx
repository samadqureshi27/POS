// app/(recipes-management)/recipes-options/page.tsx
// Simplified version using the hook

"use client";

import React from "react";
import ActionBar from "@/components/ui/action-bar";
import { Toast } from "@/components/ui/toast";
import RecipeModal from "./_components/recipe-option-modal";
import RecipeTable from "./_components/recipe-option-table";
import { ManagementPageSkeleton } from "@/app/(main)/dashboard/_components/ManagementPageSkeleton";
import { useRecipeOptions } from "@/lib/hooks/useRecipeOptions";

const RecipeOptionsPage = () => {
  const {
    items,
    selectedItems,
    loading,
    actionLoading,
    searchTerm,
    editingItem,
    isModalOpen,
    toast,
    displayFilter,
    setSearchTerm,
    setDisplayFilter,
    handleSelectAll,
    handleSelectItem,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleModalSubmit,
    dismissToast,
  } = useRecipeOptions();

  if (loading) {
    return <ManagementPageSkeleton showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <div className="bg-gray-50 min-w-full h-full overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={dismissToast}
        />
      )}

      <h1 className="text-3xl font-semibold mt-14 mb-8">Recipe Options</h1>

      {/* Action bar */}
      <ActionBar
        onAdd={handleAddNew}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDelete}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search recipe options..."
      />

      {/* Table */}
      <RecipeTable
        items={items}
        selectedItems={selectedItems}
        searchTerm={searchTerm}
        displayFilter={displayFilter}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={handleEdit}
      />

      {/* Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default RecipeOptionsPage;
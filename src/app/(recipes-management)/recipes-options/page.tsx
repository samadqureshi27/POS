// app/(recipes-management)/recipes-options/page.tsx
// Simplified version using the hook

"use client";

import React from "react";
import ActionBar from "@/components/ui/action-bar";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import RecipeModal from "./_components/recipe-option-modal";
import RecipeTable from "./_components/recipe-option-table";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useRecipeOptions } from "@/lib/hooks/useRecipeOptions";

const RecipeOptionsPage = () => {
  const { showToast: globalShowToast } = useToast();
  const {
    items,
    selectedItems,
    loading,
    actionLoading,
    searchTerm,
    editingItem,
    isModalOpen,
    displayFilter,
    setSearchTerm,
    setDisplayFilter,
    handleSelectAll,
    handleSelectItem,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleModalSubmit: handleModalSubmitOriginal,
  } = useRecipeOptions();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    handleAddNew();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      globalShowToast("Please select recipe options to delete", "warning");
      return;
    }
    await handleDelete();
    globalShowToast(`${selectedItems.length} recipe option(s) deleted successfully`, "success");
  };

  const handleModalSubmit = async (data: any) => {
    const result = await handleModalSubmitOriginal(data);
    if (editingItem) {
      globalShowToast("Recipe option updated successfully", "success");
    } else {
      globalShowToast("Recipe option added successfully", "success");
    }
    return result;
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
      <div className="p-6 bg-background min-w-full h-full overflow-y-auto">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-semibold mt-14 mb-8">Recipe Options</h1>

      {/* Action bar */}
      <ActionBar
        onAdd={handleAddWithToast}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteWithToast}
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
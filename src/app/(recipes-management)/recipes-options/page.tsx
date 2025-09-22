// app/(recipes-management)/recipes-options/page.tsx
// Simplified version using the hook

"use client";

import React from "react";
import ActionBar from "@/components/ui/action-bar";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import RecipeVariantModal from "./_components/recipe-option-modal";
import RecipeVariantTable from "./_components/recipe-option-table";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useRecipeVariants } from "@/lib/hooks/useRecipeVariants";

const RecipeVariantsPage = () => {
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
  } = useRecipeVariants();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    handleAddNew();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      globalShowToast("Please select recipe variants to delete", "warning");
      return;
    }
    await handleDelete();
    globalShowToast(`${selectedItems.length} recipe variant(s) deleted successfully`, "success");
  };

  const handleModalSubmit = async (data: any) => {
    const result = await handleModalSubmitOriginal(data);
    if (editingItem) {
      globalShowToast("Recipe variant updated successfully", "success");
    } else {
      globalShowToast("Recipe variant added successfully", "success");
    }
    return result;
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
      <div className="p-6 bg-background min-w-full h-full overflow-y-auto">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-semibold mt-14 mb-8">Recipe Variants</h1>

      {/* Action bar */}
      <ActionBar
        onAdd={handleAddWithToast}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteWithToast}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search recipe variants..."
      />

      {/* Table */}
      <RecipeVariantTable
        items={items}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={handleEdit}
        searchTerm={searchTerm}
        displayFilter={displayFilter}
      />

      {/* Modal */}
      <RecipeVariantModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        editingItem={editingItem}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default RecipeVariantsPage;
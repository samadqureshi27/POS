"use client";
import React from "react";
import ActionBar from "@/components/ui/action-bar";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import RecipeTable from "./_components/recipe-table";
import RecipeModal from "./_components/recipe-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useRecipeData } from "@/lib/hooks/useRecipeData";

const RecipesManagementPage = () => {
  const { showToast: globalShowToast } = useToast();
  const {
    // Data
    filteredItems,
    ingredients,
    availableRecipeOptions,
    selectedItems,
    loading,
    actionLoading,

    // Filter states
    searchTerm,
    statusFilter,

    // Modal states
    isModalOpen,
    editingItem,

    // Computed values
    isAllSelected,
    recipeStats,

    // CRUD operations
    deleteRecipes,

    // Selection handlers
    handleSelectItem,
    handleSelectAll,

    // Modal handlers
    openAddModal,
    openEditModal,
    closeModal,
    handleModalSubmit: handleModalSubmitOriginal,

    // Filter handlers
    updateSearchTerm,
    updateStatusFilter,

    // Utility functions
    showToast,
  } = useRecipeData();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openAddModal();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      globalShowToast("Please select recipes to delete", "warning");
      return;
    }
    const result = await deleteRecipes();
    if (result.success) {
      globalShowToast(`${selectedItems.length} recipe(s) deleted successfully`, "success");
    }
  };

  const handleModalSubmit = async (data: any) => {
    const result = await handleModalSubmitOriginal(data);
    if (result.success) {
      if (editingItem) {
        globalShowToast("Recipe updated successfully", "success");
      } else {
        globalShowToast("Recipe added successfully", "success");
      }
    }
    return result;
  };

  // Show skeleton loading during initial load
  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <div className="p-6 bg-background min-w-full h-full overflow-y-auto thin-scroll">
      <Toaster position="top-right" />

      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold mt-14 mb-2">Recipes</h1>
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
        searchPlaceholder="Search recipes..."
      />

      {/* Recipe Table */}
      <RecipeTable
        items={filteredItems}
        selectedItems={selectedItems}
        statusFilter={statusFilter}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onStatusFilterChange={updateStatusFilter}
        onEditItem={openEditModal}
      />

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        ingredients={ingredients}
        availableRecipeOptions={availableRecipeOptions}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        actionLoading={actionLoading}
        showToast={globalShowToast}
      />
    </div>
  );
};

export default RecipesManagementPage;
"use client";
import React from "react";
import ActionBar from "@/components/ui/action-bar";
import { Toast } from "@/components/ui/toast";
import RecipeTable from "./_components/recipe-table";
import RecipeModal from "./_components/recipe-modal";
import { ManagementPageSkeleton } from "@/app/(main)/dashboard/_components/ManagementPageSkeleton";
import { useRecipeData } from "@/lib/hooks/useRecipeData";

const RecipesManagementPage = () => {
  const {
    // Data
    filteredItems,
    ingredients,
    selectedItems,
    loading,
    actionLoading,
    toast,

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
    handleModalSubmit,

    // Filter handlers
    updateSearchTerm,
    updateStatusFilter,

    // Utility functions
    showToast,

    // Toast handler
    dismissToast,
  } = useRecipeData();

  // Show skeleton loading during initial load
  if (loading) {
    return <ManagementPageSkeleton showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <div className="p-6 bg-background min-w-full h-full overflow-y-auto thin-scroll">
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
        <h1 className="text-3xl font-semibold mt-14 mb-2">Recipes</h1>
        
      </header>

      {/* Action Bar - Add, Delete, Search */}
      <ActionBar
        onAdd={openAddModal}
        addDisabled={selectedItems.length > 0}
        onDelete={deleteRecipes}
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
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        actionLoading={actionLoading}
        showToast={showToast}
      />
    </div>
  );
};

export default RecipesManagementPage;
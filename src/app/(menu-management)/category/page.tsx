"use client";

import React, { useState } from "react";
import { useCategory } from '@/lib/hooks/useCategory';
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import CategoryTable from './_components/category-table';
import CategoryModal from './_components/category-model';
import ActionBar from "@/components/ui/action-bar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

const CategoriesPage = () => {
  const { showToast } = useToast();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [categoriesToDelete, setCategoriesToDelete] = useState<string[]>([]);
  const {
    // State
    categoryItems,
    selectedItems,
    loading,
    actionLoading,
    searchTerm,
    editingItem,
    isModalOpen,
    statusFilter,

    // Actions
    setSearchTerm,
    setStatusFilter,
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

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openNewModal();
  };

  const handleDeleteWithToast = async () => {
    if (selectedItems.length === 0) {
      showToast("Please select categories to delete", "warning");
      return;
    }

    // Basic protection check - ideally this should be handled by backend
    const selectedCategories = categoryItems.filter(cat => selectedItems.includes(cat.ID));
    const categoryNames = selectedCategories.map(cat => cat.Name);

    setCategoriesToDelete(categoryNames);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    setShowDeleteAlert(false);
    await handleDeleteSelected();
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <div className="p-6 bg-background min-w-full h-full overflow-y-auto">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-semibold mt-14 mb-8">Categories</h1>

      {/* Action bar */}
      <ActionBar
        onAdd={handleAddWithToast}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteWithToast}
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
        categories={categoryItems}
        onClose={closeModal}
        onCreate={handleCreateItem}
        onUpdate={handleUpdateItem}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {categoriesToDelete.length} categor{categoriesToDelete.length === 1 ? 'y' : 'ies'}?

              <div className="mt-3 p-3 bg-muted rounded-md">
                <div className="font-medium text-sm">Categories to be deleted:</div>
                <ul className="mt-1 text-sm text-muted-foreground">
                  {categoriesToDelete.map((name, index) => (
                    <li key={index}>• {name}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 text-sm">
                <strong>Warning:</strong> If any menu items are using these categories, they may be affected.
                This action cannot be undone.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Categories
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriesPage;
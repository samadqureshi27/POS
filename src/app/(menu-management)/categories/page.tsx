"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderTree, Plus } from "lucide-react";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import CategoryModal from "./_components/category-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useCategoryData } from "@/lib/hooks/useCategoryData";
import { MenuCategoryOption } from "@/lib/types/menu";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { logError } from "@/lib/util/logger";

const CategoriesManagementPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<MenuCategoryOption | null>(null);

  const {
    // Data
    filteredItems,
    loading,
    actionLoading,

    // Filter states
    searchTerm,
    statusFilter,

    // Modal states
    isModalOpen,
    editingItem,

    // Modal handlers
    openAddModal,
    openEditModal,
    closeModal,
    handleModalSubmit: handleModalSubmitOriginal,

    // Filter handlers
    updateSearchTerm,
    updateStatusFilter,

    // Utility
    parentCategories,
    refreshData,
    deleteCategory,
  } = useCategoryData();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openAddModal();
  };

  const handleModalSubmit = async (data: any) => {
    const result = await handleModalSubmitOriginal(data);
    if (result.success) {
      const message = editingItem ? "Category updated successfully" : "Category added successfully";
      toast.success(message, {
        duration: 5000,
        position: "top-right",
      });
      // No need to refresh - optimistic update in hook handles it
    }
    return result;
  };

  const handleDelete = (category: MenuCategoryOption) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    const categoryId = categoryToDelete.ID;

    if (!categoryId) {
      logError("Category ID is missing", new Error("Category ID is undefined"), {
        component: "CategoriesManagement",
        action: "confirmDelete",
      });
      toast.error("Category ID is missing");
      return;
    }

    try {
      // Use hook's delete function which has optimistic update
      const result = await deleteCategory(categoryId);

      if (result.success) {
        toast.success("Category deleted successfully", {
          duration: 5000,
          position: "top-right",
        });
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch (error: any) {
      logError("Error deleting category", error, {
        component: "CategoriesManagement",
        action: "confirmDelete",
        categoryId: categoryToDelete?.ID,
      });
      toast.error(error.message || "Failed to delete category");
    }
  };

  // Show skeleton loading during initial load
  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" richColors expand={true} duration={5000} />

      <PageHeader
        title="Menu Categories"
        subtitle="Organize your menu with categories and subcategories"
      />

      {/* Enhanced Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={updateSearchTerm}
        searchPlaceholder="Search categories by name or code..."
        filters={[
          {
            options: [
              { label: "All Status", value: "" },
              { label: "Active", value: "Active", color: "green" },
              { label: "Inactive", value: "Inactive", color: "red" },
            ],
            activeValue: statusFilter,
            onChange: (value) => updateStatusFilter(value as "" | "Active" | "Inactive"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={handleAddWithToast}
        primaryActionLabel="Add Category"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
      />

      {/* Category Grid */}
      <ResponsiveGrid<MenuCategoryOption>
        items={filteredItems}
        loading={loading}
        loadingText="Loading categories..."
        viewMode={viewMode}
        emptyIcon={<FolderTree className="h-16 w-16 text-gray-300" />}
        emptyTitle="No categories found"
        emptyDescription="Start by adding your first menu category"
        getItemId={(item) => item.ID}
        onEdit={openEditModal}
        onDelete={handleDelete}
        customActions={(item) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditModal(item)}
              className="px-3 py-1 bg-gray-900 hover:bg-black text-white text-sm rounded-md transition-all"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-all"
            >
              Delete
            </button>
          </div>
        )}
        columns={[
          {
            key: "Name",
            header: "Category Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center border bg-blue-50 border-blue-200">
                  <FolderTree className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.Name}</div>
                  {item.Description && (
                    <div className="text-xs text-gray-500 truncate max-w-[300px]">{item.Description}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "Code",
            header: "Code",
            render: (item) => (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                {item.Code}
              </span>
            ),
            className: "w-32",
          },
          {
            key: "DisplayOrder",
            header: "Order",
            render: (item) => (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                  {item.DisplayOrder}
                </div>
              </div>
            ),
            className: "w-24",
          },
          {
            key: "Status",
            header: "Status",
            render: (item) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.Status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {item.Status}
              </span>
            ),
            className: "w-28",
          },
        ]}
        renderGridCard={(item, actions) => {
          const isActive = item.Status === "Active";
          const hasParent = !!item.ParentCategory;

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className="relative h-28 flex items-center justify-center border-b-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <FolderTree className="h-14 w-14 text-blue-400" />

                {/* Status Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {item.Status}
                </div>

                {/* Code Badge - Top Right */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-blue-600 text-white">
                  {item.Code}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Category Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.Name}>
                  {item.Name}
                </h3>

                {/* Description */}
                {item.Description ? (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {item.Description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic mb-3 min-h-[2.5rem]">
                    No description provided
                  </p>
                )}

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  {/* Display Order */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-100">
                      <span className="text-xs font-bold text-blue-700">
                        {item.DisplayOrder}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      order
                    </span>
                  </div>

                  {/* Parent Category Indicator */}
                  <div className="text-xs text-gray-500">
                    {hasParent ? (
                      <span className="font-semibold text-gray-700">Subcategory</span>
                    ) : (
                      <span className="italic">Top Level</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        actionLoading={actionLoading}
        parentCategories={parentCategories}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.Name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </PageContainer>
  );
};

export default CategoriesManagementPage;

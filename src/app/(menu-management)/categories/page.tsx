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
import { cn } from "@/lib/utils";
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
        toast.error("Failed to delete category", {
          duration: 5000,
          position: "top-right",
        });
      }
    } catch (error: any) {
      logError("Error deleting category", error, {
        component: "CategoriesManagement",
        action: "confirmDelete",
        categoryId: categoryToDelete?.ID,
      });
      toast.error(error.message || "Failed to delete category", {
        duration: 5000,
        position: "top-right",
      });
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
        columns={[
          {
            key: "Name",
            header: "Category Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-sm flex items-center justify-center border bg-blue-50/50 border-blue-100/50 text-blue-600">
                  <FolderTree className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">{item.Name}</div>
                  {item.Description && (
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate max-w-[300px]">{item.Description}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "Code",
            header: "Code",
            render: (item) => (
              <span className="font-mono text-[10px] font-bold text-gray-600 uppercase">
                {item.Code}
              </span>
            ),
            className: "w-32",
          },
          {
            key: "DisplayOrder",
            header: "Order",
            render: (item) => (
              <span className="text-sm font-bold text-gray-900">
                #{item.DisplayOrder}
              </span>
            ),
            className: "w-24",
          },
          {
            key: "Status",
            header: "Status",
            render: (item) => (
              <span className={cn(
                "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                item.Status === "Active" ? "text-green-600 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"
              )}>
                {item.Status?.toUpperCase()}
              </span>
            ),
            className: "w-28",
          },
        ]}
        renderGridCard={(item, actions) => {
          const isActive = item.Status === "Active";

          return (
            <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
              <div className={cn("h-0.5 w-full shrink-0", isActive ? "bg-green-500" : "bg-red-500")} />

              <div className="p-4 flex flex-col flex-1">
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    CODE: {item.Code?.toUpperCase()}
                  </span>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold tracking-widest border",
                    isActive ? "text-green-600 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"
                  )}>
                    {item.Status?.toUpperCase()}
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="h-10 w-10 rounded-sm flex items-center justify-center shrink-0 border bg-blue-50/50 border-blue-100/50 text-blue-600 transition-colors">
                    <FolderTree className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-gray-800 leading-tight truncate group-hover:text-black transition-colors" title={item.Name}>
                        {item.Name}
                      </h3>
                      <div className="flex lg:hidden items-center gap-1 shrink-0">
                        {actions}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight truncate">
                      {item.ParentCategory ? 'Subcategory' : 'Main Category'}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Order</span>
                    <span className="text-sm font-bold text-gray-900 tracking-tight pr-2">
                      #{item.DisplayOrder}
                    </span>
                  </div>

                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    <div className="flex items-center gap-1">
                      {actions}
                    </div>
                  </div>

                  <div className="lg:hidden flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Type</span>
                    <span className="text-xs font-bold text-gray-900 uppercase">
                      {item.ParentCategory ? 'Child' : 'Parent'}
                    </span>
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

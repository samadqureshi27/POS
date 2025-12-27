"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Plus } from "lucide-react";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { toast } from "sonner";
import { Toaster } from "sonner";
import RecipeModal from "./_components/recipe-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useRecipeData } from "@/lib/hooks/useRecipeData";
import { RecipeOption } from "@/lib/types/recipes";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatPrice, formatCurrency } from "@/lib/util/formatters";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { GridActionButtons } from "@/components/ui/grid-action-buttons";
import { cn } from "@/lib/utils";

// add view only modal for recipe items with compact view

const RecipesManagementPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [recipeTypeFilter, setRecipeTypeFilter] = useState<"all" | "final" | "sub">("all");

  // Confirmation Dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<RecipeOption | null>(null);

  const {
    // Data
    filteredItems,
    ingredients,
    availableRecipeOptions,
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
    refreshData,
    deleteRecipe,
  } = useRecipeData();

  // Debug logging
  React.useEffect(() => {
    console.log("🏪 Recipes Page - Ingredients loaded:", ingredients?.length || 0);
    console.log("🍲 Recipes Page - Recipe Options loaded:", availableRecipeOptions?.length || 0);
  }, [ingredients, availableRecipeOptions]);

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openAddModal();
  };

  const handleModalSubmit = async (data: any) => {
    const result = await handleModalSubmitOriginal(data);
    if (result.success) {
      if (editingItem) {
        toast.success("Recipe updated successfully", {
          duration: 5000,
          position: "top-right",
        });
      } else {
        toast.success("Recipe added successfully", {
          duration: 5000,
          position: "top-right",
        });
      }
      // No need to refresh - optimistic update in hook handles it
    }
    return result;
  };

  const handleDelete = (recipe: RecipeOption) => {
    setRecipeToDelete(recipe);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!recipeToDelete) return;

    // Get the actual MongoDB _id or fallback to ID
    const recipeId = (recipeToDelete as any)._id || recipeToDelete.ID;

    if (!recipeId) {
      console.error("❌ Recipe ID is missing");
      toast.error("Recipe ID is missing", {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    try {
      // Use hook's delete function which has optimistic update
      const result = await deleteRecipe(String(recipeId));

      if (result.success) {
        toast.success("Recipe deleted successfully", {
          duration: 5000,
          position: "top-right",
        });
        setConfirmDialogOpen(false);
        setRecipeToDelete(null);
      } else {
        toast.error((result?.error as string) || "Failed to delete recipe", {
          duration: 5000,
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("Error deleting recipe:", error);
      toast.error(error.message || "Failed to delete recipe", {
        duration: 5000,
        position: "top-right",
      });
    }
  };

  // Apply recipe type filter to the filtered items (must be before early return)
  const typeFilteredItems = useMemo(() => {
    if (recipeTypeFilter === "all") return filteredItems;
    return filteredItems.filter((item: any) => item.type === recipeTypeFilter);
  }, [filteredItems, recipeTypeFilter]);

  // Show skeleton loading during initial load
  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} />;
  }

  return (
    <PageContainer>
      <Toaster position="top-right" />

      {/* Page Header */}
      <PageHeader
        title="Recipes Management"
        subtitle="Manage your final recipes and sub-recipes"
      />

      {/* Enhanced Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={updateSearchTerm}
        searchPlaceholder="Search recipes by name or description..."
        filters={[
          {
            options: [
              { label: "All", value: "all" },
              { label: "Final Recipe", value: "final", color: "blue" },
              { label: "Sub Recipe", value: "sub", color: "purple" },
            ],
            activeValue: recipeTypeFilter,
            onChange: (value) => setRecipeTypeFilter(value as "all" | "final" | "sub"),
          },
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
        primaryActionLabel="Add Recipe"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
      />

      {/* Recipe Grid */}
      <ResponsiveGrid<RecipeOption>
        items={typeFilteredItems}
        loading={loading}
        loadingText="Loading recipes..."
        viewMode={viewMode}
        emptyIcon={<UtensilsCrossed className="h-16 w-16 text-gray-300" />}
        emptyTitle="No recipes found"
        emptyDescription="Start by adding your first recipe"
        getItemId={(item) => String((item as any)._id || item.ID || 'unknown')}
        onEdit={openEditModal}
        onDelete={handleDelete}
        columns={[
          {
            key: "Name",
            header: "Recipe Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-sm flex items-center justify-center border ${
                  (item as any).type === "final"
                    ? "bg-blue-50/50 border-blue-100/50"
                    : (item as any).type === "sub"
                    ? "bg-purple-50/50 border-purple-100/50"
                    : "bg-gray-50/50 border-gray-100/50"
                }`}>
                  <UtensilsCrossed className={`h-5 w-5 ${
                    (item as any).type === "final"
                      ? "text-blue-600"
                      : (item as any).type === "sub"
                      ? "text-purple-600"
                      : "text-gray-600"
                  }`} />
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
            key: "type",
            header: "Type",
            render: (item: any) => (
              <span className={cn(
                "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                item.type === "final"
                  ? "bg-blue-50 text-blue-600 border-blue-100"
                  : item.type === "sub"
                  ? "bg-purple-50 text-purple-600 border-purple-100"
                  : "bg-gray-50 text-gray-600 border-gray-100"
              )}>
                {item.type ? (item.type === "final" ? "FINAL" : "SUB") : "—"}
              </span>
            ),
            className: "w-24",
          },
          {
            key: "ingredients",
            header: "Ingredients",
            render: (item: any) => {
              const ingredientCount = item.ingredients?.length || 0;
              return (
                <span className="text-sm font-bold text-gray-900">
                  {ingredientCount} {ingredientCount === 1 ? "item" : "items"}
                </span>
              );
            },
            className: "w-32",
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
        renderGridCard={(item: any, actions) => {
          const recipeType = item.type || "unknown";
          const typeLabel = recipeType === "final" ? "FINAL" : recipeType === "sub" ? "SUB" : "RECIPE";
          const ingredientCount = item.ingredients?.length || 0;
          const isActive = item.Status === "Active";

          return (
            <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
              <div className={cn("h-0.5 w-full shrink-0",
                recipeType === "final" ? "bg-blue-500" : recipeType === "sub" ? "bg-purple-500" : "bg-gray-400"
              )} />

              <div className="p-4 flex flex-col flex-1">
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    TYPE: {typeLabel}
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
                  <div className={cn(
                    "h-10 w-10 rounded-sm flex items-center justify-center shrink-0 border transition-colors",
                    recipeType === "final"
                      ? "bg-blue-50/50 border-blue-100/50 text-blue-600"
                      : recipeType === "sub"
                      ? "bg-purple-50/50 border-purple-100/50 text-purple-600"
                      : "bg-gray-50/50 border-gray-100/50 text-gray-600"
                  )}>
                    <UtensilsCrossed className="h-5 w-5 stroke-[1.5]" />
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
                      {item.Description || 'No description'}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Ingredients</span>
                    <span className="text-sm font-bold text-gray-900 tracking-tight pr-2">
                      {ingredientCount} {ingredientCount === 1 ? "item" : "items"}
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
                      {typeLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
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
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Delete Recipe"
        description={`Are you sure you want to delete "${recipeToDelete?.Name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </PageContainer>
  );
};

export default RecipesManagementPage;
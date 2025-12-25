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
        toast.error(result.message || "Failed to delete recipe", {
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
    <PageContainer hasSubmenu={true}>
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
            header: "Recipe Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                  (item as any).type === "final"
                    ? "bg-blue-50 border-blue-200"
                    : (item as any).type === "sub"
                    ? "bg-purple-50 border-purple-200"
                    : "bg-gray-50 border-gray-200"
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
                  <div className="font-medium text-gray-900">{item.Name}</div>
                  {item.Description && (
                    <div className="text-xs text-gray-500 truncate max-w-[300px]">{item.Description}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "type",
            header: "Type",
            render: (item: any) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.type === "final"
                  ? "bg-blue-100 text-blue-700"
                  : item.type === "sub"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {item.type ? (item.type === "final" ? "Final" : "Sub") : "—"}
              </span>
            ),
            className: "w-28",
          },
          {
            key: "ingredients",
            header: "Ingredients",
            render: (item: any) => {
              const ingredientCount = item.ingredients?.length || 0;
              return (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                    {ingredientCount}
                  </div>
                  <span className="text-sm text-gray-600">
                    {ingredientCount === 1 ? "item" : "items"}
                  </span>
                </div>
              );
            },
            className: "w-36",
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
        renderGridCard={(item: any, actions) => {
          const recipeType = item.type || "unknown";
          const typeLabel = recipeType === "final" ? "Final Recipe" : recipeType === "sub" ? "Sub Recipe" : "Recipe";
          const ingredientCount = item.ingredients?.length || 0;
          const isActive = item.Status === "Active";

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                recipeType === "final"
                  ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                  : recipeType === "sub"
                  ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
              }`}>
                <UtensilsCrossed className={`h-14 w-14 ${
                  recipeType === "final"
                    ? "text-blue-400"
                    : recipeType === "sub"
                    ? "text-purple-400"
                    : "text-gray-400"
                }`} />

                {/* Status Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {item.Status}
                </div>

                {/* Type Badge - Top Right */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  recipeType === "final"
                    ? "bg-blue-600 text-white"
                    : recipeType === "sub"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-600 text-white"
                }`}>
                  {typeLabel}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Recipe Name */}
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
                  {/* Ingredient Count */}
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${
                      recipeType === "final"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                    }`}>
                      <span className={`text-xs font-bold ${
                        recipeType === "final"
                          ? "text-blue-700"
                          : "text-purple-700"
                      }`}>
                        {ingredientCount}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {ingredientCount === 1 ? "ingredient" : "ingredients"}
                    </span>
                  </div>

                  {/* Cost Placeholder (can be implemented later) */}
                  <div className="text-xs text-gray-500">
                    {item.totalCost ? (
                      <span className="font-semibold text-gray-700">${formatPrice(item.totalCost)}</span>
                    ) : (
                      <span className="italic">Cost: N/A</span>
                    )}
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
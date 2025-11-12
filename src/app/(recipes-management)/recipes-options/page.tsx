"use client";

import React, { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import RecipeVariantModal from "./_components/recipe-variant-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useRecipeVariants } from "@/lib/hooks/useRecipeVariations";
import { RecipeVariant } from "@/lib/types/recipe-variants";

const RecipeVariationsPage = () => {
  const { showToast: globalShowToast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    // Data
    items,
    recipes,
    ingredients,
    loading,
    actionLoading,

    // Pagination
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    handlePageChange,

    // Filter states
    searchTerm,
    typeFilter,

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
    updateTypeFilter,
    deleteVariant,
  } = useRecipeVariants();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openAddModal();
  };

  const handleModalSubmit = async (data: any) => {
    const result = await handleModalSubmitOriginal(data);
    if (result.success) {
      if (editingItem) {
        globalShowToast("Recipe variant updated successfully", "success");
      } else {
        globalShowToast("Recipe variant added successfully", "success");
      }
    } else {
      globalShowToast(result.error || "Failed to save recipe variant", "error");
    }
    return result;
  };

  const handleDelete = async (variant: RecipeVariant) => {
    if (!variant._id) return;

    const result = await deleteVariant(variant._id);
    if (result.success) {
      globalShowToast("Recipe variant deleted successfully", "success");
    } else {
      globalShowToast(result.error || "Failed to delete recipe variant", "error");
    }
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
        <h1 className="text-3xl font-semibold mt-14 mb-2">Recipe Variations</h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage size, flavor, crust, and custom variations for your recipes
        </p>
      </header>

      {/* Enhanced Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={updateSearchTerm}
        searchPlaceholder="Search variations by name or description..."
        filters={[
          {
            options: [
              { label: "All Types", value: "all" },
              { label: "Size", value: "size", color: "blue" },
              { label: "Flavor", value: "flavor", color: "purple" },
              { label: "Crust", value: "crust", color: "red" },
              { label: "Custom", value: "custom", color: "green" },
            ],
            activeValue: typeFilter,
            onChange: (value) => updateTypeFilter(value),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={handleAddWithToast}
        primaryActionLabel="Add Variation"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
      />

      {/* Recipe Variations Grid */}
      <ResponsiveGrid<RecipeVariant>
        items={items}
        loading={loading}
        loadingText="Loading recipe variations..."
        viewMode={viewMode}
        // Pagination
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        emptyIcon={<Sparkles className="h-16 w-16 text-gray-300" />}
        emptyTitle="No recipe variations found"
        emptyDescription="Start by adding your first recipe variation"
        getItemId={(item) => String(item._id)}
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
            key: "name",
            header: "Variation Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                  item.type === "size"
                    ? "bg-blue-50 border-blue-200"
                    : item.type === "flavor"
                    ? "bg-purple-50 border-purple-200"
                    : item.type === "crust"
                    ? "bg-orange-50 border-orange-200"
                    : "bg-green-50 border-green-200"
                }`}>
                  <Sparkles className={`h-5 w-5 ${
                    item.type === "size"
                      ? "text-blue-600"
                      : item.type === "flavor"
                      ? "text-purple-600"
                      : item.type === "crust"
                      ? "text-orange-600"
                      : "text-green-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 truncate max-w-[300px]">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "type",
            header: "Type",
            render: (item) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.type === "size"
                  ? "bg-blue-100 text-blue-700"
                  : item.type === "flavor"
                  ? "bg-purple-100 text-purple-700"
                  : item.type === "crust"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
            ),
            className: "w-28",
          },
          {
            key: "ingredients",
            header: "Ingredients",
            render: (item) => {
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
            key: "costAdjustment",
            header: "Cost Adjustment",
            render: (item) => (
              <span className="text-sm font-semibold text-gray-700">
                {item.baseCostAdjustment ? `$${item.baseCostAdjustment.toFixed(2)}` : "—"}
              </span>
            ),
            className: "w-36",
          },
        ]}
        renderGridCard={(item, actions) => {
          const ingredientCount = item.ingredients?.length || 0;
          const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                item.type === "size"
                  ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                  : item.type === "flavor"
                  ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                  : item.type === "crust"
                  ? "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
                  : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              }`}>
                <Sparkles className={`h-14 w-14 ${
                  item.type === "size"
                    ? "text-blue-400"
                    : item.type === "flavor"
                    ? "text-purple-400"
                    : item.type === "crust"
                    ? "text-orange-400"
                    : "text-green-400"
                }`} />

                {/* Type Badge - Top Right */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  item.type === "size"
                    ? "bg-blue-600 text-white"
                    : item.type === "flavor"
                    ? "bg-purple-600 text-white"
                    : item.type === "crust"
                    ? "bg-orange-600 text-white"
                    : "bg-green-600 text-white"
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
                {/* Variation Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.name}>
                  {item.name}
                </h3>

                {/* Description */}
                {item.description ? (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {item.description}
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
                      item.type === "size"
                        ? "bg-blue-100"
                        : item.type === "flavor"
                        ? "bg-purple-100"
                        : item.type === "crust"
                        ? "bg-orange-100"
                        : "bg-green-100"
                    }`}>
                      <span className={`text-xs font-bold ${
                        item.type === "size"
                          ? "text-blue-700"
                          : item.type === "flavor"
                          ? "text-purple-700"
                          : item.type === "crust"
                          ? "text-orange-700"
                          : "text-green-700"
                      }`}>
                        {ingredientCount}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {ingredientCount === 1 ? "ingredient" : "ingredients"}
                    </span>
                  </div>

                  {/* Cost Adjustment */}
                  <div className="text-xs text-gray-500">
                    {item.baseCostAdjustment ? (
                      <span className="font-semibold text-gray-700">+${item.baseCostAdjustment.toFixed(2)}</span>
                    ) : (
                      <span className="italic">No cost adj.</span>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                {item.sizeMultiplier && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Size: <span className="font-semibold text-gray-700">{item.sizeMultiplier}x</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />

      {/* Recipe Variant Modal */}
      <RecipeVariantModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        recipes={recipes}
        ingredients={ingredients}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        actionLoading={actionLoading}
        showToast={globalShowToast}
      />
    </div>
  );
};

export default RecipeVariationsPage;

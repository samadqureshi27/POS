"use client";

import React, { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { toast } from "sonner";
import { Toaster } from "sonner";
import RecipeVariantModal from "./_components/recipe-variant-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useRecipeVariants } from "@/lib/hooks/useRecipeVariations";
import { RecipeVariant } from "@/lib/types/recipe-variants";
import { formatPrice } from "@/lib/util/formatters";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

const RecipeVariationsPage = () => {
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
        toast.success("Recipe variant updated successfully", {
          duration: 5000,
          position: "top-right",
        });
      } else {
        toast.success("Recipe variant added successfully", {
          duration: 5000,
          position: "top-right",
        });
      }
    } else {
      toast.error(result.error || "Failed to save recipe variant", {
        duration: 5000,
        position: "top-right",
      });
    }
    return result;
  };

  const handleDelete = async (variant: RecipeVariant) => {
    if (!variant._id) return;

    const result = await deleteVariant(variant._id);
    if (result.success) {
      toast.success("Recipe variant deleted successfully", {
        duration: 5000,
        position: "top-right",
      });
    } else {
      toast.error(result.error || "Failed to delete recipe variant", {
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
      <Toaster position="top-right" />

      {/* Page Header */}
      <PageHeader
        title="Recipe Variations"
        subtitle="Manage size, flavor, crust, and custom variations for your recipes"
      />

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
        columns={[
          {
            key: "name",
            header: "Variation Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-sm flex items-center justify-center border",
                  item.type === "size" ? "bg-blue-50/50 border-blue-100/50 text-blue-600" :
                    item.type === "flavor" ? "bg-purple-50/50 border-purple-100/50 text-purple-600" :
                      item.type === "crust" ? "bg-orange-50/50 border-orange-100/50 text-orange-600" :
                        "bg-green-50/50 border-green-100/50 text-green-600"
                )}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">{item.name}</div>
                  {item.description && (
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate max-w-[300px]">
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
              <span className={cn(
                "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                item.type === "size" ? "text-blue-600 bg-blue-50 border-blue-100" :
                  item.type === "flavor" ? "text-purple-600 bg-purple-50 border-purple-100" :
                    item.type === "crust" ? "text-orange-600 bg-orange-50 border-orange-100" :
                      "text-green-600 bg-green-50 border-green-100"
              )}>
                {item.type?.toUpperCase()}
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
                  <div className="flex items-center justify-center h-6 w-6 rounded-sm bg-gray-100 text-[10px] font-bold text-gray-700">
                    {ingredientCount}
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">
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
              <span className="text-sm font-bold text-gray-900">
                {item.baseCostAdjustment ? `$${formatPrice(item.baseCostAdjustment)}` : "—"}
              </span>
            ),
            className: "w-36",
          },
        ]}
        renderGridCard={(item, actions) => {
          const ingredientCount = item.ingredients?.length || 0;
          const status = item.type === "size"
            ? { label: "SIZE", color: "text-blue-600 bg-blue-50 border-blue-100", bar: "bg-blue-500" }
            : item.type === "flavor"
              ? { label: "FLAVOR", color: "text-purple-600 bg-purple-50 border-purple-100", bar: "bg-purple-500" }
              : item.type === "crust"
                ? { label: "CRUST", color: "text-orange-600 bg-orange-50 border-orange-100", bar: "bg-orange-500" }
                : { label: "CUSTOM", color: "text-green-600 bg-green-50 border-green-100", bar: "bg-green-500" };

          return (
            <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
              <div className={cn("h-0.5 w-full shrink-0", status.bar)} />

              <div className="p-4 flex flex-col flex-1">
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    ID: {item._id?.slice(-6).toUpperCase() || 'NEW'}
                  </span>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold tracking-widest border",
                    status.color
                  )}>
                    {status.label}
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex items-start gap-3 mb-6">
                  <div className={cn(
                    "h-10 w-10 rounded-sm flex items-center justify-center shrink-0 border transition-colors",
                    item.type === "size" ? "bg-blue-50/50 border-blue-100/50 text-blue-600" :
                      item.type === "flavor" ? "bg-purple-50/50 border-purple-100/50 text-purple-600" :
                        item.type === "crust" ? "bg-orange-50/50 border-orange-100/50 text-orange-600" :
                          "bg-green-50/50 border-green-100/50 text-green-600"
                  )}>
                    <Sparkles className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-gray-800 leading-tight truncate group-hover:text-black transition-colors" title={item.name}>
                        {item.name}
                      </h3>
                      <div className="flex lg:hidden items-center gap-1 shrink-0">
                        {actions}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight truncate">
                      {item.description || 'No Description'}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Ingredients</span>
                    <span className="text-sm font-bold text-gray-900 tracking-tight pr-2">
                      {ingredientCount} {ingredientCount === 1 ? 'ITEM' : 'ITEMS'}
                    </span>
                  </div>

                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    <div className="flex items-center gap-1">
                      {actions}
                    </div>
                  </div>

                  <div className="lg:hidden flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Adjustment</span>
                    <span className="text-xs font-bold text-gray-900">
                      {item.baseCostAdjustment
                        ? `+$${formatPrice(item.baseCostAdjustment)}`
                        : "NO ADJUSTMENT"}
                    </span>
                  </div>
                </div>
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
      />
    </PageContainer>
  );
};

export default RecipeVariationsPage;

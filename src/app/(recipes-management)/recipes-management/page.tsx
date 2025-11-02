"use client";
import React, { useState, useMemo } from "react";
import { UtensilsCrossed, Plus } from "lucide-react";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import RecipeModal from "./_components/recipe-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useRecipeData } from "@/lib/hooks/useRecipeData";
import { RecipeOption } from "@/lib/types/recipes";

// add view only modal for recipe items with compact view

const RecipesManagementPage = () => {
  const { showToast: globalShowToast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [recipeTypeFilter, setRecipeTypeFilter] = useState<"all" | "final" | "sub">("all");

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
  } = useRecipeData();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openAddModal();
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
    <div className="p-6 bg-background min-w-full h-full overflow-y-auto thin-scroll">
      <Toaster position="top-right" />

      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold mt-14 mb-2">Recipes Management</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your final recipes and sub-recipes</p>
      </header>

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
        getItemId={(item) => String(item.ID)}
        onEdit={openEditModal}
        customActions={(item) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditModal(item)}
              className="px-3 py-1 bg-gray-900 hover:bg-black text-white text-sm rounded-md transition-all"
            >
              Edit
            </button>
          </div>
        )}
        columns={[
          {
            key: "ID",
            header: "ID",
            render: (item) => <span className="text-gray-700 font-mono text-sm">#{item.ID}</span>,
            className: "w-20",
          },
          {
            key: "Name",
            header: "Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                  <UtensilsCrossed className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.Name}</div>
                  {item.Description && (
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.Description}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "type",
            header: "Type",
            render: (item: any) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.type === "final"
                  ? "bg-blue-100 text-blue-700"
                  : item.type === "sub"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {item.type ? (item.type === "final" ? "Final Recipe" : "Sub Recipe") : "—"}
              </span>
            ),
          },
          {
            key: "Status",
            header: "Status",
            render: (item) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.Status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {item.Status}
              </span>
            ),
          },
          {
            key: "Priority",
            header: "Priority",
            render: (item) => <span className="text-gray-700">{item.Priority || "—"}</span>,
          },
        ]}
        renderGridCard={(item: any, actions) => {
          const recipeType = item.type || "unknown";
          const typeLabel = recipeType === "final" ? "Final Recipe" : recipeType === "sub" ? "Sub Recipe" : "Recipe";
          const typeColor = recipeType === "final" ? "bg-blue-100 text-blue-700" : recipeType === "sub" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700";

          return (
            <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
              {/* Card Header - Icon */}
              <div className="relative h-32 bg-gray-50 flex items-center justify-center border-b border-gray-200">
                <UtensilsCrossed className="h-12 w-12 text-gray-300" />

                {/* Type Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${typeColor}`}>
                  {typeLabel}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{item.Name}</h3>
                <p className="text-xs text-gray-500 font-mono mb-3">ID: #{item.ID}</p>

                {/* Info Grid */}
                <div className="space-y-2 mb-4">
                  {/* Status */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.Status === "Active"
                        ? "text-green-600 bg-green-50"
                        : "text-red-600 bg-red-50"
                    }`}>
                      {item.Status}
                    </span>
                  </div>

                  {/* Description */}
                  {item.Description && (
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-600 mb-1">Description:</span>
                      <span className="text-gray-700 text-xs line-clamp-2">{item.Description}</span>
                    </div>
                  )}

                  {/* Priority */}
                  {item.Priority !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Priority:</span>
                      <span className="text-gray-900 font-medium">{item.Priority}</span>
                    </div>
                  )}
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
        showToast={globalShowToast}
      />
    </div>
  );
};

export default RecipesManagementPage;
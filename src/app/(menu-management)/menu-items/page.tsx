"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Plus } from "lucide-react";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import MenuItemModal from "./_components/menu-item-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useMenuItemData } from "@/lib/hooks/useMenuItemData";
import { MenuItemOption } from "@/lib/types/menu";
import { formatPrice } from "@/lib/util/formatters";

const MenuItemsManagementPage = () => {
  const router = useRouter();
  const { showToast: globalShowToast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItemOption | null>(null);

  const {
    // Data
    filteredItems,
    categories,
    recipes,
    loading,
    actionLoading,

    // Filter states
    searchTerm,
    statusFilter,
    categoryFilter,

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
    updateCategoryFilter,

    // Utility
    refreshData,
  } = useMenuItemData();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openAddModal();
  };

  const handleModalSubmit = async (data: any) => {
    const result = await handleModalSubmitOriginal(data);
    if (result.success) {
      if (editingItem) {
        globalShowToast("Menu item updated successfully", "success");
      } else {
        globalShowToast("Menu item added successfully", "success");
      }
    }
    return result;
  };

  const handleDelete = (menuItem: MenuItemOption) => {
    setItemToDelete(menuItem);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;


    const itemId = itemToDelete.ID;

    if (!itemId) {
      console.error("❌ Menu item ID is missing");
      globalShowToast("Menu item ID is missing", "error");
      return;
    }


    try {
      const MenuService = (await import("@/lib/services/menu-service")).MenuService;

      const result = await MenuService.deleteMenuItem(itemId);

      if (result.success) {
        globalShowToast("Menu item deleted successfully", "success");
        await refreshData();
      } else {
        globalShowToast(result.message || "Failed to delete menu item", "error");
      }
    } catch (error: any) {
      console.error("Error deleting menu item:", error);
      globalShowToast(error.message || "Failed to delete menu item", "error");
      router.refresh();
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
        <h1 className="text-3xl font-semibold mt-14 mb-2">Menu Items</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your menu items with pricing and details</p>
      </header>

      {/* Enhanced Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={updateSearchTerm}
        searchPlaceholder="Search menu items by name or code..."
        filters={[
          {
            options: [
              { label: "All Categories", value: "" },
              ...categories.map((cat: any) => ({
                label: cat.name,
                value: cat._id || cat.id,
              })),
            ],
            activeValue: categoryFilter,
            onChange: (value) => updateCategoryFilter(value),
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
        primaryActionLabel="Add Menu Item"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
      />

      {/* Menu Items Grid */}
      <ResponsiveGrid<MenuItemOption>
        items={filteredItems}
        loading={loading}
        loadingText="Loading menu items..."
        viewMode={viewMode}
        emptyIcon={<UtensilsCrossed className="h-16 w-16 text-gray-300" />}
        emptyTitle="No menu items found"
        emptyDescription="Start by adding your first menu item"
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
            header: "Item Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                {item.ImageUrl ? (
                  <img
                    src={item.ImageUrl}
                    alt={item.Name}
                    className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center border bg-orange-50 border-orange-200">
                    <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                  </div>
                )}
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
            key: "Category",
            header: "Category",
            render: (item) => (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {item.Category || "Uncategorized"}
              </span>
            ),
            className: "w-36",
          },
          {
            key: "BasePrice",
            header: "Price",
            render: (item) => (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-xs font-semibold text-green-700">
                  {item.Currency}
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.BasePrice)}
                </span>
              </div>
            ),
            className: "w-32",
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
          const hasRecipe = !!item.Recipe;
          const tagCount = item.Tags.length;

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className="relative h-28 flex items-center justify-center border-b-2 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                {item.ImageUrl ? (
                  <>
                    <img
                      src={item.ImageUrl}
                      alt={item.Name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                  </>
                ) : (
                  <UtensilsCrossed className="h-14 w-14 text-orange-400" />
                )}

                {/* Status Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {item.Status}
                </div>

                {/* Category Badge - Top Right */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-orange-600 text-white">
                  {item.Category || "N/A"}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Item Name */}
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

                {/* Tags */}
                {tagCount > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.Tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {tagCount > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{tagCount - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-orange-100">
                      <span className="text-xs font-bold text-orange-700">
                        {item.Currency}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrice(item.BasePrice)}
                    </span>
                  </div>

                  {/* Recipe Indicator */}
                  <div className="text-xs text-gray-500">
                    {hasRecipe ? (
                      <span className="font-semibold text-gray-700">Has Recipe</span>
                    ) : (
                      <span className="italic">No Recipe</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Menu Item Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        actionLoading={actionLoading}
        categories={categories}
        recipes={recipes}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Menu Item"
        description={`Are you sure you want to delete "${itemToDelete?.Name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default MenuItemsManagementPage;

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Plus } from "lucide-react";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import MenuItemModal from "./_components/menu-item-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useMenuItemData } from "@/lib/hooks/useMenuItemData";
import { MenuItemOption } from "@/lib/types/menu";
import { formatPrice } from "@/lib/util/formatters";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { logError } from "@/lib/util/logger";

const MenuItemsManagementPage = () => {
  const router = useRouter();
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
    deleteMenuItem,
  } = useMenuItemData();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    openAddModal();
  };

  const handleModalSubmit = async (data: any) => {
    const result = await handleModalSubmitOriginal(data);
    if (result.success) {
      const message = editingItem ? "Menu item updated successfully" : "Menu item added successfully";
      toast.success(message, {
        duration: 5000,
        position: "top-right",
      });
      // No need to refresh - optimistic update in hook handles it
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
      logError("Menu item ID is missing", new Error("Menu item ID is undefined"), {
        component: "MenuItemsManagement",
        action: "confirmDelete",
      });
      toast.error("Menu item ID is missing");
      return;
    }

    try {
      // Use hook's delete function which has optimistic update
      const result = await deleteMenuItem(itemId);

      if (result.success) {
        toast.success("Menu item deleted successfully", {
          duration: 5000,
          position: "top-right",
        });
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } else {
        toast.error((result?.message as string) || "Failed to delete menu item", {
          duration: 5000,
          position: "top-right",
        });
      }
    } catch (error: any) {
      logError("Error deleting menu item", error, {
        component: "MenuItemsManagement",
        action: "confirmDelete",
        itemId: itemToDelete?.ID,
      });
      toast.error((error?.message as string) || "Failed to delete menu item", {
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
        title="Menu Items"
        subtitle="Manage your menu items with pricing and details"
      />

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
                    className="h-10 w-10 rounded-sm object-cover border border-[#d5d5dd]"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-sm flex items-center justify-center border bg-orange-50/50 border-orange-100/50 text-orange-600">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>
                )}
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
            key: "Category",
            header: "Category",
            render: (item) => (
              <span className="px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border text-blue-600 bg-blue-50 border-blue-100">
                {(item.Category || "UNCATEGORIZED").toUpperCase()}
              </span>
            ),
            className: "w-36",
          },
          {
            key: "BasePrice",
            header: "Price",
            render: (item) => (
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-gray-400">{item.Currency}</span>
                <span className="text-sm font-bold text-gray-900">
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
                    ID: {item.ID?.slice(-6).toUpperCase()}
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
                  {item.ImageUrl ? (
                    <img
                      src={item.ImageUrl}
                      alt={item.Name}
                      className="h-10 w-10 rounded-sm object-cover border border-[#d5d5dd] shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-sm flex items-center justify-center shrink-0 border bg-orange-50/50 border-orange-100/50 text-orange-600 transition-colors">
                      <UtensilsCrossed className="h-5 w-5 stroke-[1.5]" />
                    </div>
                  )}
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
                      {item.Category || 'General Menu'}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Price</span>
                    <span className="text-base font-bold text-gray-900 tracking-tight pr-2">
                      <span className="text-[10px] font-medium text-gray-400 mr-0.5">{item.Currency}</span>
                      {formatPrice(item.BasePrice)}
                    </span>
                  </div>

                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    <div className="flex items-center gap-1">
                      {actions}
                    </div>
                  </div>

                  <div className="lg:hidden flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Details</span>
                    <span className="text-xs font-bold text-gray-900">
                      {item.Recipe ? 'Recipe Linked' : 'No Recipe'}
                    </span>
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
    </PageContainer>
  );
};

export default MenuItemsManagementPage;

"use client";

import React, { useState } from "react";
import { Settings, Plus } from "lucide-react";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { toast } from "sonner";
import { Toaster } from "sonner";
import MenuModal from "./_components/menu-modal";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import { useMenuOptions } from "@/lib/hooks/useMenuOptions";
import { MenuItemOptions } from "@/lib/types/menuItemOptions";
import { formatPrice } from "@/lib/util/formatters";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

const AddOnsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    // State
    loading,
    searchTerm,
    actionLoading,
    DisplayFilter,
    filteredItems,
    isModalOpen,
    editingItem,
    formData,

    // Setters
    setSearchTerm,
    setDisplayFilter,
    setFormData,
    setIsModalOpen,

    // Handlers
    handleModalSubmit: handleModalSubmitOriginal,
    handleCloseModal,
    handleEditItem,

    // Utils
    isFormValid,
    refreshData,
  } = useMenuOptions();

  // Enhanced action handlers with consistent toast notifications
  const handleAddWithToast = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    const result = await handleModalSubmitOriginal();
    if (result.success) {
      const message = editingItem ? "Add-on updated successfully" : "Add-on created successfully";
      toast.success(message, {
        duration: 5000,
        position: "top-right",
      });
      // Refresh to get latest data since menu-options uses different hook
      await refreshData();
    }
  };

  const handleDelete = async (item: MenuItemOptions) => {
    if (!item.groupId) {
      toast.error("Cannot delete: Invalid group ID", {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    try {
      // Delete the group - backend should handle cascade delete of items
      const { AddonsGroupsService } = await import("@/lib/services/addons-groups-service");
      const deleteRes = await AddonsGroupsService.deleteGroup(item.groupId);

      if (deleteRes.success) {
        toast.success("Add-on deleted successfully", {
          duration: 5000,
          position: "top-right",
        });
        // Refresh to get latest data
        await refreshData();
      } else {
        toast.error(deleteRes.message || "Failed to delete add-on", {
          duration: 5000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting add-on:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete add-on", {
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

      <PageHeader
        title="Add-ons"
        subtitle="Manage modifiers and customization options for your menu items"
      />

      {/* Enhanced Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search add-ons by name..."
        filters={[
          {
            options: [
              { label: "All Types", value: "" },
              { label: "Radio", value: "Radio", color: "blue" },
              { label: "Select", value: "Select", color: "purple" },
              { label: "Checkbox", value: "Checkbox", color: "green" },
            ],
            activeValue: DisplayFilter,
            onChange: (value) => setDisplayFilter(value as "" | "Radio" | "Select" | "Checkbox"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={handleAddWithToast}
        primaryActionLabel="Add Add-on"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
      />

      {/* Add-ons Grid */}
      <ResponsiveGrid<MenuItemOptions>
        items={filteredItems}
        loading={loading}
        loadingText="Loading add-ons..."
        viewMode={viewMode}
        emptyIcon={<Settings className="h-16 w-16 text-gray-300" />}
        emptyTitle="No add-ons found"
        emptyDescription="Start by adding your first add-on"
        getItemId={(item) => String(item.ID)}
        onEdit={handleEditItem}
        onDelete={handleDelete}
        customActions={(item) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEditItem(item)}
              className="px-3 py-1 bg-gray-900 hover:bg-black text-white text-sm rounded-sm transition-all"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-sm transition-all"
            >
              Delete
            </button>
          </div>
        )}
        columns={[
          {
            key: "Name",
            header: "Add-on Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-sm flex items-center justify-center border",
                  item.DisplayType === "Radio" ? "bg-blue-50/50 border-blue-100/50 text-blue-600" :
                    item.DisplayType === "Select" ? "bg-purple-50/50 border-purple-100/50 text-purple-600" :
                      "bg-green-50/50 border-green-100/50 text-green-600"
                )}>
                  <Settings className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">{item.Name}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate">
                    Priority: {item.Priority}
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: "DisplayType",
            header: "Type",
            render: (item) => (
              <span className={cn(
                "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                item.DisplayType === "Radio" ? "text-blue-600 bg-blue-50 border-blue-100" :
                  item.DisplayType === "Select" ? "text-purple-600 bg-purple-50 border-purple-100" :
                    "text-green-600 bg-green-50 border-green-100"
              )}>
                {item.DisplayType?.toUpperCase()}
              </span>
            ),
            className: "w-28",
          },
          {
            key: "OptionValue",
            header: "Options",
            render: (item) => {
              const optionCount = item.OptionValue?.length || 0;
              return (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-sm bg-gray-100 text-[10px] font-bold text-gray-700">
                    {optionCount}
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {optionCount === 1 ? "option" : "options"}
                  </span>
                </div>
              );
            },
            className: "w-36",
          },
        ]}
        renderGridCard={(item, actions) => {
          const optionCount = item.OptionValue?.length || 0;
          const status = item.DisplayType === "Radio"
            ? { label: "RADIO", color: "text-blue-600 bg-blue-50 border-blue-100", bar: "bg-blue-500" }
            : item.DisplayType === "Select"
              ? { label: "SELECT", color: "text-purple-600 bg-purple-50 border-purple-100", bar: "bg-purple-500" }
              : { label: "CHECKBOX", color: "text-green-600 bg-green-50 border-green-100", bar: "bg-green-500" };

          return (
            <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
              <div className={cn("h-0.5 w-full shrink-0", status.bar)} />

              <div className="p-4 flex flex-col flex-1">
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    ID: {item.ID?.toString().padStart(3, '0') || 'NEW'}
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
                    item.DisplayType === "Radio" ? "bg-blue-50/50 border-blue-100/50 text-blue-600" :
                      item.DisplayType === "Select" ? "bg-purple-50/50 border-purple-100/50 text-purple-600" :
                        "bg-green-50/50 border-green-100/50 text-green-600"
                  )}>
                    <Settings className="h-5 w-5 stroke-[1.5]" />
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
                      Priority: {item.Priority}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Options</span>
                    <span className="text-sm font-bold text-gray-900 tracking-tight pr-2">
                      {optionCount} {optionCount === 1 ? 'OPTION' : 'OPTIONS'}
                    </span>
                  </div>

                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    <div className="flex items-center gap-1">
                      {actions}
                    </div>
                  </div>

                  <div className="lg:hidden flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Price Range</span>
                    <span className="text-xs font-bold text-gray-900">
                      {item.OptionPrice && item.OptionPrice.length > 0
                        ? `$${formatPrice(Math.min(...item.OptionPrice))} - $${formatPrice(Math.max(...item.OptionPrice))}`
                        : "NO PRICE"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Add-on Modal */}
      <MenuModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleModalSubmit}
        onClose={handleCloseModal}
        isFormValid={isFormValid}
      />
    </PageContainer>
  );
};

export default AddOnsPage;

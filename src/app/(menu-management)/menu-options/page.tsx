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
            header: "Add-on Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                  item.DisplayType === "Radio"
                    ? "bg-blue-50 border-blue-200"
                    : item.DisplayType === "Select"
                    ? "bg-purple-50 border-purple-200"
                    : "bg-green-50 border-green-200"
                }`}>
                  <Settings className={`h-5 w-5 ${
                    item.DisplayType === "Radio"
                      ? "text-blue-600"
                      : item.DisplayType === "Select"
                      ? "text-purple-600"
                      : "text-green-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.Name}</div>
                  <div className="text-xs text-gray-500">
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
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.DisplayType === "Radio"
                  ? "bg-blue-100 text-blue-700"
                  : item.DisplayType === "Select"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {item.DisplayType}
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
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                    {optionCount}
                  </div>
                  <span className="text-sm text-gray-600">
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

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                item.DisplayType === "Radio"
                  ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                  : item.DisplayType === "Select"
                  ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                  : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              }`}>
                <Settings className={`h-14 w-14 ${
                  item.DisplayType === "Radio"
                    ? "text-blue-400"
                    : item.DisplayType === "Select"
                    ? "text-purple-400"
                    : "text-green-400"
                }`} />

                {/* Type Badge - Top Right */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  item.DisplayType === "Radio"
                    ? "bg-blue-600 text-white"
                    : item.DisplayType === "Select"
                    ? "bg-purple-600 text-white"
                    : "bg-green-600 text-white"
                }`}>
                  {item.DisplayType}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Add-on Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.Name}>
                  {item.Name}
                </h3>

                {/* Priority */}
                <div className="text-xs text-gray-500 mb-3">
                  Priority: <span className="font-semibold text-gray-700">{item.Priority}</span>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  {/* Option Count */}
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${
                      item.DisplayType === "Radio"
                        ? "bg-blue-100"
                        : item.DisplayType === "Select"
                        ? "bg-purple-100"
                        : "bg-green-100"
                    }`}>
                      <span className={`text-xs font-bold ${
                        item.DisplayType === "Radio"
                          ? "text-blue-700"
                          : item.DisplayType === "Select"
                          ? "text-purple-700"
                          : "text-green-700"
                      }`}>
                        {optionCount}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {optionCount === 1 ? "option" : "options"}
                    </span>
                  </div>

                  {/* Price Range */}
                  {item.OptionPrice && item.OptionPrice.length > 0 && (
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">
                        ${formatPrice(Math.min(...item.OptionPrice))} - ${formatPrice(Math.max(...item.OptionPrice))}
                      </span>
                    </div>
                  )}
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

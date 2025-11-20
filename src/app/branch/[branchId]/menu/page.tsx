<<<<<<< HEAD
"use client";

import React, { useState, useMemo } from "react";
import { UtensilsCrossed, Settings, Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatPrice } from "@/lib/util/formatters";
import { useBranchMenu } from "@/lib/hooks/useBranchMenu";
import BranchMenuModal from "./_components/branch-menu-modal";
import type { EffectiveMenuItem } from "@/lib/services/branch-menu-service";

const BranchMenuPage = () => {
  const params = useParams();
  const branchId = (params?.branchId as string) || "";

  const {
    // Data
    filteredItems,
    loading,
    actionLoading,
    stats,
    branchObjectId,
    categories,

    // Filters
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    assignmentFilter,
    setAssignmentFilter,

    // Modal
    isModalOpen,
    editingItem,
    openAddModal,
    openEditModal,
    closeModal,

    // Actions
    handleAddToMenu,
    handleUpdateConfig,
    handleRemoveFromMenu,
  } = useBranchMenu(branchId);

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(21);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<EffectiveMenuItem | null>(null);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  const handleRemove = (item: EffectiveMenuItem) => {
    setItemToRemove(item);
    setDeleteDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove || !itemToRemove.branchConfig) return;

    const configId = itemToRemove.branchConfig._id || itemToRemove.branchConfig.id;
    if (!configId) return;

    await handleRemoveFromMenu(configId);
    setDeleteDialogOpen(false);
    setItemToRemove(null);
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showActionBar={true} hasSubmenu={true} />;
  }

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      <PageHeader
        title={`Menu Management - Branch ${branchId}`}
        subtitle="Configure menu items for this branch with custom pricing and availability"
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdvancedMetricCard
          title="Total Items"
          subtitle="Available in base menu"
          value={stats.totalItems}
          icon="inventory"
          format="number"
        />

        <AdvancedMetricCard
          title="Assigned Items"
          subtitle="Active in branch"
          value={stats.assignedItems}
          icon="target"
          format="number"
          status="good"
        />

        <AdvancedMetricCard
          title="Available"
          subtitle="Ready to order"
          value={stats.availableItems}
          icon="inventory"
          format="number"
          status="good"
        />

        <AdvancedMetricCard
          title="Featured"
          subtitle="Highlighted items"
          value={stats.featuredItems}
          icon="target"
          format="number"
          status="neutral"
        />
      </div>

      {/* Action Bar */}
      <EnhancedActionBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search menu items by name or category..."
        filters={[
          {
            options: [
              { label: "All Categories", value: "all" },
              ...categories.map(cat => ({
                label: cat || "Uncategorized",
                value: cat || "",
              })),
            ],
            activeValue: categoryFilter,
            onChange: setCategoryFilter,
          },
          {
            options: [
              { label: "All Items", value: "all" },
              { label: "Assigned", value: "assigned", color: "green" },
              { label: "Unassigned", value: "unassigned", color: "gray" },
            ],
            activeValue: assignmentFilter,
            onChange: (value) => setAssignmentFilter(value as "all" | "assigned" | "unassigned"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={() => setAssignmentFilter("unassigned")}
        primaryActionLabel="Browse Items to Add"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
        primaryActionDisabled={!branchObjectId || loading}
      />

      {/* Menu Items Grid */}
      <ResponsiveGrid<EffectiveMenuItem>
        items={paginatedItems}
        loading={loading}
        loadingText="Loading menu items..."
        viewMode={viewMode}
        emptyIcon={<UtensilsCrossed className="h-16 w-16 text-gray-300" />}
        emptyTitle="No menu items found"
        emptyDescription="No items match your current filters"
        getItemId={(item) => item._id || item.id || ""}
        customActions={(item) => {
          const isAssigned = !!item.branchConfig;
          return (
            <div className="flex items-center gap-2">
              {isAssigned ? (
                <>
                  <Button
                    onClick={() => openEditModal(item)}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <Button
                    onClick={() => handleRemove(item)}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => openAddModal(item)}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Menu
                </Button>
              )}
            </div>
          );
        }}
        // Pagination props
        showPagination={true}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredItems.length}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        columns={[
          {
            key: "name",
            header: "Item Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center border bg-orange-50 border-orange-200">
                    <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 truncate max-w-[300px]">{item.description}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "category",
            header: "Category",
            render: (item) => (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {item.category || "Uncategorized"}
              </span>
            ),
            className: "w-36",
          },
          {
            key: "price",
            header: "Price",
            render: (item) => {
              const effectivePrice = item.branchConfig?.sellingPrice || item.basePrice;
              const hasOverride = item.branchConfig?.sellingPrice && item.branchConfig.sellingPrice !== item.basePrice;

              return (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${hasOverride ? 'text-orange-600' : 'text-gray-900'}`}>
                      {formatPrice(effectivePrice)}
                    </span>
                  </div>
                  {hasOverride && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(item.basePrice)}
                    </span>
                  )}
                </div>
              );
            },
            className: "w-32",
          },
          {
            key: "status",
            header: "Branch Status",
            render: (item) => {
              const isAssigned = !!item.branchConfig;
              const isAvailable = item.branchConfig?.isAvailable;

              return (
                <div className="flex flex-col gap-1">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-center ${
                    isAssigned
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {isAssigned ? "Assigned" : "Unassigned"}
                  </span>
                  {isAssigned && !isAvailable && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-center bg-red-100 text-red-700">
                      Unavailable
                    </span>
                  )}
                </div>
              );
            },
            className: "w-32",
          },
        ]}
        renderGridCard={(item, actions) => {
          const isAssigned = !!item.branchConfig;
          const isAvailable = item.branchConfig?.isAvailable ?? true;
          const isFeatured = item.branchConfig?.isFeatured ?? false;
          const effectivePrice = item.branchConfig?.sellingPrice || item.basePrice;
          const hasOverride = item.branchConfig?.sellingPrice && item.branchConfig.sellingPrice !== item.basePrice;
          const tagCount = item.tags?.length || 0;

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                isAssigned
                  ? isAvailable
                    ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                    : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
              }`}>
                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                  </>
                ) : (
                  <UtensilsCrossed className={`h-14 w-14 ${
                    isAssigned ? isAvailable ? "text-green-400" : "text-red-400" : "text-gray-400"
                  }`} />
                )}

                {/* Assignment Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isAssigned
                    ? isAvailable
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-500 text-white"
                }`}>
                  {isAssigned ? isAvailable ? "Available" : "Unavailable" : "Unassigned"}
                </div>

                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-yellow-500 text-white">
                    ⭐ Featured
                  </div>
                )}

                {/* Category Badge - Top Right (if not featured) */}
                {!isFeatured && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-orange-600 text-white">
                    {item.category || "N/A"}
                  </div>
                )}

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Item Name */}
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

                {/* Tags */}
                {tagCount > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags!.slice(0, 3).map((tag, idx) => (
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
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-orange-100">
                        <span className="text-xs font-bold text-orange-700">
                          {item.currency || "PKR"}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${hasOverride ? 'text-orange-600' : 'text-gray-900'}`}>
                        {formatPrice(effectivePrice)}
                      </span>
                    </div>
                    {hasOverride && (
                      <span className="text-xs text-gray-500 line-through ml-9">
                        {formatPrice(item.basePrice)}
                      </span>
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="flex flex-col gap-1">
                    {item.branchConfig?.isVisibleInPOS && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700">
                        POS
                      </span>
                    )}
                    {item.branchConfig?.isVisibleInOnline && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
                        Online
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Branch Menu Modal */}
      <BranchMenuModal
        isOpen={isModalOpen}
        item={editingItem}
        branchObjectId={branchObjectId}
        onClose={closeModal}
        onSave={handleAddToMenu}
        onUpdate={handleUpdateConfig}
        actionLoading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Remove from Branch Menu"
        description={`Are you sure you want to remove "${itemToRemove?.name}" from this branch's menu? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setItemToRemove(null);
        }}
        variant="danger"
      />
    </PageContainer>
  );
};

export default BranchMenuPage;
=======
"use client";

import React, { useState, useMemo } from "react";
import { UtensilsCrossed, Settings, Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatPrice } from "@/lib/util/formatters";
import { useBranchMenu } from "@/lib/hooks/useBranchMenu";
import BranchMenuModal from "./_components/branch-menu-modal";
import type { EffectiveMenuItem } from "@/lib/services/branch-menu-service";

const BranchMenuPage = () => {
  const params = useParams();
  const branchId = (params?.branchId as string) || "";

  const {
    // Data
    filteredItems,
    loading,
    actionLoading,
    stats,
    branchObjectId,
    categories,

    // Filters
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    assignmentFilter,
    setAssignmentFilter,

    // Modal
    isModalOpen,
    editingItem,
    openAddModal,
    openEditModal,
    closeModal,

    // Actions
    handleAddToMenu,
    handleUpdateConfig,
    handleRemoveFromMenu,
  } = useBranchMenu(branchId);

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(21);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<EffectiveMenuItem | null>(null);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  const handleRemove = (item: EffectiveMenuItem) => {
    setItemToRemove(item);
    setDeleteDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove || !itemToRemove.branchConfig) return;

    const configId = itemToRemove.branchConfig._id || itemToRemove.branchConfig.id;
    if (!configId) return;

    await handleRemoveFromMenu(configId);
    setDeleteDialogOpen(false);
    setItemToRemove(null);
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showActionBar={true} hasSubmenu={true} />;
  }

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      <PageHeader
        title={`Menu Management - Branch ${branchId}`}
        subtitle="Configure menu items for this branch with custom pricing and availability"
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdvancedMetricCard
          title="Total Items"
          subtitle="Available in base menu"
          value={stats.totalItems}
          icon="inventory"
          format="number"
        />

        <AdvancedMetricCard
          title="Assigned Items"
          subtitle="Active in branch"
          value={stats.assignedItems}
          icon="target"
          format="number"
          status="good"
        />

        <AdvancedMetricCard
          title="Available"
          subtitle="Ready to order"
          value={stats.availableItems}
          icon="inventory"
          format="number"
          status="good"
        />

        <AdvancedMetricCard
          title="Featured"
          subtitle="Highlighted items"
          value={stats.featuredItems}
          icon="target"
          format="number"
          status="neutral"
        />
      </div>

      {/* Action Bar */}
      <EnhancedActionBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search menu items by name or category..."
        filters={[
          {
            options: [
              { label: "All Categories", value: "all" },
              ...categories.map(cat => ({
                label: cat || "Uncategorized",
                value: cat || "",
              })),
            ],
            activeValue: categoryFilter,
            onChange: setCategoryFilter,
          },
          {
            options: [
              { label: "All Items", value: "all" },
              { label: "Assigned", value: "assigned", color: "green" },
              { label: "Unassigned", value: "unassigned", color: "gray" },
            ],
            activeValue: assignmentFilter,
            onChange: (value) => setAssignmentFilter(value as "all" | "assigned" | "unassigned"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={() => setAssignmentFilter("unassigned")}
        primaryActionLabel="Browse Items to Add"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
        primaryActionDisabled={!branchObjectId || loading}
      />

      {/* Menu Items Grid */}
      <ResponsiveGrid<EffectiveMenuItem>
        items={paginatedItems}
        loading={loading}
        loadingText="Loading menu items..."
        viewMode={viewMode}
        emptyIcon={<UtensilsCrossed className="h-16 w-16 text-gray-300" />}
        emptyTitle="No menu items found"
        emptyDescription="No items match your current filters"
        getItemId={(item) => item._id || item.id || ""}
        customActions={(item) => {
          const isAssigned = !!item.branchConfig;
          return (
            <div className="flex items-center gap-2">
              {isAssigned ? (
                <>
                  <Button
                    onClick={() => openEditModal(item)}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <Button
                    onClick={() => handleRemove(item)}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => openAddModal(item)}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Menu
                </Button>
              )}
            </div>
          );
        }}
        // Pagination props
        showPagination={true}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredItems.length}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        columns={[
          {
            key: "name",
            header: "Item Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center border bg-orange-50 border-orange-200">
                    <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 truncate max-w-[300px]">{item.description}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "category",
            header: "Category",
            render: (item) => (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {item.category || "Uncategorized"}
              </span>
            ),
            className: "w-36",
          },
          {
            key: "price",
            header: "Price",
            render: (item) => {
              const effectivePrice = item.branchConfig?.sellingPrice || item.basePrice;
              const hasOverride = item.branchConfig?.sellingPrice && item.branchConfig.sellingPrice !== item.basePrice;

              return (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${hasOverride ? 'text-orange-600' : 'text-gray-900'}`}>
                      {formatPrice(effectivePrice)}
                    </span>
                  </div>
                  {hasOverride && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(item.basePrice)}
                    </span>
                  )}
                </div>
              );
            },
            className: "w-32",
          },
          {
            key: "status",
            header: "Branch Status",
            render: (item) => {
              const isAssigned = !!item.branchConfig;
              const isAvailable = item.branchConfig?.isAvailable;

              return (
                <div className="flex flex-col gap-1">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-center ${
                    isAssigned
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {isAssigned ? "Assigned" : "Unassigned"}
                  </span>
                  {isAssigned && !isAvailable && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-center bg-red-100 text-red-700">
                      Unavailable
                    </span>
                  )}
                </div>
              );
            },
            className: "w-32",
          },
        ]}
        renderGridCard={(item, actions) => {
          const isAssigned = !!item.branchConfig;
          const isAvailable = item.branchConfig?.isAvailable ?? true;
          const isFeatured = item.branchConfig?.isFeatured ?? false;
          const effectivePrice = item.branchConfig?.sellingPrice || item.basePrice;
          const hasOverride = item.branchConfig?.sellingPrice && item.branchConfig.sellingPrice !== item.basePrice;
          const tagCount = item.tags?.length || 0;

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                isAssigned
                  ? isAvailable
                    ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                    : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
              }`}>
                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                  </>
                ) : (
                  <UtensilsCrossed className={`h-14 w-14 ${
                    isAssigned ? isAvailable ? "text-green-400" : "text-red-400" : "text-gray-400"
                  }`} />
                )}

                {/* Assignment Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isAssigned
                    ? isAvailable
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-500 text-white"
                }`}>
                  {isAssigned ? isAvailable ? "Available" : "Unavailable" : "Unassigned"}
                </div>

                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-yellow-500 text-white">
                    ⭐ Featured
                  </div>
                )}

                {/* Category Badge - Top Right (if not featured) */}
                {!isFeatured && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-orange-600 text-white">
                    {item.category || "N/A"}
                  </div>
                )}

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Item Name */}
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

                {/* Tags */}
                {tagCount > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags!.slice(0, 3).map((tag, idx) => (
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
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-orange-100">
                        <span className="text-xs font-bold text-orange-700">
                          {item.currency || "PKR"}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${hasOverride ? 'text-orange-600' : 'text-gray-900'}`}>
                        {formatPrice(effectivePrice)}
                      </span>
                    </div>
                    {hasOverride && (
                      <span className="text-xs text-gray-500 line-through ml-9">
                        {formatPrice(item.basePrice)}
                      </span>
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="flex flex-col gap-1">
                    {item.branchConfig?.isVisibleInPOS && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700">
                        POS
                      </span>
                    )}
                    {item.branchConfig?.isVisibleInOnline && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
                        Online
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Branch Menu Modal */}
      <BranchMenuModal
        isOpen={isModalOpen}
        item={editingItem}
        branchObjectId={branchObjectId}
        onClose={closeModal}
        onSave={handleAddToMenu}
        onUpdate={handleUpdateConfig}
        actionLoading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Remove from Branch Menu"
        description={`Are you sure you want to remove "${itemToRemove?.name}" from this branch's menu? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setItemToRemove(null);
        }}
        variant="danger"
      />
    </PageContainer>
  );
};

export default BranchMenuPage;
>>>>>>> 69081f1dbe186cba9b8621cfc2802f1b2f2b1f15

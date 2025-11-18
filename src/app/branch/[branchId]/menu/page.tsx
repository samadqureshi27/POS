"use client";

import React, { useState, useMemo, useEffect } from "react";
import { UtensilsCrossed, Plus, Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { formatPrice } from "@/lib/util/formatters";
import { logError } from "@/lib/util/logger";

// Types
interface MenuItem {
  ID: string;
  Name: string;
  Description?: string;
  Category?: string;
  BasePrice: number;
  Currency: string;
  Status: "Active" | "Inactive";
  ImageUrl?: string;
  Tags: string[];
  Recipe?: string;
  // Branch-specific
  isAssignedToBranch?: boolean;
}

const BranchMenuPage = () => {
  const params = useParams();
  const branchId = parseInt(params?.branchId as string) || 1;
  const { showToast } = useToast();

  // State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [branchMenuItems, setBranchMenuItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // View and filter state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "assigned" | "unassigned">("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(21);

  // Load menu items from base menu
  const loadMenuItems = async () => {
    try {
      setLoading(true);

      // Import MenuService dynamically
      const { MenuService } = await import("@/lib/services/menu-service");

      // Fetch all menu items from base menu
      const response = await MenuService.getMenuItems();

      if (response.success && response.data) {
        setMenuItems(response.data);

        // TODO: In a real implementation, fetch branch-specific assignments from backend
        // For now, we'll use localStorage to simulate branch menu assignments
        const storedBranchMenu = localStorage.getItem(`branch_${branchId}_menu`);
        if (storedBranchMenu) {
          setBranchMenuItems(new Set(JSON.parse(storedBranchMenu)));
        }
      } else {
        throw new Error(response.message || "Failed to load menu items");
      }
    } catch (error) {
      logError("Failed to load menu items", error, {
        component: "BranchMenu",
        action: "loadMenuItems",
        branchId,
      });
      showToast("Failed to load menu items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, [branchId]);

  // Categories for filtering
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(menuItems.map(item => item.Category).filter(Boolean)));
    return uniqueCategories;
  }, [menuItems]);

  // Calculate enhanced statistics
  const stats = useMemo(() => {
    const totalItems = menuItems.length;
    const assignedItems = menuItems.filter(item => branchMenuItems.has(item.ID)).length;
    const unassignedItems = totalItems - assignedItems;
    const activeItems = menuItems.filter(item =>
      branchMenuItems.has(item.ID) && item.Status === "Active"
    ).length;

    return {
      totalItems,
      assignedItems,
      unassignedItems,
      activeItems
    };
  }, [menuItems, branchMenuItems]);

  // Filter and search
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = searchTerm.trim() === "" ||
        item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "" || item.Category === categoryFilter;

      const isAssigned = branchMenuItems.has(item.ID);
      const matchesAssignment =
        assignmentFilter === "all" ||
        (assignmentFilter === "assigned" && isAssigned) ||
        (assignmentFilter === "unassigned" && !isAssigned);

      return matchesSearch && matchesCategory && matchesAssignment;
    });
  }, [menuItems, branchMenuItems, searchTerm, categoryFilter, assignmentFilter]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  // Toggle menu item assignment
  const toggleMenuItem = async (itemId: string) => {
    try {
      setActionLoading(true);

      const newBranchMenuItems = new Set(branchMenuItems);

      if (newBranchMenuItems.has(itemId)) {
        newBranchMenuItems.delete(itemId);
        showToast("Menu item removed from branch", "success");
      } else {
        newBranchMenuItems.add(itemId);
        showToast("Menu item added to branch", "success");
      }

      setBranchMenuItems(newBranchMenuItems);

      // TODO: In a real implementation, save to backend
      // For now, save to localStorage
      localStorage.setItem(`branch_${branchId}_menu`, JSON.stringify(Array.from(newBranchMenuItems)));

    } catch (error) {
      logError("Failed to toggle menu item", error, {
        component: "BranchMenu",
        action: "toggleMenuItem",
        branchId,
        itemId,
      });
      showToast("Failed to update menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showActionBar={true} hasSubmenu={true} />;
  }

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      <PageHeader
        title={`Menu Management - Branch #${branchId}`}
        subtitle="Assign menu items from base menu to this branch"
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdvancedMetricCard
          title="Total Available"
          subtitle="Base menu items"
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
          title="Unassigned"
          subtitle="Not in branch"
          value={stats.unassignedItems}
          icon="inventory"
          format="number"
          status="neutral"
        />

        <AdvancedMetricCard
          title="Active Items"
          subtitle="Ready to sell"
          value={stats.activeItems}
          icon="target"
          format="number"
          status="good"
        />
      </div>

      {/* Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search menu items by name or description..."
        filters={[
          {
            options: [
              { label: "All Categories", value: "" },
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
      />

      {/* Menu Items Grid */}
      <ResponsiveGrid<MenuItem>
        items={paginatedItems}
        loading={loading}
        loadingText="Loading menu items..."
        viewMode={viewMode}
        emptyIcon={<UtensilsCrossed className="h-16 w-16 text-gray-300" />}
        emptyTitle="No menu items found"
        emptyDescription="No items match your current filters"
        getItemId={(item) => item.ID}
        customActions={(item) => {
          const isAssigned = branchMenuItems.has(item.ID);
          return (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => toggleMenuItem(item.ID)}
                disabled={actionLoading}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  isAssigned
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isAssigned ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Assign
                  </>
                )}
              </Button>
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
            key: "Assignment",
            header: "Branch Status",
            render: (item) => {
              const isAssigned = branchMenuItems.has(item.ID);
              return (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  isAssigned
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {isAssigned ? "Assigned" : "Unassigned"}
                </span>
              );
            },
            className: "w-32",
          },
        ]}
        renderGridCard={(item, actions) => {
          const isAssigned = branchMenuItems.has(item.ID);
          const isActive = item.Status === "Active";
          const hasRecipe = !!item.Recipe;
          const tagCount = item.Tags?.length || 0;

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                isAssigned
                  ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
              }`}>
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
                  <UtensilsCrossed className={`h-14 w-14 ${
                    isAssigned ? "text-green-400" : "text-gray-400"
                  }`} />
                )}

                {/* Assignment Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isAssigned
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}>
                  {isAssigned ? "Assigned" : "Unassigned"}
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

                  {/* Status Indicator */}
                  <div className="text-xs">
                    <span className={`px-2 py-1 rounded-full font-semibold ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {item.Status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    </PageContainer>
  );
};

export default BranchMenuPage;

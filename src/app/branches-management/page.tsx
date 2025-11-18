// BranchManagementPage.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Building2, Plus, MapPin } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from '@/components/ui/sonner';
import BranchModal from "./_components/branch-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useBranchManagement } from "@/lib/hooks/useBranchManagment";
import { BranchItem } from "@/lib/types/branch";

const BranchManagementPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Auth check (no redirect): allow accessing this page for testing even if not logged in
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    // State
    branchItems,
    filteredItems,
    searchTerm,
    statusFilter,
    loading,
    actionLoading,
    statistics,
    // Modal
    isModalOpen,
    editingItem,
    formData,
    // Actions
    setSearchTerm,
    setStatusFilter,
    openCreateModal,
    openEditModal,
    closeModal,
    handleModalSubmit,
    updateFormData,
    handleStatusChange,
    loadBranchItems,
  } = useBranchManagement();

  // Load branches after auth is ready
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadBranchItems();
    }
  }, [authLoading, isAuthenticated]);

  const handleBranchClick = (branchId: number) => {
    const item = branchItems.find((b) => b["Branch-ID"] === branchId);
    const targetId = item?.backendId ?? String(branchId);
    router.push(`/branch/${targetId}/pos`);
  };

  const handleDelete = async (branch: BranchItem) => {
    // TODO: Implement delete functionality when backend endpoint is available
    alert("Delete functionality will be implemented when backend endpoint is available");
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={2} />;
  }

  // Show loading while fetching branch data
  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={2} />;
  }

  return (
    <div className="p-6 bg-background min-w-full h-full overflow-y-auto thin-scroll">
      <Toaster position="top-right" />

      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold mt-14 mb-2">Branch Management</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your restaurant branches and locations</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-4xl">
        <AdvancedMetricCard
          title="Total Branches"
          subtitle="All locations"
          value={statistics.totalBranches}
          icon="building"
          format="number"
        />
        <AdvancedMetricCard
          title="Active Branches"
          subtitle="Currently operating"
          value={statistics.activeBranches}
          icon="target"
          format="number"
          status="good"
        />
      </div>

      {/* Enhanced Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search branches by name, address, or contact info..."
        filters={[
          {
            options: [
              { label: "All Status", value: "" },
              { label: "Active", value: "Active", color: "green" },
              { label: "Inactive", value: "Inactive", color: "red" },
            ],
            activeValue: statusFilter,
            onChange: (value) => setStatusFilter(value as "" | "Active" | "Inactive"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={openCreateModal}
        primaryActionLabel="Add Branch"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
      />

      {/* Branch Grid */}
      <ResponsiveGrid<BranchItem>
        items={filteredItems}
        loading={loading}
        loadingText="Loading branches..."
        viewMode={viewMode}
        emptyIcon={<Building2 className="h-16 w-16 text-gray-300" />}
        emptyTitle="No branches found"
        emptyDescription="Start by adding your first branch"
        getItemId={(item) => String(item["Branch-ID"])}
        onEdit={openEditModal}
        onDelete={handleDelete}
        customActions={(item) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBranchClick(item["Branch-ID"])}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-all"
            >
              View
            </button>
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
            key: "Branch-ID",
            header: "Branch ID",
            render: (item) => (
              <span className="font-mono text-gray-700">
                #{String(item["Branch-ID"]).padStart(3, "0")}
              </span>
            ),
            className: "w-28",
          },
          {
            key: "Branch_Name",
            header: "Branch Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center border bg-blue-50 border-blue-200">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.Branch_Name}</div>
                  {item.Address && (
                    <div className="text-xs text-gray-500 truncate max-w-[300px]">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {item.Address}
                    </div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "Contact-Info",
            header: "Contact",
            render: (item) => (
              <div className="text-sm text-gray-700">
                {item["Contact-Info"] || "—"}
              </div>
            ),
            className: "w-40",
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

          return (
            <div
              className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200 cursor-pointer"
              onClick={() => handleBranchClick(item["Branch-ID"])}
            >
              {/* Card Header with Gradient Background */}
              <div className="relative h-28 flex items-center justify-center border-b-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <Building2 className="h-14 w-14 text-blue-400" />

                {/* Status Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {item.Status}
                </div>

                {/* Branch ID Badge - Top Right */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-blue-600 text-white">
                  #{String(item["Branch-ID"]).padStart(3, "0")}
                </div>

                {/* Hover Actions Overlay */}
                <div
                  className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Branch Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.Branch_Name}>
                  {item.Branch_Name}
                </h3>

                {/* Contact Info */}
                {item["Contact-Info"] ? (
                  <p className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Contact:</span> {item["Contact-Info"]}
                  </p>
                ) : null}

                {/* Address */}
                {item.Address ? (
                  <div className="flex items-start gap-1 mb-3 min-h-[2.5rem]">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {item.Address}
                      {item.postalCode && `, ${item.postalCode}`}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic mb-3 min-h-[2.5rem]">
                    No address provided
                  </p>
                )}

                {/* Email (if available) */}
                {item.email && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 truncate">
                      <span className="font-medium">Email:</span> {item.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />

      {/* Branch modal */}
      <BranchModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        formData={formData}
        actionLoading={actionLoading}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        onFormDataChange={updateFormData}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};


export default BranchManagementPage;
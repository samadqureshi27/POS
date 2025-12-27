// BranchManagementPage.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";
import { Building2, Plus, MapPin } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from '@/components/ui/sonner';
import { cn } from "@/lib/utils";
import { GridActionButtons } from "@/components/ui/grid-action-buttons";
import BranchModal from "./_components/branch-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { useBranchManagement } from "@/lib/hooks/useBranchManagment";
import { BranchItem } from "@/lib/types/branch";
import { formatID } from "@/lib/util/formatters";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

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
    if (!authLoading) {
      loadBranchItems();
    }
  }, [authLoading, loadBranchItems]);

  const handleBranchClick = (branchId: number) => {
    const item = branchItems.find((b) => b["Branch-ID"] === branchId);
    const targetId = item?.backendId ?? String(branchId);
    router.push(`/branch/${targetId}/pos`);
  };

  const handleDelete = async (branch: BranchItem) => {
    // TODO: Implement delete functionality when backend endpoint is available
    toast.error("Delete functionality will be implemented when backend endpoint is available");
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
    <PageContainer>
      <Toaster position="top-right" />

      <PageHeader
        title="Branch Management"
        subtitle="Manage your restaurant branches and locations"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AdvancedMetricCard
          title="Total Branches"
          subtitle="All locations"
          value={statistics.totalBranches}
          icon="inventory"
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
        customActions={(item) => {
          const actions = [
            {
              label: "Edit",
              onClick: () => openEditModal(item),
              variant: "edit" as const,
            },
            {
              label: "Open POS",
              onClick: () => handleBranchClick(item["Branch-ID"]),
              variant: "custom" as const,
              className: "bg-blue-600 hover:bg-blue-700 text-white",
            },
          ];
          return <GridActionButtons actions={actions} />;
        }}
        columns={[
          {
            key: "Branch-ID",
            header: "Branch ID",
            render: (item) => (
              <span className="font-mono text-gray-700">
                {formatID(item["Branch-ID"])}
              </span>
            ),
            className: "w-28",
          },
          {
            key: "Branch_Name",
            header: "Branch Name",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-sm flex items-center justify-center border bg-blue-50/50 border-blue-100/50 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">{item.Branch_Name}</div>
                  {item.Address && (
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate max-w-[300px]">
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
              <div className="text-sm text-gray-600 font-medium">
                {item["Contact-Info"] || "—"}
              </div>
            ),
            className: "w-40",
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
            <div
              className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleBranchClick(item["Branch-ID"])}
            >
              {/* Subtle top accent */}
              <div className={cn("h-0.5 w-full shrink-0", isActive ? "bg-green-500" : "bg-red-500")} />

              <div className="p-4 flex flex-col flex-1">
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    ID: {formatID(item["Branch-ID"])}
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
                  <div className="h-10 w-10 rounded-sm flex items-center justify-center shrink-0 border bg-blue-50/30 border-blue-100/50 text-blue-500 transition-colors">
                    <Building2 className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-gray-800 leading-tight truncate group-hover:text-black transition-colors" title={item.Branch_Name}>
                        {item.Branch_Name}
                      </h3>
                      {/* Mobile Actions */}
                      <div className="flex lg:hidden items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {actions}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight truncate">
                      {item["Contact-Info"] || 'Main Contact'}
                    </p>
                  </div>
                </div>

                {/* Footer / Address */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5 block">Location</span>
                    <p className="text-[11px] text-gray-600 font-medium line-clamp-1">
                      {item.Address || "No address provided"}
                    </p>
                  </div>

                  {/* Desktop Actions: Hover Reveal */}
                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {actions}
                    </div>
                  </div>
                </div>
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
    </PageContainer>
  );
};

export default BranchManagementPage;
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Users, Plus, Edit2, Settings, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "sonner";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { GridActionButtons } from "@/components/ui/grid-action-buttons";
import { cn } from "@/lib/utils";
import { useStaff } from "@/lib/hooks/useStaff";
import StaffModal from "./_components/staff-modal";
import type { TenantStaff } from "@/lib/services/staff-service";
import { BranchService } from "@/lib/services/branch-service";

const StaffManagementPage = () => {
  const params = useParams();
  const branchId = (params?.branchId as string) || "";

  // Branch name state
  const [branchName, setBranchName] = useState<string>("");

  const {
    // Data
    filteredItems,
    loading,
    actionLoading,
    stats,
    roles,

    // Filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,

    // Modal
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,

    // Actions
    handleCreateStaff,
    handleUpdateStaff,
    handleUpdateStatus,
  } = useStaff(branchId);

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(21);

  // Status update confirmation
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [itemToUpdateStatus, setItemToUpdateStatus] = useState<{ item: TenantStaff; status: "active" | "inactive" | "suspended" } | null>(null);

  // Fetch branch name
  useEffect(() => {
    const fetchBranchName = async () => {
      if (!branchId) return;

      try {
        const response = await BranchService.getBranch(branchId);
        if (response.success && response.data?.name) {
          setBranchName(response.data.name);
        }
      } catch (error) {
        console.error("Error fetching branch name:", error);
      }
    };

    fetchBranchName();
  }, [branchId]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  const handleStatusChange = (item: TenantStaff, newStatus: "active" | "inactive" | "suspended") => {
    setItemToUpdateStatus({ item, status: newStatus });
    setStatusDialogOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!itemToUpdateStatus) return;

    const itemId = itemToUpdateStatus.item._id || itemToUpdateStatus.item.id;
    if (!itemId) return;

    await handleUpdateStatus(itemId, itemToUpdateStatus.status);
    setStatusDialogOpen(false);
    setItemToUpdateStatus(null);
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showActionBar={true} hasSubmenu={true} />;
  }

  if (!branchId) {
    return (
      <PageContainer hasSubmenu={true}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Branch ID not found in URL parameters</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      <div className="pt-6">
        <PageHeader
          title={`Staff Management - ${branchName || `Branch #${branchId}`}`}
          subtitle="Manage staff members and their roles for this branch"
        />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdvancedMetricCard
          title="Total Staff"
          subtitle="All employees"
          value={stats.totalStaff}
          icon="inventory"
          format="number"
        />

        <AdvancedMetricCard
          title="Active"
          subtitle="Currently active"
          value={stats.activeStaff}
          icon="target"
          format="number"
          status="good"
        />

        <AdvancedMetricCard
          title="Inactive"
          subtitle="Not active"
          value={stats.inactiveStaff}
          icon="inventory"
          format="number"
          status={stats.inactiveStaff > 0 ? "warning" : "neutral"}
        />

        <AdvancedMetricCard
          title="Suspended"
          subtitle="Temporarily suspended"
          value={stats.suspendedStaff}
          icon="inventory"
          format="number"
          status={stats.suspendedStaff > 0 ? "critical" : "neutral"}
        />
      </div>

      {/* Action Bar */}
      <EnhancedActionBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search staff by name, email, or position..."
        filters={[
          {
            options: [
              { label: "All Roles", value: "all" },
              ...roles.map(role => ({
                label: role.charAt(0).toUpperCase() + role.slice(1),
                value: role,
              })),
            ],
            activeValue: roleFilter,
            onChange: setRoleFilter,
          },
          {
            options: [
              { label: "All Status", value: "all" },
              { label: "Active", value: "active", color: "green" },
              { label: "Inactive", value: "inactive", color: "red" },
              { label: "Suspended", value: "suspended", color: "default" },
            ],
            activeValue: statusFilter,
            onChange: (value) => setStatusFilter(value as "all" | "active" | "inactive" | "suspended"),
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        onPrimaryAction={openCreateModal}
        primaryActionLabel="Add Staff Member"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
        primaryActionDisabled={loading}
      />

      {/* Staff Grid */}
      <ResponsiveGrid<TenantStaff>
        items={paginatedItems}
        loading={loading}
        loadingText="Loading staff members..."
        viewMode={viewMode}
        emptyIcon={<Users className="h-16 w-16 text-gray-300" />}
        emptyTitle="No staff members found"
        emptyDescription="Start by adding your first staff member"
        getItemId={(item) => item._id || item.id || ""}
        customActions={(item) => {
          const actions = [
            {
              label: "Edit",
              onClick: () => openEditModal(item),
              variant: "edit" as const,
            },
          ];

          if (item.status === "active") {
            actions.push({
              label: "Suspend",
              onClick: () => handleStatusChange(item, "suspended"),
              variant: "custom" as const,
              className: "bg-orange-600 hover:bg-orange-700 text-white",
            });
          } else if (item.status === "suspended") {
            actions.push({
              label: "Activate",
              onClick: () => handleStatusChange(item, "active"),
              variant: "custom" as const,
              className: "bg-green-600 hover:bg-green-700 text-white",
            });
          }

          return <GridActionButtons actions={actions} />;
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
            header: "Staff Member",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-sm flex items-center justify-center border",
                  item.status === "active" ? "bg-green-50/50 border-green-100/50 text-green-600" :
                    item.status === "suspended" ? "bg-orange-50/50 border-orange-100/50 text-orange-600" :
                      "bg-red-50/50 border-red-100/50 text-red-600"
                )}>
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">{item.fullName}</div>
                  {item.email && (
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate">{item.email}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "position",
            header: "Position",
            render: (item) => (
              <span className="text-sm font-bold text-gray-700">{item.position || "—"}</span>
            ),
            className: "w-36",
          },
          {
            key: "roles",
            header: "Roles",
            render: (item) => (
              <div className="flex flex-wrap gap-1">
                {item.roles && item.roles.length > 0 ? (
                  item.roles.slice(0, 2).map((role, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border text-blue-600 bg-blue-50 border-blue-100">
                      {role.toUpperCase()}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-gray-400 font-bold">NO ROLES</span>
                )}
              </div>
            ),
            className: "w-48",
          },
          {
            key: "status",
            header: "Status",
            render: (item) => (
              <span className={cn(
                "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                item.status === "active" ? "text-green-600 bg-green-50 border-green-100" :
                  item.status === "suspended" ? "text-orange-600 bg-orange-50 border-orange-100" :
                    "text-red-600 bg-red-50 border-red-100"
              )}>
                {item.status?.toUpperCase()}
              </span>
            ),
            className: "w-32",
          },
        ]}
        renderGridCard={(item, actions) => {
          const status = item.status === "active"
            ? { label: "ACTIVE", color: "text-green-600 bg-green-50 border-green-100", bar: "bg-green-500" }
            : item.status === "suspended"
              ? { label: "SUSPENDED", color: "text-orange-600 bg-orange-50 border-orange-100", bar: "bg-orange-500" }
              : { label: "INACTIVE", color: "text-red-600 bg-red-50 border-red-100", bar: "bg-red-500" };

          return (
            <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
              <div className={cn("h-0.5 w-full shrink-0", status.bar)} />

              <div className="p-4 flex flex-col flex-1">
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    ID: {item._id?.slice(-6).toUpperCase() || item.id?.slice(-6).toUpperCase() || 'NEW'}
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
                    item.status === "active" ? "bg-green-50/50 border-green-100/50 text-green-600" : "bg-gray-50/50 border-gray-100/50 text-gray-400"
                  )}>
                    <Users className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-gray-800 leading-tight truncate group-hover:text-black transition-colors" title={item.fullName}>
                        {item.fullName}
                      </h3>
                      <div className="flex lg:hidden items-center gap-1 shrink-0">
                        {actions}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight truncate">
                      {item.position || 'No Position'}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Email</span>
                    <span className="text-xs font-bold text-gray-900 tracking-tight pr-2 truncate">
                      {item.email || 'NO EMAIL'}
                    </span>
                  </div>

                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    <div className="flex items-center gap-1">
                      {actions}
                    </div>
                  </div>

                  <div className="lg:hidden flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">PIN</span>
                    <span className="text-xs font-bold text-gray-900">
                      {item.pin ? '••••' : 'NONE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Staff Modal */}
      <StaffModal
        isOpen={isModalOpen}
        item={editingItem}
        branchId={branchId}
        onClose={closeModal}
        onSave={handleCreateStaff}
        onUpdate={handleUpdateStaff}
        actionLoading={actionLoading}
      />

      {/* Status Update Confirmation Dialog */}
      <ConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title="Update Staff Status"
        description={`Are you sure you want to ${itemToUpdateStatus?.status === "active" ? "activate" : itemToUpdateStatus?.status === "suspended" ? "suspend" : "deactivate"} ${itemToUpdateStatus?.item.fullName}?`}
        confirmText="Update Status"
        cancelText="Cancel"
        onConfirm={confirmStatusUpdate}
        onCancel={() => {
          setStatusDialogOpen(false);
          setItemToUpdateStatus(null);
        }}
        variant={itemToUpdateStatus?.status === "active" ? "default" : "destructive"}
      />
    </PageContainer>
  );
};

export default StaffManagementPage;

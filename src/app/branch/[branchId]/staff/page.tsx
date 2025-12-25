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
  const [itemToUpdateStatus, setItemToUpdateStatus] = useState<{item: TenantStaff; status: "active" | "inactive" | "suspended"} | null>(null);

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
        customActions={(item) => (
          <div className="flex items-center gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(item);
              }}
              disabled={actionLoading}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
            {item.status === "active" && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(item, "suspended");
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-sm rounded-md bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Settings className="h-4 w-4 mr-1" />
                Suspend
              </Button>
            )}
            {item.status === "suspended" && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(item, "active");
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
              >
                <Settings className="h-4 w-4 mr-1" />
                Activate
              </Button>
            )}
          </div>
        )}
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
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                  item.status === "active"
                    ? "bg-green-50 border-green-200"
                    : item.status === "suspended"
                    ? "bg-orange-50 border-orange-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <Users className={`h-5 w-5 ${
                    item.status === "active" ? "text-green-600" :
                    item.status === "suspended" ? "text-orange-600" :
                    "text-red-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.fullName}</div>
                  {item.email && (
                    <div className="text-xs text-gray-500 truncate">{item.email}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "position",
            header: "Position",
            render: (item) => (
              <span className="text-sm text-gray-700">{item.position || "—"}</span>
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
                    <span key={idx} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">No roles</span>
                )}
                {item.roles && item.roles.length > 2 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    +{item.roles.length - 2}
                  </span>
                )}
              </div>
            ),
            className: "w-48",
          },
          {
            key: "status",
            header: "Status",
            render: (item) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.status === "active"
                  ? "bg-green-100 text-green-700"
                  : item.status === "suspended"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {item.status?.charAt(0).toUpperCase() + (item.status?.slice(1) || "")}
              </span>
            ),
            className: "w-32",
          },
        ]}
        renderGridCard={(item, actions) => {
          const statusColor = item.status === "active"
            ? "green"
            : item.status === "suspended"
            ? "orange"
            : "red";

          return (
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                statusColor === "green"
                  ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                  : statusColor === "orange"
                  ? "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
                  : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
              }`}>
                <Users className={`h-14 w-14 ${
                  statusColor === "green" ? "text-green-400" :
                  statusColor === "orange" ? "text-orange-400" :
                  "text-red-400"
                }`} />

                {/* Status Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  statusColor === "green"
                    ? "bg-green-500 text-white"
                    : statusColor === "orange"
                    ? "bg-orange-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {item.status?.charAt(0).toUpperCase() + (item.status?.slice(1) || "")}
                </div>

                {/* Position Badge - Top Right */}
                {item.position && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-blue-600 text-white">
                    {item.position}
                  </div>
                )}

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Staff Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.fullName}>
                  {item.fullName}
                </h3>

                {/* Email */}
                <div className="mb-3 min-h-[2.5rem]">
                  {item.email && (
                    <p className="text-xs text-gray-600 truncate">
                      <span className="font-medium">Email:</span> {item.email}
                    </p>
                  )}
                </div>

                {/* Roles */}
                {item.roles && item.roles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.roles.slice(0, 3).map((role, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md capitalize"
                      >
                        {role}
                      </span>
                    ))}
                    {item.roles.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{item.roles.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* PIN Indicator */}
                {item.pin && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">PIN:</span> ••••
                    </p>
                  </div>
                )}
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

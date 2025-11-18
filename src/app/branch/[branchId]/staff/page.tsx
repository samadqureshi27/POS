"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Users, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import StaffModal from "./_components/staffModal";
import { Toast } from "@/components/ui/toast";
import { useStaff } from "@/lib/hooks/useStaffManagement";
import { useStaffModal } from "@/lib/hooks/useStaffModal";
import { useStaffFiltering } from "@/lib/hooks/useStaffFiltering";
import { useSelection } from "@/lib/hooks/selection";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/lib/hooks";
import { Toaster } from "@/components/ui/sonner";

const EmployeeRecordsPage = () => {
  const params = useParams();
  const branchId = params?.branchId as string;
  const { showToast: globalShowToast } = useToast();

  // Core staff management hook
  const {
    staffItems,
    branchInfo,
    loading,
    actionLoading,
    toast,
    showToast,
    setToast,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteSelected,
  } = useStaff(branchId);

  // Modal management hook
  const {
    editingItem,
    isModalOpen,
    formData,
    setFormData,
    openModal,
    closeModal,
    openEditModal,
    handleStatusChange,
    isFormValid,
  } = useStaffModal(branchId);

  // Filtering hook
  const {
    searchInput,
    setSearchInput,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    filteredItems,
  } = useStaffFiltering(staffItems);

  // Selection hook
  const {
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    clearSelection,
    isAllSelected,
    isSomeSelected,
  } = useSelection();

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(21);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Calculate enhanced statistics
  const enhancedStats = useMemo(() => {
    const totalStaff = staffItems.length;
    const activeStaff = staffItems.filter(item => item.Status === "Active").length;
    const inactiveStaff = staffItems.filter(item => item.Status === "Inactive").length;

    // Get unique roles
    const roles = Array.from(new Set(staffItems.map(item => item.Role).filter(Boolean)));

    return {
      totalStaff,
      activeStaff,
      inactiveStaff,
      roleCount: roles.length
    };
  }, [staffItems]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  // Get unique roles for filtering
  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(staffItems.map(item => item.Role).filter(Boolean)));
    return roles.map(role => ({ label: role, value: role }));
  }, [staffItems]);

  // Handle modal submission
  const handleModalSubmit = async () => {
    const success = editingItem
      ? await handleUpdateItem(editingItem.Staff_ID, formData)
      : await handleCreateItem(formData);

    if (success) {
      closeModal();
      clearSelection();
    }
  };

  // Handle delete with selection clearing
  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      globalShowToast("Please select staff members to delete", "warning");
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    const success = await handleDeleteSelected(selectedItems as string[]);
    if (success) {
      clearSelection();
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showActionBar={true} hasSubmenu={true} />;
  }

  if (!branchId) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Branch ID not found in URL parameters</p>
        </div>
      </div>
    );
  }

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <PageHeader
        title={`Staff Management - Branch #${branchId}`}
        subtitle="Manage employees and staff members for this branch"
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdvancedMetricCard
          title="Total Staff"
          subtitle="All employees"
          value={enhancedStats.totalStaff}
          icon="inventory"
          format="number"
        />

        <AdvancedMetricCard
          title="Active Staff"
          subtitle="Currently employed"
          value={enhancedStats.activeStaff}
          icon="target"
          format="number"
          status="good"
        />

        <AdvancedMetricCard
          title="Inactive Staff"
          subtitle="Not active"
          value={enhancedStats.inactiveStaff}
          icon="inventory"
          format="number"
          status={enhancedStats.inactiveStaff > 0 ? "warning" : "neutral"}
        />

        <AdvancedMetricCard
          title="Roles"
          subtitle="Unique positions"
          value={enhancedStats.roleCount}
          icon="target"
          format="number"
          status="neutral"
        />
      </div>

      {/* Action Bar */}
      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search staff by name, email, or role..."
        filters={[
          {
            options: [
              { label: "All Roles", value: "" },
              ...roleOptions,
            ],
            activeValue: roleFilter,
            onChange: setRoleFilter,
          },
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
        onPrimaryAction={openModal}
        primaryActionLabel="Add Staff"
        primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
        onSecondaryAction={selectedItems.length > 0 ? handleDelete : undefined}
        secondaryActionLabel="Delete Selected"
        secondaryActionDisabled={selectedItems.length === 0}
      />

      {/* Staff Grid */}
      <ResponsiveGrid<any>
        items={paginatedItems}
        loading={loading}
        loadingText="Loading staff..."
        viewMode={viewMode}
        emptyIcon={<Users className="h-16 w-16 text-gray-300" />}
        emptyTitle="No staff members found"
        emptyDescription="Start by adding your first staff member"
        getItemId={(item) => item.Staff_ID}
        onEdit={openEditModal}
        onDelete={(item) => {
          handleSelectItem(item.Staff_ID);
          setDeleteDialogOpen(true);
        }}
        customActions={(item) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditModal(item)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleSelectItem(item.Staff_ID);
                setDeleteDialogOpen(true);
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
                  item.Status === "Active"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <Users className={`h-5 w-5 ${
                    item.Status === "Active" ? "text-green-600" : "text-red-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.Name}</div>
                  {item.Email && (
                    <div className="text-xs text-gray-500 truncate">{item.Email}</div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "role",
            header: "Role",
            render: (item) => (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {item.Role || "N/A"}
              </span>
            ),
            className: "w-32",
          },
          {
            key: "phone",
            header: "Phone",
            render: (item) => (
              <span className="text-sm text-gray-700">{item.Phone || "—"}</span>
            ),
            className: "w-36",
          },
          {
            key: "status",
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
            <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200">
              {/* Card Header with Gradient Background */}
              <div className={`relative h-28 flex items-center justify-center border-b-2 ${
                isActive
                  ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                  : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
              }`}>
                <Users className={`h-14 w-14 ${
                  isActive ? "text-green-400" : "text-red-400"
                }`} />

                {/* Status Badge - Top Left */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {item.Status}
                </div>

                {/* Role Badge - Top Right */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-blue-600 text-white">
                  {item.Role || "N/A"}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                  {actions}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Staff Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.Name}>
                  {item.Name}
                </h3>

                {/* Contact Details */}
                <div className="mb-3 min-h-[2.5rem] space-y-1">
                  {item.Email && (
                    <p className="text-xs text-gray-600 truncate">
                      <span className="font-medium">Email:</span> {item.Email}
                    </p>
                  )}
                  {item.Phone && (
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Phone:</span> {item.Phone}
                    </p>
                  )}
                </div>

                {/* Staff Details */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Staff ID:</span> {item.Staff_ID}
                  </p>
                  {item.Salary && (
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-medium">Salary:</span> ${item.Salary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Staff Modal */}
      <StaffModal
        isOpen={isModalOpen}
        isEditing={!!editingItem}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleModalSubmit}
        onClose={closeModal}
        onStatusChange={handleStatusChange}
        actionLoading={actionLoading}
        isFormValid={isFormValid}
        showToast={showToast}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Staff Members"
        description={`Are you sure you want to delete ${selectedItems.length} staff member(s)? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </PageContainer>
  );
};

export default EmployeeRecordsPage;

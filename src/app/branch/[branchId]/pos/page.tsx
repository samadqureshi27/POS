"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Monitor, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/lib/hooks";
import PosModal from "./_components/pos-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { usePosManagement } from "@/lib/hooks/usePosManagement";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { formatID } from "@/lib/util/formatters";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const PosListPage = () => {
    const params = useParams();
    const branchId = params?.branchId as string;
    const { showToast } = useToast();

    const {
        // State
        filteredItems,
        searchTerm,
        statusFilter,
        loading,
        actionLoading,
        statistics,
        // Selection
        selectedItems,
        isAllSelected,
        // Modal
        isModalOpen,
        editingItem,
        formData,
        // Actions
        setSearchTerm,
        setStatusFilter,
        handleSelectAll,
        handleSelectItem,
        openCreateModal,
        openEditModal,
        handleDeleteSelected,
        handleModalSubmit,
        updateFormData,
        handleStatusChange,
        closeModal,
    } = usePosManagement(branchId);

    // View mode state
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(21);

    // Delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Calculate enhanced statistics
    const enhancedStats = useMemo(() => {
        const totalPos = filteredItems.length;
        const activePos = filteredItems.filter(item => item.Status === "Active").length;
        const inactivePos = filteredItems.filter(item => item.Status === "Inactive").length;

        return {
            totalPos,
            activePos,
            inactivePos
        };
    }, [filteredItems]);

    // Paginated items
    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredItems.slice(startIndex, endIndex);
    }, [filteredItems, currentPage, itemsPerPage]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

    const handleAddPos = () => {
        openCreateModal();
    };

    const handleEditPos = (item: any) => {
        openEditModal(item);
    };

    const handleDeletePos = () => {
        if (selectedItems.length === 0) {
            showToast("Please select POS systems to delete", "warning");
            return;
        }
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        await handleDeleteSelected();
        setDeleteDialogOpen(false);
    };

    if (loading) {
        return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={3} showActionBar={true} hasSubmenu={true} />;
    }

    if (!branchId) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
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

            <PageHeader
                title={`POS Systems - Branch #${branchId}`}
                subtitle="Manage point-of-sale systems for this branch"
            />

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AdvancedMetricCard
                    title="Total POS"
                    subtitle="All systems"
                    value={enhancedStats.totalPos}
                    icon="inventory"
                    format="number"
                />

                <AdvancedMetricCard
                    title="Active POS"
                    subtitle="Operational"
                    value={enhancedStats.activePos}
                    icon="target"
                    format="number"
                    status="good"
                />

                <AdvancedMetricCard
                    title="Inactive POS"
                    subtitle="Offline"
                    value={enhancedStats.inactivePos}
                    icon="inventory"
                    format="number"
                    status={enhancedStats.inactivePos > 0 ? "warning" : "neutral"}
                />
            </div>

            {/* Action Bar */}
            <EnhancedActionBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search POS by ID or name..."
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
                onPrimaryAction={handleAddPos}
                primaryActionLabel="Add POS"
                primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
                onSecondaryAction={selectedItems.length > 0 ? handleDeletePos : undefined}
                secondaryActionLabel="Delete Selected"
                secondaryActionDisabled={selectedItems.length === 0}
            />

            {/* POS Grid */}
            <ResponsiveGrid<any>
                items={paginatedItems}
                loading={loading}
                loadingText="Loading POS systems..."
                viewMode={viewMode}
                emptyIcon={<Monitor className="h-16 w-16 text-gray-300" />}
                emptyTitle="No POS systems found"
                emptyDescription="Start by adding your first POS system"
                getItemId={(item) => String(item.POS_ID)}
                onEdit={handleEditPos}
                onDelete={(item) => {
                    handleSelectItem(item.POS_ID);
                    setDeleteDialogOpen(true);
                }}
                customActions={(item) => (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPos(item)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                handleSelectItem(item.POS_ID);
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
                        key: "posId",
                        header: "POS ID",
                        render: (item) => (
                            <span className="font-mono text-gray-700">
                                {formatID(item.POS_ID)}
                            </span>
                        ),
                        className: "w-28",
                    },
                    {
                        key: "posName",
                        header: "POS Name",
                        render: (item) => (
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                                    item.Status === "Active"
                                        ? "bg-green-50 border-green-200"
                                        : "bg-red-50 border-red-200"
                                }`}>
                                    <Monitor className={`h-5 w-5 ${
                                        item.Status === "Active" ? "text-green-600" : "text-red-600"
                                    }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900">{item.POS_Name}</div>
                                </div>
                            </div>
                        ),
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
                                <Monitor className={`h-14 w-14 ${
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

                                {/* POS ID Badge - Top Right */}
                                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-gray-800 text-white">
                                    {formatID(item.POS_ID)}
                                </div>

                                {/* Hover Actions Overlay */}
                                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                                    {actions}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4">
                                {/* POS Name */}
                                <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.POS_Name}>
                                    {item.POS_Name}
                                </h3>

                                {/* POS Details */}
                                <div className="pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-600">
                                        <span className="font-medium">POS ID:</span> {formatID(item.POS_ID)}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        <span className="font-medium">Branch ID:</span> {item.Branch_ID_fk}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                }}
            />

            {/* POS modal */}
            <PosModal
                isOpen={isModalOpen}
                editingItem={editingItem}
                formData={formData}
                actionLoading={actionLoading}
                branchId={branchId}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                onFormDataChange={updateFormData}
                onStatusChange={handleStatusChange}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete POS Systems"
                description={`Are you sure you want to delete ${selectedItems.length} POS system(s)? This action cannot be undone.`}
                onConfirm={confirmDelete}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </PageContainer>
    );
};

export default PosListPage;

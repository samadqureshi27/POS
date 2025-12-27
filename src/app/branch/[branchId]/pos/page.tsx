"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Monitor, Plus, AlertCircle } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { Toaster } from "sonner";
import { useToast } from "@/lib/hooks";
import PosModal from "./_components/pos-modal";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { usePosManagement } from "@/lib/hooks/usePosManagement";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { formatID } from "@/lib/util/formatters";
import { cn } from "@/lib/utils";
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
        const activePos = filteredItems.filter(item => item.Status === "active").length;
        const inactivePos = filteredItems.filter(item => item.Status === "inactive").length;

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
                            { label: "Active", value: "active", color: "green" },
                            { label: "Inactive", value: "inactive", color: "red" },
                        ],
                        activeValue: statusFilter,
                        onChange: (value) => setStatusFilter(value as "" | "active" | "inactive"),
                    },
                ]}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showViewToggle={true}
                onPrimaryAction={handleAddPos}
                primaryActionLabel="Add POS"
                primaryActionIcon={<Plus className="h-5 w-5 mr-2" />}
                secondaryActions={
                    selectedItems.length > 0 ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeletePos}
                            className="h-[40px] px-4 rounded-sm"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Selected ({selectedItems.length})
                        </Button>
                    ) : null
                }
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
                    handleSelectItem(item.POS_ID, true);
                    setDeleteDialogOpen(true);
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
                        key: "posId",
                        header: "POS ID",
                        render: (item) => (
                            <span className="font-mono text-[10px] font-bold text-gray-400 uppercase">
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
                                <div className={cn(
                                    "h-10 w-10 rounded-sm flex items-center justify-center border",
                                    item.Status === "active" ? "bg-green-50/50 border-green-100/50 text-green-600" : "bg-red-50/50 border-red-100/50 text-red-600"
                                )}>
                                    <Monitor className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-gray-900">{item.POS_Name}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate">Terminal Terminal</div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: "status",
                        header: "Status",
                        render: (item) => (
                            <span className={cn(
                                "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                                item.Status === "active" ? "text-green-600 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"
                            )}>
                                {item.Status?.toUpperCase()}
                            </span>
                        ),
                        className: "w-28",
                    },
                ]}
                renderGridCard={(item, actions) => {
                    const isActive = item.Status === "active";
                    const status = isActive
                        ? { label: "ACTIVE", color: "text-green-600 bg-green-50 border-green-100", bar: "bg-green-500" }
                        : { label: "INACTIVE", color: "text-red-600 bg-red-50 border-red-100", bar: "bg-red-500" };

                    return (
                        <div className="group relative bg-white border border-[#d5d5dd] rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
                            <div className={cn("h-0.5 w-full shrink-0", status.bar)} />

                            <div className="p-4 flex flex-col flex-1">
                                {/* ID & Status */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-gray-400 tracking-wider">
                                        TERMINAL: {item.POS_ID?.toString().padStart(3, '0') || '000'}
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
                                        isActive ? "bg-green-50/50 border-green-100/50 text-green-600" : "bg-gray-50/50 border-gray-100/50 text-gray-400"
                                    )}>
                                        <Monitor className="h-5 w-5 stroke-[1.5]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-1">
                                            <h3 className="text-sm font-bold text-gray-800 leading-tight truncate group-hover:text-black transition-colors" title={item.POS_Name}>
                                                {item.POS_Name}
                                            </h3>
                                            <div className="flex lg:hidden items-center gap-1 shrink-0">
                                                {actions}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight truncate">
                                            POS System
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Metrics */}
                                <div className="mt-auto pt-3 border-t border-gray-100/60 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Reference</span>
                                        <span className="text-xs font-bold text-gray-900 tracking-tight pr-2">
                                            #{item.POS_ID}
                                        </span>
                                    </div>

                                    <div className="hidden lg:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                                        <div className="flex items-center gap-1">
                                            {actions}
                                        </div>
                                    </div>

                                    <div className="lg:hidden flex flex-col items-end">
                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Branch</span>
                                        <span className="text-xs font-bold text-gray-900">
                                            ID: {item.Branch_ID_fk}
                                        </span>
                                    </div>
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

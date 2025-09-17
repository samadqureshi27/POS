"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import StatCard from "@/components/ui/summary-card";
import ActionBar from "@/components/ui/action-bar";
import { Toast } from '@/components/ui/toast';
import PosModal from "./_components/pos-modal";
import PosTable from "./_components/pos-table";
import LoadingSpinner from '@/components/ui/loader';
import { ManagementPageSkeleton } from "@/app/(main)/dashboard/_components/ManagementPageSkeleton";
import { Toaster } from "@/components/ui/sonner";
import { usePosManagement } from "@/lib/hooks/usePosManagement";

const PosListPage = () => {
    const params = useParams();
    const branchId = params?.branchId as string;

    const {
        // State
        filteredItems,
        searchTerm,
        statusFilter,
        loading,
        actionLoading,
        statistics,
        // Toast
        toast,
        hideToast,
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

    if (loading) {
        return <ManagementPageSkeleton showSummaryCards={true} summaryCardCount={3} showActionBar={true} />;
    }

    if (!branchId) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-muted-foreground">Branch ID not found in URL parameters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 bg-gray-50 min-h-screen">
            <Toaster position="top-right" />

            <h1 className="text-3xl font-semibold tracking-tight mb-8 mt-20">
                POS Systems - Branch #{branchId}
            </h1>

            {/* Summary cards */}
            <div className="grid grid-cols-1 max-w-[100vw] lg:grid-cols-2 gap-4 mb-8 lg:max-w-[50vw]">
                <StatCard
                    title="Total POS"
                    value={statistics.totalPosCount}
                />
                <StatCard
                    title="Active POS"
                    value={statistics.activePosCount}
                />
            </div>

            {/* Action bar */}
            <ActionBar
                onAdd={openCreateModal}
                addDisabled={selectedItems.length > 0}
                onDelete={handleDeleteSelected}
                deleteDisabled={selectedItems.length === 0}
                isDeleting={actionLoading}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search"
            />

            {/* POS table */}
            <PosTable
                posItems={filteredItems}
                filteredItems={filteredItems}
                selectedItems={selectedItems}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onSelectAll={handleSelectAll}
                onSelectItem={handleSelectItem}
                onEditItem={openEditModal}
                isAllSelected={isAllSelected(filteredItems)}
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
        </div>
    );
};

export default PosListPage;
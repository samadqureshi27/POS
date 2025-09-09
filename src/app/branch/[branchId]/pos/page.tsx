"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import StatCard from "../../../../components/layout/UI/SummaryCard";
import ActionBar from "@/components/layout/UI/ActionBar";
import { Toast } from '../../../../components/layout/UI/Toast';
import PosModal from "./_components/posModal";
import PosTable from "./_components/posTable";
import LoadingSpinner from '../../../../components/layout/UI/Loader';
import { usePosManagement } from "../../../../lib/hooks/UsePosManagement";

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
        return <LoadingSpinner message="Loading POS..." />;
    }

    if (!branchId) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Branch ID not found in URL parameters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 bg-gray-50 min-h-screen">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <h1 className="text-3xl font-semibold mb-8 mt-20">
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
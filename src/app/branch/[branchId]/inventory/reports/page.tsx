"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import StatCard from "@/components/layout/UI/SummaryCard";
import ActionBar from "@/components/layout/UI/ActionBar";
import { Toast } from '@/components/layout/UI/Toast';
import ReportsTable from "./_components/reportsTable";
import LoadingSpinner from '@/components/layout/UI/Loader';
import { useReportsManagement } from "../../../../../lib/hooks/useReport";

const ReportsPage = () => {
    const params = useParams();
    const branchId = params?.branchId as string;

    const {
        // State
        reportItems,
        filteredItems,
        searchTerm,
        unitFilter,
        loading,
        statistics,
        uniqueUnits,
        // Toast
        toast,
        hideToast,
        // Actions
        setSearchTerm,
        setUnitFilter,
    } = useReportsManagement(branchId);

    if (loading) {
        return <LoadingSpinner message="Loading Inventory..." />;
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
                Inventory Report - Branch #{branchId}
            </h1>

            {/* Summary cards */}
            <div className="grid grid-cols-1 max-w-[100vw] lg:grid-cols-2 gap-4 mb-8 lg:max-w-[50vw]">
                <StatCard
                    title="Most Used"
                    value={statistics.mostUsedItem.name}
                    subtitle={`${statistics.mostUsedItem.count} times`}
                />
                <StatCard
                    title="Least Used"
                    value={statistics.leastUsedItem.name}
                    subtitle={`${statistics.leastUsedItem.count} times`}
                />
            </div>

            {/* Action bar - only search, no add/delete for reports */}
            <ActionBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search"
            />

            {/* Reports table */}
            <ReportsTable
                reportItems={reportItems}
                filteredItems={filteredItems}
                unitFilter={unitFilter}
                onUnitFilterChange={setUnitFilter}
            />
        </div>
    );
};

export default ReportsPage;
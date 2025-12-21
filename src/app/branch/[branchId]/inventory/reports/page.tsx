"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import { Toaster } from "@/components/ui/sonner";
import ReportsTable from "./_components/reports-table";
import ImportExportControls from "@/components/ui/import-export-btn";
import { useReportsManagement } from "@/lib/hooks/useReport";
import { useImportExport } from "@/lib/hooks/importExportHook";
import { useToast } from "@/lib/hooks";
import GlobalSkeleton from "@/components/ui/global-skeleton";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

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
        // Actions
        setSearchTerm,
        setUnitFilter,
    } = useReportsManagement(branchId);

    // Toast for export operations
    const { showToast } = useToast();

    // Export functionality only
    const { handleExportWithConfig, isLoading } = useImportExport({
        onExportSuccess: () => showToast("Inventory report exported successfully", "success"),
        onExportError: (error) => showToast(error, "error"),
    });

    // Export functionality using predefined config
    const handleExport = () => {
        handleExportWithConfig(filteredItems, 'inventory', branchId);
    };

    if (loading) {
        return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={2} showActionBar={true} hasSubmenu={true} />
    }

    if (!branchId) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen bg-background">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Branch ID not found in URL parameters</p>
                </div>
            </div>
        );
    }

    return (
        <PageContainer hasSubmenu={true}>
            <Toaster position="top-right" />

            {/* Coming Soon Content */}
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="text-center px-6 py-12 max-w-md">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                            <AlertCircle className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Coming Soon</h1>
                    <p className="text-lg text-gray-600 mb-2">Inventory Reports</p>
                    <p className="text-sm text-gray-500">
                        This feature is currently under development and will be available soon.
                    </p>
                </div>
            </div>

            {/* Original Content - Preserved but hidden */}
            <div className="hidden">
                {/* Header with Export Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8">
                    <div>
                        <PageHeader
                            title={`Inventory Report - Branch #${branchId}`}
                            subtitle="View inventory usage statistics and export reports"
                        />
                    </div>

                    {/* Export Controls Only */}
                    <ImportExportControls
                        onExport={handleExport}
                        disabled={isLoading || filteredItems.length === 0}
                        exportLabel={isLoading ? "Exporting..." : "Export Report"}
                        showImport={false}
                        showExport={true}
                        className="mt-4 md:mt-0"
                    />
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <AdvancedMetricCard
                        title="Most Used Item"
                        subtitle={`${statistics.mostUsedItem.count} times`}
                        value={statistics.mostUsedItem.name}
                        icon="target"
                        format="text"
                        status="good"
                    />

                    <AdvancedMetricCard
                        title="Least Used Item"
                        subtitle={`${statistics.leastUsedItem.count} times`}
                        value={statistics.leastUsedItem.name}
                        icon="inventory"
                        format="text"
                        status="neutral"
                    />
                </div>

                {/* Action Bar */}
                <EnhancedActionBar
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search inventory items..."
                    showViewToggle={false}
                />

                {/* Reports table */}
                <ReportsTable
                    reportItems={reportItems}
                    filteredItems={filteredItems}
                    unitFilter={unitFilter}
                    onUnitFilterChange={setUnitFilter}
                />
            </div>
        </PageContainer>
    );
};

export default ReportsPage;

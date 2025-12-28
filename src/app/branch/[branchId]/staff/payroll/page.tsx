"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, DollarSign } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import { DateFilter } from "@/components/ui/date-filter";
import { toast } from "sonner";
import { StaffTable } from "./components/payroll-staff-table";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { useDateFilter } from "@/lib/hooks/useDateFilter";
import { useStaffData } from "@/lib/hooks/usePayrollStaffData";
import { useFilters } from "@/lib/hooks/payrollFilter";
import { formatCurrency } from "@/lib/util/formatters";

const StaffManagementPage = () => {
  const params = useParams();
  const branchId = params?.branchId as string || "1";

  // Custom hooks
  const dateFilter = useDateFilter("Week");

  // Staff data hook with error handling
  const { staffItems, loading, summaryData } = useStaffData(branchId);

  // Filters hook
  const filters = useFilters(staffItems, dateFilter);

  // Handle staff data loading errors
  React.useEffect(() => {
    if (!loading && !branchId) {
      toast.error("Branch ID not found");
    }
  }, [loading, branchId]);

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showActionBar={true} hasSubmenu={true} />;
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
      {/* Coming Soon Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center px-6 py-12 max-w-md">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Coming Soon</h1>
          <p className="text-lg text-gray-600 mb-2">Staff Payroll</p>
          <p className="text-sm text-gray-500">
            This feature is currently under development and will be available soon.
          </p>
        </div>
      </div>

      {/* Original Content - Preserved but hidden */}
      <div className="hidden">
        <PageHeader
          title={`Payroll - Branch #${branchId}`}
          subtitle="Manage employee payroll and salary payments"
        />

        {/* Date Filter Component */}
        <DateFilter dateFilter={dateFilter} />

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdvancedMetricCard
            title="Total Staff"
            subtitle="All employees"
            value={summaryData.totalStaff}
            icon="inventory"
            format="number"
          />

          <AdvancedMetricCard
            title="Paid Staff"
            subtitle="Payment complete"
            value={summaryData.paidStaff}
            icon="target"
            format="number"
            status="good"
          />

          <AdvancedMetricCard
            title="Total Payroll"
            subtitle="All salaries"
            value={summaryData.totalSalaries}
            icon="money"
            format="currency"
            status="neutral"
          />

          <AdvancedMetricCard
            title="Pending Payments"
            subtitle="Not yet paid"
            value={summaryData.unpaidSalaries}
            icon="money"
            format="currency"
            status={summaryData.unpaidSalaries > 0 ? "warning" : "good"}
          />
        </div>

        {/* Action Bar */}
        <EnhancedActionBar
          searchValue={filters.searchTerm}
          onSearchChange={filters.setSearchInput}
          searchPlaceholder="Search staff by name or role..."
          showViewToggle={false}
        />

        {/* Staff Table Component */}
        <StaffTable
          filteredItems={filters.filteredItems}
          staffItems={staffItems}
          filters={filters}
          branchId={branchId}
        />
      </div>
    </PageContainer>
  );
};

export default StaffManagementPage;

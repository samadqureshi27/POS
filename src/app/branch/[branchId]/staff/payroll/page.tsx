"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, DollarSign } from "lucide-react";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import { DateFilter } from "@/components/ui/date-filter";
import { Toast } from "@/components/ui/toast";
import { StaffTable } from "./components/payroll-staff-table";
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Toaster } from "@/components/ui/sonner";
import { useDateFilter } from "@/lib/hooks/useDateFilter";
import { useStaffData } from "@/lib/hooks/usePayrollStaffData";
import { useFilters } from "@/lib/hooks/payrollFilter";
import { useToast as useToastHook } from "@/lib/hooks/toast";
import { formatCurrency } from "@/lib/util/formatters";

const StaffManagementPage = () => {
  const params = useParams();
  const branchId = params?.branchId as string || "1";

  // Custom hooks
  const dateFilter = useDateFilter("Week");
  const { toast, showToast, hideToast } = useToastHook();

  // Staff data hook with error handling
  const { staffItems, loading, summaryData } = useStaffData(branchId);

  // Filters hook
  const filters = useFilters(staffItems, dateFilter);

  // Handle staff data loading errors
  React.useEffect(() => {
    if (!loading && !branchId) {
      showToast("Branch ID not found", "error");
    }
  }, [loading, branchId, showToast]);

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
      <Toaster position="top-right" />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

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
    </PageContainer>
  );
};

export default StaffManagementPage;

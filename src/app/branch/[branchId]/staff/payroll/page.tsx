"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

// Components
import { DateFilter } from "@/components/ui/date-filter";
import { Toaster } from "@/components/ui/sonner";
import StatCard from "@/components/ui/summary-card";
import { StaffTable } from "./components/payroll-staff-table";
import ActionBar from "@/components/ui/action-bar";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';

// Hooks
import { useDateFilter } from "@/lib/hooks/useDateFilter";
import { useStaffData } from "@/lib/hooks/usePayrollStaffData";
import { useFilters } from "@/lib/hooks/payrollFilter";
import { useToast } from "@/lib/hooks";

const StaffManagementPage = () => {
  // For demo purposes, let's set a default branch ID since we can't access real routing
  const [branchId, setBranchId] = useState("1"); // Default to branch 1 for demo

  // In a real Next.js app, you would use:
  // const params = useParams();
  // const branchId = params?.branchId;

  // Custom hooks
  const dateFilter = useDateFilter("Week");
  const { showToast } = useToast();

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
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={3} showActionBar={true} />;
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
    <div className="p-6 bg-gray-50 min-h-screen mt-17 w-full">
      <Toaster position="top-right" />

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold">Payroll - Branch #{branchId}</h1>
      </div>

      {/* Date Filter Component */}
      <DateFilter dateFilter={dateFilter} />

      {/* Summary Cards using StatCard component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-[100vw]">
        <StatCard
          title="Total Staff"
          value={summaryData.totalStaff}
        />
        <StatCard
          title="Paid Staff"
          value={summaryData.paidStaff}
        />
        <StatCard
          title="Total Payroll"
          value={`$${summaryData.totalSalaries.toLocaleString()}`}
        />
        <StatCard
          title="Pending Payments"
          value={`$${summaryData.unpaidSalaries.toLocaleString()}`}
        />
      </div>

      {/* Action Bar */}
      <ActionBar
        searchValue={filters.searchTerm}
        onSearchChange={filters.setSearchInput}
        searchPlaceholder="Search staff..."
      />

      {/* Staff Table Component */}
      <StaffTable
        filteredItems={filters.filteredItems}
        staffItems={staffItems}
        filters={filters}
        branchId={branchId}
      />
    </div>
  );
};

export default StaffManagementPage;
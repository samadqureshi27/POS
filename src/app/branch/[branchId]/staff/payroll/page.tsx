"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

// Components
import { DateFilter } from "@/components/layout/ui/Date-Filter";
import { Toast } from "@/components/layout/ui/toast";
import StatCard from "@/components/layout/ui/summary-card";
import { StaffTable } from "./components/payroll-staff-table";
import ActionBar from "@/components/layout/ui/action-bar";

// Hooks
import { useDateFilter } from "@/lib/hooks/useDateFilter";
import { useStaffData } from "@/lib/hooks/usePayrollStaffData";
import { useFilters } from "@/lib/hooks/PayrollFilter";
import { useToast } from "@/lib/hooks/toast";

const StaffManagementPage = () => {
  // For demo purposes, let's set a default branch ID since we can't access real routing
  const [branchId, setBranchId] = useState("1"); // Default to branch 1 for demo

  // In a real Next.js app, you would use:
  // const params = useParams();
  // const branchId = params?.branchId;

  // Custom hooks
  const dateFilter = useDateFilter("Week");
  const { toast, showToast, hideToast } = useToast();
  
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
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Payroll...</p>
        </div>
      </div>
    );
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
    <div className="bg-gray-50 min-h-screen mt-17 w-full px-2">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

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
        searchPlaceholder="Search"
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
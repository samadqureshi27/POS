// app/customers-details/page.tsx
"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import ActionBar from "@/components/ui/action-bar";
import { Toast } from "@/components/ui/toast";
import CustomerSummaryCards from "./_components/customer-summary-cards";
import CustomerTable from "./_components/customer-table";
import ImportExportControls from "@/components/ui/import-export-btn";
import { useCustomers, useCustomerFiltering, useCustomerSummary } from "@/lib/hooks/useCustomerDetails";
import { exportCustomersToCSV } from "@/lib/util/customer-details-utils";
import { useToast } from "@/lib/hooks";
import LoadingSpinner from "@/components/ui/loader";
import { ManagementPageSkeleton } from "@/app/(main)/dashboard/_components/ManagementPageSkeleton";
import { Toaster } from "@/components/ui/sonner";

const CustomerManagementPage = () => {
  const router = useRouter();

  // Custom hooks
  const { customerItems, loading } = useCustomers();
  const { searchInput, searchTerm, setSearchInput, filteredCustomers } = useCustomerFiltering(customerItems);
  const summaryData = useCustomerSummary(filteredCustomers);
  const { toast, showToast, hideToast } = useToast();

  // Handle customer row click - Navigate to dynamic route
  const handleCustomerClick = (customerId: number) => {
    console.log('Navigating to customer ID:', customerId);
    router.push(`/customer-details/${customerId}`);
  };

  // Export functionality
  const handleExport = () => {
    exportCustomersToCSV(filteredCustomers);
    showToast("Data exported successfully", "success");
  };

  // Import functionality


  if (loading) {
    return <ManagementPageSkeleton showSummaryCards={true} summaryCardCount={4} showImportExport={true} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 md:grid-cols-2 items-center max-w-[100vw] mb-8 mt-2">
        <h1 className="text-3xl font-semibold tracking-tight">Loyal Customers</h1>

        {/* Import/Export Controls */}
        <ImportExportControls
          onExport={handleExport}
        />
      </div>

      {/* Summary Cards */}
      <CustomerSummaryCards summaryData={summaryData} />

      <ActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search"
      />

      {/* Customer Table */}
      <CustomerTable
        customers={filteredCustomers}
        searchTerm={searchTerm}
        onCustomerClick={handleCustomerClick}
      />
    </div>
  );
};

export default CustomerManagementPage;
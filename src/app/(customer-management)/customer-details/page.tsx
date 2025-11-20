// app/customers-details/page.tsx
"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import EnhancedActionBar from "@/components/ui/enhanced-action-bar";
import { Toast } from "@/components/ui/toast";
import CustomerSummaryCards from "./_components/customer-summary-cards";
import CustomerTable from "./_components/customer-table";
import ImportExportControls from "@/components/ui/import-export-btn";
import { useCustomers, useCustomerFiltering, useCustomerSummary } from "@/lib/hooks/useCustomerDetails";
import { exportCustomersToCSV } from "@/lib/util/customer-details-utils";
import { useToast } from "@/lib/hooks";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { Toaster } from "@/components/ui/sonner";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

const CustomerManagementPage = () => {
  const router = useRouter();

  // Custom hooks
  const { customerItems, loading } = useCustomers();
  const { searchInput, searchTerm, setSearchInput, filteredCustomers } = useCustomerFiltering(customerItems);
  const summaryData = useCustomerSummary(filteredCustomers);
  const { toast, showToast, hideToast } = useToast();

  // Handle customer row click - Navigate to dynamic route
  const handleCustomerClick = (customerId: number) => {
    router.push(`/customer-details/${customerId}`);
  };

  // Export functionality
  const handleExport = () => {
    exportCustomersToCSV(filteredCustomers);
    showToast("Data exported successfully", "success");
  };

  // Import functionality


  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={true} summaryCardCount={4} showImportExport={true} />;
  }

  return (
    <PageContainer>
      <Toaster position="top-right" />

      <PageHeader
        title="Loyal Customers"
        actions={<ImportExportControls onExport={handleExport} />}
      />

      {/* Summary Cards */}
      <CustomerSummaryCards summaryData={summaryData} />

      <EnhancedActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search customers by name, email, or phone..."
        showViewToggle={false}
      />

      {/* Customer Table */}
      <CustomerTable
        customers={filteredCustomers}
        searchTerm={searchTerm}
        onCustomerClick={handleCustomerClick}
      />
    </PageContainer>
  );
};

export default CustomerManagementPage;
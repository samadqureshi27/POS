// app/customers-details/[customer-profile]/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useCustomerId } from '@/lib/hooks/useCustomerID';
import { useCustomerProfile } from '@/lib/hooks/useCustomerProfile';
import { useOrderFilters } from '@/lib/hooks/cutomerOrderFilter';
// Components
import  {LoadingSpinner } from './_components/loading-spinner';
import { ErrorMessage } from './_components/error-message';
import { CustomerProfileHeader } from './_components/customer-profile-header';
import { CustomerMetricsSection } from './_components/customers-metric-section';
import { OrderHistorySection } from './_components/order-history-section';

const CustomerProfilePage = () => {
  const router = useRouter();
  const customerId = useCustomerId();
  
  const {
    customer,
    orders,
    loading,
    error,
    totalSpent,
    averageOrderValue
  } = useCustomerProfile(customerId);

  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filteredOrders
  } = useOrderFilters(orders);

  const handleBackClick = () => {
    router.push("/customer-details");
  };

  // Debug render
  console.log("Render state:", { customerId, loading, error, customer });

  if (loading) {
    return <LoadingSpinner customerId={customerId} />;
  }

  if (error || !customer) {
    return (
      <ErrorMessage 
        error={error || "Customer not found"} 
        customerId={customerId}
        onBackClick={handleBackClick}
      />
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <CustomerProfileHeader onBackClick={handleBackClick} />

      <CustomerMetricsSection
        customer={customer}
        orders={orders}
        totalSpent={totalSpent}
        averageOrderValue={averageOrderValue}
      />

      <OrderHistorySection
        orders={orders}
        filteredOrders={filteredOrders}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        setTypeFilter={setTypeFilter}
        setStatusFilter={setStatusFilter}
      />
    </div>
  );
};

export default CustomerProfilePage;
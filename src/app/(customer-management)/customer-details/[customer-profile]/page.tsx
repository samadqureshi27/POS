// app/customers-details/[customer-profile]/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useCustomerId } from '@/lib/hooks/useCustomerID';
import { useCustomerProfile } from '@/lib/hooks/useCustomerProfile';
import { useOrderFilters } from '@/lib/hooks/cutomerP-orderFilter';
// Components
import  {LoadingSpinner } from './_components/LoadingSpinner';
import { ErrorMessage } from './_components/ErrorMessage';
import { CustomerProfileHeader } from './_components/CustomerProfileHeader';
import { CustomerMetricsSection } from './_components/customersMetricSection';
import { OrderHistorySection } from './_components/orderHistorySection';

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
    <div className="bg-gray-50 min-h-screen">
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
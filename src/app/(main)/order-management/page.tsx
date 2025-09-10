// page.tsx - Refactored Main Component
"use client";
import React, { useState, useEffect } from "react";
import ActionBar from "@/components/layout/ui/ActionBar";

// Import all our new components
import {Toast} from "@/components/layout/ui/Toast";
import PeriodSelector from "./_components/period-selector";
import MostOrderedTable from "./_components/most-ordered-table";
import LeastOrderedTable from "./_components/least-order-table";
import OrderTypeChart from "./_components/order-type-chart";
import OrderTable from "./_components/order-table";

// Import types and services

import { OrderItem, OrderStats } from "@/lib/types";
import { OrderAPI } from "@/components/auth/order-API";
import { useOrderFilters } from "@/lib/hooks/UseOrderFilter";

const OrderManagementPage = () => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Stats data
  const [orderStats, setOrderStats] = useState<OrderStats>({
    mostOrdered: [],
    leastOrdered: [],
    orderTypeStats: [],
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Use our custom hook for filtering logic
  const {
    filteredItems,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    unitFilter,
    setUnitFilter,
    selectedPeriod,
    handlePeriodChange,
    showDatePicker,
    setShowDatePicker,
    customDateRange,
    setCustomDateRange,
  } = useOrderFilters(items);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load orders on mount
  useEffect(() => {
    loadOrders();
    loadOrderStats();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderAPI.getOrders();
      if (response.success) {
        setItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadOrderStats = async () => {
    try {
      setStatsLoading(true);
      const response = await OrderAPI.getOrderStats();
      if (response.success) {
        setOrderStats(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch order statistics");
      }
    } catch (error) {
      console.error("Error fetching order stats:", error);
      showToast("Failed to load order statistics", "error");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems(
      checked ? [...selectedItems, id] : selectedItems.filter((i) => i !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((i) => i.Order) : []);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Order Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-8">Order Management</h1>

      {/* Time Period Selector */}
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MostOrderedTable 
          data={orderStats.mostOrdered} 
          loading={statsLoading} 
        />
        
        <LeastOrderedTable 
          data={orderStats.leastOrdered} 
          loading={statsLoading} 
        />
        
        <OrderTypeChart 
          data={orderStats.orderTypeStats} 
          loading={statsLoading} 
        />
      </div>

      {/* Search Bar */}
      <ActionBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
      />

      {/* Order Table */}
      <OrderTable
        items={items}
        filteredItems={filteredItems}
        statusFilter={statusFilter}
        unitFilter={unitFilter}
        setStatusFilter={setStatusFilter}
        setUnitFilter={setUnitFilter}
        loading={loading}
      />
    </div>
  );
};

export default OrderManagementPage;
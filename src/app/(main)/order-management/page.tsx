// page.tsx - Refactored Main Component
"use client";
import React, { useState, useEffect } from "react";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";

// Import all our new components
import { Toast } from "@/components/ui/toast";
import { PeriodSelector } from "@/components/ui/period-selector";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import { DashboardSection } from "@/components/ui/dashboard-section";
import ActionBar from "@/components/ui/action-bar";
import OrderTypeChart from "./_components/order-type-chart";
import ModernOrderChart from "./_components/modern-order-chart";
import ModernTopItems from "./_components/modern-top-items";
import OrderTable from "./_components/order-table";

// Import types and services
import { OrderItem, OrderStats } from "@/lib/types";
import { OrderAPI } from "@/lib/util/order-api";
import { useOrderFilters } from "@/lib/hooks/useOrderFilter";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { logError } from "@/lib/util/logger";

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
      logError("Error fetching orders", error, {
        component: "OrderManagement",
        action: "loadOrders",
      });
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
      logError("Error fetching order stats", error, {
        component: "OrderManagement",
        action: "loadOrderStats",
      });
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
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={true} showPeriodSelector={true} />;
  }

  return (
    <PageContainer>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <PageHeader title="Order Management" />

      {/* Time Period Selector */}
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
      />

      {/* Order Performance Overview */}
      <DashboardSection
        title="Order Performance Overview"
        subtitle="Real-time order metrics and KPIs"
        priority="high"
        collapsible={true}
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <AdvancedMetricCard
            title="Total Orders Today"
            value={145}
            format="number"
            icon="orders"
            trend={{
              value: 18.2,
              direction: "up",
              period: "vs yesterday"
            }}
            status="good"
            target={{
              current: 145,
              goal: 200,
              unit: "orders"
            }}
          />
          <AdvancedMetricCard
            title="Average Order Value"
            value={450}
            format="currency"
            icon="revenue"
            trend={{
              value: -3.5,
              direction: "down",
              period: "vs last week"
            }}
            status="warning"
            target={{
              current: 450,
              goal: 500,
              unit: "PKR"
            }}
          />
          <AdvancedMetricCard
            title="Order Completion Rate"
            value={94.8}
            format="percentage"
            icon="target"
            trend={{
              value: 2.1,
              direction: "up",
              period: "this week"
            }}
            status="good"
            target={{
              current: 94.8,
              goal: 98,
              unit: "%"
            }}
          />
          <AdvancedMetricCard
            title="Average Prep Time"
            value="4.2 min"
            icon="time"
            trend={{
              value: -8.5,
              direction: "down",
              period: "vs target"
            }}
            status="good"
            subtitle="Under target of 5 min"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <AdvancedMetricCard
            title="Peak Hour Orders"
            value={45}
            format="number"
            icon="orders"
            subtitle="11 AM - 12 PM"
            trend={{
              value: 12.8,
              direction: "up",
              period: "vs last week"
            }}
            status="good"
          />
          <AdvancedMetricCard
            title="Order Cancellation Rate"
            value={2.1}
            format="percentage"
            icon="percentage"
            trend={{
              value: 0.8,
              direction: "up",
              period: "this month"
            }}
            status="warning"
          />
          <AdvancedMetricCard
            title="Staff Efficiency"
            value={88.5}
            format="percentage"
            icon="target"
            trend={{
              value: 4.2,
              direction: "up",
              period: "vs last month"
            }}
            status="good"
            target={{
              current: 88.5,
              goal: 90,
              unit: "%"
            }}
          />
          <AdvancedMetricCard
            title="Customer Wait Time"
            value="2.8 min"
            icon="time"
            trend={{
              value: -15.2,
              direction: "down",
              period: "vs last week"
            }}
            status="good"
            subtitle="Improved service"
          />
        </div>
      </DashboardSection>

      {/* Order Analytics & Trends */}
      <DashboardSection
        title="Order Analytics & Trends"
        subtitle="Product performance and order insights"
        priority="medium"
        collapsible={true}
        defaultExpanded={true}
      >
        {/* Modern Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ModernTopItems
            data={orderStats.mostOrdered}
            loading={statsLoading}
            title="Bestsellers"
            type="most"
          />

          <ModernTopItems
            data={orderStats.leastOrdered}
            loading={statsLoading}
            title="Underperformers"
            type="least"
          />

          <ModernOrderChart
            data={orderStats.orderTypeStats}
            loading={statsLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdvancedMetricCard
            title="Bestseller Contribution"
            value={38.5}
            format="percentage"
            icon="percentage"
            subtitle="Revenue share"
            trend={{
              value: 5.2,
              direction: "up",
              period: "this month"
            }}
            status="good"
          />
          <AdvancedMetricCard
            title="Menu Item Variety"
            value={42}
            format="number"
            icon="inventory"
            subtitle="Active items"
            status="neutral"
          />
          <AdvancedMetricCard
            title="Seasonal Items Performance"
            value={15.8}
            format="percentage"
            icon="percentage"
            trend={{
              value: 22.1,
              direction: "up",
              period: "vs last season"
            }}
            status="good"
          />
          <AdvancedMetricCard
            title="Special Requests Rate"
            value={8.2}
            format="percentage"
            icon="percentage"
            trend={{
              value: 1.5,
              direction: "up",
              period: "this week"
            }}
            status="neutral"
          />
        </div>
      </DashboardSection>

      {/* Order Management & Processing */}
      <DashboardSection
        title="Order Management & Processing"
        subtitle="Detailed order tracking and management"
        priority="high"
        collapsible={true}
        defaultExpanded={true}
      >
        {/* Search Bar */}
        <div className="mb-6">
          <ActionBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search orders by ID, customer name, or product"
          />
        </div>

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
      </DashboardSection>
    </PageContainer>
  );
};

export default OrderManagementPage;
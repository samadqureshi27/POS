// app/analytics/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

// Types
import { AnalyticsData } from '@/lib/types/analytics';

// Components
import { StarRating } from '@/components/layout/ui/StarRating';
import LoadingSpinner from '@/components/layout/ui/loader';
import { MetricCard } from './_components/MetricCard';
import { CustomerGrowthChart } from './_components/CustomerGrowthChart';
import { RevenueTrendsChart } from './_components/RevenueTrendsChart';
import { OrderTypesChart } from './_components/OrderTypesChart';
import { MonthlyComparisonChart } from './_components/MonthlyComparisonChart';
import { CustomerSegmentsChart } from './_components/CustomerSegmentsChart';
import { TopCustomersTable } from './_components/TopCustomersTable';
import { RecentOrdersTable } from './_components/RecentOrdersTable';
import { PeriodSelector } from './_components/PeriodSelector';

// Hooks
import { useDashboard } from '@/lib/hooks/useAnalytics';
import { AnalyticsAPI } from "@/lib/util/AnalyticsApi";

const AnalyticsDashboard = () => {
  const router = useRouter();
  
  // Single combined hook
  const {
    // Analytics data
    analyticsData,
    topCustomers,
    recentOrders,
    loading,
    error,
    setError,
    setLoading,
    
    // Date range
    selectedPeriod,
    setSelectedPeriod,
    showDatePicker,
    setShowDatePicker,
    customDateRange,
    setCustomDateRange,
    
    handleCustomDateRange,
    
    // Order filters
    searchTerm,
    setSearchTerm,
    filteredOrders,
    
    // Actions
    loadDashboardData,
    refetch
  } = useDashboard();

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle period changes (without loading animation for period buttons)
  const handlePeriodChangeWithData = async (period: string) => {
    try {
      setSelectedPeriod(period);
      setShowDatePicker(false);
      // Load data without showing loading spinner for period changes
      await loadDashboardData(period, false); // Pass false to skip loading animation
    } catch (error) {
      console.error("Error changing period:", error);
      setError("Failed to load data for selected period");
    }
  };

  // Handle custom date range
  const handleCustomDateRangeWithData = async (startDate: string, endDate: string) => {
    try {
      const { startDate: start, endDate: end } = handleCustomDateRange(startDate, endDate);
      await loadCustomRangeData(start, end);
    } catch (error) {
      console.error("Error handling custom date range:", error);
      setError("Failed to load custom date range data");
    }
  };

  const loadCustomRangeData = async (startDate?: Date, endDate?: Date) => {
    if (!customDateRange?.[0]?.startDate || !customDateRange?.[0]?.endDate) {
      console.warn("Custom date range not properly set");
      return;
    }

    const start = startDate || customDateRange[0].startDate;
    const end = endDate || customDateRange[0].endDate;

    const startDateStr = start.toISOString().split("T")[0];
    const endDateStr = end.toISOString().split("T")[0];

    try {
      // Use the hook's handleCustomDateRange which handles loading state
      handleCustomDateRange(startDateStr, endDateStr);
    } catch (error) {
      console.error("Error fetching custom range data:", error);
      setError("Failed to load custom date range data");
    }
  };

  const formatDisplayDate = (date: Date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleBackClick = () => {
    router.push('/');
  };

  if (loading) {
    return <LoadingSpinner message="Loading Analytics Dashboard..." />;
  }


  return (
    <div className="bg-gray-50 min-h-screen p-6 mt-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
          </div>
        </div>
        
        {/* Period Selector */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChangeWithData}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          onCustomDateRange={handleCustomDateRangeWithData}
        />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Customers"
          value={analyticsData.totalCustomers}
          subtitle="Active customers"
        />
        <MetricCard
          title="Total Revenue"
          value={`PKR ${analyticsData.totalRevenue?.toLocaleString() || '0'}`}
          subtitle="All time revenue"
        />
        <MetricCard
          title="Total Orders"
          value={analyticsData.totalOrders}
          subtitle="All orders placed"
        />
        <MetricCard
          title="Avg Order Value"
          value={`PKR ${analyticsData.averageOrderValue || '0'}`}
          subtitle="Per order average"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="New Customers"
          value={analyticsData.newCustomersThisMonth}
          subtitle="This month"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`PKR ${analyticsData.monthlyRevenue?.toLocaleString() || '0'}`}
          subtitle="Current month"
        />
        <MetricCard
          title="Repeat Customers"
          value={analyticsData.repeatCustomers}
          subtitle="Returning customers"
        />
        <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-3xl font-bold">{analyticsData.customerSatisfaction || 0}</p>
            <p className="text-sm text-gray-500">Customer Satisfaction</p>
            <StarRating rating={Math.floor(analyticsData.customerSatisfaction || 0)} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueTrendsChart selectedPeriod={selectedPeriod} />
        <CustomerGrowthChart selectedPeriod={selectedPeriod} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <OrderTypesChart selectedPeriod={selectedPeriod} />
        <MonthlyComparisonChart selectedPeriod={selectedPeriod} />
        <CustomerSegmentsChart selectedPeriod={selectedPeriod} />
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCustomersTable customers={topCustomers} />
        <RecentOrdersTable
          orders={filteredOrders}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          maxRows={8}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
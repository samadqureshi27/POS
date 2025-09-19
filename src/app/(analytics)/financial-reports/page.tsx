// app/analytics/page.tsx
"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { useRouter } from 'next/navigation';
// Components
import { StarRating } from '@/components/ui/StarRating';
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { MetricCard } from '@/components/ui/MetricCard';
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

  const calendarRef = useRef<HTMLDivElement>(null);

  // Add debug logging
  console.log('Analytics Dashboard render - Loading:', loading);

  // Simplified useEffect - the hook now handles initialization
  useEffect(() => {
    console.log('Analytics Dashboard mounted');
  }, []); // Just for debugging

  // Memoize period change handler to prevent recreating on every render
  const handlePeriodChangeWithData = useCallback(async (period: string) => {
    try {
      console.log('Changing period to:', period);
      setSelectedPeriod(period);
      setShowDatePicker(false);
      await loadDashboardData(period, false);
    } catch (error) {
      console.error("Error changing period:", error);
      setError("Failed to load data for selected period");
    }
  }, [setSelectedPeriod, setShowDatePicker, loadDashboardData, setError]);

  // Memoize custom date range handler
  const handleCustomDateRangeWithData = useCallback(async (startDate: string, endDate: string) => {
    try {
      console.log('Custom date range:', startDate, 'to', endDate);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      const { startDate: start, endDate: end } = handleCustomDateRange(startDate, endDate);
      await loadCustomRangeData(startDateObj, endDateObj);
    } catch (error) {
      console.error("Error handling custom date range:", error);
      setError("Failed to load custom date range data");
    }
  }, [handleCustomDateRange, setError]);

  const loadCustomRangeData = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!customDateRange?.[0]?.startDate || !customDateRange?.[0]?.endDate) {
      console.warn("Custom date range not properly set");
      return;
    }

    const start = startDate || customDateRange[0].startDate;
    const end = endDate || customDateRange[0].endDate;

    const startDateStr = start.toISOString().split("T")[0];
    const endDateStr = end.toISOString().split("T")[0];

    try {
      handleCustomDateRange(startDateStr, endDateStr);
    } catch (error) {
      console.error("Error fetching custom range data:", error);
      setError("Failed to load custom date range data");
    }
  }, [customDateRange, handleCustomDateRange, setError]);

  const formatDisplayDate = (date: Date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleBackClick = useCallback(() => {
    router.push('/');
  }, [router]);

  // Add error boundary for debugging
  if (error) {
    return (
      <div className="bg-background min-h-screen p-6 mt-4 flex items-center justify-center">
        <div className="bg-card p-8 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-destructive mb-4">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <GlobalSkeleton type="dashboard" showPeriodSelector={true} showCharts={true} summaryCardCount={8} />;
  }

  // Add null check for analyticsData
  if (!analyticsData) {
    console.log('Analytics data not loaded yet');
    return <GlobalSkeleton type="dashboard" showPeriodSelector={true} showCharts={true} summaryCardCount={8} />;
  }

  return (
    <div className="bg-background min-h-screen p-6 mt-4">
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
        />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Customers"
          value={analyticsData.totalCustomers || 0}
          subtitle="Active customers"
        />
        <MetricCard
          title="Total Revenue"
          value={`PKR ${analyticsData.totalRevenue?.toLocaleString() || '0'}`}
          subtitle="All time revenue"
        />
        <MetricCard
          title="Total Orders"
          value={analyticsData.totalOrders || 0}
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
          value={analyticsData.newCustomersThisMonth || 0}
          subtitle="This month"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`PKR ${analyticsData.monthlyRevenue?.toLocaleString() || '0'}`}
          subtitle="Current month"
        />
        <MetricCard
          title="Repeat Customers"
          value={analyticsData.repeatCustomers || 0}
          subtitle="Returning customers"
        />
        <MetricCard
          title="Customer Satisfaction"
          value={analyticsData.customerSatisfaction || 0}
          subtitle={<StarRating rating={Math.floor(analyticsData.customerSatisfaction || 0)} />}
        />
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
        <TopCustomersTable customers={topCustomers || []} />
        <RecentOrdersTable
          orders={filteredOrders || []}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          maxRows={8}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
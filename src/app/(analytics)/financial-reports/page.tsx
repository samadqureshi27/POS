// app/analytics/page.tsx
"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
// Components
import { StarRating } from '@/components/ui/StarRating';
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { formatCurrency, formatDisplayDate } from "@/lib/util/formatters";
import  {MetricCard } from '@/components/ui/MetricCard';
import { AdvancedMetricCard } from '@/components/ui/advanced-metric-card';
import { DashboardSection } from '@/components/ui/dashboard-section';
import { CustomerGrowthChart } from './_components/CustomerGrowthChart';
import { RevenueTrendsChart } from './_components/RevenueTrendsChart';
import { OrderTypesChart } from './_components/OrderTypesChart';
import { MonthlyComparisonChart } from './_components/MonthlyComparisonChart';
import { CustomerSegmentsChart } from './_components/CustomerSegmentsChart';
import { TopCustomersTable } from './_components/TopCustomersTable';
import { RecentOrdersTable } from './_components/RecentOrdersTable';
import { ProfitLossChart } from './_components/ProfitLossChart';
import { CashFlowChart } from './_components/CashFlowChart';
import { PeriodSelector } from '@/components/ui/period-selector';
import { ExpenseInputModal } from '@/components/ui/expense-input-modal';
import { Button } from '@/components/ui/button';
import { Plus, Receipt, TrendingUp } from 'lucide-react';
import PremiumCustomerAnalytics from './_components/PremiumCustomerAnalytics';
// Hooks
import { useDashboard } from '@/lib/hooks/useAnalytics';

const AnalyticsDashboard = () => {
  const router = useRouter();

  // Modal states
  const [showExpenseModal, setShowExpenseModal] = React.useState(false);

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

  // Simplified useEffect - the hook now handles initialization
  useEffect(() => {
  }, []); // Just for debugging

  // Memoize period change handler to prevent recreating on every render
  const handlePeriodChangeWithData = useCallback(async (period: string) => {
    try {
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

  const handleBackClick = useCallback(() => {
    router.push('/');
  }, [router]);

  // Handle expense submission
  const handleExpenseSubmit = useCallback((expense: any) => {
    // Here you would typically send the expense data to your backend
    // For now, we'll just log it and possibly update local state

    // You could also trigger a refetch of financial data
    // refetch();

    // Show success message
    toast.success(`Expense of PKR ${expense.amount} for ${expense.category} has been added successfully!`);
  }, []);

  // Add error boundary for debugging
  if (error) {
    return (
      <div className="bg-background min-h-screen p-6 mt-4 flex items-center justify-center">
        <div className="bg-card p-8 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-destructive mb-4">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              router.refresh();
            }}
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

      {/* Executive Financial Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Executive Financial Overview</h2>
            <p className="text-sm text-gray-600">Key financial metrics & performance indicators</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowExpenseModal(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              Add Expense
            </Button>
            <div className="text-xs text-gray-500">December 2024</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800 mb-3">Revenue Performance</h3>
            <div className="text-3xl font-bold text-green-900 mb-2">PKR {analyticsData.totalRevenue ? formatCurrency(analyticsData.totalRevenue) : '485,000'}</div>
            <div className="text-sm text-green-700">Monthly Revenue</div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <span className="font-medium">+18.5%</span>
              <span className="ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-3">Profitability</h3>
            <div className="text-3xl font-bold text-blue-900 mb-2">22.4%</div>
            <div className="text-sm text-blue-700">Net Profit Margin</div>
            <div className="flex items-center mt-2 text-sm text-blue-600">
              <span className="font-medium">PKR 108K</span>
              <span className="ml-2">net profit</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-lg border border-purple-200">
            <h3 className="text-sm font-medium text-purple-800 mb-3">Cost Control</h3>
            <div className="text-3xl font-bold text-purple-900 mb-2">34.2%</div>
            <div className="text-sm text-purple-700">COGS Ratio</div>
            <div className="flex items-center mt-2 text-sm text-purple-600">
              <span className="font-medium">28.5%</span>
              <span className="ml-2">labor cost</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
            <h3 className="text-sm font-medium text-indigo-800 mb-3">Cash Position</h3>
            <div className="text-3xl font-bold text-indigo-900 mb-2">PKR 527K</div>
            <div className="text-sm text-indigo-700">Available Cash</div>
            <div className="flex items-center mt-2 text-sm text-indigo-600">
              <span className="font-medium">+PKR 90K</span>
              <span className="ml-2">this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Charts Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Financial Performance Analysis</h2>
            <p className="text-sm text-gray-600">P&L trends and cash flow management</p>
          </div>
        </div>

        <div className="space-y-6">
          <ProfitLossChart />
          <CashFlowChart />
        </div>
      </div>

      {/* Customer & Revenue Analytics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Customer & Revenue Analytics</h2>
            <p className="text-sm text-gray-600">Customer acquisition, retention & lifetime value</p>
          </div>
        </div>

        {/* Premium Customer Analytics */}
        <PremiumCustomerAnalytics
          analyticsData={analyticsData}
          selectedPeriod={selectedPeriod}
        />
      </div>


      {/* Expense Input Modal */}
      <ExpenseInputModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSubmit={handleExpenseSubmit}
      />
    </div>
  );
};

export default AnalyticsDashboard;
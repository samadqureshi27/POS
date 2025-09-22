"use client";

// Dashboard.tsx - Main Dashboard Component

import React, { useState, useEffect, useRef, useCallback } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Types
import { DashboardData } from "@/lib/types/Dtypes";

// API
import { dashboardAPI } from "@/lib/util/DsahboradApi";

// Utils
import { getPeriodLabel } from "@/lib/util/Dashboradutils";

// Components
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { DashboardHeader } from "./_components/DashboardHeader";
import { PeriodSelector } from "@/components/ui/period-selector";
import { MetricsCards } from "./_components/MetricsCards";
import { CustomerAnalytics } from "./_components/CustomerAnalytics";
import { InventoryStatusChart } from "./_components/InventoryStatusChart";
import { HourlySalesChart } from "./_components/HourlySalesChart";
import { CategorySalesChart } from "./_components/CategorySalesChart";
import ErrorMessage from "@/components/ui/error-message";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import { ExpenseInputModal } from "@/components/ui/expense-input-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FuturisticSalesVisual from "./_components/FuturisticSalesVisual";

// Main Dashboard Component
const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [customDateRange, setCustomDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Modal states
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const periods = ["Today", "Week", "Month", "Quarter", "Year", "Custom"];
  const calendarRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Add debug logging
  console.log('Dashboard render - Loading:', loading);

  // Modified load dashboard data function with optional loading parameter
  const loadDashboardData = useCallback(async (period: string, showLoading = true, startDate?: string, endDate?: string) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      console.log('Loading dashboard data for period:', period, startDate ? `from ${startDate} to ${endDate}` : '');

      const data = await dashboardAPI.getDashboardData(period, startDate, endDate);
      setDashboardData(data);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showToast("Failed to load dashboard data", "error");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast(message);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      console.log('Refreshing dashboard data for period:', selectedPeriod);

      let data;
      if (selectedPeriod === "Custom" && customDateRange?.[0]?.startDate && customDateRange?.[0]?.endDate) {
        const startDate = customDateRange[0].startDate.toISOString().split('T')[0];
        const endDate = customDateRange[0].endDate.toISOString().split('T')[0];
        data = await dashboardAPI.refreshDashboardData(selectedPeriod, startDate, endDate);
      } else {
        data = await dashboardAPI.refreshDashboardData(selectedPeriod);
      }

      setDashboardData(data);
      setLastUpdated(new Date().toISOString());
      showToast("Dashboard refreshed successfully", "success");
    } catch (error) {
      showToast("Failed to refresh dashboard", "error");
    } finally {
      setRefreshing(false);
    }
  }, [selectedPeriod, showToast, customDateRange]);

  // Modified period change handler - no loading animation for period changes
  const handlePeriodChange = useCallback(async (period: string) => {
    try {
      console.log('Period changed to:', period);
      setSelectedPeriod(period);
      setShowDatePicker(false);

      // For Custom period, check if we have date range data
      if (period === "Custom" && customDateRange?.[0]?.startDate && customDateRange?.[0]?.endDate) {
        const startDate = customDateRange[0].startDate.toISOString().split('T')[0];
        const endDate = customDateRange[0].endDate.toISOString().split('T')[0];
        console.log('Loading custom range data:', startDate, 'to', endDate);
        await loadDashboardData(period, false, startDate, endDate);
      } else {
        // Load data without showing loading spinner for period changes
        await loadDashboardData(period, false);
      }
    } catch (error) {
      console.error("Error changing period:", error);
      showToast("Failed to load data for selected period", "error");
    }
  }, [loadDashboardData, showToast, customDateRange]);

  const getPeriodLabelWithCustomRange = useCallback(() => {
    return getPeriodLabel(selectedPeriod, customDateRange);
  }, [selectedPeriod, customDateRange]);

  // Handle inventory submission
  const handleInventorySubmit = useCallback((inventory: any) => {
    console.log('New inventory action:', inventory);
    showToast(`Inventory ${inventory.actionType} of ${inventory.quantity} ${inventory.unit} for ${inventory.itemName} has been processed!`, "success");
  }, [showToast]);

  // Handle expense submission
  const handleExpenseSubmit = useCallback((expense: any) => {
    console.log('New expense submitted:', expense);
    showToast(`Expense of PKR ${expense.amount} for ${expense.category} has been added successfully!`, "success");
  }, [showToast]);

  // Click outside handler for calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initial data load - only run once
  useEffect(() => {
    if (!isInitialized.current) {
      console.log('Initializing dashboard...');
      isInitialized.current = true;
      loadDashboardData(selectedPeriod).catch(error => {
        console.error('Initial dashboard load failed:', error);
        showToast('Failed to initialize dashboard', 'error');
      });
    }
  }, []); // Empty dependency array - only run once

  if (loading) {
    return <GlobalSkeleton type="dashboard" showHeader={true} showSummaryCards={true} showPeriodSelector={true} showCharts={true} summaryCardCount={4} />;
  }

  if (!dashboardData) {
    return (
      <ErrorMessage
        message="Failed to load dashboard data"
        onDismiss={() => setDashboardData(null)}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      <div className="w-full">
        <DashboardHeader
          lastUpdated={lastUpdated}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />

        {/* 1. Daily Snapshot - POS System Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Daily Snapshot</h2>
              <p className="text-sm text-gray-600">Real-time POS operations & tactical metrics</p>
            </div>
            <div className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>

          {/* Key Daily Metrics */}
          <MetricsCards metrics={dashboardData.metrics} />

          {/* Futuristic Sales Visualization */}
          <div className="mb-6">
            <FuturisticSalesVisual
              revenueData={dashboardData.revenueData}
              bestSellingItems={dashboardData.bestSellingItems}
              selectedPeriod={selectedPeriod}
            />
          </div>

          {/* Customer & Payment Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Customer Flow</h3>
              <div className="text-2xl font-bold text-blue-900">142</div>
              <div className="text-xs text-blue-600">Transactions today</div>
              <div className="mt-2 text-xs text-blue-700">Peak: 11AM-12PM (23 orders)</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium text-green-800 mb-2">Payment Split</h3>
              <div className="text-sm text-green-900">
                <div>Card: 68% • Cash: 32%</div>
                <div className="mt-1">Digital: 12% • UPI: 8%</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <h3 className="text-sm font-medium text-amber-800 mb-2">Staff Performance</h3>
              <div className="text-2xl font-bold text-amber-900">3.2</div>
              <div className="text-xs text-amber-600">Avg order time (min)</div>
              <div className="mt-2 text-xs text-amber-700">Target: &lt;5 min ✓</div>
            </div>
          </div>
        </div>

        {/* 2. Weekly Trends - Customer Analytics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Weekly Trends</h2>
              <p className="text-sm text-gray-600">Customer behavior & category performance</p>
            </div>
          </div>

          <CustomerAnalytics
            visitData={dashboardData.visitData}
            getPeriodLabel={getPeriodLabelWithCustomRange}
          />
        </div>

        {/* 3. Product & Menu Insights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Product & Menu Insights</h2>
              <p className="text-sm text-gray-600">Category performance & hourly patterns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategorySalesChart />
            <HourlySalesChart />
          </div>
        </div>

        {/* 4. Monthly P&L View */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Monthly P&L View</h2>
              <p className="text-sm text-gray-600">Financial performance & profitability metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowExpenseModal(true)}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus size={16} className="mr-2" />
                Add Expense
              </Button>
              <div className="text-xs text-gray-500">December 2024</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Revenue Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium text-green-800 mb-4">Revenue</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Gross Sales</span>
                  <span className="text-sm font-semibold text-green-900">PKR 485,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Net Sales</span>
                  <span className="text-sm font-semibold text-green-900">PKR 462,800</span>
                </div>
                <div className="flex justify-between border-t border-green-200 pt-2">
                  <span className="text-sm font-medium text-green-800">Growth</span>
                  <span className="text-sm font-bold text-green-900">+18.5%</span>
                </div>
              </div>
            </div>

            {/* COGS Section */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-4">COGS</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Ingredients</span>
                  <span className="text-sm font-semibold text-blue-900">PKR 138,840</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Packaging</span>
                  <span className="text-sm font-semibold text-blue-900">PKR 18,512</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="text-sm font-medium text-blue-800">COGS %</span>
                  <span className="text-sm font-bold text-blue-900">34.2%</span>
                </div>
              </div>
            </div>

            {/* Labor Costs */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-lg border border-amber-200">
              <h3 className="text-sm font-medium text-amber-800 mb-4">Labor</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-amber-700">Staff Wages</span>
                  <span className="text-sm font-semibold text-amber-900">PKR 125,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-amber-700">Benefits</span>
                  <span className="text-sm font-semibold text-amber-900">PKR 6,840</span>
                </div>
                <div className="flex justify-between border-t border-amber-200 pt-2">
                  <span className="text-sm font-medium text-amber-800">Labor %</span>
                  <span className="text-sm font-bold text-amber-900">28.5%</span>
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-lg border border-purple-200">
              <h3 className="text-sm font-medium text-purple-800 mb-4">Profit</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Gross Profit</span>
                  <span className="text-sm font-semibold text-purple-900">PKR 305,448</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Operating Exp</span>
                  <span className="text-sm font-semibold text-purple-900">PKR 89,200</span>
                </div>
                <div className="flex justify-between border-t border-purple-200 pt-2">
                  <span className="text-sm font-medium text-purple-800">Net Margin</span>
                  <span className="text-sm font-bold text-purple-900">22.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* P&L Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">PKR 462.8K</div>
                <div className="text-xs text-gray-600">Net Sales</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">PKR 157.4K</div>
                <div className="text-xs text-gray-600">Total COGS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">PKR 132.0K</div>
                <div className="text-xs text-gray-600">Labor & OpEx</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">PKR 173.4K</div>
                <div className="text-xs text-gray-600">Net Profit</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Strategic KPIs & Inventory */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Strategic KPIs & Inventory</h2>
              <p className="text-sm text-gray-600">Growth metrics & inventory management</p>
            </div>
          </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InventoryStatusChart />

            {/* Strategic KPIs Panel */}
            <div className="space-y-6">
              {/* Growth Metrics */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4">Growth & Expansion</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-indigo-700">+18.5%</div>
                    <div className="text-xs text-indigo-600">Same-store growth</div>
                    <div className="text-xs text-indigo-500">vs last month</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-700">PKR 2,450</div>
                    <div className="text-xs text-indigo-600">Customer LTV</div>
                    <div className="text-xs text-indigo-500">+12.8% growth</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-700">320%</div>
                    <div className="text-xs text-indigo-600">Marketing ROI</div>
                    <div className="text-xs text-indigo-500">Q4 average</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">Ready</div>
                    <div className="text-xs text-indigo-600">Expansion</div>
                    <div className="text-xs text-green-500">EBITDA positive</div>
                  </div>
                </div>
              </div>

              {/* Customer Metrics */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-200">
                <h3 className="text-lg font-semibold text-rose-900 mb-4">Customer Intelligence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-rose-700">68.5%</div>
                    <div className="text-xs text-rose-600">Repeat rate</div>
                    <div className="text-xs text-rose-500">+5.2% vs last month</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-rose-700">PKR 125</div>
                    <div className="text-xs text-rose-600">Acquisition cost</div>
                    <div className="text-xs text-green-500">-8.2% optimized</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-rose-700">4.2</div>
                    <div className="text-xs text-rose-600">Satisfaction</div>
                    <div className="text-xs text-rose-500">out of 5 stars</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-rose-700">42.5%</div>
                    <div className="text-xs text-rose-600">Add-on attach</div>
                    <div className="text-xs text-rose-500">+8.1% growth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <ExpenseInputModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSubmit={handleExpenseSubmit}
      />
    </div>
  );
};

export default Dashboard;
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
import LoadingSpinner from "@/components/ui/loader";
import ErrorDisplay from "@/components/ui/error-message";
import { DashboardHeader } from "./_components/DashboardHeader";
import { PeriodSelector } from "./_components/PeriodSelector";
import { MetricsCards } from "./_components/MetricsCards";
import { CustomerAnalytics } from "./_components/CustomerAnalytics";
import { RevenueTrendChart } from "./_components/RevenueTrendChart";
import { BestSellingItemsChart } from "./_components/BestSellingItemsChart";
import ErrorMessage from "@/components/ui/error-message";
import { DashboardSkeleton } from "./_components/DashboardSkeleton";

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
    return <DashboardSkeleton />;
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

        <MetricsCards metrics={dashboardData.metrics} />

        <CustomerAnalytics 
          visitData={dashboardData.visitData} 
          getPeriodLabel={getPeriodLabelWithCustomRange} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <RevenueTrendChart revenueData={dashboardData.revenueData} />

          <BestSellingItemsChart
            bestSellingItems={dashboardData.bestSellingItems}
            selectedPeriod={selectedPeriod}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
"use client";

// Dashboard.tsx - Main Dashboard Component

import React, { useState, useEffect, useRef } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Types
import { DashboardData } from "@/lib/types/Dtypes";

// API
import { dashboardAPI } from "@/lib/util/DsahboradApi";

// Utils
import { getPeriodLabel } from "@/lib/util/Dashboradutils";

// Components
import { Toast } from "@/components/layout/ui/toast";
import  LoadingSpinner  from "@/components/layout/ui/loading-spinner";
import   ErrorDisplay  from "@/components/layout/ui/error-message";
import { DashboardHeader } from "./_components/DashboardHeader";
import { PeriodSelector } from "./_components/PeriodSelector";
import { MetricsCards } from "./_components/MetricsCards";
import { CustomerAnalytics } from "./_components/CustomerAnalytics";
import { RevenueTrendChart } from "./_components/RevenueTrendChart";
import { BestSellingItemsChart } from "./_components/BestSellingItemsChart";

// Main Dashboard Component
const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
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

  // Load dashboard data
  const loadDashboardData = async (period: string) => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getDashboardData(period);
      setDashboardData(data);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await dashboardAPI.refreshDashboardData(selectedPeriod);
      setDashboardData(data);
      setLastUpdated(new Date().toISOString());
      showToast("Dashboard refreshed successfully", "success");
    } catch (error) {
      showToast("Failed to refresh dashboard", "error");
    } finally {
      setRefreshing(false);
    }
  };

  const handlePeriodChange = async (period: string) => {
    setSelectedPeriod(period);
    setShowDatePicker(false);
    await loadDashboardData(period);
  };

  const getPeriodLabelWithCustomRange = () => {
    return getPeriodLabel(selectedPeriod, customDateRange);
  };

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

  // Initial data load
  useEffect(() => {
    loadDashboardData(selectedPeriod);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <ErrorDisplay 
        onRetry={() => loadDashboardData(selectedPeriod)} 
        selectedPeriod={selectedPeriod} 
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full">
        <DashboardHeader
          lastUpdated={lastUpdated}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <PeriodSelector
          selectedPeriod={selectedPeriod}
          periods={periods}
          onPeriodChange={handlePeriodChange}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          calendarRef={calendarRef}
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
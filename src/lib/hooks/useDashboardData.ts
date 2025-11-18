import { useState, useCallback, useRef, useEffect } from 'react';
import { DashboardData } from '@/lib/types/Dtypes';
import { dashboardAPI } from '@/lib/util/DashboardApi';
import { logError } from '@/lib/util/logger';

export interface UseDashboardDataReturn {
  // State
  dashboardData: DashboardData | null;
  loading: boolean;
  refreshing: boolean;
  lastUpdated: string;
  selectedPeriod: string;
  customDateRange: any[];
  showDatePicker: boolean;

  // Actions
  setSelectedPeriod: (period: string) => void;
  setCustomDateRange: (range: any[]) => void;
  setShowDatePicker: (show: boolean) => void;
  handlePeriodChange: (period: string) => Promise<void>;
  handleRefresh: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const useDashboardData = (
  initialPeriod: string = "Week",
  toastCallback: (message: string, type: 'success' | 'error' | 'info') => void
): UseDashboardDataReturn => {
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);
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

  const isInitialized = useRef(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    toastCallback(message, type);
  }, [toastCallback]);

  // Load dashboard data function
  const loadDashboardData = useCallback(async (
    period: string,
    showLoading = true,
    startDate?: string,
    endDate?: string
  ) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const data = await dashboardAPI.getDashboardData(period, startDate, endDate);
      setDashboardData(data);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      logError("Error fetching dashboard data", error, {
        component: "useDashboardData",
        action: "loadDashboardData",
        period,
      });
      showToast("Failed to load dashboard data", "error");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [showToast]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

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
  }, [selectedPeriod, customDateRange, showToast]);

  // Handle period change
  const handlePeriodChange = useCallback(async (period: string) => {
    try {
      setSelectedPeriod(period);
      setShowDatePicker(false);

      // For Custom period, check if we have date range data
      if (period === "Custom" && customDateRange?.[0]?.startDate && customDateRange?.[0]?.endDate) {
        const startDate = customDateRange[0].startDate.toISOString().split('T')[0];
        const endDate = customDateRange[0].endDate.toISOString().split('T')[0];
        await loadDashboardData(period, false, startDate, endDate);
      } else {
        // Load data without showing loading spinner for period changes
        await loadDashboardData(period, false);
      }
    } catch (error) {
      logError("Error changing period", error, {
        component: "useDashboardData",
        action: "handlePeriodChange",
        period,
      });
      showToast("Failed to load data for selected period", "error");
    }
  }, [customDateRange, loadDashboardData, showToast]);

  // Initial data load - only run once
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      loadDashboardData(selectedPeriod).catch(error => {
        logError('Initial dashboard load failed', error, {
          component: "useDashboardData",
          action: "useEffect:initialLoad",
        });
        showToast('Failed to initialize dashboard', 'error');
      });
    }
  }, []); // Empty dependency array - only run once

  return {
    dashboardData,
    loading,
    refreshing,
    lastUpdated,
    selectedPeriod,
    customDateRange,
    showDatePicker,
    setSelectedPeriod,
    setCustomDateRange,
    setShowDatePicker,
    handlePeriodChange,
    handleRefresh,
    showToast,
  };
};

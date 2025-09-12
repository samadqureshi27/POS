// hooks/useDashboard.ts
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AnalyticsData, CustomerItem, OrderItem } from '@/lib/types/analytics';
import { AnalyticsAPI } from '@/lib/util/AnalyticsApi';

export const useDashboard = () => {
  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date range state
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  // Order filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Ref to prevent initial infinite loop
  const isInitialized = useRef(false);
  const [startDate, endDate] = dateRange;

  // FIXED: Memoized load dashboard data function
  const loadDashboardData = useCallback(async (period?: string, showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      const currentPeriod = period || selectedPeriod;
      
      console.log('Loading dashboard data for period:', currentPeriod);
      
      const [analyticsResponse, customersResponse, ordersResponse] = await Promise.all([
        AnalyticsAPI.getAnalyticsData(currentPeriod),
        AnalyticsAPI.getCustomers(),
        AnalyticsAPI.getOrders()
      ]);
      
      if (analyticsResponse.success) {
        setAnalyticsData(analyticsResponse.data);
      }
      
      if (customersResponse.success) {
        setCustomers(customersResponse.data);
      }
      
      if (ordersResponse.success) {
        setOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
      setError("Failed to load dashboard data");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [selectedPeriod]); // Only depend on selectedPeriod

  // FIXED: Memoized load custom range data
  const loadCustomRangeData = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      console.log('Loading custom range data:', startDate, 'to', endDate);
      
      const response = await AnalyticsAPI.getCustomDateRangeData(startDate, endDate);
      if (response.success) {
        setAnalyticsData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch custom range data");
      }
    } catch (error) {
      console.error("Error fetching custom range data:", error);
      setError("Failed to load custom date range data");
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed

  // FIXED: Memoized period change handler
  const handlePeriodChange = useCallback(async (period: string) => {
    console.log('Period changed to:', period);
    setSelectedPeriod(period);
    setShowDatePicker(false);
    if (period !== "Custom") {
      // Pass false to skip loading animation for period changes
      await loadDashboardData(period, false);
    }
  }, [loadDashboardData]);

  // FIXED: Memoized custom date range handler
  const handleCustomDateRange = useCallback((startDate: string, endDate: string) => {
    console.log('Custom date range selected:', startDate, 'to', endDate);
    setSelectedPeriod("Custom");
    loadCustomRangeData(startDate, endDate);
    return { startDate, endDate };
  }, [loadCustomRangeData]);

  // FIXED: Remove the problematic useEffect that caused infinite loop
  // This was causing the infinite loop because it re-triggered on every date change
  /*
  useEffect(() => {
    if (startDate && endDate) {
      const startStr = startDate.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];
      handleCustomDateRange(startStr, endStr);
    }
  }, [startDate, endDate]); // This was the main culprit
  */

  // FIXED: Initial data load - only run once
  useEffect(() => {
    if (!isInitialized.current) {
      console.log('Initializing dashboard...');
      isInitialized.current = true;
      loadDashboardData().catch(error => {
        console.error('Initial load failed:', error);
        setError('Failed to initialize dashboard');
      });
    }
  }, []); // Empty dependency array

  // Computed values - these are fine
  const topCustomers = useMemo(() => {
    return customers
      .sort((a, b) => b.Total_Orders - a.Total_Orders)
      .slice(0, 5);
  }, [customers]);

  const recentOrders = useMemo(() => {
    return orders
      .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
      .slice(0, 10);
  }, [orders]);

  // Filtered orders based on search and status
  const filteredOrders = useMemo(() => {
    let filtered = recentOrders;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.Order_ID.toLowerCase().includes(term) ||
        order.Order_Number.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.Status === statusFilter);
    }

    return filtered;
  }, [recentOrders, searchTerm, statusFilter]);

  // FIXED: Memoized refetch function
  const refetch = useCallback(() => {
    return loadDashboardData(selectedPeriod);
  }, [loadDashboardData, selectedPeriod]);

  return {
    // Analytics data
    analyticsData,
    customers,
    orders,
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
    dateRange,
    setDateRange,
    startDate,
    endDate,
    
    // Order filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOrders,
    
    // Actions
    loadDashboardData,
    loadCustomRangeData,
    handlePeriodChange,
    handleCustomDateRange,
    refetch
  };
};
'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Data Models
interface DashboardMetrics {
  grossRevenue: number;
  avgOrderValue: number;
  taxes: number;
  customers: number;
  period: string;
  lastUpdated: string;
}

interface RevenueData {
  day: string;
  date: string;
  value: number;
  orders: number;
}

interface BestSellingItem {
  rank: number;
  product: string;
  revenue: string;
  sales: number;
  category: string;
  profitMargin: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  revenueData: RevenueData[];
  bestSellingItems: BestSellingItem[];
  period: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  lastUpdated?: string;
}

// Mock API Class
class DashboardAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockMetrics: Record<string, DashboardMetrics> = {
    Today: {
      grossRevenue: 2450,
      avgOrderValue: 85,
      taxes: 245.0,
      customers: 29,
      period: 'Today',
      lastUpdated: new Date().toISOString(),
    },
    Week: {
      grossRevenue: 14509,
      avgOrderValue: 204,
      taxes: 1210.5,
      customers: 306,
      period: 'Week',
      lastUpdated: new Date().toISOString(),
    },
    Month: {
      grossRevenue: 58200,
      avgOrderValue: 195,
      taxes: 4856.7,
      customers: 1245,
      period: 'Month',
      lastUpdated: new Date().toISOString(),
    },
    Quarter: {
      grossRevenue: 174600,
      avgOrderValue: 210,
      taxes: 14550.0,
      customers: 3680,
      period: 'Quarter',
      lastUpdated: new Date().toISOString(),
    },
    Year: {
      grossRevenue: 698400,
      avgOrderValue: 198,
      taxes: 58200.0,
      customers: 14720,
      period: 'Year',
      lastUpdated: new Date().toISOString(),
    },
  };

  private static mockRevenueData: Record<string, RevenueData[]> = {
    Today: [
      { day: '9AM', date: '09', value: 150, orders: 3 },
      { day: '11AM', date: '11', value: 300, orders: 8 },
      { day: '1PM', date: '13', value: 850, orders: 15 },
      { day: '3PM', date: '15', value: 650, orders: 12 },
      { day: '5PM', date: '17', value: 500, orders: 9 },
    ],
    Week: [
      { day: 'Mon', date: '15', value: 2000, orders: 45 },
      { day: 'Tue', date: '16', value: 3000, orders: 62 },
      { day: 'Wed', date: '17', value: 2500, orders: 55 },
      { day: 'Thu', date: '18', value: 4000, orders: 78 },
      { day: 'Fri', date: '19', value: 6000, orders: 95 },
      { day: 'Sat', date: '20', value: 8000, orders: 110 },
      { day: 'Sun', date: '21', value: 7500, orders: 98 },
    ],
    Month: [
      { day: 'Week 1', date: '1-7', value: 12000, orders: 250 },
      { day: 'Week 2', date: '8-14', value: 18000, orders: 380 },
      { day: 'Week 3', date: '15-21', value: 15000, orders: 320 },
      { day: 'Week 4', date: '22-28', value: 21000, orders: 420 },
    ],
  };

  private static mockBestSelling: Record<string, BestSellingItem[]> = {
    Today: [
      { rank: 1, product: 'Iced Coffee', revenue: '$125', sales: 15, category: 'Beverages', profitMargin: 75 },
      { rank: 2, product: 'Breakfast Sandwich', revenue: '$98', sales: 8, category: 'Food', profitMargin: 60 },
      { rank: 3, product: 'Croissant', revenue: '$87', sales: 12, category: 'Pastry', profitMargin: 70 },
    ],
    Week: [
      { rank: 1, product: 'Coffee', revenue: '$1,304', sales: 195, category: 'Beverages', profitMargin: 80 },
      { rank: 2, product: 'Grill Sandwich', revenue: '$1,250', sales: 90, category: 'Food', profitMargin: 65 },
      { rank: 3, product: 'Fajita Wraps', revenue: '$1,030', sales: 330, category: 'Food', profitMargin: 55 },
      { rank: 4, product: 'Peach Iced Tea', revenue: '$890', sales: 56, category: 'Beverages', profitMargin: 78 },
      { rank: 5, product: 'Crispy Burger', revenue: '$730', sales: 35, category: 'Food', profitMargin: 45 },
    ],
    Month: [
      { rank: 1, product: 'Coffee', revenue: '$5,216', sales: 780, category: 'Beverages', profitMargin: 80 },
      { rank: 2, product: 'Grill Sandwich', revenue: '$5,000', sales: 360, category: 'Food', profitMargin: 65 },
      { rank: 3, product: 'Fajita Wraps', revenue: '$4,120', sales: 1320, category: 'Food', profitMargin: 55 },
      { rank: 4, product: 'Peach Iced Tea', revenue: '$3,560', sales: 224, category: 'Beverages', profitMargin: 78 },
      { rank: 5, product: 'Crispy Burger', revenue: '$2,920', sales: 140, category: 'Food', profitMargin: 45 },
    ],
  };

  // GET /api/dashboard/overview/{period}
  static async getDashboardData(period: string): Promise<ApiResponse<DashboardData>> {
    await this.delay(600);
    
    const metrics = this.mockMetrics[period] || this.mockMetrics.Week;
    const revenueData = this.mockRevenueData[period] || this.mockRevenueData.Week;
    const bestSellingItems = this.mockBestSelling[period] || this.mockBestSelling.Week;

    return {
      success: true,
      data: {
        metrics,
        revenueData,
        bestSellingItems,
        period,
      },
      message: `Dashboard data for ${period} fetched successfully`,
      lastUpdated: new Date().toISOString(),
    };
  }

  // GET /api/dashboard/metrics/{period}
  static async getMetrics(period: string): Promise<ApiResponse<DashboardMetrics>> {
    await this.delay(400);
    
    const metrics = this.mockMetrics[period] || this.mockMetrics.Week;
    
    return {
      success: true,
      data: metrics,
      message: `Metrics for ${period} fetched successfully`,
    };
  }

  // GET /api/dashboard/revenue-trend/{period}
  static async getRevenueTrend(period: string): Promise<ApiResponse<RevenueData[]>> {
    await this.delay(500);
    
    const revenueData = this.mockRevenueData[period] || this.mockRevenueData.Week;
    
    return {
      success: true,
      data: revenueData,
      message: `Revenue trend for ${period} fetched successfully`,
    };
  }

  // GET /api/dashboard/best-selling/{period}
  static async getBestSelling(period: string): Promise<ApiResponse<BestSellingItem[]>> {
    await this.delay(450);
    
    const bestSellingItems = this.mockBestSelling[period] || this.mockBestSelling.Week;
    
    return {
      success: true,
      data: bestSellingItems,
      message: `Best selling items for ${period} fetched successfully`,
    };
  }

  // POST /api/dashboard/refresh
  static async refreshDashboard(period: string): Promise<ApiResponse<DashboardData>> {
    await this.delay(800);
    
    // Simulate data refresh with slight variations
    const baseMetrics = this.mockMetrics[period] || this.mockMetrics.Week;
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    
    const refreshedMetrics: DashboardMetrics = {
      ...baseMetrics,
      grossRevenue: Math.round(baseMetrics.grossRevenue * (1 + variation)),
      customers: Math.round(baseMetrics.customers * (1 + variation * 0.5)),
      lastUpdated: new Date().toISOString(),
    };

    const revenueData = this.mockRevenueData[period] || this.mockRevenueData.Week;
    const bestSellingItems = this.mockBestSelling[period] || this.mockBestSelling.Week;

    return {
      success: true,
      data: {
        metrics: refreshedMetrics,
        revenueData,
        bestSellingItems,
        period,
      },
      message: `Dashboard refreshed successfully`,
      lastUpdated: new Date().toISOString(),
    };
  }

  // GET /api/dashboard/custom-date/{date}
  static async getCustomDateData(date: Date): Promise<ApiResponse<DashboardData>> {
    await this.delay(700);
    
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    // Generate data based on the selected date
    const baseRevenue = 1000 + (dayOfWeek * 500); // Higher revenue on weekends
    const baseCustomers = 15 + (dayOfWeek * 8);
    
    const customMetrics: DashboardMetrics = {
      grossRevenue: baseRevenue + Math.floor(Math.random() * 500),
      avgOrderValue: 45 + Math.floor(Math.random() * 40),
      taxes: Math.round((baseRevenue * 0.1) + Math.random() * 50),
      customers: baseCustomers + Math.floor(Math.random() * 20),
      period: `Custom: ${dateStr}`,
      lastUpdated: new Date().toISOString(),
    };

    // Generate hourly data for the custom date
    const customRevenueData: RevenueData[] = [
      { day: '9AM', date: '09', value: Math.floor(Math.random() * 200) + 100, orders: Math.floor(Math.random() * 5) + 2 },
      { day: '11AM', date: '11', value: Math.floor(Math.random() * 300) + 200, orders: Math.floor(Math.random() * 8) + 4 },
      { day: '1PM', date: '13', value: Math.floor(Math.random() * 600) + 400, orders: Math.floor(Math.random() * 12) + 8 },
      { day: '3PM', date: '15', value: Math.floor(Math.random() * 500) + 300, orders: Math.floor(Math.random() * 10) + 6 },
      { day: '5PM', date: '17', value: Math.floor(Math.random() * 400) + 250, orders: Math.floor(Math.random() * 8) + 5 },
      { day: '7PM', date: '19', value: Math.floor(Math.random() * 350) + 200, orders: Math.floor(Math.random() * 6) + 3 },
    ];

    // Generate best selling for custom date
    const customBestSelling: BestSellingItem[] = [
      { rank: 1, product: 'Daily Special', revenue: `${Math.floor(Math.random() * 200) + 100}`, sales: Math.floor(Math.random() * 20) + 10, category: 'Special', profitMargin: 65 },
      { rank: 2, product: 'Coffee', revenue: `${Math.floor(Math.random() * 150) + 80}`, sales: Math.floor(Math.random() * 25) + 15, category: 'Beverages', profitMargin: 80 },
      { rank: 3, product: 'Sandwich', revenue: `${Math.floor(Math.random() * 120) + 60}`, sales: Math.floor(Math.random() * 15) + 8, category: 'Food', profitMargin: 55 },
    ];

    return {
      success: true,
      data: {
        metrics: customMetrics,
        revenueData: customRevenueData,
        bestSellingItems: customBestSelling,
        period: `Custom: ${dateStr}`,
      },
      message: `Custom date data for ${dateStr} fetched successfully`,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Toast Component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for exit animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-out transform ${
        type === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"
      } ${
        isVisible && !isClosing
          ? "translate-x-0 opacity-100"
          : isClosing
          ? "translate-x-full opacity-0"
          : "translate-x-full opacity-0"
      }`}
    >
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
      <button 
        onClick={handleClose} 
        className="ml-2 hover:bg-black/10 rounded p-1 transition-colors duration-200"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const Dashboard = () => {
  // State Management
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [customDate, setCustomDate] = useState<Date | null>(new Date());
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const periods = ['Today', 'Week', 'Month', 'Quarter', 'Year', 'Custom date'];

  // Toast helper
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load dashboard data
  const loadDashboardData = async (period: string) => {
    try {
      setLoading(true);
      const response = await DashboardAPI.getDashboardData(period);
      if (response.success) {
        setDashboardData(response.data);
        setLastUpdated(response.lastUpdated || new Date().toISOString());
      } else {
        throw new Error(response.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Refresh dashboard
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await DashboardAPI.refreshDashboard(selectedPeriod);
      if (response.success) {
        setDashboardData(response.data);
        setLastUpdated(response.lastUpdated || new Date().toISOString());
        showToast("Dashboard refreshed successfully", "success");
      }
    } catch (error) {
      showToast("Failed to refresh dashboard", "error");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle period change
  const handlePeriodChange = async (period: string) => {
    if (period === 'Custom date') {
      setSelectedPeriod(period);
      if (customDate) {
        await loadCustomDateData(customDate);
      }
      return;
    }
    
    setSelectedPeriod(period);
    await loadDashboardData(period);
  };

  // Load custom date data
  const loadCustomDateData = async (date: Date) => {
    try {
      setLoading(true);
      const response = await DashboardAPI.getCustomDateData(date);
      if (response.success) {
        setDashboardData(response.data);
        setLastUpdated(response.lastUpdated || new Date().toISOString());
      } else {
        throw new Error(response.message || "Failed to fetch custom date data");
      }
    } catch (error) {
      console.error("Error fetching custom date data:", error);
      showToast("Failed to load custom date data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle custom date change
  const handleCustomDateChange = (date: Date | null) => {
    setCustomDate(date);
    if (date && selectedPeriod === 'Custom date') {
      loadCustomDateData(date);
    }
  };

  // Load initial data
  useEffect(() => {
    loadDashboardData(selectedPeriod);
  }, []);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-[#CCAB4D] rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button
            onClick={() => loadDashboardData(selectedPeriod)}
            className="mt-4 px-4 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                refreshing
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#2C2C2C] text-white hover:bg-gray-700"
              }`}
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Time Period Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 items-center">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-md transition-colors disabled:opacity-50 ${
                selectedPeriod === period
                  ? 'bg-[#2C2C2C] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
          
          {selectedPeriod === "Custom date" && (
            <DatePicker
              selected={customDate}
              onChange={handleCustomDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date"
              maxDate={new Date()}
              className="ml-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm"
              wrapperClassName="inline-block"
            />
          )}
        </div>

        {/* Metrics Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={cardVariants} className="bg-white p-4 sm:p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Gross revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              <CountUp end={dashboardData.metrics.grossRevenue} prefix="$" duration={1.5} />
            </p>
          </motion.div>
          <motion.div variants={cardVariants} className="bg-white p-4 sm:p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Avg. order value</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              <CountUp end={dashboardData.metrics.avgOrderValue} prefix="$" duration={1.5} />
            </p>
          </motion.div>
          <motion.div variants={cardVariants} className="bg-white p-4 sm:p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Taxes</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              <CountUp end={dashboardData.metrics.taxes} prefix="$" decimals={1} duration={1.5} />
            </p>
          </motion.div>
          <motion.div variants={cardVariants} className="bg-white p-4 sm:p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Customers</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              <CountUp end={dashboardData.metrics.customers} duration={1.5} />
            </p>
          </motion.div>
        </motion.div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Revenue Trend Chart */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="border border-gray-100 lg:col-span-2 bg-white p-4 sm:p-6 rounded-md shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Revenue trend</h2>
              <p className="text-sm text-gray-500">
                {selectedPeriod} - {dashboardData.revenueData.length} data points
              </p>
            </div>

            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.revenueData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value, index) => {
                      const item = dashboardData.revenueData[index];
                      return `${value}\n${item?.date}`;
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => 
                      value >= 1000 ? `${value / 1000}K` : value.toString()
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#CCAB4D"
                    strokeWidth={2}
                    dot={{ fill: '#CCAB4D', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#CCAB4D' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '12px',
                    }}
                    labelFormatter={(label, payload) => {
                      const dataPoint = dashboardData.revenueData.find((d) => d.day === label);
                      return `${dataPoint?.day} (${dataPoint?.date})`;
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `$${value}`, 
                      'Revenue',
                      `${props.payload?.orders} orders`
                    ]}
                    cursor={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Best Selling Items */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-4 sm:p-6 rounded-md shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Best selling items</h2>
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium pb-3 border-b border-gray-100">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Products</div>
                <div className="col-span-3 text-right">Revenue</div>
                <div className="col-span-3 text-right">Sales</div>
              </div>
              {dashboardData.bestSellingItems.map((item, index) => (
                <motion.div
                  key={item.rank}
                  className="grid grid-cols-12 gap-2 py-3 text-sm border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-md transition-colors"
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  title={`Category: ${item.category} | Profit Margin: ${item.profitMargin}%`}
                >
                  <div className="col-span-1 text-gray-600 font-medium">{item.rank}</div>
                  <div className="col-span-5 text-gray-900">{item.product}</div>
                  <div className="col-span-3 text-right font-medium text-gray-900">{item.revenue}</div>
                  <div className="col-span-3 text-right text-gray-600">{item.sales}</div>
                </motion.div>
              ))}
            </div>
            {dashboardData.bestSellingItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No data available for {selectedPeriod}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
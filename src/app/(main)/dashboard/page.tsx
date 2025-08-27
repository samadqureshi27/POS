"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Legend,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
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

interface CustomerAnalytics {
  totalVisits: number;
  repeatCustomers: number;
  newCustomers: number;
  referrals: number;
  lastPeriod: number;
  visitGrowth: number;
  repeatGrowth: number;
  newCustomerGrowth: number;
  referralGrowth: number;
}

interface VisitData {
  date: string;
  visits: number;
  repeat: number;
  referrals: number;
}

const data = [
  { date: "Jun 24", visits: 50, repeat: 20, referrals: 8 },
  { date: "Jun 25", visits: 65, repeat: 22, referrals: 10 },
  { date: "Jun 26", visits: 58, repeat: 25, referrals: 9 },
  { date: "Jun 27", visits: 70, repeat: 28, referrals: 12 },
  { date: "Jun 28", visits: 62, repeat: 21, referrals: 8 },
  { date: "Jun 29", visits: 75, repeat: 26, referrals: 11 },
  { date: "Jun 30", visits: 68, repeat: 23, referrals: 9 },
  { date: "Jul 01", visits: 80, repeat: 30, referrals: 13 },
  { date: "Jul 02", visits: 72, repeat: 28, referrals: 12 },
  { date: "Jul 03", visits: 78, repeat: 25, referrals: 10 },
  { date: "Jul 04", visits: 66, repeat: 22, referrals: 9 },
  { date: "Jul 05", visits: 82, repeat: 32, referrals: 14 },
  { date: "Jul 06", visits: 70, repeat: 27, referrals: 11 },
  { date: "Jul 07", visits: 85, repeat: 35, referrals: 15 },
  { date: "Jul 08", visits: 73, repeat: 29, referrals: 12 },
  { date: "Jul 09", visits: 88, repeat: 37, referrals: 16 },
  { date: "Jul 10", visits: 75, repeat: 31, referrals: 13 },
  { date: "Jul 11", visits: 90, repeat: 40, referrals: 17 },
  { date: "Jul 12", visits: 77, repeat: 33, referrals: 14 },
  { date: "Jul 13", visits: 85, repeat: 36, referrals: 15 },
  { date: "Jul 14", visits: 79, repeat: 30, referrals: 13 },
  { date: "Jul 15", visits: 92, repeat: 41, referrals: 18 },
  { date: "Jul 16", visits: 81, repeat: 34, referrals: 14 },
  { date: "Jul 17", visits: 95, repeat: 43, referrals: 19 },
  { date: "Jul 18", visits: 83, repeat: 35, referrals: 15 },
  { date: "Jul 19", visits: 97, repeat: 45, referrals: 20 },
  { date: "Jul 20", visits: 85, repeat: 38, referrals: 16 },
  { date: "Jul 21", visits: 100, repeat: 46, referrals: 21 },
  { date: "Jul 22", visits: 87, repeat: 39, referrals: 17 },
  { date: "Jul 23", visits: 102, repeat: 48, referrals: 22 },
];

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
  customerAnalytics: CustomerAnalytics;
  visitData: VisitData[];
  customerAnalytics: CustomerAnalytics;
  visitData: VisitData[];
  period: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  lastUpdated?: string;
}

// Calendar Date Range Picker Component


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
      period: "Today",
      lastUpdated: new Date().toISOString(),
    },
    Week: {
      grossRevenue: 14509,
      avgOrderValue: 204,
      taxes: 1210.5,
      customers: 306,
      period: "Week",
      lastUpdated: new Date().toISOString(),
    },
    Month: {
      grossRevenue: 58200,
      avgOrderValue: 195,
      taxes: 4856.7,
      customers: 1245,
      period: "Month",
      lastUpdated: new Date().toISOString(),
    },
    Quarter: {
      grossRevenue: 174600,
      avgOrderValue: 210,
      taxes: 14550.0,
      customers: 3680,
      period: "Quarter",
      lastUpdated: new Date().toISOString(),
    },
    Year: {
      grossRevenue: 698400,
      avgOrderValue: 198,
      taxes: 58200.0,
      customers: 14720,
      period: "Year",
      lastUpdated: new Date().toISOString(),
    },
    Custom: {
      grossRevenue: 35600,
      avgOrderValue: 178,
      taxes: 2968.0,
      customers: 680,
      period: "Custom",
      lastUpdated: new Date().toISOString(),
    },
  };

  private static mockRevenueData: Record<string, RevenueData[]> = {
    Today: [
      { day: "9AM", date: "09", value: 150, orders: 3 },
      { day: "11AM", date: "11", value: 300, orders: 8 },
      { day: "1PM", date: "13", value: 850, orders: 15 },
      { day: "3PM", date: "15", value: 650, orders: 12 },
      { day: "5PM", date: "17", value: 500, orders: 9 },
    ],
    Week: [
      { day: "Mon", date: "15", value: 2000, orders: 45 },
      { day: "Tue", date: "16", value: 3000, orders: 62 },
      { day: "Wed", date: "17", value: 2500, orders: 55 },
      { day: "Thu", date: "18", value: 4000, orders: 78 },
      { day: "Fri", date: "19", value: 6000, orders: 95 },
      { day: "Sat", date: "20", value: 8000, orders: 110 },
      { day: "Sun", date: "21", value: 7500, orders: 98 },
    ],
    Month: [
      { day: "Week 1", date: "1-7", value: 12000, orders: 250 },
      { day: "Week 2", date: "8-14", value: 18000, orders: 380 },
      { day: "Week 3", date: "15-21", value: 15000, orders: 320 },
      { day: "Week 4", date: "22-28", value: 21000, orders: 420 },
    ],
    Quarter: [
      { day: "Jan", date: "01", value: 45000, orders: 850 },
      { day: "Feb", date: "02", value: 52000, orders: 980 },
      { day: "Mar", date: "03", value: 58200, orders: 1100 },
    ],
    Year: [
      { day: "Q1", date: "1-3", value: 155200, orders: 2930 },
      { day: "Q2", date: "4-6", value: 168400, orders: 3180 },
      { day: "Q3", date: "7-9", value: 185600, orders: 3520 },
      { day: "Q4", date: "10-12", value: 189200, orders: 3590 },
    ],
    Custom: [
      { day: "Day 1", date: "01", value: 5200, orders: 95 },
      { day: "Day 2", date: "02", value: 6800, orders: 120 },
      { day: "Day 3", date: "03", value: 4500, orders: 80 },
      { day: "Day 4", date: "04", value: 7200, orders: 135 },
      { day: "Day 5", date: "05", value: 8100, orders: 150 },
      { day: "Day 6", date: "06", value: 3800, orders: 70 },
    ],
  };

  private static mockBestSelling: Record<string, BestSellingItem[]> = {
    Today: [
      {
        rank: 1,
        product: "Iced Coffee",
        revenue: "$125",
        sales: 15,
        category: "Beverages",
        profitMargin: 75,
      },
      {
        rank: 2,
        product: "Breakfast Sandwich",
        revenue: "$98",
        sales: 8,
        category: "Food",
        profitMargin: 60,
      },
      {
        rank: 3,
        product: "Croissant",
        revenue: "$87",
        sales: 12,
        category: "Pastry",
        profitMargin: 70,
      },
    ],
    Week: [
      {
        rank: 1,
        product: "Coffee",
        revenue: "$1,304",
        sales: 195,
        category: "Beverages",
        profitMargin: 80,
      },
      {
        rank: 2,
        product: "Grill Sandwich",
        revenue: "$1,250",
        sales: 90,
        category: "Food",
        profitMargin: 65,
      },
      {
        rank: 3,
        product: "Fajita Wraps",
        revenue: "$1,030",
        sales: 330,
        category: "Food",
        profitMargin: 55,
      },
      {
        rank: 4,
        product: "Peach Iced Tea",
        revenue: "$890",
        sales: 56,
        category: "Beverages",
        profitMargin: 78,
      },
      {
        rank: 5,
        product: "Crispy Burger",
        revenue: "$730",
        sales: 35,
        category: "Food",
        profitMargin: 45,
      },
    ],
    Month: [
      {
        rank: 1,
        product: "Coffee",
        revenue: "$5,216",
        sales: 780,
        category: "Beverages",
        profitMargin: 80,
      },
      {
        rank: 2,
        product: "Grill Sandwich",
        revenue: "$5,000",
        sales: 360,
        category: "Food",
        profitMargin: 65,
      },
      {
        rank: 3,
        product: "Fajita Wraps",
        revenue: "$4,120",
        sales: 1320,
        category: "Food",
        profitMargin: 55,
      },
      {
        rank: 4,
        product: "Peach Iced Tea",
        revenue: "$3,560",
        sales: 224,
        category: "Beverages",
        profitMargin: 78,
      },
      {
        rank: 5,
        product: "Crispy Burger",
        revenue: "$2,920",
        sales: 140,
        category: "Food",
        profitMargin: 45,
      },
    ],
    Quarter: [
      {
        rank: 1,
        product: "Coffee",
        revenue: "$18,650",
        sales: 2340,
        category: "Beverages",
        profitMargin: 80,
      },
      {
        rank: 2,
        product: "Grill Sandwich",
        revenue: "$17,400",
        sales: 1080,
        category: "Food",
        profitMargin: 65,
      },
      {
        rank: 3,
        product: "Fajita Wraps",
        revenue: "$14,760",
        sales: 3960,
        category: "Food",
        profitMargin: 55,
      },
      {
        rank: 4,
        product: "Peach Iced Tea",
        revenue: "$12,680",
        sales: 672,
        category: "Beverages",
        profitMargin: 78,
      },
      {
        rank: 5,
        product: "Crispy Burger",
        revenue: "$10,440",
        sales: 420,
        category: "Food",
        profitMargin: 45,
      },
    ],
    Year: [
      {
        rank: 1,
        product: "Coffee",
        revenue: "$83,520",
        sales: 9360,
        category: "Beverages",
        profitMargin: 80,
      },
      {
        rank: 2,
        product: "Grill Sandwich",
        revenue: "$76,800",
        sales: 4320,
        category: "Food",
        profitMargin: 65,
      },
      {
        rank: 3,
        product: "Fajita Wraps",
        revenue: "$66,240",
        sales: 15840,
        category: "Food",
        profitMargin: 55,
      },
      {
        rank: 4,
        product: "Peach Iced Tea",
        revenue: "$56,960",
        sales: 2688,
        category: "Beverages",
        profitMargin: 78,
      },
      {
        rank: 5,
        product: "Crispy Burger",
        revenue: "$46,800",
        sales: 1680,
        category: "Food",
        profitMargin: 45,
      },
    ],
    Custom: [
      {
        rank: 1,
        product: "Coffee",
        revenue: "$2,840",
        sales: 320,
        category: "Beverages",
        profitMargin: 80,
      },
      {
        rank: 2,
        product: "Grill Sandwich",
        revenue: "$2,600",
        sales: 150,
        category: "Food",
        profitMargin: 65,
      },
      {
        rank: 3,
        product: "Fajita Wraps",
        revenue: "$2,200",
        sales: 580,
        category: "Food",
        profitMargin: 55,
      },
      {
        rank: 4,
        product: "Peach Iced Tea",
        revenue: "$1,890",
        sales: 95,
        category: "Beverages",
        profitMargin: 78,
      },
      {
        rank: 5,
        product: "Crispy Burger",
        revenue: "$1,520",
        sales: 65,
        category: "Food",
        profitMargin: 45,
      },
    ],
  };

  private static mockCustomerAnalytics: Record<string, CustomerAnalytics> = {
    Today: {
      totalVisits: 1731,
      repeatCustomers: 258,
      newCustomers: 369,
      referrals: 20,
      lastPeriod: 133,
      visitGrowth: 1023,
      repeatGrowth: 125,
      newCustomerGrowth: -5,
      referralGrowth: 19,
    },
    Week: {
      totalVisits: 5231,
      repeatCustomers: 1258,
      newCustomers: 2369,
      referrals: 120,
      lastPeriod: 4133,
      visitGrowth: 2023,
      repeatGrowth: 425,
      newCustomerGrowth: 105,
      referralGrowth: 49,
    },
    Month: {
      totalVisits: 21731,
      repeatCustomers: 5258,
      newCustomers: 8369,
      referrals: 320,
      lastPeriod: 19133,
      visitGrowth: 5023,
      repeatGrowth: 1225,
      newCustomerGrowth: 305,
      referralGrowth: 119,
    },
    Quarter: {
      totalVisits: 67240,
      repeatCustomers: 18560,
      newCustomers: 26480,
      referrals: 1250,
      lastPeriod: 58420,
      visitGrowth: 8820,
      repeatGrowth: 2340,
      newCustomerGrowth: 1680,
      referralGrowth: 280,
    },
    Year: {
      totalVisits: 284600,
      repeatCustomers: 89500,
      newCustomers: 118200,
      referrals: 5800,
      lastPeriod: 241800,
      visitGrowth: 42800,
      repeatGrowth: 15600,
      newCustomerGrowth: 8900,
      referralGrowth: 1450,
    },
    Custom: {
      totalVisits: 8450,
      repeatCustomers: 2150,
      newCustomers: 3200,
      referrals: 180,
      lastPeriod: 7200,
      visitGrowth: 1250,
      repeatGrowth: 320,
      newCustomerGrowth: 450,
      referralGrowth: 65,
    },
  };

  private static mockVisitData: Record<string, VisitData[]> = {
    Today: [
      { date: "9AM", visits: 50, repeat: 20, referrals: 19 },
      { date: "11AM", visits: 65, repeat: 22, referrals: 21 },
      { date: "1PM", visits: 58, repeat: 25, referrals: 24 },
      { date: "3PM", visits: 70, repeat: 28, referrals: 30 },
      { date: "5PM", visits: 62, repeat: 21, referrals: 7 },
      { date: "7PM", visits: 75, repeat: 26, referrals: 13 },
    ],
    Week: [
      { date: "Mon", visits: 150, repeat: 50, referrals: 50 },
      { date: "Tue", visits: 165, repeat: 62, referrals: 50 },
      { date: "Wed", visits: 158, repeat: 55, referrals: 96 },
      { date: "Thu", visits: 170, repeat: 68, referrals: 35 },
      { date: "Fri", visits: 262, repeat: 121, referrals: 14 },
      { date: "Sat", visits: 375, repeat: 156, referrals: 70 },
      { date: "Sun", visits: 275, repeat: 126, referrals: 30 },
    ],
    Month: data,
    Quarter: [
      { date: "Jan", visits: 1850, repeat: 680, referrals: 190 },
      { date: "Feb", visits: 2120, repeat: 780, referrals: 240 },
      { date: "Mar", visits: 2340, repeat: 890, referrals: 500 },
    ],
    Year: [
      { date: "Q1", visits: 6310, repeat: 2350, referrals: 1900 },
      { date: "Q2", visits: 7120, repeat: 2640, referrals: 500 },
      { date: "Q3", visits: 7890, repeat: 2980, referrals: 600 },
      { date: "Q4", visits: 8240, repeat: 3120, referrals: 2500 },
    ],
    Custom: [
      { date: "Day 1", visits: 420, repeat: 180, referrals: 35 },
      { date: "Day 2", visits: 380, repeat: 160, referrals: 28 },
      { date: "Day 3", visits: 450, repeat: 195, referrals: 42 },
      { date: "Day 4", visits: 520, repeat: 220, referrals: 38 },
      { date: "Day 5", visits: 480, repeat: 205, referrals: 45 },
      { date: "Day 6", visits: 360, repeat: 150, referrals: 25 },
    ],
  };

  static async getDashboardData(
    period: string
  ): Promise<ApiResponse<DashboardData>> {
    await this.delay(600);

    const metrics = this.mockMetrics[period] || this.mockMetrics.Week;
    const revenueData =
      this.mockRevenueData[period] || this.mockRevenueData.Week;
    const bestSellingItems =
      this.mockBestSelling[period] || this.mockBestSelling.Week;
    const customerAnalytics =
      this.mockCustomerAnalytics[period] || this.mockCustomerAnalytics.Week;
    const visitData = this.mockVisitData[period] || this.mockVisitData.Week;

    return {
      success: true,
      data: {
        metrics,
        revenueData,
        bestSellingItems,
        customerAnalytics,
        visitData,
        customerAnalytics,
        visitData,
        period,
      },
      message: `Dashboard data for ${period} fetched successfully`,
      lastUpdated: new Date().toISOString(),
    };
  }

  static async getCustomRangeData(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<DashboardData>> {
    await this.delay(800);

    const metrics = { ...this.mockMetrics.Custom };
    const revenueData = [...this.mockRevenueData.Custom];
    const bestSellingItems = [...this.mockBestSelling.Custom];
    const customerAnalytics = { ...this.mockCustomerAnalytics.Custom };
    const visitData = [...this.mockVisitData.Custom];

    // Add some variation based on date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const multiplier = Math.max(1, daysDiff / 7); // Scale based on range

    metrics.grossRevenue = Math.round(metrics.grossRevenue * multiplier);
    metrics.customers = Math.round(metrics.customers * multiplier);
    metrics.taxes = Math.round(metrics.taxes * multiplier * 100) / 100;

    return {
      success: true,
      data: {
        metrics,
        revenueData,
        bestSellingItems,
        customerAnalytics,
        visitData,
        period: `Custom (${startDate} to ${endDate})`,
      },
      message: `Dashboard data for custom range fetched successfully`,
      lastUpdated: new Date().toISOString(),
    };
  }

  static async refreshDashboard(
    period: string
  ): Promise<ApiResponse<DashboardData>> {
    await this.delay(800);

    const baseMetrics = this.mockMetrics[period] || this.mockMetrics.Week;
    const variation = (Math.random() - 0.5) * 0.1;

    const refreshedMetrics: DashboardMetrics = {
      ...baseMetrics,
      grossRevenue: Math.round(baseMetrics.grossRevenue * (1 + variation)),
      customers: Math.round(baseMetrics.customers * (1 + variation * 0.5)),
      lastUpdated: new Date().toISOString(),
    };

    const revenueData =
      this.mockRevenueData[period] || this.mockRevenueData.Week;
    const bestSellingItems =
      this.mockBestSelling[period] || this.mockBestSelling.Week;
    const customerAnalytics =
      this.mockCustomerAnalytics[period] || this.mockCustomerAnalytics.Week;
    const visitData = this.mockVisitData[period] || this.mockVisitData.Week;

    return {
      success: true,
      data: {
        metrics: refreshedMetrics,
        revenueData,
        bestSellingItems,
        customerAnalytics,
        visitData,
        customerAnalytics,
        visitData,
        period,
      },
      message: `Dashboard refreshed successfully`,
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
  type: "success" | "error" | "info";
  onClose: () => void;
}) => (
  <div
    className={`fixed top-4 right-4 px-4 py-3 rounded-sm shadow-lg z-50 flex items-center gap-2 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`}
  >
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X size={16} />
    </button>
  </div>
);

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const periods = ["Today", "Week", "Month", "Quarter", "Year"];

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
// Inside your Dashboard component state


  // 🔹 State for date range
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

 

  // 🔹 Apply button logic
  const handleApplyCustomRange = () => {
    if (startDate && endDate) {
      const startStr = startDate.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];
      handleCustomDateRange(startStr, endStr);
      setShowDatePicker(false);
    }
  };
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  const loadCustomRangeData = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      const response = await DashboardAPI.getCustomRangeData(startDate, endDate);
      if (response.success) {
        setDashboardData(response.data);
        setLastUpdated(response.lastUpdated || new Date().toISOString());
        setCustomDateRange({ start: startDate, end: endDate });
        showToast("Custom date range data loaded successfully", "success");
      } else {
        throw new Error(response.message || "Failed to fetch custom range data");
      }
    } catch (error) {
      console.error("Error fetching custom range data:", error);
      showToast("Failed to load custom date range data", "error");
    } finally {
      setLoading(false);
    }
  };

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

  const handlePeriodChange = async (period: string) => {
    setSelectedPeriod(period);
    setCustomDateRange(null);
    setShowDatePicker(false);
    await loadDashboardData(period);
  };

  const handleCustomDateRange = async (startDate: string, endDate: string) => {
    setSelectedPeriod("Custom");
    await loadCustomRangeData(startDate, endDate);
  };

  useEffect(() => {
    loadDashboardData(selectedPeriod);
  }, []);

  const HorizontalSeparator = ({
    className = "",
    height = "1px",
    color = "#e5e7eb",
    margin = "1.5rem 0",
  }: {
    className?: string;
    height?: string;
    color?: string;
    margin?: string;
  }) => (
    <div
      className={className}
      style={{
        height: height,
        backgroundColor: color,
        margin: margin,
        width: "100%",
      }}
    />
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }// Horizontal Line Separator Component
const HorizontalSeparator = ({ 
  className = "",
  height = "1px",
  color = "#e5e7eb",
  margin = "1.5rem 0"
}: {
  className?: string;
  height?: string;
  color?: string;
  margin?: string;
}) => (
  <div 
    className={className}
    style={{
      height: height,
      backgroundColor: color,
      margin: margin,
      width: '100%'
    }}
  />
);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button
            onClick={() => loadDashboardData(selectedPeriod)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
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
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {period}
            </button>
          ))}
          
          {/* Custom Date Range Button */}
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors disabled:opacity-50 ${
              selectedPeriod === "Custom" || showDatePicker
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Calendar size={16} />
            {customDateRange ? 
              `${formatDisplayDate(customDateRange.start)} - ${formatDisplayDate(customDateRange.end)}` :
              "Custom Range"
            }
          </button>
        </div>

        {/* Calendar Date Range Picker */}
     <DatePicker
  selectsRange
  startDate={startDate}
  endDate={endDate}
  onChange={(update) => {
    const [start, end] = update as [Date | null, Date | null];
    setDateRange([start, end]);

    if (start && end) {
      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];
      handleCustomDateRange(startStr, endStr);
    }
  }}
  placeholderText="Custom Range"
  dateFormat="dd.MM.yyyy"
  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors cursor-pointer ${
    selectedPeriod === "Custom"
      ? "bg-gray-800 text-white"
      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
  }`}
/>



        

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-sm shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Gross revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              ${dashboardData.metrics.grossRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-sm shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Avg. order value</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              ${dashboardData.metrics.avgOrderValue}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-sm shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Taxes</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              ${dashboardData.metrics.taxes.toFixed(1)}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-sm shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Customers</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {dashboardData.metrics.customers.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Customer Analytics Section */}
        <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <div className="w-full">
            <p className="text-lg font-bold text-gray-500">
              Last month, 24 June - 23 July 2025
            </p>
            <HorizontalSeparator margin="1rem 0 0 0" />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side - Main chart area */}
            <div className="flex-1 min-w-0 w-[100%]">
              {/* Top metrics row */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Total visits */}
                <div className="border-r pt-4 pr-4 border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">Total visits</p>
                    <div className="flex items-center text-green-500">
                      <span className="text-sm font-medium">+1,023</span>
                      <TrendingUp size={12} className="ml-1" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">1,731</h3>
                </div>

                {/* Repeat customers */}
                <div className="border-r pt-4 pr-4 border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">Repeat customers</p>
                    <div className="flex items-center text-green-500">
                      <span className="text-sm font-medium">+125</span>
                      <TrendingUp size={12} className="ml-1" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">258</h3>
                </div>

                {/* Last period */}
                <div>
                  <p className="text-sm pt-4 pr-4 text-gray-500 mb-2">
                    Last period
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900">133</h3>
                </div>
              </div>

              {/* Chart */}
              <div className="w-[100%] min-w-0">
                <ResponsiveContainer width="100%" height={320} >
                  <BarChart
                    data={dashboardData.visitData}
                    margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                    barCategoryGap="2%"
                  >
                    <defs>
                      {/* Green gradient for referrals */}
                      <linearGradient
                        id="referralsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#22c55e"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#92fc7e"
                          stopOpacity={1}
                        />
                      </linearGradient>

                      {/* Blue gradient for repeat customers */}
                      <linearGradient
                        id="repeatGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#93C5FD"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="50%"
                          stopColor="#60A5FA"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#1D4ED8"
                          stopOpacity={1}
                        />
                      </linearGradient>

                      {/* Purple gradient for new members */}
                      <linearGradient
                        id="newMembersGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#aab5df"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#e4e8f5"
                          stopOpacity={1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#9CA3AF" }}
                      height={30}
                    />
                    
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        padding: "8px",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="repeat"
                      stackId="a"
                      fill="#1d50cd"
                      name="Repeat Customers"
                    />
                    <Bar
                      dataKey="visits"
                      stackId="a"
                      fill="url(#newMembersGradient)"
                      name="New Members"
                    />
                    <Bar
                      dataKey="referrals"
                      stackId="a"
                      fill="url(#referralsGradient)"
                      name="Referrals"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right side - Stats cards */}
            <div className="lg:w-80 flex-shrink-0 border-l border-gray-300 space-y-6">
              {/* Repeat customers card */}
              <div className="p-4  border-b border-gray-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl pb-8 font-bold text-gray-900">258</div>
                  <TrendingUp size={14} className="text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Repeat customers
                    </span>
                  </div>
                  <div className="text-green-500 text-sm font-medium">+125</div>
                </div>
              </div>

              {/* New members card */}
              <div className="p-4  border-b border-gray-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl pb-8 font-bold text-gray-900">369</div>
                  <TrendingDown size={14} className="text-red-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">New members</span>
                  </div>
                  <div className="text-red-500 text-sm font-medium">-5</div>
                </div>
              </div>

              {/* Referrals card */}
              <div className="p-4 ">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl pb-8 font-bold text-gray-900">20</div>
                  <TrendingUp size={14} className="text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Referrals</span>
                  </div>
                  <div className="text-green-500 text-sm font-medium">+19</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Revenue Trend Chart */}
          <div className="border border-gray-200 lg:col-span-2 bg-white p-4 sm:p-6 rounded-sm shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Revenue trend
              </h2>
              <p className="text-sm text-gray-500">
                {selectedPeriod} - {dashboardData.revenueData.length} data
                points
              </p>
            </div>

            <div className="h-64  sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.revenueData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value, index) => {
                      const item = dashboardData.revenueData[index];
                      return `${value}\n${item?.date}`;
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value) =>
                      value >= 1000 ? `${value / 1000}K` : value.toString()
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#CCAB4D"
                    strokeWidth={2}
                    dot={{ fill: "#CCAB4D", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#CCAB4D" }}
                    connectNulls={false}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    animationBegin={0}
                    strokeDasharray="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px",
                      fontSize: "12px",
                    }}
                    labelFormatter={(label, payload) => {
                      const dataPoint = dashboardData.revenueData.find(
                        (d) => d.day === label
                      );
                      return `${dataPoint?.day} (${dataPoint?.date})`;
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value}`,
                      "Revenue",
                      `${props.payload?.orders || 0} orders`,
                    ]}
                    cursor={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Best Selling Items */}
          <div className="bg-white p-4 sm:p-6 rounded-sm shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Best selling items
            </h2>
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium pb-3 border-b border-gray-100">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Products</div>
                <div className="col-span-3 text-right">Revenue</div>
                <div className="col-span-3 text-right">Sales</div>
              </div>
              {dashboardData.bestSellingItems.map((item, index) => (
                <div
                  key={item.rank}
                  className="grid grid-cols-12 gap-2 py-3 text-sm border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-md transition-colors"
                  title={`Category: ${item.category} | Profit Margin: ${item.profitMargin}%`}
                >
                  <div className="col-span-1 text-gray-600 font-medium">
                    {item.rank}
                  </div>
                  <div className="col-span-5 text-gray-900">{item.product}</div>
                  <div className="col-span-3 text-right font-medium text-gray-900">
                    {item.revenue}
                  </div>
                  <div className="col-span-3 text-right text-gray-600">
                    {item.sales}
                  </div>
                </div>
              ))}
            </div>
            {dashboardData.bestSellingItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No data available for {selectedPeriod}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard
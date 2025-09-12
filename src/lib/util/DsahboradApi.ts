// src/lib/utility/Dsahboradapi.ts

import { DashboardData } from '@/types/Dtypes';

// ---------------------------------------------
// Helper: generate customer analytics
// ---------------------------------------------
const generateCustomerAnalytics = (visitData: any[], lastPeriod: number) => {
  const totalVisits = visitData.reduce((acc, v) => acc + v.visits, 0);
  const repeatCustomers = visitData.reduce((acc, v) => acc + v.repeat, 0);
  const newCustomers = totalVisits - repeatCustomers;
  const referrals = visitData.reduce((acc, v) => acc + v.referrals, 0);

  return {
    totalVisits,
    repeatCustomers,
    newCustomers,
    referrals,
    lastPeriod,
    visitGrowth: Math.round(((totalVisits - lastPeriod) / lastPeriod) * 100),
    repeatGrowth: Math.round(((repeatCustomers - lastPeriod / 2) / (lastPeriod / 2)) * 100),
    newCustomerGrowth: Math.round(((newCustomers - lastPeriod / 3) / (lastPeriod / 3)) * 100),
  };
};

// ---------------------------------------------
// Helper: generate custom range data
// ---------------------------------------------
const generateCustomRangeData = (startDate: Date, endDate: Date): DashboardData => {
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const revenueData = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      value: Math.floor(Math.random() * 4000) + 1000,
      orders: Math.floor(Math.random() * 120) + 30,
    };
  });

  const visitData = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return {
      date: date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      visits: Math.floor(Math.random() * 400) + 100,
      repeat: Math.floor(Math.random() * 180) + 40,
      referrals: Math.floor(Math.random() * 120) + 20,
    };
  });

  return {
    period: "Custom",
    metrics: {
      grossRevenue: revenueData.reduce((acc, d) => acc + d.value, 0),
      avgOrderValue: 225,
      taxes: 4000,
      customers: visitData.reduce((acc, v) => acc + v.visits, 0),
      period: "Custom",
      lastUpdated: new Date().toISOString(),
    },
    revenueData,
    bestSellingItems: [
      { rank: 1, product: "Hot Chocolate", revenue: "$5,000", sales: 480, category: "Beverages", profitMargin: 80 },
      { rank: 2, product: "Club Burger", revenue: "$4,700", sales: 350, category: "Food", profitMargin: 65 },
      { rank: 3, product: "Iced Latte", revenue: "$4,200", sales: 310, category: "Beverages", profitMargin: 73 },
      { rank: 4, product: "Pasta Pesto", revenue: "$3,800", sales: 260, category: "Food", profitMargin: 62 },
      { rank: 5, product: "Donut", revenue: "$3,200", sales: 210, category: "Dessert", profitMargin: 75 },
    ],
    visitData,
    customerAnalytics: generateCustomerAnalytics(visitData, 3000),
  };
};

// ---------------------------------------------
// Mock data for fixed periods
// ---------------------------------------------
export const mockData: Record<string, DashboardData> = {
  Today: {
    metrics: {
      grossRevenue: 2100,
      avgOrderValue: 220,
      taxes: 210,
      customers: 45,
      period: "Today",
      lastUpdated: new Date().toISOString(),
    },
    revenueData: [
      { day: "Today", date: "10", value: 2100, orders: 45 },
    ],
    bestSellingItems: [
      { rank: 1, product: "Espresso", revenue: "$520", sales: 50, category: "Beverages", profitMargin: 78 },
      { rank: 2, product: "Cheese Sandwich", revenue: "$460", sales: 40, category: "Food", profitMargin: 65 },
      { rank: 3, product: "Latte", revenue: "$430", sales: 35, category: "Beverages", profitMargin: 72 },
      { rank: 4, product: "Brownie", revenue: "$360", sales: 30, category: "Dessert", profitMargin: 70 },
      { rank: 5, product: "Cappuccino", revenue: "$330", sales: 28, category: "Beverages", profitMargin: 74 },
    ],
    visitData: [
      { date: "Today", visits: 60, repeat: 20, referrals: 10 },
    ],
    customerAnalytics: generateCustomerAnalytics([{ visits: 60, repeat: 20, referrals: 10 }], 50),
  },
  Week: {
    metrics: {
      grossRevenue: 14509,
      avgOrderValue: 204,
      taxes: 1210.5,
      customers: 306,
      period: "Week",
      lastUpdated: new Date().toISOString(),
    },
    revenueData: [
      { day: "Mon", date: "15", value: 2000, orders: 45 },
      { day: "Tue", date: "16", value: 3000, orders: 62 },
      { day: "Wed", date: "17", value: 2500, orders: 55 },
      { day: "Thu", date: "18", value: 4000, orders: 78 },
      { day: "Fri", date: "19", value: 6000, orders: 95 },
      { day: "Sat", date: "20", value: 8000, orders: 110 },
      { day: "Sun", date: "21", value: 7500, orders: 98 },
    ],
    bestSellingItems: [
      { rank: 1, product: "Coffee", revenue: "$1,304", sales: 195, category: "Beverages", profitMargin: 80 },
      { rank: 2, product: "Grill Sandwich", revenue: "$1,250", sales: 90, category: "Food", profitMargin: 65 },
      { rank: 3, product: "Fajita Wraps", revenue: "$1,030", sales: 330, category: "Food", profitMargin: 55 },
      { rank: 4, product: "Peach Iced Tea", revenue: "$890", sales: 56, category: "Beverages", profitMargin: 78 },
      { rank: 5, product: "Crispy Burger", revenue: "$730", sales: 35, category: "Food", profitMargin: 45 },
    ],
    visitData: [
      { date: "Mon", visits: 150, repeat: 50, referrals: 50 },
      { date: "Tue", visits: 165, repeat: 62, referrals: 50 },
      { date: "Wed", visits: 158, repeat: 55, referrals: 96 },
      { date: "Thu", visits: 170, repeat: 68, referrals: 35 },
      { date: "Fri", visits: 262, repeat: 121, referrals: 14 },
      { date: "Sat", visits: 375, repeat: 156, referrals: 70 },
      { date: "Sun", visits: 275, repeat: 126, referrals: 30 },
    ],
    customerAnalytics: generateCustomerAnalytics([
      { visits: 150, repeat: 50, referrals: 50 },
      { visits: 165, repeat: 62, referrals: 50 },
      { visits: 158, repeat: 55, referrals: 96 },
      { visits: 170, repeat: 68, referrals: 35 },
      { visits: 262, repeat: 121, referrals: 14 },
      { visits: 375, repeat: 156, referrals: 70 },
      { visits: 275, repeat: 126, referrals: 30 },
    ], 1200),
  },
  Month: {
    metrics: {
      grossRevenue: 60200,
      avgOrderValue: 240,
      taxes: 5800,
      customers: 1200,
      period: "Month",
      lastUpdated: new Date().toISOString(),
    },
    revenueData: Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${i + 1}`,
      date: `${i + 1}`,
      value: Math.floor(Math.random() * 4000) + 1000,
      orders: Math.floor(Math.random() * 120) + 30,
    })),
    bestSellingItems: [
      { rank: 1, product: "Pizza", revenue: "$7,200", sales: 520, category: "Food", profitMargin: 65 },
      { rank: 2, product: "Mocha", revenue: "$6,800", sales: 480, category: "Beverages", profitMargin: 75 },
      { rank: 3, product: "Grilled Chicken", revenue: "$6,400", sales: 450, category: "Food", profitMargin: 60 },
      { rank: 4, product: "Muffin", revenue: "$5,900", sales: 420, category: "Dessert", profitMargin: 70 },
      { rank: 5, product: "Cappuccino", revenue: "$5,500", sales: 390, category: "Beverages", profitMargin: 72 },
    ],
    visitData: Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      visits: Math.floor(Math.random() * 400) + 100,
      repeat: Math.floor(Math.random() * 180) + 40,
      referrals: Math.floor(Math.random() * 120) + 20,
    })),
    customerAnalytics: generateCustomerAnalytics(
      Array.from({ length: 30 }, () => ({
        visits: Math.floor(Math.random() * 400) + 100,
        repeat: Math.floor(Math.random() * 180) + 40,
        referrals: Math.floor(Math.random() * 120) + 20,
      })),
      10000
    ),
  },
  Quarter: {
    metrics: {
      grossRevenue: 180000,
      avgOrderValue: 260,
      taxes: 15000,
      customers: 3500,
      period: "Quarter",
      lastUpdated: new Date().toISOString(),
    },
    revenueData: Array.from({ length: 12 }, (_, i) => ({
      day: `Week ${i + 1}`,
      date: `${i + 1}`,
      value: Math.floor(Math.random() * 20000) + 5000,
      orders: Math.floor(Math.random() * 800) + 200,
    })),
    bestSellingItems: [
      { rank: 1, product: "Steak", revenue: "$15,200", sales: 900, category: "Food", profitMargin: 55 },
      { rank: 2, product: "Latte", revenue: "$14,800", sales: 880, category: "Beverages", profitMargin: 74 },
      { rank: 3, product: "Tacos", revenue: "$14,400", sales: 850, category: "Food", profitMargin: 62 },
      { rank: 4, product: "Ice Cream", revenue: "$13,900", sales: 820, category: "Dessert", profitMargin: 70 },
      { rank: 5, product: "Espresso", revenue: "$13,500", sales: 800, category: "Beverages", profitMargin: 76 },
    ],
    visitData: Array.from({ length: 12 }, (_, i) => ({
      date: `Week ${i + 1}`,
      visits: Math.floor(Math.random() * 1200) + 300,
      repeat: Math.floor(Math.random() * 600) + 150,
      referrals: Math.floor(Math.random() * 400) + 80,
    })),
    customerAnalytics: generateCustomerAnalytics(
      Array.from({ length: 12 }, () => ({
        visits: Math.floor(Math.random() * 1200) + 300,
        repeat: Math.floor(Math.random() * 600) + 150,
        referrals: Math.floor(Math.random() * 400) + 80,
      })),
      25000
    ),
  },
  Year: {
    metrics: {
      grossRevenue: 750000,
      avgOrderValue: 280,
      taxes: 60000,
      customers: 15000,
      period: "Year",
      lastUpdated: new Date().toISOString(),
    },
    revenueData: Array.from({ length: 12 }, (_, i) => ({
      day: new Date(2025, i).toLocaleString("en-US", { month: "short" }),
      date: `${i + 1}`,
      value: Math.floor(Math.random() * 80000) + 20000,
      orders: Math.floor(Math.random() * 3000) + 800,
    })),
    bestSellingItems: [
      { rank: 1, product: "Pasta", revenue: "$50,200", sales: 2500, category: "Food", profitMargin: 60 },
      { rank: 2, product: "Americano", revenue: "$48,800", sales: 2400, category: "Beverages", profitMargin: 75 },
      { rank: 3, product: "Burrito", revenue: "$47,400", sales: 2300, category: "Food", profitMargin: 62 },
      { rank: 4, product: "Croissant", revenue: "$45,900", sales: 2200, category: "Dessert", profitMargin: 70 },
      { rank: 5, product: "Cappuccino", revenue: "$44,500", sales: 2100, category: "Beverages", profitMargin: 72 },
    ],
    visitData: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2025, i).toLocaleString("en-US", { month: "short" }),
      visits: Math.floor(Math.random() * 4000) + 1000,
      repeat: Math.floor(Math.random() * 2000) + 500,
      referrals: Math.floor(Math.random() * 1500) + 300,
    })),
    customerAnalytics: generateCustomerAnalytics(
      Array.from({ length: 12 }, () => ({
        visits: Math.floor(Math.random() * 4000) + 1000,
        repeat: Math.floor(Math.random() * 2000) + 500,
        referrals: Math.floor(Math.random() * 1500) + 300,
      })),
      100000
    ),
  },
};

// ---------------------------------------------
// API service
// ---------------------------------------------
export const dashboardAPI = {
  async getDashboardData(period: string, startDate?: string, endDate?: string): Promise<DashboardData> {
    await new Promise(resolve => setTimeout(resolve, 600));

    if (period === "Custom" && startDate && endDate) {
      return generateCustomRangeData(new Date(startDate), new Date(endDate));
    }

    return mockData[period] || mockData["Week"];
  },

  async refreshDashboardData(period: string, startDate?: string, endDate?: string): Promise<DashboardData> {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (period === "Custom" && startDate && endDate) {
      return generateCustomRangeData(new Date(startDate), new Date(endDate));
    }

    return mockData[period] || mockData["Week"];
  }
};

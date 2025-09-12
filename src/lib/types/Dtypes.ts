// types.ts - All TypeScript interfaces and types

export interface DashboardMetrics {
  grossRevenue: number;
  avgOrderValue: number;
  taxes: number;
  customers: number;
  period: string;
  lastUpdated: string;
}

export interface CustomerAnalytics {
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

export interface VisitData {
  date: string;
  visits: number;
  repeat: number;
  referrals: number;
}

export interface RevenueData {
  day: string;
  date: string;
  value: number;
  orders: number;
}

export interface BestSellingItem {
  rank: number;
  product: string;
  revenue: string;
  sales: number;
  category: string;
  profitMargin: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  revenueData: RevenueData[];
  bestSellingItems: BestSellingItem[];
  customerAnalytics: CustomerAnalytics;
  visitData: VisitData[];
  period: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  lastUpdated?: string;
}

export interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}
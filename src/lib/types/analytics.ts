// types/analytics.ts

export interface CustomerItem {
  Customer_ID: number;
  Name: string;
  Contact: string;
  Email: string;
  Address: string;
  Feedback_Rating: number;
  Total_Orders: number;
  Birthdate: string;
  Registration_Date: string;
  Profile_Creation_Date: string;
}

export interface OrderItem {
  Customer_fk_ID: number;
  Order_ID: string;
  Order_Number: string;
  Type: "Dine in" | "Takeaway" | "Delivery";
  Date: string;
  Total: number;
  Status: "Completed" | "Pending" | "Cancelled";
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface AnalyticsData {
  totalCustomers: number;
  newCustomersThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  customerSatisfaction: number;
  repeatCustomers: number;
}

export type PeriodType = "Today" | "Week" | "Month" | "Quarter" | "Year" | "Custom";

export interface ChartDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface GrowthDataPoint {
  month: string;
  newCustomers: number;
  totalCustomers: number;
}

export interface OrderTypeData {
  name: string;
  value: number;
  color: string;
}

export interface ComparisonData {
  metric: string;
  thisMonth: number;
  lastMonth: number;
}

export interface SegmentData {
  segment: string;
  customers: number;
}

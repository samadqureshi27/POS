// services/analyticsAPI.ts
import { CustomerItem, ApiResponse, OrderItem, AnalyticsData, PeriodType, ChartDataPoint, GrowthDataPoint, OrderTypeData, ComparisonData, SegmentData } from '@/lib/types/analytics';

export const mockCustomers: CustomerItem[] = [
  {
    Customer_ID: 1,
    Name: "Ahmed Ali",
    Contact: "03001234567",
    Email: "ahmed.ali@gmail.com",
    Address: "123 Main Street, Lahore",
    Feedback_Rating: 5,
    Total_Orders: 12,
    Birthdate: "09/13/1995",
    Registration_Date: "2024-01-15",
    Profile_Creation_Date: "01/15/2024 09:30",
  },
  {
    Customer_ID: 2,
    Name: "Fatima Khan",
    Contact: "03009876543",
    Email: "fatima.khan@gmail.com",
    Address: "456 Park Avenue, Karachi",
    Feedback_Rating: 4,
    Total_Orders: 8,
    Birthdate: "05/22/1988",
    Registration_Date: "2024-02-20",
    Profile_Creation_Date: "02/20/2024 14:45",
  },
  {
    Customer_ID: 3,
    Name: "Muhammad Hassan",
    Contact: "03001111111",
    Email: "hassan@gmail.com",
    Address: "789 Garden Road, Islamabad",
    Feedback_Rating: 3,
    Total_Orders: 15,
    Birthdate: "12/08/1992",
    Registration_Date: "2023-12-10",
    Profile_Creation_Date: "12/10/2023 11:20",
  },
  {
    Customer_ID: 4,
    Name: "Mariam Qureshi",
    Contact: "03001010101",
    Email: "mariam.qureshi@yahoo.com",
    Address: "112 F-6 Sector, Islamabad",
    Feedback_Rating: 5,
    Total_Orders: 25,
    Birthdate: "03/15/1990",
    Registration_Date: "2022-01-15",
    Profile_Creation_Date: "01/15/2022 10:30",
  },
  {
    Customer_ID: 5,
    Name: "Ali Raza",
    Contact: "03002222222",
    Email: "ali.raza@gmail.com",
    Address: "555 Model Town, Lahore",
    Feedback_Rating: 4,
    Total_Orders: 18,
    Birthdate: "07/20/1987",
    Registration_Date: "2023-05-20",
    Profile_Creation_Date: "05/20/2023 16:20",
  }
];

export const mockOrders: OrderItem[] = [
  { Customer_fk_ID: 1, Order_ID: "ORD001", Order_Number: "12345", Type: "Dine in", Date: "2024-08-25", Total: 850, Status: "Completed" },
  { Customer_fk_ID: 1, Order_ID: "ORD002", Order_Number: "12346", Type: "Takeaway", Date: "2024-08-20", Total: 1200, Status: "Completed" },
  { Customer_fk_ID: 2, Order_ID: "ORD007", Order_Number: "12351", Type: "Delivery", Date: "2024-08-22", Total: 650, Status: "Pending" },
  { Customer_fk_ID: 3, Order_ID: "ORD008", Order_Number: "12352", Type: "Dine in", Date: "2024-08-18", Total: 1100, Status: "Completed" },
  { Customer_fk_ID: 4, Order_ID: "ORD009", Order_Number: "12353", Type: "Takeaway", Date: "2024-08-15", Total: 750, Status: "Completed" },
  { Customer_fk_ID: 4, Order_ID: "ORD010", Order_Number: "12354", Type: "Delivery", Date: "2024-08-10", Total: 950, Status: "Completed" },
  { Customer_fk_ID: 5, Order_ID: "ORD011", Order_Number: "12355", Type: "Dine in", Date: "2024-08-08", Total: 1150, Status: "Completed" },
  { Customer_fk_ID: 2, Order_ID: "ORD012", Order_Number: "12356", Type: "Takeaway", Date: "2024-08-05", Total: 825, Status: "Cancelled" },
];

export const periodData = {
  "Today": {
    totalCustomers: 305,
    newCustomersThisMonth: 3,
    totalRevenue: 2100,
    monthlyRevenue: 2100,
    totalOrders: 18,
    averageOrderValue: 117,
    customerSatisfaction: 4.6,
    repeatCustomers: 285
  },
  "Week": {
    totalCustomers: 305,
    newCustomersThisMonth: 12,
    totalRevenue: 15800,
    monthlyRevenue: 15800,
    totalOrders: 142,
    averageOrderValue: 111,
    customerSatisfaction: 4.4,
    repeatCustomers: 278
  },
  "Month": {
    totalCustomers: 305,
    newCustomersThisMonth: 32,
    totalRevenue: 68500,
    monthlyRevenue: 68500,
    totalOrders: 595,
    averageOrderValue: 115,
    customerSatisfaction: 4.3,
    repeatCustomers: 268
  },
  "Quarter": {
    totalCustomers: 305,
    newCustomersThisMonth: 85,
    totalRevenue: 195000,
    monthlyRevenue: 65000,
    totalOrders: 1650,
    averageOrderValue: 118,
    customerSatisfaction: 4.2,
    repeatCustomers: 255
  },
  "Year": {
    totalCustomers: 305,
    newCustomersThisMonth: 165,
    totalRevenue: 785000,
    monthlyRevenue: 65416,
    totalOrders: 6800,
    averageOrderValue: 115,
    customerSatisfaction: 4.1,
    repeatCustomers: 240
  },
  "Custom": {
    totalCustomers: 305,
    newCustomersThisMonth: 15,
    totalRevenue: 28500,
    monthlyRevenue: 28500,
    totalOrders: 245,
    averageOrderValue: 116,
    customerSatisfaction: 4.5,
    repeatCustomers: 275
  }
};

export const revenueChartData: ChartDataPoint[] = [
  { month: 'Jan', revenue: 4200, orders: 42 },
  { month: 'Feb', revenue: 3800, orders: 38 },
  { month: 'Mar', revenue: 5100, orders: 51 },
  { month: 'Apr', revenue: 4800, orders: 48 },
  { month: 'May', revenue: 6200, orders: 62 },
  { month: 'Jun', revenue: 5500, orders: 55 },
  { month: 'Jul', revenue: 7200, orders: 72 },
  { month: 'Aug', revenue: 6800, orders: 68 },
];

export const customerGrowthData: GrowthDataPoint[] = [
  { month: 'Jan', newCustomers: 12, totalCustomers: 145 },
  { month: 'Feb', newCustomers: 15, totalCustomers: 160 },
  { month: 'Mar', newCustomers: 22, totalCustomers: 182 },
  { month: 'Apr', newCustomers: 18, totalCustomers: 200 },
  { month: 'May', newCustomers: 25, totalCustomers: 225 },
  { month: 'Jun', newCustomers: 20, totalCustomers: 245 },
  { month: 'Jul', newCustomers: 28, totalCustomers: 273 },
  { month: 'Aug', newCustomers: 32, totalCustomers: 305 },
];

export const orderTypesData: OrderTypeData[] = [
  { name: 'Dine In', value: 45, color: '#f59e0b' },
  { name: 'Takeaway', value: 35, color: '#10b981' },
  { name: 'Delivery', value: 20, color: '#3b82f6' }
];

export const monthlyComparisonData: ComparisonData[] = [
  { metric: 'Revenue', thisMonth: 6800, lastMonth: 7200 },
  { metric: 'Orders', thisMonth: 68, lastMonth: 72 },
  { metric: 'Customers', thisMonth: 32, lastMonth: 28 },
  { metric: 'Avg Order', thisMonth: 100, lastMonth: 100 },
];

export const customerSegmentData: SegmentData[] = [
  { segment: 'New', customers: 45 },
  { segment: 'Regular', customers: 120 },
  { segment: 'VIP', customers: 35 },
  { segment: 'Inactive', customers: 25 }
];

export const SEGMENT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export class AnalyticsAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  static async getAnalyticsData(period: string = "Week"): Promise<ApiResponse<AnalyticsData>> {
    await this.delay(800);
    
    const data = periodData[period as keyof typeof periodData] || periodData["Week"];
    
    return {
      success: true,
      data: data
    };
  }

  static async getCustomers(): Promise<ApiResponse<CustomerItem[]>> {
    await this.delay(600);
    return {
      success: true,
      data: mockCustomers
    };
  }

  static async getOrders(): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(600);
    return {
      success: true,
      data: mockOrders
    };
  }

  static async getCustomerById(id: number): Promise<ApiResponse<CustomerItem | null>> {
    await this.delay(400);
    const customer = mockCustomers.find(c => c.Customer_ID === id) || null;
    return {
      success: !!customer,
      data: customer,
      message: customer ? 'Customer found' : 'Customer not found'
    };
  }

  static async getOrdersByCustomerId(customerId: number): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(500);
    const customerOrders = mockOrders.filter(order => order.Customer_fk_ID === customerId);
    return {
      success: true,
      data: customerOrders
    };
  }

  static async getOrdersByStatus(status: string): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(500);
    const filteredOrders = mockOrders.filter(order => 
      status ? order.Status === status : true
    );
    return {
      success: true,
      data: filteredOrders
    };
  }

  static async getTopCustomers(limit: number = 5): Promise<ApiResponse<CustomerItem[]>> {
    await this.delay(400);
    const topCustomers = mockCustomers
      .sort((a, b) => b.Total_Orders - a.Total_Orders)
      .slice(0, limit);
    
    return {
      success: true,
      data: topCustomers
    };
  }

  static async getRecentOrders(limit: number = 10): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(400);
    const sortedOrders = mockOrders
      .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
      .slice(0, limit);
    
    return {
      success: true,
      data: sortedOrders
    };
  }

  static async searchOrders(searchTerm: string): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(300);
    const term = searchTerm.toLowerCase();
    const filteredOrders = mockOrders.filter(order =>
      order.Order_ID.toLowerCase().includes(term) ||
      order.Order_Number.toLowerCase().includes(term)
    );
    
    return {
      success: true,
      data: filteredOrders
    };
  }

  static async getCustomDateRangeData(
    startDate: string, 
    endDate: string
  ): Promise<ApiResponse<AnalyticsData>> {
    await this.delay(900);
    
    // In a real implementation, you would filter data based on date range
    // For now, return custom period data
    return {
      success: true,
      data: periodData["Custom"]
    };
  }
}
// app/analytics/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, ArrowLeft, Star, ChevronDown, Users, TrendingUp, DollarSign, ShoppingCart, Calendar, Filter } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useRouter } from 'next/navigation';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// Types
interface CustomerItem {
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

interface OrderItem {
  Customer_fk_ID: number;
  Order_ID: string;
  Order_Number: string;
  Type: "Dine in" | "Takeaway" | "Delivery";
  Date: string;
  Total: number;
  Status: "Completed" | "Pending" | "Cancelled";
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface AnalyticsData {
  totalCustomers: number;
  newCustomersThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  customerSatisfaction: number;
  repeatCustomers: number;
}

// Mock Analytics API
class AnalyticsAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockCustomers: CustomerItem[] = [
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
      Customer_ID: 12,
      Name: "Mariam Qureshi",
      Contact: "03001010101",
      Email: "mariam.qureshi@yahoo.com",
      Address: "112 F-6 Sector, Islamabad",
      Feedback_Rating: 5,
      Total_Orders: 25,
      Birthdate: "03/15/1990",
      Registration_Date: "2022-01-15",
      Profile_Creation_Date: "01/15/2022 10:30",
    }
  ];

  private static mockOrders: OrderItem[] = [
    { Customer_fk_ID: 1, Order_ID: "ORD001", Order_Number: "12345", Type: "Dine in", Date: "2024-08-25", Total: 850, Status: "Completed" },
    { Customer_fk_ID: 1, Order_ID: "ORD002", Order_Number: "12346", Type: "Takeaway", Date: "2024-08-20", Total: 1200, Status: "Completed" },
    { Customer_fk_ID: 2, Order_ID: "ORD007", Order_Number: "12351", Type: "Delivery", Date: "2024-08-22", Total: 650, Status: "Pending" },
    { Customer_fk_ID: 3, Order_ID: "ORD008", Order_Number: "12352", Type: "Dine in", Date: "2024-08-18", Total: 1100, Status: "Completed" },
    { Customer_fk_ID: 12, Order_ID: "ORD009", Order_Number: "12353", Type: "Takeaway", Date: "2024-08-15", Total: 750, Status: "Completed" },
    { Customer_fk_ID: 12, Order_ID: "ORD010", Order_Number: "12354", Type: "Delivery", Date: "2024-08-10", Total: 950, Status: "Completed" },
  ];

  static async getAnalyticsData(): Promise<ApiResponse<AnalyticsData>> {
    await this.delay(800);
    
    const totalRevenue = this.mockOrders.reduce((sum, order) => sum + order.Total, 0);
    const completedOrders = this.mockOrders.filter(order => order.Status === "Completed");
    const avgRating = this.mockCustomers.reduce((sum, customer) => sum + customer.Feedback_Rating, 0) / this.mockCustomers.length;
    const repeatCustomers = this.mockCustomers.filter(customer => customer.Total_Orders > 1).length;
    
    return {
      success: true,
      data: {
        totalCustomers: this.mockCustomers.length,
        newCustomersThisMonth: 2,
        totalRevenue: totalRevenue,
        monthlyRevenue: 4500,
        totalOrders: this.mockOrders.length,
        averageOrderValue: Math.round(totalRevenue / completedOrders.length),
        customerSatisfaction: Math.round(avgRating * 10) / 10,
        repeatCustomers: repeatCustomers
      }
    };
  }

  static async getCustomers(): Promise<ApiResponse<CustomerItem[]>> {
    await this.delay(600);
    return {
      success: true,
      data: this.mockCustomers
    };
  }

  static async getOrders(): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(600);
    return {
      success: true,
      data: this.mockOrders
    };
  }
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue",
  subtitle,
  trend
}: { 
  title: string; 
  value: string | number; 
  icon: React.ComponentType<any>; 
  color?: "blue" | "green" | "yellow" | "purple" | "red";
  subtitle?: string;
  trend?: string;
}) => {
  const colorClasses = {
    blue: "text-blue-500",
    green: "text-green-500", 
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    red: "text-red-500"
  };

  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Icon size={24} className={colorClasses[color]} />
        {trend && (
          <span className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
};

// Revenue Trends Chart Component
const RevenueTrendsChart = () => {
  const revenueData = [
    { month: 'Jan', revenue: 4200, orders: 42 },
    { month: 'Feb', revenue: 3800, orders: 38 },
    { month: 'Mar', revenue: 5100, orders: 51 },
    { month: 'Apr', revenue: 4800, orders: 48 },
    { month: 'May', revenue: 6200, orders: 62 },
    { month: 'Jun', revenue: 5500, orders: 55 },
    { month: 'Jul', revenue: 7200, orders: 72 },
    { month: 'Aug', revenue: 6800, orders: 68 },
  ];

  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Revenue Trends</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
              formatter={(value, name) => [
                `PKR ${value.toLocaleString()}`,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Customer Growth Chart Component
const CustomerGrowthChart = () => {
  const growthData = [
    { month: 'Jan', newCustomers: 12, totalCustomers: 145 },
    { month: 'Feb', newCustomers: 15, totalCustomers: 160 },
    { month: 'Mar', newCustomers: 22, totalCustomers: 182 },
    { month: 'Apr', newCustomers: 18, totalCustomers: 200 },
    { month: 'May', newCustomers: 25, totalCustomers: 225 },
    { month: 'Jun', newCustomers: 20, totalCustomers: 245 },
    { month: 'Jul', newCustomers: 28, totalCustomers: 273 },
    { month: 'Aug', newCustomers: 32, totalCustomers: 305 },
  ];

  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Customer Growth</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="newCustomers" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="New Customers"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="totalCustomers" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              name="Total Customers"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Order Types Distribution Chart
const OrderTypesChart = () => {
  const orderTypesData = [
    { name: 'Dine In', value: 45, color: '#f59e0b' },
    { name: 'Takeaway', value: 35, color: '#10b981' },
    { name: 'Delivery', value: 20, color: '#3b82f6' }
  ];

  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Order Types Distribution</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderTypesData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {orderTypesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Percentage']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Monthly Comparison Chart
const MonthlyComparisonChart = () => {
  const comparisonData = [
    { metric: 'Revenue', thisMonth: 6800, lastMonth: 7200 },
    { metric: 'Orders', thisMonth: 68, lastMonth: 72 },
    { metric: 'Customers', thisMonth: 32, lastMonth: 28 },
    { metric: 'Avg Order', thisMonth: 100, lastMonth: 100 },
  ];

  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Monthly Comparison</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="metric" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
            />
            <Legend />
            <Bar dataKey="thisMonth" fill="#10b981" name="This Month" radius={[2, 2, 0, 0]} />
            <Bar dataKey="lastMonth" fill="#6b7280" name="Last Month" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Customer Segments Chart
const CustomerSegmentsChart = () => {
  const segmentData = [
    { segment: 'New', customers: 45 },
    { segment: 'Regular', customers: 120 },
    { segment: 'VIP', customers: 35 },
    { segment: 'Inactive', customers: 25 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Customer Segments</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segmentData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="customers"
              label={({ segment, customers }) => `${segment}: ${customers}`}
              labelLine={false}
            >
              {segmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value}`, 'Customers']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                `${entry.payload.segment}: ${entry.payload.customers}`
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("This Month");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsResponse, customersResponse, ordersResponse] = await Promise.all([
        AnalyticsAPI.getAnalyticsData(),
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
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    router.push('/');
  };

  // Filter orders for recent activity
  const filteredOrders = useMemo(() => {
    let filtered = orders;

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

    return filtered.slice(0, 10); // Show only recent 10 orders
  }, [orders, searchTerm, statusFilter]);

  // Top customers by orders
  const topCustomers = useMemo(() => {
    return customers
      .sort((a, b) => b.Total_Orders - a.Total_Orders)
      .slice(0, 5);
  }, [customers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">{error || "Failed to load analytics data"}</p>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Customer Analytics • Customer Reports • Financial Reports</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="px-4 py-2 border border-gray-300 rounded-sm bg-white flex items-center gap-2 hover:bg-gray-50 focus:outline-none">
              <Calendar size={16} />
              {timeFilter}
              <ChevronDown size={14} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="min-w-[180px] rounded-md bg-white shadow-md border p-1 outline-none" sideOffset={6}>
                {["Today", "This Week", "This Month", "This Quarter", "This Year"].map((period) => (
                  <DropdownMenu.Item 
                    key={period}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                    onClick={() => setTimeFilter(period)}
                  >
                    {period}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Customers"
          value={analyticsData.totalCustomers}
          icon={Users}
          color="blue"
          trend="+12%"
          subtitle="Active customers"
        />
        <MetricCard
          title="Total Revenue"
          value={`PKR ${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend="+8.5%"
          subtitle="All time revenue"
        />
        <MetricCard
          title="Total Orders"
          value={analyticsData.totalOrders}
          icon={ShoppingCart}
          color="purple"
          trend="+15%"
          subtitle="All orders placed"
        />
        <MetricCard
          title="Avg Order Value"
          value={`PKR ${analyticsData.averageOrderValue}`}
          icon={TrendingUp}
          color="yellow"
          trend="+3.2%"
          subtitle="Per order average"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="New Customers"
          value={analyticsData.newCustomersThisMonth}
          icon={Users}
          color="blue"
          subtitle="This month"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`PKR ${analyticsData.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          subtitle="Current month"
        />
        <MetricCard
          title="Repeat Customers"
          value={analyticsData.repeatCustomers}
          icon={Users}
          color="purple"
          subtitle="Returning customers"
        />
        <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Star size={24} className="text-yellow-500" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold">{analyticsData.customerSatisfaction}</p>
            <p className="text-sm text-gray-500">Customer Satisfaction</p>
            <StarRating rating={Math.floor(analyticsData.customerSatisfaction)} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueTrendsChart />
        <CustomerGrowthChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <OrderTypesChart />
        <MonthlyComparisonChart />
        <CustomerSegmentsChart />
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-sm border border-gray-300 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold">Top Customers</h3>
            <p className="text-sm text-gray-500 mt-1">By total orders</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.Customer_ID} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#2c2c2c] rounded-full flex items-center justify-center text-white text-sm">
                      {customer.Name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{customer.Name}</p>
                      <p className="text-sm text-gray-500">{customer.Email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{customer.Total_Orders} orders</p>
                    <StarRating rating={customer.Feedback_Rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-sm border border-gray-300 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Recent Orders</h3>
                <p className="text-sm text-gray-500 mt-1">Latest order activity</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48 pr-8 pl-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.slice(0, 8).map((order) => (
                  <tr key={order.Order_ID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{order.Order_ID}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.Type === "Dine in" ? "text-yellow-600 bg-yellow-100" : 
                        order.Type === "Takeaway" ? "text-green-600 bg-green-100" : 
                        "text-blue-600 bg-blue-100"
                      }`}>
                        {order.Type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">PKR {order.Total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.Status === "Completed" ? "text-green-600 bg-green-100" :
                        order.Status === "Pending" ? "text-blue-600 bg-blue-100" :
                        "text-red-600 bg-red-100"
                      }`}>
                        {order.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
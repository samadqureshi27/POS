"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, Heart, Target, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatTickValue } from "@/lib/util/formatters";

interface PremiumCustomerAnalyticsProps {
  analyticsData: any;
  selectedPeriod: string;
}

// Simplified trend data
const customerGrowthData = [
  { month: 'Jan', customers: 1180, revenue: 340000 },
  { month: 'Feb', customers: 1245, revenue: 365000 },
  { month: 'Mar', customers: 1290, revenue: 385000 },
  { month: 'Apr', customers: 1350, revenue: 410000 },
  { month: 'May', customers: 1425, revenue: 450000 },
  { month: 'Jun', customers: 1510, revenue: 485000 },
];

const customerSegmentData = [
  { name: 'Premium', value: 35, color: '#8b5cf6', customers: 385 },
  { name: 'Regular', value: 45, color: '#06b6d4', customers: 495 },
  { name: 'Occasional', value: 20, color: '#10b981', customers: 220 },
];

const PremiumCustomerAnalytics: React.FC<PremiumCustomerAnalyticsProps> = ({ analyticsData, selectedPeriod }) => {
  const metrics = [
    {
      title: "Total Customers",
      value: "1,510",
      change: "+12.8%",
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Customer LTV",
      value: "PKR 2,450",
      change: "+8.5%",
      trend: "up",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Retention Rate",
      value: "78.5%",
      change: "+3.2%",
      trend: "up",
      icon: Heart,
      color: "rose"
    },
    {
      title: "Acquisition Cost",
      value: "PKR 125",
      change: "-15.3%",
      trend: "down",
      icon: Target,
      color: "purple"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const isPositive = metric.trend === "up";

          return (
            <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white border-slate-200 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className={`w-12 h-12 rounded-sm bg-${metric.color}-100 flex items-center justify-center`}>
                      <IconComponent size={24} className={`text-${metric.color}-600`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {isPositive ? (
                      <ArrowUpRight size={16} className="text-green-600" />
                    ) : (
                      <ArrowDownRight size={16} className="text-green-600" />
                    )}
                    <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-green-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* Subtle gradient overlay */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-${metric.color}-500/5 to-transparent rounded-full -translate-y-12 translate-x-12`} />
            </Card>
          );
        })}
      </div>

      {/* Customer Growth & Segmentation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Customer Growth Chart */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50/30 border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <div className="p-2 rounded-sm bg-blue-100">
                    <TrendingUp size={18} className="text-blue-600" />
                  </div>
                  Customer Growth Trend
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">Customer acquisition & revenue correlation</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                6 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={customerGrowthData}>
                  <defs>
                    <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      fontSize: "12px"
                    }}
                    formatter={(value: any, name: string) => [
                      name === 'customers' ? `${value} customers` : `PKR ${formatTickValue(value)}`,
                      name === 'customers' ? 'Customers' : 'Revenue'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#customerGradient)"
                    strokeLinecap="round"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Growth Summary */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
              <div className="text-center">
                <p className="text-sm text-slate-600">Monthly Growth</p>
                <p className="text-lg font-bold text-green-600">+12.8%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600">Revenue/Customer</p>
                <p className="text-lg font-bold text-slate-900">PKR 321</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segmentation */}
        <Card className="bg-gradient-to-br from-white to-purple-50/30 border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Customer Segments</CardTitle>
            <p className="text-sm text-slate-600">Revenue distribution by customer type</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[180px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {customerSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                    formatter={(value: any) => [`${value}%`, "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Segment Details */}
            <div className="space-y-3">
              {customerSegmentData.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="text-sm font-medium text-slate-700">{segment.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{segment.customers}</p>
                    <p className="text-xs text-slate-500">{segment.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Insights */}
      <Card className="bg-gradient-to-r from-slate-50 to-green-50/50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Revenue Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700">Average Order Value</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Premium Customers</span>
                  <span className="font-semibold text-green-600">PKR 685</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Regular Customers</span>
                  <span className="font-semibold">PKR 425</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Occasional</span>
                  <span className="font-semibold">PKR 285</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700">Visit Frequency</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Daily Visitors</span>
                  <span className="font-semibold">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Weekly Visitors</span>
                  <span className="font-semibold">42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Monthly Visitors</span>
                  <span className="font-semibold">30%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700">Key Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Customer Satisfaction</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">4.6</span>
                    <span className="text-xs text-slate-500">/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">NPS Score</span>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">+52</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Churn Rate</span>
                  <span className="font-semibold text-green-600">8.2%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumCustomerAnalytics;
"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Users, TrendingUp, Heart, Target, DollarSign, Sparkles } from "lucide-react";

interface CustomerAnalyticsProps {
  analyticsData: any;
  selectedPeriod: string;
}

// Mock trend data
const customerTrendData = [
  { month: 'Aug', total: 1205, new: 128, returning: 1077 },
  { month: 'Sep', total: 1247, new: 142, returning: 1105 },
  { month: 'Oct', total: 1289, new: 156, returning: 1133 },
  { month: 'Nov', total: 1347, new: 168, returning: 1179 },
  { month: 'Dec', total: 1425, new: 189, returning: 1236 },
];

const retentionData = [
  { period: 'Week 1', rate: 92 },
  { period: 'Week 2', rate: 78 },
  { period: 'Month 1', rate: 68 },
  { period: 'Month 3', rate: 45 },
  { period: 'Month 6', rate: 32 },
];

const ModernCustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({ analyticsData, selectedPeriod }) => {
  const customerMetrics = [
    {
      icon: Users,
      title: "Active Customers",
      value: analyticsData?.totalCustomers || "1,425",
      change: "+12.8%",
      positive: true,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      icon: Sparkles,
      title: "New Customers",
      value: analyticsData?.newCustomersThisMonth || "189",
      change: "+33.1%",
      positive: true,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      icon: Heart,
      title: "Retention Rate",
      value: "68.5%",
      change: "+2.4%",
      positive: true,
      color: "bg-rose-500",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700"
    },
    {
      icon: Target,
      title: "LTV:CAC Ratio",
      value: "19.6:1",
      change: "Strong",
      positive: true,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Customer Metrics Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 gap-4">
        {customerMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className={`w-10 h-10 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                      <IconComponent size={20} className={metric.textColor} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`${metric.positive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'} text-xs`}>
                    {metric.change}
                  </Badge>
                </div>
              </CardContent>

              {/* Decorative gradient */}
              <div className={`absolute top-0 right-0 w-16 h-16 ${metric.color} opacity-10 rounded-full -translate-y-8 translate-x-8`} />
            </Card>
          );
        })}
      </div>

      {/* Customer Growth Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
            Growth Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[120px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerTrendData}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#totalGradient)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                  formatter={(value: any) => [`${value} customers`, "Total"]}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">This month</span>
              <span className="font-semibold">1,425 customers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Growth rate</span>
              <span className="font-semibold text-green-600">+12.8%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simplified Analytics */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Customer Insights</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Retention Chart */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Retention Rates</h4>
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={retentionData} layout="horizontal">
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="period" type="category" width={60} tick={{ fontSize: 10 }} />
                      <Bar dataKey="rate" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px"
                        }}
                        formatter={(value: any) => [`${value}%`, "Retention"]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Key Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Order Value</span>
                    <span className="font-semibold">PKR 485</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">4.2</span>
                      <span className="text-xs text-muted-foreground">/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">NPS Score</span>
                    <Badge variant="outline" className="text-xs">+45</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Acquisition Cost</span>
                    <span className="font-semibold">PKR 125</span>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Revenue Sources</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>New Customers</span>
                      <span className="font-semibold">32%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '32%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Returning Customers</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Revenue</span>
                      <span className="font-bold text-lg">PKR 485K</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernCustomerAnalytics;
// components/CustomerAnalytics.tsx

import React from "react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { VisitData } from "@/lib/types/Dtypes";
import { Separator } from "@/components/ui/separator";

interface CustomerAnalyticsProps {
  visitData: VisitData[];
  getPeriodLabel: () => string;
}

export const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
  visitData,
  getPeriodLabel
}) => (
  <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm mb-6 sm:mb-8">
    <div className="w-full">
      <h2 className="text-lg font-semibold tracking-tight text-muted-foreground">
        {getPeriodLabel()}
      </h2>
      <Separator className="mt-4" />
    </div>

    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main metrics and chart area */}
      <div className="flex-1 min-w-0 w-[100%]">
        {/* Top metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <div className="flex items-center text-green-500">
                <span className="text-sm font-medium">+1,023</span>
                <TrendingUp size={12} className="ml-1" />
              </div>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">1,731</h3>
            <Separator className="md:hidden mt-4" />
            <Separator orientation="vertical" className="hidden md:block absolute right-0 top-0 h-full" />
          </div>

          <div className="p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Expense</p>
              <div className="flex items-center text-green-500">
                <span className="text-sm font-medium">+125</span>
                <TrendingUp size={12} className="ml-1" />
              </div>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">258</h3>
            <Separator className="md:hidden mt-4" />
            <Separator orientation="vertical" className="hidden md:block absolute right-0 top-0 h-full" />
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <div className="flex items-center text-green-500">
                <span className="text-sm font-medium">+95</span>
                <TrendingUp size={12} className="ml-1" />
              </div>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">98</h3>
            <Separator className="md:hidden mt-4" />
          </div>
        </div>

        {/* Chart */}
        <div className="w-[100%] min-w-0">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={visitData}
              margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="referralsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="repeatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="newMembersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6B7280" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6B7280" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                height={30}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="repeat"
                stackId="a"
                fill="url(#repeatGradient)"
                stroke="#1D4ED8"
                strokeWidth={1}
                name="Repeat Customers"
              />
              <Area
                type="monotone"
                dataKey="visits"
                stackId="a"
                fill="url(#newMembersGradient)"
                stroke="#6B7280"
                strokeWidth={1}
                name="New Members"
              />
              <Area
                type="monotone"
                dataKey="referrals"
                stackId="a"
                fill="url(#referralsGradient)"
                stroke="#22c55e"
                strokeWidth={1}
                name="Referrals"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right side stats cards */}
      <div className="lg:w-80 flex-shrink-0 relative">
        <Separator orientation="vertical" className="hidden lg:block absolute left-0 top-0 h-full" />
        <div className="lg:pl-6 space-y-6">
          <div className="p-4">
            <Separator className="lg:hidden mb-4" />
            <div className="flex items-center justify-between mb-3">
              <div className="text-4xl pb-8 font-bold tracking-tight">258</div>
              <TrendingUp size={14} className="text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-muted-foreground">Total Revenue</span>
              </div>
              <div className="text-green-500 text-sm font-medium">+125</div>
            </div>
          </div>

          <Separator />

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-4xl pb-8 font-bold tracking-tight">369</div>
              <TrendingDown size={14} className="text-red-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                <span className="text-sm text-muted-foreground">Total Expense</span>
              </div>
              <div className="text-red-500 text-sm font-medium">-5</div>
            </div>
          </div>

          <Separator />

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-4xl pb-8 font-bold tracking-tight">20</div>
              <TrendingUp size={14} className="text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-muted-foreground">Total Orders</span>
              </div>
              <div className="text-green-500 text-sm font-medium">+19</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
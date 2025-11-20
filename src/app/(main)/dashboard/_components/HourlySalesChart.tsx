"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { formatCurrency, formatDecimal } from "@/lib/util/formatters";

// Sample data that would come from your POS system
const hourlySalesData = [
  { hour: "8AM", orders: 5, revenue: 850, avgTime: 2.8 },
  { hour: "9AM", orders: 12, revenue: 2100, avgTime: 3.1 },
  { hour: "10AM", orders: 18, revenue: 3200, avgTime: 3.4 },
  { hour: "11AM", orders: 23, revenue: 4150, avgTime: 4.2 },
  { hour: "12PM", orders: 31, revenue: 5500, avgTime: 5.1 },
  { hour: "1PM", orders: 28, revenue: 4900, avgTime: 4.8 },
  { hour: "2PM", orders: 22, revenue: 3800, avgTime: 3.9 },
  { hour: "3PM", orders: 19, revenue: 3100, avgTime: 3.2 },
  { hour: "4PM", orders: 25, revenue: 4200, avgTime: 3.8 },
  { hour: "5PM", orders: 29, revenue: 5100, avgTime: 4.5 },
  { hour: "6PM", orders: 24, revenue: 4300, avgTime: 4.1 },
  { hour: "7PM", orders: 16, revenue: 2800, avgTime: 3.5 },
  { hour: "8PM", orders: 8, revenue: 1400, avgTime: 2.9 }
];

export const HourlySalesChart: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Hourly Sales Pattern</h3>
          <p className="text-sm text-gray-600">Today's order flow & peak hours</p>
        </div>
        <div className="text-xs text-gray-500">
          Peak: {hourlySalesData.reduce((max, current) => current.orders > max.orders ? current : max).hour}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlySalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              formatter={(value, name) => [
                name === "orders" ? `${value} orders` :
                name === "revenue" ? `PKR ${formatCurrency(Number(value))}` :
                `${value} min`,
                name === "orders" ? "Orders" :
                name === "revenue" ? "Revenue" : "Avg Time"
              ]}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#orderGradient)"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {hourlySalesData.reduce((sum, hour) => sum + hour.orders, 0)}
          </div>
          <div className="text-xs text-gray-600">Total Orders</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            PKR {formatCurrency(hourlySalesData.reduce((sum, hour) => sum + hour.revenue, 0))}
          </div>
          <div className="text-xs text-gray-600">Total Revenue</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-600">
            {formatDecimal(hourlySalesData.reduce((sum, hour) => sum + hour.avgTime, 0) / hourlySalesData.length)}
          </div>
          <div className="text-xs text-gray-600">Avg Time (min)</div>
        </div>
      </div>
    </div>
  );
};
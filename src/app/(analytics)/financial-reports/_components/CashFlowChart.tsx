"use client";
import React from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { formatTickValue, formatCompactNumber } from "@/lib/util/formatters";

// Sample cash flow data
const cashFlowData = [
  { month: "Jul", operating: 85200, investing: -15000, financing: 5000, netCashFlow: 75200, cumulativeCash: 125200 },
  { month: "Aug", operating: 89300, investing: -8000, financing: 0, netCashFlow: 81300, cumulativeCash: 206500 },
  { month: "Sep", operating: 87100, investing: -12000, financing: -10000, netCashFlow: 65100, cumulativeCash: 271600 },
  { month: "Oct", operating: 92800, investing: -5000, financing: 0, netCashFlow: 87800, cumulativeCash: 359400 },
  { month: "Nov", operating: 95600, investing: -18000, financing: 0, netCashFlow: 77600, cumulativeCash: 437000 },
  { month: "Dec", operating: 97200, investing: -22000, financing: 15000, netCashFlow: 90200, cumulativeCash: 527200 }
];

export const CashFlowChart: React.FC = () => {
  const totalCashFlow = cashFlowData.reduce((sum, month) => sum + month.netCashFlow, 0);
  const avgMonthlyFlow = totalCashFlow / cashFlowData.length;
  const currentCash = cashFlowData[cashFlowData.length - 1].cumulativeCash;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Cash Flow Analysis</h3>
          <p className="text-sm text-gray-600">Operating, investing & financing activities</p>
        </div>
        <div className="text-xs text-gray-500">6-month trend</div>
      </div>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <DollarSign size={24} className="text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">
                PKR {formatTickValue(currentCash)}
              </div>
              <div className="text-xs text-green-600">Current Cash Position</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-700">
                PKR {formatTickValue(avgMonthlyFlow)}
              </div>
              <div className="text-xs text-blue-600">Avg Monthly Flow</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-violet-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-700">
                PKR {formatTickValue(totalCashFlow)}
              </div>
              <div className="text-xs text-purple-600">6-Month Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="operatingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              yAxisId="flow"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(value) => formatTickValue(value)}
            />
            <YAxis
              yAxisId="cumulative"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#8b5cf6" }}
              tickFormatter={(value) => formatTickValue(value)}
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
              formatter={(value: any, name: string) => [
                `PKR ${formatCompactNumber(value)}`,
                name === "operating" ? "Operating CF" :
                name === "investing" ? "Investing CF" :
                name === "financing" ? "Financing CF" :
                name === "netCashFlow" ? "Net Cash Flow" : "Cumulative Cash"
              ]}
            />
            <Legend />

            {/* Cash flow lines */}
            <Line
              yAxisId="flow"
              type="monotone"
              dataKey="operating"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              name="Operating CF"
            />
            <Line
              yAxisId="flow"
              type="monotone"
              dataKey="investing"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
              name="Investing CF"
            />
            <Line
              yAxisId="flow"
              type="monotone"
              dataKey="financing"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
              name="Financing CF"
            />
            <Line
              yAxisId="cumulative"
              type="monotone"
              dataKey="cumulativeCash"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              name="Cumulative Cash"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-gray-600">Strong operating cash flow growth (+14.1%)</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-purple-500" />
            <span className="text-gray-600">Healthy cash reserves for expansion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
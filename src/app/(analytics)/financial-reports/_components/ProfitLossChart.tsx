"use client";
import React from "react";
import { ComposedChart, Area, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { formatTickValue, formatCompactNumber } from "@/lib/util/formatters";

// Sample P&L data that would come from your financial system
const profitLossData = [
  { month: "Jul", revenue: 420000, cogs: 142800, labor: 119700, opex: 85200, netProfit: 72300 },
  { month: "Aug", revenue: 445000, cogs: 151300, labor: 126850, opex: 89000, netProfit: 77850 },
  { month: "Sep", revenue: 438000, cogs: 148920, labor: 124740, opex: 87600, netProfit: 76740 },
  { month: "Oct", revenue: 465000, cogs: 158100, labor: 132450, opex: 93000, netProfit: 81450 },
  { month: "Nov", revenue: 478000, cogs: 162520, labor: 136190, opex: 95600, netProfit: 83690 },
  { month: "Dec", revenue: 485000, cogs: 164900, labor: 138150, opex: 97000, netProfit: 84950 }
];

export const ProfitLossChart: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Profit & Loss Trend</h3>
          <p className="text-sm text-gray-600">6-month financial performance breakdown</p>
        </div>
        <div className="text-xs text-gray-500">July - December 2024</div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={profitLossData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
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
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
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
                name === "revenue" ? "Revenue" :
                name === "cogs" ? "COGS" :
                name === "labor" ? "Labor" :
                name === "opex" ? "OpEx" : "Net Profit"
              ]}
            />
            <Legend />

            {/* Revenue as area chart */}
            <Area
              type="monotone"
              dataKey="revenue"
              fill="url(#revenueGradient)"
              stroke="#10b981"
              strokeWidth={2}
              name="Revenue"
            />

            {/* Costs as bars */}
            <Bar dataKey="cogs" stackId="costs" fill="#3b82f6" name="COGS" />
            <Bar dataKey="labor" stackId="costs" fill="#f59e0b" name="Labor" />
            <Bar dataKey="opex" stackId="costs" fill="#ef4444" name="OpEx" />

            {/* Net profit as area */}
            <Area
              type="monotone"
              dataKey="netProfit"
              fill="url(#profitGradient)"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Net Profit"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-700">
            PKR {formatTickValue(profitLossData[profitLossData.length - 1].revenue)}
          </div>
          <div className="text-xs text-green-600">Current Revenue</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-700">34.2%</div>
          <div className="text-xs text-blue-600">COGS Ratio</div>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <div className="text-lg font-bold text-amber-700">28.5%</div>
          <div className="text-xs text-amber-600">Labor Ratio</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-700">17.5%</div>
          <div className="text-xs text-purple-600">Net Margin</div>
        </div>
      </div>
    </div>
  );
};
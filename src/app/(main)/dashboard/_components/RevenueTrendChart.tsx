// components/RevenueTrendChart.tsx

import React from "react";
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { RevenueData } from "@/lib/types/Dtypes";
import { getDayAbbreviation } from "@/lib/util/Dashboardutils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface RevenueTrendChartProps {
  revenueData: RevenueData[];
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ revenueData }) => (
  <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm lg:col-span-2">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
      <h2 className="text-lg font-semibold tracking-tight">Revenue trend</h2>
    </div>

    <div className="h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={revenueData}
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            interval={0}
            angle={0}
            textAnchor="middle"
            height={60}
            padding={{ left: 20, right: 20 }}
            tickFormatter={getDayAbbreviation}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#301bcbff"
            strokeWidth={2}
            dot={{ fill: "#3c1ae4ff", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#8783dfff" }}
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-in-out"
            animationBegin={0}
            strokeDasharray="0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #175be2ff",
              borderRadius: "8px",
              padding: "8px",
              fontSize: "12px",
            }}
            labelFormatter={(label, payload) => {
              const dataPoint = revenueData.find((d) => d.day === label);
              return `${dataPoint?.day} (${dataPoint?.date})`;
            }}
            formatter={(value, name, props) => [
              `${value}`,
              "Revenue",
              `${props.payload?.orders || 0} orders`,
            ]}
            cursor={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);
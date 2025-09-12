// components/BestSellingItemsChart.tsx

import React from "react";
import { BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Bar, CartesianGrid } from "recharts";
import { BestSellingItem } from "@/lib/types/Dtypes";
import { formatTickValue } from "@/lib/util/Dashboradutils";

interface BestSellingItemsChartProps {
  bestSellingItems: BestSellingItem[];
  selectedPeriod: string;
}

export const BestSellingItemsChart: React.FC<BestSellingItemsChartProps> = ({
  bestSellingItems,
  selectedPeriod,
}) => (
  <div className="bg-white p-4 sm:p-6 rounded-sm shadow-sm border border-gray-200">
    <h2 className="text-lg font-semibold text-gray-900 mb-6">Best selling items</h2>

    {bestSellingItems.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        No data available for {selectedPeriod}
      </div>
    ) : (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bestSellingItems.map((item, index) => {
              const blueShades = [
                "#dbeafe",
                "#93c5fd",
                "#60a5fa",
                "#3b82f6",
                "#2563eb",
                "#1d4ed8",
              ];
              return {
                product: item.product,
                revenue: parseFloat(item.revenue.replace(/[$,]/g, "")),
                sales: parseInt(item.sales.toString().replace(/[,]/g, "")),
                fill: blueShades[index % blueShades.length],
              };
            })}
            layout="vertical"
            margin={{
              left: 0,
              right: 20,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={formatTickValue}
            />
            <YAxis
              dataKey="product"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#374151" }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px",
                fontSize: "12px",
              }}
              formatter={(value, name) => [
                name === "Ordered"
                  ? `${value.toLocaleString()}`
                  : value.toLocaleString(),
                name === "revenue" ? "Ordered" : "Sales",
              ]}
            />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);
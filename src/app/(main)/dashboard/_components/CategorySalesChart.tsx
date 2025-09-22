"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Sample data that would come from your POS system
const categorySalesData = [
  { name: "Coffee", value: 42, revenue: 18500, color: "#8b5cf6" },
  { name: "Matcha & Tea", value: 28, revenue: 12200, color: "#10b981" },
  { name: "Food & Pastries", value: 15, revenue: 6800, color: "#f59e0b" },
  { name: "Add-ons", value: 10, revenue: 3200, color: "#ef4444" },
  { name: "Retail Items", value: 5, revenue: 1800, color: "#6b7280" }
];

export const CategorySalesChart: React.FC = () => {
  const totalRevenue = categorySalesData.reduce((sum, item) => sum + item.revenue, 0);

  const renderCustomLabel = (entry: any) => {
    return `${entry.value}%`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
          <p className="text-sm text-gray-600">Today's category breakdown</p>
        </div>
        <div className="text-xs text-gray-500">
          Top: {categorySalesData[0].name} ({categorySalesData[0].value}%)
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categorySalesData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categorySalesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              formatter={(value: any, name: string, props: any) => [
                `${value}% (PKR ${props.payload.revenue.toLocaleString()})`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {categorySalesData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-medium">{item.value}%</span>
              <span className="text-gray-600">PKR {item.revenue.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Revenue</span>
          <span className="text-lg font-bold text-gray-900">PKR {totalRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
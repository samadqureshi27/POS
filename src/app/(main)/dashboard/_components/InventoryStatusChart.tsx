"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

// Sample data that would come from your inventory system
const inventoryData = [
  { item: "Coffee Beans", current: 85, minimum: 20, maximum: 100, status: "good", unit: "kg" },
  { item: "Milk", current: 45, minimum: 30, maximum: 60, status: "good", unit: "L" },
  { item: "Matcha Powder", current: 15, minimum: 10, maximum: 25, status: "low", unit: "kg" },
  { item: "Sugar", current: 8, minimum: 15, maximum: 30, status: "critical", unit: "kg" },
  { item: "Oat Milk", current: 22, minimum: 15, maximum: 30, status: "good", unit: "L" },
  { item: "Croissants", current: 12, minimum: 20, maximum: 40, status: "low", unit: "pcs" }
];

export const InventoryStatusChart: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "#ef4444";
      case "low": return "#f59e0b";
      case "good": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <AlertTriangle size={16} className="text-red-500" />;
      case "low": return <Clock size={16} className="text-amber-500" />;
      case "good": return <CheckCircle size={16} className="text-green-500" />;
      default: return null;
    }
  };

  const criticalItems = inventoryData.filter(item => item.status === "critical").length;
  const lowItems = inventoryData.filter(item => item.status === "low").length;
  const goodItems = inventoryData.filter(item => item.status === "good").length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
          <p className="text-sm text-gray-600">Real-time stock levels</p>
        </div>
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <div>
              <div className="text-2xl font-bold text-red-700">{criticalItems}</div>
              <div className="text-xs text-red-600">Critical</div>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <div>
              <div className="text-2xl font-bold text-amber-700">{lowItems}</div>
              <div className="text-xs text-amber-600">Low Stock</div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-700">{goodItems}</div>
              <div className="text-xs text-green-600">Good Stock</div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={inventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="item"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              angle={-45}
              textAnchor="end"
              height={60}
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
              formatter={(value: any, name: string, props: any) => [
                `${value} ${props.payload.unit}`,
                "Current Stock"
              ]}
              labelFormatter={(label: string, payload: any) => {
                if (payload && payload[0]) {
                  const item = payload[0].payload;
                  return `${label} (Min: ${item.minimum} ${item.unit})`;
                }
                return label;
              }}
            />
            <Bar
              dataKey="current"
              radius={[4, 4, 0, 0]}
            >
              {inventoryData.map((entry, index) => (
                <Bar key={`bar-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed List */}
      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Stock Details</h4>
        {inventoryData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(item.status)}
              <span className="text-sm font-medium text-gray-700">{item.item}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">
                {item.current}/{item.maximum} {item.unit}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === "critical" ? "bg-red-100 text-red-700" :
                item.status === "low" ? "bg-amber-100 text-amber-700" :
                "bg-green-100 text-green-700"
              }`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, Coffee, Utensils } from "lucide-react";

interface OrderTypeData {
  name: string;
  value: number;
  fill: string;
  icon?: string;
  percentage?: number;
}

interface ModernOrderChartProps {
  data: OrderTypeData[];
  loading: boolean;
}

const COLORS = [
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#6366f1', // Indigo
];

const getIcon = (name: string) => {
  const iconName = name.toLowerCase();
  if (iconName.includes('coffee') || iconName.includes('espresso')) return Coffee;
  if (iconName.includes('food') || iconName.includes('pastry')) return Utensils;
  return Package;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.fill }}
          />
          <span className="text-sm font-medium">{data.name}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {data.value} orders ({data.percentage?.toFixed(1)}%)
        </div>
      </div>
    );
  }
  return null;
};

const ModernOrderChart: React.FC<ModernOrderChartProps> = ({ data, loading }) => {
  // Calculate percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentages = data.map((item, index) => ({
    ...item,
    fill: item.fill || COLORS[index % COLORS.length],
    percentage: (item.value / total) * 100
  }));

  const topOrder = dataWithPercentages[0];

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp size={16} className="text-primary" />
            </div>
            Order Distribution
          </CardTitle>
          {topOrder && (
            <Badge variant="secondary" className="text-xs">
              #{1} {topOrder.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[240px]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="text-sm text-muted-foreground">Loading chart...</span>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataWithPercentages}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {dataWithPercentages.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Modern Legend */}
            <div className="space-y-2">
              {dataWithPercentages.slice(0, 4).map((item, index) => {
                const IconComponent = getIcon(item.name);
                return (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <IconComponent size={14} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.value}</span>
                      <Badge variant="outline" className="text-xs h-5">
                        {item.percentage?.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>

      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
    </Card>
  );
};

export default ModernOrderChart;
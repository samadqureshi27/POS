"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, RadialBarChart, RadialBar } from "recharts";
import { TrendingUp, Crown, Zap, Target, DollarSign, Activity } from "lucide-react";
import { formatTickValue, formatCompactNumber } from "@/lib/util/formatters";

interface FuturisticSalesVisualProps {
  revenueData: any[];
  bestSellingItems: any[];
  selectedPeriod: string;
}

// Mock hourly revenue data for today
const todayRevenueData = [
  { hour: '8', revenue: 2400, target: 2000, trend: 'up' },
  { hour: '9', revenue: 4200, target: 3500, trend: 'up' },
  { hour: '10', revenue: 6100, target: 5000, trend: 'up' },
  { hour: '11', revenue: 8900, target: 7500, trend: 'up' },
  { hour: '12', revenue: 12400, target: 10000, trend: 'up' },
  { hour: '13', revenue: 11800, target: 10000, trend: 'stable' },
  { hour: '14', revenue: 9600, target: 8000, trend: 'up' },
  { hour: '15', revenue: 7300, target: 6500, trend: 'up' },
  { hour: '16', revenue: 5800, target: 5000, trend: 'up' },
  { hour: '17', revenue: 4200, target: 4000, trend: 'up' },
];

const FuturisticSalesVisual: React.FC<FuturisticSalesVisualProps> = ({
  revenueData,
  bestSellingItems,
  selectedPeriod
}) => {
  const currentHour = new Date().getHours();
  const currentRevenue = todayRevenueData.find(d => parseInt(d.hour) === currentHour)?.revenue || 0;
  const projectedDaily = currentRevenue * (24 / Math.max(currentHour, 1));

  // Process best selling items with better visual data
  const topItems = (bestSellingItems || []).slice(0, 4).map((item, index) => ({
    ...item,
    percentage: Math.max(90 - (index * 15), 20),
    color: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][index],
    rank: index + 1
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Real-time Revenue Pulse */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border-none shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />

        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-2 rounded-sm bg-blue-500/10 backdrop-blur-sm">
              <Activity size={16} className="text-blue-600" />
            </div>
            Revenue Pulse
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 text-xs animate-pulse">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Current Hour</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PKR {formatCompactNumber(currentRevenue)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Projected Daily</p>
              <p className="text-2xl font-bold text-slate-700">
                PKR {formatTickValue(projectedDaily)}
              </p>
            </div>
          </div>

          {/* Mini Revenue Chart */}
          <div className="h-[120px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={todayRevenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#revenueGradient)"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  strokeLinecap="round"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#e2e8f0"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  fill="none"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px"
                  }}
                  formatter={(value: any, name: string) => [
                    `PKR ${formatCompactNumber(value)}`,
                    name === 'revenue' ? 'Actual' : 'Target'
                  ]}
                  labelFormatter={(label) => `${label}:00`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Indicators */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">Above target</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp size={14} />
              <span className="font-semibold">+18.3%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bestsellers Spotlight */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-amber-50 border-none shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />

        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-2 rounded-sm bg-amber-500/10 backdrop-blur-sm">
              <Crown size={16} className="text-amber-600" />
            </div>
            Bestsellers Spotlight
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div
                key={item.name || index}
                className="group flex items-center gap-4 p-3 rounded-sm hover:bg-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Rank Circle */}
                <div className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                  ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-slate-500' :
                    index === 2 ? 'bg-gradient-to-r from-amber-600 to-orange-500' :
                    'bg-gradient-to-r from-slate-400 to-gray-500'}
                  group-hover:scale-110 transition-transform duration-200
                `}>
                  #{item.rank}
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                  )}
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {item.name || `Item ${index + 1}`}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${item.percentage}%`,
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 min-w-[40px]">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Sales Count */}
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-700">
                    {item.sales || Math.floor(Math.random() * 50) + 10}
                  </p>
                  <p className="text-xs text-muted-foreground">sold</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-4 border-t border-slate-200/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-slate-700">8.7</p>
                <p className="text-xs text-muted-foreground">Avg items/order</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-700">PKR 485</p>
                <p className="text-xs text-muted-foreground">Avg order value</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-700">142</p>
                <p className="text-xs text-muted-foreground">Orders today</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FuturisticSalesVisual;
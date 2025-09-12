import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueChartData } from '@/lib/util/AnalyticsApi';

interface RevenueTrendsChartProps {
  selectedPeriod?: string;
}

export const RevenueTrendsChart: React.FC<RevenueTrendsChartProps> = ({ selectedPeriod }) => {
  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Revenue Trends</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueChartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
              formatter={(value, name) => [
                `PKR ${value.toLocaleString()}`,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
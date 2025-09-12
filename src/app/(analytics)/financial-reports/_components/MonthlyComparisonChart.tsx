import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { monthlyComparisonData } from '@/lib/util/AnalyticsApi';

interface MonthlyComparisonChartProps {
  selectedPeriod?: string;
}

export const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({ selectedPeriod }) => {
  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Monthly Comparison</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="metric" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
            />
            <Legend />
            <Bar dataKey="thisMonth" fill="#10b981" name="This Month" radius={[2, 2, 0, 0]} />
            <Bar dataKey="lastMonth" fill="#6b7280" name="Last Month" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { customerGrowthData } from '@/lib/util/AnalyticsApi';

interface CustomerGrowthChartProps {
  selectedPeriod?: string;
}

export const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({ selectedPeriod }) => {
  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Customer Growth</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={customerGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="newCustomers" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="New Customers"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="totalCustomers" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              name="Total Customers"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
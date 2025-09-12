import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { customerSegmentData, SEGMENT_COLORS } from '@/lib/util/AnalyticsApi';

interface CustomerSegmentsChartProps {
  selectedPeriod?: string;
}

export const CustomerSegmentsChart: React.FC<CustomerSegmentsChartProps> = ({ selectedPeriod }) => {
  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Customer Segments</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={customerSegmentData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="customers"
              label={({ segment, customers }) => `${segment}: ${customers}`}
              labelLine={false}
            >
              {customerSegmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[index]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value}`, 'Customers']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                `${entry.payload.segment}: ${entry.payload.customers}`
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
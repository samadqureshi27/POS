import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { orderTypesData } from '@/lib/util/AnalyticsApi';

interface OrderTypesChartProps {
  selectedPeriod?: string;
}

export const OrderTypesChart: React.FC<OrderTypesChartProps> = ({ selectedPeriod }) => {
  return (
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Order Types Distribution</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderTypesData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {orderTypesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Percentage']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px' 
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
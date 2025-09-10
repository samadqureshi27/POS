// components/OrderChart.tsx
import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { OrderItem } from '@/lib/types/customerProfile';

interface OrderChartProps {
    orders: OrderItem[];
}

export const OrderChart: React.FC<OrderChartProps> = ({ orders }) => {
    return (
        <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm h-[448px]">
            <h3 className="text-xl font-semibold mb-6">Order Spent</h3>
            <div className="h-[378px] bg-white rounded-sm p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={orders}
                        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Date" />
                        <YAxis />
                        <Tooltip
                            formatter={(value: number) => value.toLocaleString()}
                        />
                        <Bar dataKey="Total" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
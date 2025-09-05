// _components/OrderStats/OrderTypeChart.tsx
import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrderTypeData {
  name: string;
  value: number;
  fill: string;
}

interface OrderTypeChartProps {
  data: OrderTypeData[];
  loading: boolean;
}

const OrderTypeChart: React.FC<OrderTypeChartProps> = ({ data, loading }) => {
  return (
    <div className="w-full flex items-center justify-center overflow-hidden outline-none border-none">
      <div className="w-full max-h-[300px] outline-none border-none">
        <div className="flex items-center justify-center">
          <p className="text-2xl mb-1">Most Type of Orders</p>
        </div>
        
        <div className="w-full flex items-center justify-center outline-none border-none">
          {loading ? (
            <div className="flex items-center justify-center h-[250px]">
              <div className="animate-spin h-8 w-8 border-b-2 border-gray-600 rounded-full"></div>
            </div>
          ) : (
            <div
              className="w-full"
              style={{
                outline: "none",
                border: "none",
                boxShadow: "none",
              }}
            >
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart
                  cx="40%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  barSize={20}
                  data={data}
                  startAngle={90}
                  endAngle={-270}
                  style={{
                    outline: "none",
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <RadialBar 
                    dataKey="value"
                    cornerRadius={5}
                  />
                  <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} Orders`,
                      props.payload.name,
                    ]}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

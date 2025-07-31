'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [doNotCompare, setDoNotCompare] = useState(true);

  // Sample data for the revenue trend chart
  const revenueData = [
    { day: 'Mon', date: '15', value: 2000 },
    { day: 'Tue', date: '16', value: 3000 },
    { day: 'Wed', date: '17', value: 2500 },
    { day: 'Thu', date: '18', value: 4000 },
    { day: 'Fri', date: '19', value: 6000 },
    { day: 'Sat', date: '20', value: 8000 },
    { day: 'Sun', date: '21', value: 7500 },
  ];

  // Best selling items data
  const bestSellingItems = [
    { rank: 1, product: 'Coffee', revenue: '$1,304', sales: 195 },
    { rank: 2, product: 'Grill Sandwich', revenue: '$1,250', sales: 90 },
    { rank: 3, product: 'Fajita Wraps', revenue: '$1,030', sales: 330 },
    { rank: 4, product: 'Peach Iced Tea', revenue: '$890', sales: 56 },
    { rank: 5, product: 'Crispy Burger', revenue: '$730', sales: 35 },
  ];

  const periods = ['Today', 'Week', 'Month', 'Quarter', 'Year', 'Custom date'];

  return (
    <div className="mx-10 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="compare"
              checked={doNotCompare}
              onChange={(e) => setDoNotCompare(e.target.checked)}
              className=" w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
            />
            <label htmlFor="compare" className="text-sm text-gray-600">
              Do not compare
            </label>
          </div> */}
          {/* <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={16} />
            Export
          </button> */}
        </div>
      </div>

      {/* Time Period Buttons */}
      <div className="flex gap-2 mb-8">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              selectedPeriod === period
                ? 'bg-[#CCAB4D] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className=" bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Gross revenue</p>
          <p className="text-3xl font-bold text-gray-900">$14,509</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Avg. order value</p>
          <p className="text-3xl font-bold text-gray-900">$204</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Taxes</p>
          <p className="text-3xl font-bold text-gray-900">$12.1</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Customers</p>
          <p className="text-3xl font-bold text-gray-900">306</p>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="border border-black-100 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue trend</h2>
            <p className="text-sm text-gray-500">March 15 - March 21</p>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <XAxis 
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value, index) => {
                    const item = revenueData[index];
                    return `${value}\n${item?.date}`;
                  }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#CCAB4D" 
                  strokeWidth={2}
                  dot={{ fill: '#CCAB4D', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#CCAB4D' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Selling Items */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Best selling items</h2>
          
          <div className="space-y-1">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium pb-3 border-b border-gray-100">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Products</div>
              <div className="col-span-3 text-right">Revenue</div>
              <div className="col-span-3 text-right">Sales</div>
            </div>
            
            {/* Table Rows */}
            {bestSellingItems.map((item) => (
              <div key={item.rank} className="grid grid-cols-12 gap-2 py-3 text-sm border-b border-gray-50 last:border-b-0">
                <div className="col-span-1 text-gray-600 font-medium">{item.rank}</div>
                <div className="col-span-5 text-gray-900">{item.product}</div>
                <div className="col-span-3 text-right font-medium text-gray-900">{item.revenue}</div>
                <div className="col-span-3 text-right text-gray-600">{item.sales}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
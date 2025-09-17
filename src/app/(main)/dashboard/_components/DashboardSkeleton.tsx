// components/DashboardSkeleton.tsx

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton: React.FC = () => (
  <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div className="w-full">
      {/* Dashboard Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      {/* Period Selector Skeleton */}
      <div className="mb-6">
        <div className="flex mb-6 sm:mb-8 gap-2">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>

      {/* Customer Analytics Skeleton */}
      <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm mb-6 sm:mb-8">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-px w-full mb-6" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main metrics and chart area */}
          <div className="flex-1 min-w-0">
            {/* Top metrics row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b md:border-r md:border-b-0 p-4 border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>

            {/* Chart */}
            <Skeleton className="w-full h-80" />
          </div>

          {/* Right side stats cards */}
          <div className="lg:w-80 flex-shrink-0 border-l border-gray-300 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-300">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="w-2 h-2 rounded-full mr-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-64 md:h-80 w-full" />
        </div>

        {/* Best Selling Items Chart */}
        <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
          <Skeleton className="h-6 w-40 mb-6" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
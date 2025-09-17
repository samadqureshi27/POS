"use client";
// Global Skeleton Component for all pages
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface GlobalSkeletonProps {
  // Page type
  type?: 'dashboard' | 'management' | 'simple' | 'settings';
  
  // Layout options
  showHeader?: boolean;
  showSummaryCards?: boolean;
  showActionBar?: boolean;
  showImportExport?: boolean;
  showPeriodSelector?: boolean;
  showCharts?: boolean;
  
  // Content options
  summaryCardCount?: number;
  contentRows?: number;
  tableRows?: number;
  
  // Styling
  className?: string;
  containerClassName?: string;
}

export const GlobalSkeleton: React.FC<GlobalSkeletonProps> = ({
  type = 'management',
  showHeader = true,
  showSummaryCards = true,
  showActionBar = true,
  showImportExport = false,
  showPeriodSelector = false,
  showCharts = false,
  summaryCardCount = 2,
  contentRows = 6,
  tableRows = 8,
  className,
  containerClassName
}) => {
  // Dashboard skeleton
  if (type === 'dashboard') {
    return (
      <div className={cn("w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8", containerClassName)}>
        <div className="w-full">
          {/* Dashboard Header Skeleton */}
          {showHeader && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <Skeleton className="h-8 w-48" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          )}

          {/* Period Selector Skeleton */}
          {showPeriodSelector && (
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
          )}

          {/* Metrics Cards Skeleton */}
          {showSummaryCards && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(summaryCardCount)].map((_, i) => (
                <div key={i} className="bg-card rounded-sm border p-6 shadow-sm">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ))}
            </div>
          )}

          {/* Customer Analytics Skeleton */}
          <div className="bg-card rounded-sm border p-6 shadow-sm mb-6 sm:mb-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-px w-full mb-6" />

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main metrics and chart area */}
              <div className="flex-1 min-w-0">
                {/* Top metrics row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b md:border-r md:border-b-0 p-4 border-border">
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
              <div className="lg:w-80 flex-shrink-0 border-l border-border space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border-b border-border">
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
          {showCharts && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Revenue Trend Chart */}
              <div className="bg-card rounded-sm border p-6 shadow-sm lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-64 md:h-80 w-full" />
              </div>

              {/* Best Selling Items Chart */}
              <div className="bg-card rounded-sm border p-6 shadow-sm">
                <Skeleton className="h-6 w-40 mb-6" />
                <Skeleton className="h-80 w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Management page skeleton
  if (type === 'management') {
    return (
      <div className={cn("bg-background min-h-screen mt-6 w-full px-4", containerClassName)}>
        {/* Header */}
        <div className={cn(
          showImportExport ? 'grid grid-cols-1 md:grid-cols-2 items-center' : 'mb-8',
          'max-w-[100vw] mb-8 mt-2'
        )}>
          <Skeleton className="h-9 w-64" />
          {showImportExport && (
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {showSummaryCards && (
          <div className={cn(
            "grid grid-cols-1 max-w-[100vw] gap-4 mb-8",
            `lg:grid-cols-${summaryCardCount}`,
            summaryCardCount <= 2 ? 'lg:max-w-[50vw]' : ''
          )}>
            {[...Array(summaryCardCount)].map((_, i) => (
              <div key={i} className="bg-card rounded-sm border p-6 shadow-sm">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        )}

        {/* Action Bar */}
        {showActionBar && (
          <div className="bg-card rounded-sm border p-4 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-sm border shadow-sm">
          {/* Table Header */}
          <div className="border-b border-border p-4">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          {/* Table Rows */}
          {[...Array(tableRows)].map((_, i) => (
            <div key={i} className="border-b border-border p-4 last:border-b-0">
              <div className="grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Simple page skeleton
  if (type === 'simple') {
    return (
      <div className={cn("bg-background min-h-screen w-full p-4", containerClassName)}>
        {/* Header */}
        {showHeader && (
          <div className="mb-8 mt-2">
            <Skeleton className="h-9 w-64" />
          </div>
        )}

        {/* Content */}
        <div className="bg-card rounded-sm border p-6 shadow-sm">
          <div className="space-y-6">
            {[...Array(contentRows)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Settings page skeleton
  if (type === 'settings') {
    return (
      <div className={cn("min-h-screen w-full bg-background", containerClassName)}>
        <div className="flex-1 justify-center items-center w-full px-6">
          <div className="mt-20">
            {/* Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8">
              <Skeleton className="h-9 w-64" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Settings Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-sm border p-6 shadow-sm">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GlobalSkeleton;

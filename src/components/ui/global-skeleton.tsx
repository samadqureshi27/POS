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
  showSections?: boolean; // For pages with dashboard-style sections
  hasSubmenu?: boolean; // For pages with submenu navigation

  // Content options
  summaryCardCount?: number;
  sectionCount?: number;
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
  showSections = false,
  hasSubmenu = false,
  summaryCardCount = 2,
  sectionCount = 3,
  contentRows = 6,
  tableRows = 8,
  className,
  containerClassName
}) => {
  // Dashboard skeleton
  if (type === 'dashboard') {
    return (
      <div className={cn("w-full min-h-screen bg-background p-4 sm:p-6 lg:p-6", containerClassName)}>
        <div className="w-full">
          {/* Dashboard Header Skeleton */}
          {showHeader && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Skeleton className="h-6 w-32 rounded-lg" />
              </div>
            </div>
          )}

          {/* Period Selector Skeleton */}
          {showPeriodSelector && (
            <div className="mb-6">
              <div className="flex mb-6 sm:mb-8 gap-2">
                <Skeleton className="h-10 w-16 rounded-sm" />
                <Skeleton className="h-10 w-16 rounded-sm" />
                <Skeleton className="h-10 w-20 rounded-sm" />
                <Skeleton className="h-10 w-20 rounded-sm" />
                <Skeleton className="h-10 w-16 rounded-sm" />
                <Skeleton className="h-10 w-20 rounded-sm" />
              </div>
            </div>
          )}

          

          {/* Dashboard Section Skeleton 1 - Daily Snapshot */}
          <div className="mb-8">
            {/* Section Header with Title Box + Divider */}
            <div className="flex items-center w-full mb-6 relative">
              {/* Title Box */}
              <div className="px-5 py-2 bg-white border border-[#d5d5dd] rounded-sm shadow-none z-10">
                <Skeleton className="h-6 w-32" />
              </div>
              {/* Connecting Line */}
              <div className="flex-grow border-t border-[#d5d5dd] -ml-1"></div>
              {/* Toggle Button Box */}
              <div className="p-1 bg-white border border-[#d5d5dd] rounded-sm shadow-none z-10 ml-0">
                <Skeleton className="h-[25px] w-[25px]" />
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg border border-[#d5d5dd] p-6 shadow-none">
              <Skeleton className="h-4 w-64 mb-4" />

              {/* Key Daily Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>

              {/* Futuristic Visual Area */}
              <Skeleton className="w-full h-64 rounded-lg mb-6" />

              {/* Customer Insights Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-lg border",
                    i === 0 && "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
                    i === 1 && "bg-gradient-to-r from-green-50 to-green-100 border-green-200",
                    i === 2 && "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200"
                  )}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Section Skeleton 2 - Charts */}
          {showCharts && (
            <div className="mb-8">
              {/* Section Header with Title Box + Divider */}
              <div className="flex items-center w-full mb-6 relative">
                <div className="px-5 py-2 bg-white border border-[#d5d5dd] rounded-sm shadow-none z-10">
                  <Skeleton className="h-6 w-40" />
                </div>
                <div className="flex-grow border-t border-[#d5d5dd] -ml-1"></div>
                <div className="p-1 bg-white border border-[#d5d5dd] rounded-sm shadow-none z-10 ml-0">
                  <Skeleton className="h-[25px] w-[25px]" />
                </div>
              </div>

              {/* Content Area */}
              <div className="bg-white rounded-lg border border-[#d5d5dd] p-6 shadow-none">
                <Skeleton className="h-4 w-56 mb-6" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart 1 */}
                  <div>
                    <Skeleton className="h-64 w-full rounded-lg" />
                  </div>

                  {/* Chart 2 */}
                  <div>
                    <Skeleton className="h-64 w-full rounded-lg" />
                  </div>
                </div>
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
      <div className={cn("bg-background min-h-screen w-full p-6", containerClassName)}>
        {/* Header */}
        <div className={cn(
          showImportExport ? 'grid grid-cols-1 md:grid-cols-2 items-center' : 'mb-8',
          'max-w-[100vw] mb-8',
          hasSubmenu ? 'mt-20' : 'mt-2'
        )}>
          <Skeleton className="h-9 w-64 rounded-lg" />
          {showImportExport && (
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          )}
        </div>

        {/* Period Selector Skeleton */}
        {showPeriodSelector && (
          <div className="mb-6">
            <div className="flex mb-6 sm:mb-8 gap-2">
              <Skeleton className="h-10 w-16 rounded-sm" />
              <Skeleton className="h-10 w-16 rounded-sm" />
              <Skeleton className="h-10 w-20 rounded-sm" />
              <Skeleton className="h-10 w-20 rounded-sm" />
              <Skeleton className="h-10 w-16 rounded-sm" />
              <Skeleton className="h-10 w-20 rounded-sm" />
            </div>
          </div>
        )}

        {/* Sections Layout */}
        {showSections ? (
          <>
            {[...Array(sectionCount)].map((_, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                {/* Section Header with Title Box + Divider */}
                <div className="flex items-center w-full mb-6 relative">
                  <div className="px-5 py-2 bg-white border border-[#d5d5dd] rounded-sm shadow-none z-10">
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="flex-grow border-t border-[#d5d5dd] -ml-1"></div>
                  <div className="p-1 bg-white border border-[#d5d5dd] rounded-sm shadow-none z-10 ml-0">
                    <Skeleton className="h-[25px] w-[25px]" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-lg border border-[#d5d5dd] p-6 shadow-none">
                  {/* Summary Cards in Section */}
                  {sectionIndex === 0 && showSummaryCards && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {[...Array(summaryCardCount)].map((_, i) => (
                        <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-8 w-20 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Charts in Section */}
                  {sectionIndex === 1 && showCharts && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                      ))}
                    </div>
                  )}

                  {/* Table Section */}
                  {sectionIndex === sectionCount - 1 && (
                    <>
                      {/* Action Bar */}
                      {showActionBar && (
                        <div className="mb-6">
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <Skeleton className="h-10 w-64 rounded-md" />
                            <div className="flex gap-2 ml-auto">
                              <Skeleton className="h-10 w-20 rounded-md" />
                              <Skeleton className="h-10 w-20 rounded-md" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Table */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Table Header */}
                        <div className="border-b border-gray-200 p-4 bg-gray-50">
                          <div className="grid grid-cols-4 gap-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>

                        {/* Table Rows */}
                        {[...Array(Math.min(tableRows, 5))].map((_, i) => (
                          <div key={i} className="border-b border-gray-200 p-4 last:border-b-0">
                            <div className="grid grid-cols-4 gap-4 items-center">
                              <Skeleton className="h-6 w-full" />
                              <Skeleton className="h-6 w-full" />
                              <Skeleton className="h-6 w-full" />
                              <div className="flex gap-2">
                                <Skeleton className="h-8 w-16 rounded-md" />
                                <Skeleton className="h-8 w-16 rounded-md" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Summary Cards */}
            {showSummaryCards && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[...Array(summaryCardCount)].map((_, i) => (
                  <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-6 shadow-sm">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            )}

            {/* Action Bar */}
            {showActionBar && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <Skeleton className="h-10 w-64 rounded-md" />
                  <div className="flex gap-2 ml-auto">
                    <Skeleton className="h-10 w-20 rounded-md" />
                    <Skeleton className="h-10 w-20 rounded-md" />
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Table Header */}
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>

              {/* Table Rows */}
              {[...Array(tableRows)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 p-4 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16 rounded-md" />
                      <Skeleton className="h-8 w-16 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Simple page skeleton
  if (type === 'simple') {
    return (
      <div className={cn("bg-background min-h-screen w-full p-6", containerClassName)}>
        {/* Header */}
        {showHeader && (
          <div className={cn("mb-8", hasSubmenu ? 'mt-28' : 'mt-2')}>
            <Skeleton className="h-9 w-64 rounded-lg" />
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="space-y-6">
            {[...Array(contentRows)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
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
      <div className={cn("min-h-screen w-full bg-background p-6", containerClassName)}>
        <div className="flex-1 justify-center items-center w-full">
          <div className="mt-20">
            {/* Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8">
              <Skeleton className="h-9 w-64 rounded-lg" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>

            {/* Settings Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <Skeleton className="h-6 w-32 mb-4 rounded-lg" />
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

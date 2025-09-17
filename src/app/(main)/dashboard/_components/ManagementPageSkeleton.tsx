// components/ManagementPageSkeleton.tsx

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ManagementPageSkeletonProps {
  showSummaryCards?: boolean;
  summaryCardCount?: number;
  showActionBar?: boolean;
  showImportExport?: boolean;
}

export const ManagementPageSkeleton: React.FC<ManagementPageSkeletonProps> = ({
  showSummaryCards = true,
  summaryCardCount = 2,
  showActionBar = true,
  showImportExport = false
}) => (
  <div className="bg-gray-50 min-h-screen mt-6 w-full px-4">
    {/* Header */}
    <div className={`${showImportExport ? 'grid grid-cols-1 md:grid-cols-2 items-center' : 'mb-8'} max-w-[100vw] mb-8 mt-2`}>
      <Skeleton className="h-9 w-64" />
      {showImportExport && (
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      )}
    </div>

    {/* Summary Cards */}
    {showSummaryCards && (
      <div className={`grid grid-cols-1 max-w-[100vw] lg:grid-cols-${summaryCardCount} gap-4 mb-8 ${summaryCardCount <= 2 ? 'lg:max-w-[50vw]' : ''}`}>
        {[...Array(summaryCardCount)].map((_, i) => (
          <div key={i} className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    )}

    {/* Action Bar */}
    {showActionBar && (
      <div className="bg-white rounded-sm border border-gray-300 p-4 shadow-sm mb-6">
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
    <div className="bg-white rounded-sm border border-gray-300 shadow-sm">
      {/* Table Header */}
      <div className="border-b border-gray-300 p-4">
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* Table Rows */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="border-b border-gray-300 p-4 last:border-b-0">
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

export default ManagementPageSkeleton;
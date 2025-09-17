// components/SimplePageSkeleton.tsx

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SimplePageSkeletonProps {
  showHeader?: boolean;
  headerTitle?: string;
  showContent?: boolean;
  contentRows?: number;
}

export const SimplePageSkeleton: React.FC<SimplePageSkeletonProps> = ({
  showHeader = true,
  showContent = true,
  contentRows = 6
}) => (
  <div className="bg-gray-50 min-h-screen w-full p-4">
    {/* Header */}
    {showHeader && (
      <div className="mb-8 mt-2">
        <Skeleton className="h-9 w-64" />
      </div>
    )}

    {/* Content */}
    {showContent && (
      <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
        <div className="space-y-6">
          {[...Array(contentRows)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default SimplePageSkeleton;
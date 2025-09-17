// @deprecated - Use GlobalSkeleton with type="management" instead
// This component is kept for backward compatibility but should not be used in new code
import React from "react";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";

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
  <GlobalSkeleton
    type="management"
    showSummaryCards={showSummaryCards}
    summaryCardCount={summaryCardCount}
    showActionBar={showActionBar}
    showImportExport={showImportExport}
  />
);

export default ManagementPageSkeleton;
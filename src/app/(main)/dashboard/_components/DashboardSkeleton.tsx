// @deprecated - Use GlobalSkeleton with type="dashboard" instead
// This component is kept for backward compatibility but should not be used in new code
import React from "react";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";

export const DashboardSkeleton: React.FC = () => (
  <GlobalSkeleton
    type="dashboard"
    showHeader={true}
    showSummaryCards={true}
    showPeriodSelector={true}
    showCharts={true}
    summaryCardCount={4}
  />
);

export default DashboardSkeleton;
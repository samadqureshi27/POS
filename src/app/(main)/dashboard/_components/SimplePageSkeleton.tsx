// @deprecated - Use GlobalSkeleton with type="simple" instead
// This component is kept for backward compatibility but should not be used in new code
import React from "react";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";

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
  <GlobalSkeleton
    type="simple"
    showHeader={showHeader}
    contentRows={contentRows}
  />
);

export default SimplePageSkeleton;
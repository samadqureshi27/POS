// components/DashboardHeader.tsx

import React from "react";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  lastUpdated: string;
  refreshing: boolean;
  onRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdated,
  refreshing,
  onRefresh,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
      Dashboard
    </h1>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      Welcome!
      
    </div>
  </div>
);
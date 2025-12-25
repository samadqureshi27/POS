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
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6">
    <h1 className="text-2xl lg:text-3xl font-medium text-gray-800">
      Dashboard
    </h1>
    <div className="flex flex-col sm:flex-row items-start sm:items-center">
      {/* Header Actions can go here */}
    </div>
  </div>
);
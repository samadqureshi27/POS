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
      {lastUpdated && (
        <p className="text-sm text-gray-500">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      )}
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          refreshing
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
        {refreshing ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  </div>
);
// components/MetricsCards.tsx

import React from "react";
import { DashboardMetrics } from "@/lib/types/Dtypes";
import { Card, CardContent } from "@/components/ui/card";
import StatCard from "@/components/ui/summary-card";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-[100vw]">
    <StatCard
      title="Gross revenue"
      value={`$${metrics.grossRevenue.toLocaleString()}`}
    />
    <StatCard
      title="Taxes"
      value={`$${metrics.taxes.toFixed(1)}`}
    />
    <StatCard
      title="Avg. order value"
      value={`$${metrics.avgOrderValue}`}
    />
    <StatCard
      title="Customers"
      value={`$${metrics.customers.toLocaleString()}`}
    />
  </div>
);
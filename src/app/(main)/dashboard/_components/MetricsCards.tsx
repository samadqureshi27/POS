// components/MetricsCards.tsx

import React from "react";
import { DashboardMetrics } from "@/lib/types/Dtypes";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import { StatCardsGrid } from "@/components/ui/stat-cards-grid";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => (
  <StatCardsGrid>
    <AdvancedMetricCard
      title="Gross Revenue"
      value={metrics.grossRevenue}
      format="currency"
    />
    <AdvancedMetricCard
      title="Taxes Collected"
      value={metrics.taxes}
      format="currency"
    />
    <AdvancedMetricCard
      title="Avg. Order Value"
      value={metrics.avgOrderValue}
      format="currency"
    />
    <AdvancedMetricCard
      title="Total Customers"
      value={metrics.customers}
      format="number"
    />
  </StatCardsGrid>
);
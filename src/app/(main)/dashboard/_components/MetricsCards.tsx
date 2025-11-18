// components/MetricsCards.tsx

import React from "react";
import { DashboardMetrics } from "@/lib/types/Dtypes";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-[100vw]">
    <AdvancedMetricCard
      title="Gross Revenue"
      value={metrics.grossRevenue}
      format="currency"
      icon="revenue"
      trend={{
        value: 12.5,
        direction: "up",
        period: "last month"
      }}
      status="good"
    />
    <AdvancedMetricCard
      title="Taxes Collected"
      value={metrics.taxes}
      format="currency"
      icon="percentage"
      trend={{
        value: 8.2,
        direction: "up",
        period: "last month"
      }}
      status="neutral"
    />
    <AdvancedMetricCard
      title="Avg. Order Value"
      value={metrics.avgOrderValue}
      format="currency"
      icon="orders"
      trend={{
        value: -2.1,
        direction: "down",
        period: "last week"
      }}
      status="warning"
      target={{
        current: parseFloat(metrics.avgOrderValue.toString()),
        goal: 500,
        unit: "PKR"
      }}
    />
    <AdvancedMetricCard
      title="Total Customers"
      value={metrics.customers}
      format="number"
      icon="customers"
      trend={{
        value: 15.8,
        direction: "up",
        period: "this month"
      }}
      status="good"
    />
  </div>
);
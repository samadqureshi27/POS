// components/MetricsCards.tsx

import React from "react";
import { DashboardMetrics } from "@/lib/types/Dtypes";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
    <Card className="p-0 py-4 sm:py-6">
      <CardContent className="p-4 sm:p-6">
        <p className="text-sm text-gray-500 mb-2">Gross revenue</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          ${metrics.grossRevenue.toLocaleString()}
        </p>
      </CardContent>
    </Card>

    <Card className="p-0 py-4 sm:py-6">
      <CardContent className="p-4 sm:p-6">
        <p className="text-sm text-gray-500 mb-2">Avg. order value</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          ${metrics.avgOrderValue}
        </p>
      </CardContent>
    </Card>

    <Card className="p-0 py-4 sm:py-6">
      <CardContent className="p-4 sm:p-6">
        <p className="text-sm text-gray-500 mb-2">Taxes</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          ${metrics.taxes.toFixed(1)}
        </p>
      </CardContent>
    </Card>

    <Card className="p-0 py-4 sm:py-6">
      <CardContent className="p-4 sm:p-6">
        <p className="text-sm text-gray-500 mb-2">Customers</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          {metrics.customers.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  </div>
);
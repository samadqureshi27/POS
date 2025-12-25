"use client";
import React from 'react';
import { formatCurrency } from "@/lib/util/formatters";
import { Card, CardContent } from './card';

export interface AdvancedMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  target?: {
    current: number;
    goal: number;
    unit?: string;
  };
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  icon?: 'revenue' | 'customers' | 'orders' | 'inventory' | 'time' | 'percentage' | 'target';
  format?: 'currency' | 'number' | 'percentage';
  className?: string;
}

const AdvancedMetricCardComponent: React.FC<AdvancedMetricCardProps> = ({
  title,
  value,
  format = 'number',
  className = ''
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return `PKR ${formatCurrency(val)}`;
      case 'percentage':
        return `${val}%`;
      default:
        // Format to at most 2 decimal places
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(val);
    }
  };

  return (
    <Card className={`bg-white border border-gray-300 rounded-sm shadow-none w-full py-0 gap-0 ${className}`}>
      <CardContent className="px-6 py-5">
        {/* Main value - very large and prominent (matching RevenueCard) */}
        <div className="text-3xl md:text-5xl font-light text-gray-900 mb-3 leading-none truncate">
          {formatValue(value)}
        </div>

        {/* Label below - small and muted (matching RevenueCard) */}
        <p className="text-sm text-gray-500 font-normal">{title}</p>
      </CardContent>
    </Card>
  );
};

export const AdvancedMetricCard = React.memo(AdvancedMetricCardComponent);
AdvancedMetricCard.displayName = 'AdvancedMetricCard';
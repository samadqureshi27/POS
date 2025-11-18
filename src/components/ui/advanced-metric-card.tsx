"use client";
import React from 'react';
import { formatCurrency } from "@/lib/util/formatters";
import { Card, CardContent } from './card';
import { Badge } from './badge';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Clock,
  Percent,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

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

const iconMap = {
  revenue: DollarSign,
  customers: Users,
  orders: ShoppingCart,
  inventory: Package,
  time: Clock,
  percentage: Percent,
  target: Target
};

const statusConfig = {
  good: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  critical: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  neutral: { color: 'bg-gray-100 text-gray-800', icon: Minus }
};

export const AdvancedMetricCard: React.FC<AdvancedMetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  target,
  status = 'neutral',
  icon,
  format = 'number',
  className = ''
}) => {
  const IconComponent = icon ? iconMap[icon] : null;
  const StatusIcon = statusConfig[status].icon;

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return `PKR ${formatCurrency(val)}`;
      case 'percentage':
        return `${val}%`;
      default:
        return formatCurrency(val);
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;

    switch (trend.direction) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';

    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getTargetProgress = () => {
    if (!target) return null;

    const percentage = Math.min((target.current / target.goal) * 100, 100);
    const isOnTrack = percentage >= 80;

    return {
      percentage,
      isOnTrack,
      remaining: target.goal - target.current
    };
  };

  const targetProgress = getTargetProgress();

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div className="p-2 bg-primary/10 rounded-lg">
                <IconComponent size={20} className="text-primary" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground/70">{subtitle}</p>
              )}
            </div>
          </div>

          {status !== 'neutral' && (
            <Badge className={statusConfig[status].color}>
              <StatusIcon size={12} className="mr-1" />
              {status}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-3xl font-bold tracking-tight">
            {formatValue(value)}
          </p>

          {trend && (
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">
                vs {trend.period}
              </span>
            </div>
          )}

          {target && targetProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress to goal</span>
                <span>{targetProgress.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    targetProgress.isOnTrack ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${targetProgress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {targetProgress.remaining > 0
                  ? `${targetProgress.remaining} ${target.unit || ''} to goal`
                  : 'Goal achieved!'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
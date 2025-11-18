"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Progress } from './progress';
import { Separator } from './separator';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Download,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '@/lib/util/formatters';

export interface InventoryVarianceData {
  itemName: string;
  category: string;
  expectedQuantity: number;
  actualQuantity: number;
  variance: number;
  variancePercentage: number;
  costImpact: number;
  lastUpdated: string;
  status: 'critical' | 'warning' | 'normal';
  reason?: string;
}

export interface InventoryVarianceProps {
  data: InventoryVarianceData[];
  totalVarianceCost: number;
  lastAuditDate: string;
  onViewDetails?: (item: InventoryVarianceData) => void;
  onExportReport?: () => void;
  onScheduleAudit?: () => void;
  className?: string;
}

export const InventoryVarianceCard: React.FC<InventoryVarianceProps> = ({
  data,
  totalVarianceCost,
  lastAuditDate,
  onViewDetails,
  onExportReport,
  onScheduleAudit,
  className = ''
}) => {
  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp size={14} className="text-green-600" />;
    if (variance < 0) return <TrendingDown size={14} className="text-red-600" />;
    return <Minus size={14} className="text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getVarianceText = (variance: number) => {
    const prefix = variance > 0 ? '+' : '';
    return `${prefix}${variance}`;
  };

  const criticalItems = data.filter(item => item.status === 'critical').length;
  const warningItems = data.filter(item => item.status === 'warning').length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package size={20} />
            Inventory Variance Report
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportReport}
              className="text-xs"
            >
              <Download size={14} className="mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onScheduleAudit}
              className="text-xs"
            >
              <Calendar size={14} className="mr-1" />
              Schedule Audit
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Last Audit: {lastAuditDate}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Total Cost Impact: PKR {formatCurrency(totalVarianceCost)}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-700">{criticalItems}</p>
                  <p className="text-xs text-red-600">Critical Variances</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} className="text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-700">{warningItems}</p>
                  <p className="text-xs text-yellow-600">Warning Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-700">{data.length}</p>
                  <p className="text-xs text-blue-600">Total Items Audited</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Variance Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Variance Details</h4>

          {data.slice(0, 10).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{item.itemName}</p>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    {getVarianceIcon(item.variance)}
                    <span className="text-sm font-medium">
                      {getVarianceText(item.variance)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.variancePercentage > 0 ? '+' : ''}{item.variancePercentage.toFixed(1)}%
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">
                    PKR {formatCurrency(Math.abs(item.costImpact))}
                  </p>
                  <p className="text-xs text-muted-foreground">Cost Impact</p>
                </div>

                {onViewDetails && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(item)}
                    className="p-1 h-6 w-6"
                  >
                    <Eye size={12} />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {data.length > 10 && (
            <div className="text-center pt-2">
              <Button variant="outline" size="sm">
                View All {data.length} Items
              </Button>
            </div>
          )}
        </div>

        {/* Accuracy Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Inventory Accuracy</span>
            <span className="font-medium">
              {((data.length - criticalItems - warningItems) / data.length * 100).toFixed(1)}%
            </span>
          </div>
          <Progress
            value={(data.length - criticalItems - warningItems) / data.length * 100}
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            Target: 95% accuracy for optimal operations
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
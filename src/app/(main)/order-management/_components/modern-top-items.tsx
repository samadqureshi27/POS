"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, TrendingUp, Package2, BarChart3 } from "lucide-react";
import { OrderItem } from '@/lib/types';

interface ModernTopItemsProps {
  data: OrderItem[];
  loading: boolean;
  title?: string;
  type?: 'most' | 'least';
}

const ModernTopItems: React.FC<ModernTopItemsProps> = ({
  data,
  loading,
  title = "Top Selling Items",
  type = 'most'
}) => {
  const maxValue = data.length > 0 ? Math.max(...data.map(item => Number(item.number_item))) : 100;
  const icon = type === 'most' ? Crown : BarChart3;
  const IconComponent = icon;

  const getRankColor = (index: number) => {
    if (type === 'least') {
      return 'bg-orange-100 text-orange-700 border-orange-200';
    }
    switch (index) {
      case 0: return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // Gold
      case 1: return 'bg-gray-100 text-gray-700 border-gray-200'; // Silver
      case 2: return 'bg-amber-100 text-amber-700 border-amber-200'; // Bronze
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getProgressColor = (index: number) => {
    if (type === 'least') return 'bg-orange-500';
    switch (index) {
      case 0: return 'bg-yellow-500';
      case 1: return 'bg-gray-400';
      case 2: return 'bg-amber-500';
      default: return 'bg-primary';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className={`p-2 rounded-lg ${type === 'most' ? 'bg-yellow-100' : 'bg-orange-100'}`}>
            <IconComponent size={16} className={type === 'most' ? 'text-yellow-600' : 'text-orange-600'} />
          </div>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-2 bg-muted rounded w-1/2" />
                </div>
                <div className="w-12 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Package2 size={32} className="mb-2 opacity-50" />
            <span className="text-sm">No data available</span>
          </div>
        ) : (
          <div className="space-y-3">
            {data.slice(0, 5).map((item, index) => {
              const percentage = (Number(item.number_item) / maxValue) * 100;

              return (
                <div
                  key={item.Order}
                  className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
                >
                  {/* Rank Badge */}
                  <div className={`
                    w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold
                    ${getRankColor(index)}
                    group-hover:scale-110 transition-transform duration-200
                  `}>
                    {index + 1}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate pr-2">
                        {item.Name}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs h-5">
                          {item.number_item}
                        </Badge>
                        {index < 3 && type === 'most' && (
                          <TrendingUp size={12} className="text-green-500" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(index)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Summary */}
        {!loading && data.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Items: {data.length}</span>
              <span>
                {type === 'most' ? 'Top performer' : 'Needs attention'}: {data[0]?.Name}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Decorative background */}
      <div className={`
        absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-12 translate-x-12 opacity-10
        ${type === 'most' ? 'bg-gradient-to-bl from-yellow-400 to-transparent' : 'bg-gradient-to-bl from-orange-400 to-transparent'}
      `} />
    </Card>
  );
};

export default ModernTopItems;
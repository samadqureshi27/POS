"use client";
// components/ui/MetricCard.tsx
import React from 'react';
import { Card, CardContent } from './card';
import { StarRating } from './StarRating';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  showStarRating?: boolean;
  starRating?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  showStarRating = false,
  starRating = 0
}) => {
  return (
    <Card className="flex items-start justify-center flex-1 max-w-full min-h-[120px] py-0 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="flex items-start gap-2 py-4">
        <div>
          <p className="text-3xl mb-1 font-bold leading-tight">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70">{subtitle}</p>
          )}
          {showStarRating && (
            <div className="mt-2">
              <StarRating rating={Math.floor(starRating)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
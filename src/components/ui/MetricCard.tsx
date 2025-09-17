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
    <Card className="p-6">
      <CardContent className="space-y-1 p-0">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground/70">{subtitle}</p>}
        {showStarRating && <StarRating rating={Math.floor(starRating)} />}
      </CardContent>
    </Card>
  );
};
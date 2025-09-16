// components/ui/MetricCard.tsx
import React from 'react';
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
    <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm">
      <div className="space-y-1">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        {showStarRating && <StarRating rating={Math.floor(starRating)} />}
      </div>
    </div>
  );
};
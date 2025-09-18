
// components/ui/MetricCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle
}) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-1">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground/80">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

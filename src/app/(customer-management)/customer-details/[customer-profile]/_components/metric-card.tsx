// components/MetricCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
    value: string | number;
    label: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => {
    return (
        <Card className="shadow-sm h-[140px]">
            <CardContent className="p-6 flex items-center justify-start h-full">
                <div className="text-start">
                    <p className="text-5xl font-bold mb-2">{value}</p>
                    <p className="text-base text-muted-foreground">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
};
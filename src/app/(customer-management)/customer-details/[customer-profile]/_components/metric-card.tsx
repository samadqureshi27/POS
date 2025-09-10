// components/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
    value: string | number;
    label: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => {
    return (
        <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm flex items-center justify-start h-[140px]">
            <div className="text-start">
                <p className="text-5xl font-bold mb-2">{value}</p>
                <p className="text-base text-gray-500">{label}</p>
            </div>
        </div>
    );
};
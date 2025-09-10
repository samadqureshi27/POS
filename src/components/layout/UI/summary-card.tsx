"use client";
import React from "react";
import { StatCardProps } from "../../../lib/types/payment";

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => {
    return (
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[100%] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
            <div>
                <p className="text-5xl mb-1">
                    {value}
                </p>
                <p className="text-gray-500">
                    {title}
                    {subtitle && ` (${subtitle})`}
                </p>
            </div>
        </div>
    );
};

export default StatCard;
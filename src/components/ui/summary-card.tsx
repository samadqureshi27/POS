"use client";
import React from "react";
import { StatCardProps } from "@/lib/types/payment";
import { Card, CardContent } from "@/components/ui/card";

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => {
    return (
        <Card className="flex items-start justify-center flex-1 max-w-[100%] min-h-[100px] py-0 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="flex items-start gap-2 py-4">
                <div>
                    <p className="text-4xl mb-1 font-bold tracking-tight">
                        {value}
                    </p>
                    <p className="text-muted-foreground">
                        {title}
                        {subtitle && ` (${subtitle})`}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;
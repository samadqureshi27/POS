"use client";
import React from "react";
import { StatCardProps } from "@/lib/types/payment";
import { Card, CardContent } from "@/components/ui/card";

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => {
    return (
        <Card className="flex items-center justify-start flex-1 max-w-[100%] min-h-[100px] py-0">
            <CardContent className="flex items-center gap-2 py-4">
                <div>
                    <p className="text-5xl mb-1 font-bold tracking-tight">
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
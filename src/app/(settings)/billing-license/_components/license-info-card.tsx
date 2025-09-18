import React from "react";
import { Key, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LicenseInfo } from '@/lib/types/billing';
import { PlanIcon } from './plan-icon';
import { StatusBadge } from './status-batch';

interface LicenseInfoCardProps {
    licenseInfo: LicenseInfo;
}

export const LicenseInfoCard: React.FC<LicenseInfoCardProps> = ({ licenseInfo }) => {
    const daysLeft = Math.ceil(
        (new Date(licenseInfo.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
        <Card className="shadow-sm min-h-[500px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Key size={24} />
                    License Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Licensed To
                    </label>
                    <p className="text-base font-medium">
                        {licenseInfo.licensedTo}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Plan
                    </label>
                    <div className="flex items-center gap-3">
                        <PlanIcon plan={licenseInfo.plan} />
                        <span className="text-base font-medium">
                            {licenseInfo.plan}
                        </span>
                        {licenseInfo.plan === "Trial" && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                {daysLeft} days left
                            </Badge>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        License Status
                    </label>
                    <StatusBadge status={licenseInfo.status} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        License Key
                    </label>
                    <div className="bg-muted p-3 rounded border">
                        <code className="text-sm font-mono break-all">
                            {licenseInfo.licenseKey}
                        </code>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        License Expiry Date
                    </label>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">
                            {new Date(licenseInfo.expiryDate).toLocaleDateString()} at{" "}
                            {new Date(licenseInfo.expiryDate).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
import React from "react";
import { Building, Monitor, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LicenseInfo } from '@/lib/types/billing';

interface ResourcesAllocationCardProps {
    licenseInfo: LicenseInfo;
}

export const ResourcesAllocationCard: React.FC<ResourcesAllocationCardProps> = ({ licenseInfo }) => {
    return (
        <Card className="shadow-sm min-h-[500px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building size={24} />
                    Resources Allocation
                </CardTitle>
            </CardHeader>
            <CardContent>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Total Number of POS
                        </label>
                        <div className="flex items-center gap-3">
                            <Monitor size={20} className="text-muted-foreground" />
                            <span className="text-base font-medium">
                                {licenseInfo.totalPOS}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Total Number of KDS
                        </label>
                        <div className="flex items-center gap-3">
                            <Smartphone size={20} className="text-muted-foreground" />
                            <span className="text-base font-medium">
                                {licenseInfo.totalKDS}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Total Number of Branches
                        </label>
                        <div className="flex items-center gap-3">
                            <Building size={20} className="text-muted-foreground" />
                            <span className="text-base font-medium">
                                {licenseInfo.totalBranches}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        About Recheck
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        You can refresh the License Details by clicking on the
                        "Recheck" button. License is usually checked timely, but if
                        you want to fetch the latest information, click on "Recheck".
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
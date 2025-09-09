import React from "react";
import { Building, Monitor, Smartphone } from "lucide-react";
import { LicenseInfo } from '@/types/billing';

interface ResourcesAllocationCardProps {
    licenseInfo: LicenseInfo;
}

export const ResourcesAllocationCard: React.FC<ResourcesAllocationCardProps> = ({ licenseInfo }) => {
    return (
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[500px]">
            <div className="flex items-center gap-2 mb-8">
                <Building className="text-black" size={24} />
                <h2 className="text-xl font-semibold">Resources Allocation</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Total Number of POS
                    </label>
                    <div className="flex items-center gap-3">
                        <Monitor size={20} className="text-gray-400" />
                        <span className="text-base font-medium text-gray-900">
                            {licenseInfo.totalPOS}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Total Number of KDS
                    </label>
                    <div className="flex items-center gap-3">
                        <Smartphone size={20} className="text-gray-400" />
                        <span className="text-base font-medium text-gray-900">
                            {licenseInfo.totalKDS}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Total Number of Branches
                    </label>
                    <div className="flex items-center gap-3">
                        <Building size={20} className="text-gray-400" />
                        <span className="text-base font-medium text-gray-900">
                            {licenseInfo.totalBranches}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                    About Recheck
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                    You can refresh the License Details by clicking on the
                    "Recheck" button. License is usually checked timely, but if
                    you want to fetch the latest information, click on "Recheck".
                </p>
            </div>
        </div>
    );
};
import React from "react";
import { Key, Calendar } from "lucide-react";
import { LicenseInfo } from '@/lib/types/billing';
import { PlanIcon } from './PlanIcon';
import { StatusBadge } from './StatusBatch';

interface LicenseInfoCardProps {
    licenseInfo: LicenseInfo;
}

export const LicenseInfoCard: React.FC<LicenseInfoCardProps> = ({ licenseInfo }) => {
    return (
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[500px]">
            <div className="flex items-center gap-2 mb-8">
                <Key className="text-black" size={24} />
                <h2 className="text-xl font-semibold">License Information</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Licensed To
                    </label>
                    <p className="text-base font-medium text-gray-900">
                        {licenseInfo.licensedTo}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Plan
                    </label>
                    <div className="flex items-center gap-3">
                        <PlanIcon plan={licenseInfo.plan} />
                        <span className="text-base font-medium text-gray-900">
                            {licenseInfo.plan}
                        </span>
                        {licenseInfo.plan === "Trial" && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                {Math.ceil(
                                    (new Date(licenseInfo.expiryDate).getTime() -
                                        Date.now()) /
                                    (1000 * 60 * 60 * 24)
                                )}{" "}
                                days left
                            </span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        License Status
                    </label>
                    <StatusBadge status={licenseInfo.status} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        License Key
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                        <code className="text-sm font-mono text-gray-800 break-all">
                            {licenseInfo.licenseKey}
                        </code>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        License Expiry Date
                    </label>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                            {new Date(licenseInfo.expiryDate).toLocaleDateString()} at{" "}
                            {new Date(licenseInfo.expiryDate).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
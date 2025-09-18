import React from "react";
import { GeneralSettings } from '@/lib/types';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SecurityAccessCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const SecurityAccessCard: React.FC<SecurityAccessCardProps> = ({ settings, onSettingChange }) => {
    return (
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[450px]">
            <div className="flex items-center gap-2 mb-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <h2 className="text-xl font-semibold">Security & Access</h2>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium text-gray-500">
                            Manager Approval for Refunds
                        </Label>
                        <p className="text-xs text-gray-500">
                            Require manager password for refunds
                        </p>
                    </div>
                    <Switch
                        checked={settings.requireManagerForRefunds}
                        onCheckedChange={(isActive) => onSettingChange("requireManagerForRefunds", isActive)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium text-gray-500">
                            Manager Approval for Discounts
                        </Label>
                        <p className="text-xs text-gray-500">
                            Require manager password for discounts
                        </p>
                    </div>
                    <Switch
                        checked={settings.requireManagerForDiscounts}
                        onCheckedChange={(isActive) => onSettingChange("requireManagerForDiscounts", isActive)}
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2">
                        Session Timeout (minutes)
                    </Label>
                    <Input
                        type="number"
                        min="5"
                        max="240"
                        value={settings.sessionTimeout}
                        onChange={(e) => onSettingChange("sessionTimeout", parseInt(e.target.value))}
                        placeholder="Enter timeout in minutes"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Auto logout after inactivity
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SecurityAccessCard;
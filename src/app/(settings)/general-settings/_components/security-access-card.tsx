import React from "react";
import { Shield, Lock, Clock, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneralSettings } from '@/lib/types';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SecurityAccessCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const SecurityAccessCard: React.FC<SecurityAccessCardProps> = ({ settings, onSettingChange }) => {
    const timeoutOptions = [
        { value: "5", label: "5 minutes" },
        { value: "15", label: "15 minutes" },
        { value: "30", label: "30 minutes" },
        { value: "60", label: "1 hour" },
        { value: "120", label: "2 hours" },
        { value: "240", label: "4 hours" }
    ];

    const getSecurityLevel = () => {
        let level = 0;
        if (settings.requireManagerForRefunds) level++;
        if (settings.requireManagerForDiscounts) level++;
        if (settings.sessionTimeout <= 30) level++;

        if (level >= 3) return { text: "High", color: "bg-green-100 text-green-800" };
        if (level >= 2) return { text: "Medium", color: "bg-yellow-100 text-yellow-800" };
        return { text: "Low", color: "bg-red-100 text-red-800" };
    };

    const securityLevel = getSecurityLevel();

    return (
        <Card className="shadow-sm max-h-[450px]">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield size={24} />
                        Security & Access
                    </div>
                    <Badge className={securityLevel.color}>
                        {securityLevel.text} Security
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(450px - 80px)' }}>
                {/* Authorization Controls Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Lock size={16} className="text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900">Authorization Controls</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-orange-500" />
                                    Manager Approval for Refunds
                                </Label>
                                <p className="text-xs text-gray-500 mt-1">
                                    Requires manager authentication before processing any refund
                                </p>
                            </div>
                            <Switch
                                checked={settings.requireManagerForRefunds}
                                onCheckedChange={(isActive) => onSettingChange("requireManagerForRefunds", isActive)}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-orange-500" />
                                    Manager Approval for Discounts
                                </Label>
                                <p className="text-xs text-gray-500 mt-1">
                                    Requires manager authentication for applying discounts
                                </p>
                            </div>
                            <Switch
                                checked={settings.requireManagerForDiscounts}
                                onCheckedChange={(isActive) => onSettingChange("requireManagerForDiscounts", isActive)}
                            />
                        </div>
                    </div>
                </div>

                {/* Session Management Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock size={16} className="text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900">Session Management</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Automatic Logout Timer
                                <Badge variant="outline" className="ml-2 text-xs">5-240 min</Badge>
                            </Label>
                            <Select
                                value={settings.sessionTimeout?.toString()}
                                onValueChange={(value) => onSettingChange("sessionTimeout", parseInt(value))}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select timeout" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeoutOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Info size={12} />
                                Staff will be automatically logged out after this period of inactivity
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Recommendations */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Security Recommendations</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            Enable manager approval for high-value transactions
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            Set session timeout to 30 minutes or less for shared terminals
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            Review security logs regularly for unauthorized access
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default SecurityAccessCard;
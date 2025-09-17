import React from "react";
import { Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BackupSettings } from '@/lib/types/backup';
import { SettingsDropdown } from './backup-settings-dropdown';

interface BackupSettingsCardProps {
    settings: BackupSettings;
    handleSettingChange: (key: keyof BackupSettings, value: any) => void;
}

export const BackupSettingsCard: React.FC<BackupSettingsCardProps> = ({
    settings,
    handleSettingChange,
}) => {
    const frequencyOptions = [
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" }
    ];

    return (
        <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="text-black" size={20} />
                <h2 className="text-lg font-semibold">Backup Settings</h2>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium">
                            Automatic Backups
                        </Label>
                        <p className="text-xs text-muted-foreground">Enable scheduled backups</p>
                    </div>
                    <Switch
                        checked={settings.autoBackupEnabled}
                        onCheckedChange={(isActive) => handleSettingChange("autoBackupEnabled", isActive)}
                    />
                </div>

                {settings.autoBackupEnabled && (
                    <>
                        <div>
                            <Label className="text-sm font-medium">
                                Backup Frequency
                            </Label>
                            <SettingsDropdown
                                value={settings.backupFrequency}
                                options={frequencyOptions}
                                onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                                placeholder="Select frequency"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium">
                                Backup Time
                            </Label>
                            <Input
                                type="time"
                                value={settings.backupTime}
                                onChange={(e) => handleSettingChange("backupTime", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium">
                                Retention Period (days)
                            </Label>
                            <Input
                                type="number"
                                min="1"
                                max="365"
                                value={settings.retentionPeriod}
                                onChange={(e) => handleSettingChange("retentionPeriod", parseInt(e.target.value))}
                            />
                        </div>
                    </>
                )}

                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Data to Include</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeMenuData"
                                checked={settings.includeMenuData}
                                onCheckedChange={(checked) => handleSettingChange("includeMenuData", checked)}
                            />
                            <Label htmlFor="includeMenuData" className="text-sm">Menu Data</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeOrderHistory"
                                checked={settings.includeOrderHistory}
                                onCheckedChange={(checked) => handleSettingChange("includeOrderHistory", checked)}
                            />
                            <Label htmlFor="includeOrderHistory" className="text-sm">Order History</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeCustomerData"
                                checked={settings.includeCustomerData}
                                onCheckedChange={(checked) => handleSettingChange("includeCustomerData", checked)}
                            />
                            <Label htmlFor="includeCustomerData" className="text-sm">Customer Data</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeEmployeeData"
                                checked={settings.includeEmployeeData}
                                onCheckedChange={(checked) => handleSettingChange("includeEmployeeData", checked)}
                            />
                            <Label htmlFor="includeEmployeeData" className="text-sm">Employee Data</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeSettings"
                                checked={settings.includeSettings}
                                onCheckedChange={(checked) => handleSettingChange("includeSettings", checked)}
                            />
                            <Label htmlFor="includeSettings" className="text-sm">System Settings</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="includeFinancialData"
                                checked={settings.includeFinancialData}
                                onCheckedChange={(checked) => handleSettingChange("includeFinancialData", checked)}
                            />
                            <Label htmlFor="includeFinancialData" className="text-sm">Financial Data</Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
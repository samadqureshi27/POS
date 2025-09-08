import React from "react";
import { Settings } from "lucide-react";
import { BackupSettings } from '../../../../types/Backup';
import { SettingsDropdown } from './BackupSettingsDropdown';
import ButtonPage from "../../../../components/layout/UI/button";

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
                        <label className="block text-sm font-medium text-gray-700">
                            Automatic Backups
                        </label>
                        <p className="text-xs text-gray-500">Enable scheduled backups</p>
                    </div>
                    <ButtonPage
                        checked={settings.autoBackupEnabled}
                        onChange={(isActive) => handleSettingChange("autoBackupEnabled", isActive)}
                    />
                </div>

                {settings.autoBackupEnabled && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Backup Frequency
                            </label>
                            <SettingsDropdown
                                value={settings.backupFrequency}
                                options={frequencyOptions}
                                onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                                placeholder="Select frequency"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Backup Time
                            </label>
                            <input
                                type="time"
                                value={settings.backupTime}
                                onChange={(e) => handleSettingChange("backupTime", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Retention Period (days)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="365"
                                value={settings.retentionPeriod}
                                onChange={(e) => handleSettingChange("retentionPeriod", parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                            />
                        </div>
                    </>
                )}

                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Data to Include</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.includeMenuData}
                                onChange={(e) => handleSettingChange("includeMenuData", e.target.checked)}
                                className="mr-2 text-black"
                            />
                            <label className="text-sm">Menu Data</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.includeOrderHistory}
                                onChange={(e) => handleSettingChange("includeOrderHistory", e.target.checked)}
                                className="mr-2 text-black"
                            />
                            <label className="text-sm">Order History</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.includeCustomerData}
                                onChange={(e) => handleSettingChange("includeCustomerData", e.target.checked)}
                                className="mr-2 text-black"
                            />
                            <label className="text-sm">Customer Data</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.includeEmployeeData}
                                onChange={(e) => handleSettingChange("includeEmployeeData", e.target.checked)}
                                className="mr-2 text-black"
                            />
                            <label className="text-sm">Employee Data</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.includeSettings}
                                onChange={(e) => handleSettingChange("includeSettings", e.target.checked)}
                                className="mr-2 text-black"
                            />
                            <label className="text-sm">System Settings</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.includeFinancialData}
                                onChange={(e) => handleSettingChange("includeFinancialData", e.target.checked)}
                                className="mr-2 text-black"
                            />
                            <label className="text-sm">Financial Data</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
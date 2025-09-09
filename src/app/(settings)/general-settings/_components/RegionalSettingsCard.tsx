import React from "react";
import { GeneralSettings } from '../../../../types/types';
import { OPTIONS } from '../../../../lib/utility/dropDown-settings';
import SettingsDropdown from './Dropdown';

interface RegionalSettingsCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const RegionalSettingsCard: React.FC<RegionalSettingsCardProps> = ({ settings, onSettingChange }) => {
    return (
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[450px]">
            <div className="flex items-center gap-2 mb-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <h2 className="text-xl font-semibold">Regional Settings</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Language
                    </label>
                    <SettingsDropdown
                        value={settings.language}
                        options={OPTIONS.language}
                        onValueChange={(value) => onSettingChange("language", value)}
                        placeholder="Select Language"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Timezone
                    </label>
                    <SettingsDropdown
                        value={settings.timezone}
                        options={OPTIONS.timezone}
                        onValueChange={(value) => onSettingChange("timezone", value)}
                        placeholder="Select Timezone"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Date Format
                    </label>
                    <SettingsDropdown
                        value={settings.dateFormat}
                        options={OPTIONS.dateFormat}
                        onValueChange={(value) => onSettingChange("dateFormat", value)}
                        placeholder="Select Date Format"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Time Format
                    </label>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="12"
                                checked={settings.timeFormat === "12"}
                                onChange={(e) => onSettingChange("timeFormat", e.target.value)}
                                className="mr-2 text-blue-600"
                            />
                            12-hour (3:30 PM)
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="24"
                                checked={settings.timeFormat === "24"}
                                onChange={(e) => onSettingChange("timeFormat", e.target.value)}
                                className="mr-2 text-blue-600"
                            />
                            24-hour (15:30)
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegionalSettingsCard;
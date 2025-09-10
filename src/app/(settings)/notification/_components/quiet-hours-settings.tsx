import React from 'react';
import ButtonPage from '@/components/layout/ui/button';
import { NotificationSettings } from '@/lib/types/notification';

interface QuietHoursSettingsProps {
    settings: NotificationSettings;
    onSettingChange: (key: keyof NotificationSettings, value: any) => void;
}

export const QuietHoursSettings: React.FC<QuietHoursSettingsProps> = ({
    settings,
    onSettingChange
}) => {
    return (
        <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Quiet Hours
                    </label>
                </div>
                <ButtonPage
                    checked={settings.quietHoursEnabled}
                    onChange={(isActive) => onSettingChange("quietHoursEnabled", isActive)}
                />
            </div>

            {settings.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Start
                        </label>
                        <input
                            type="time"
                            value={settings.quietHoursStart}
                            onChange={(e) => onSettingChange("quietHoursStart", e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            End
                        </label>
                        <input
                            type="time"
                            value={settings.quietHoursEnd}
                            onChange={(e) => onSettingChange("quietHoursEnd", e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
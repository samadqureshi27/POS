import React from 'react';
import { Switch } from '@/components/ui/switch';
import { NotificationSettings } from '@/lib/types/notification';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
                    <Label className="text-sm font-medium text-gray-700">
                        Quiet Hours
                    </Label>
                </div>
                <Switch
                    checked={settings.quietHoursEnabled}
                    onCheckedChange={(isActive) => onSettingChange("quietHoursEnabled", isActive)}
                />
            </div>

            {settings.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                        <Label className="text-xs text-gray-500 mb-1">
                            Start
                        </Label>
                        <Input
                            type="time"
                            value={settings.quietHoursStart}
                            onChange={(e) => onSettingChange("quietHoursStart", e.target.value)}
                            className="text-sm"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-500 mb-1">
                            End
                        </Label>
                        <Input
                            type="time"
                            value={settings.quietHoursEnd}
                            onChange={(e) => onSettingChange("quietHoursEnd", e.target.value)}
                            className="text-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
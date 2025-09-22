import React from "react";
import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GeneralSettings } from '@/lib/types';
import { OPTIONS } from '@/lib/util/drop-down-settings';
import SettingsDropdown from './Dropdown';

interface RegionalSettingsCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const RegionalSettingsCard: React.FC<RegionalSettingsCardProps> = ({ settings, onSettingChange }) => {
    return (
        <Card className="shadow-sm max-h-[450px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe size={24} />
                    Regional Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                        Language
                    </Label>
                    <SettingsDropdown
                        value={settings.language}
                        options={OPTIONS.language}
                        onValueChange={(value) => onSettingChange("language", value)}
                        placeholder="Select Language"
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                        Timezone
                    </Label>
                    <SettingsDropdown
                        value={settings.timezone}
                        options={OPTIONS.timezone}
                        onValueChange={(value) => onSettingChange("timezone", value)}
                        placeholder="Select Timezone"
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                        Date Format
                    </Label>
                    <SettingsDropdown
                        value={settings.dateFormat}
                        options={OPTIONS.dateFormat}
                        onValueChange={(value) => onSettingChange("dateFormat", value)}
                        placeholder="Select Date Format"
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                        Time Format
                    </Label>
                    <RadioGroup
                        value={settings.timeFormat}
                        onValueChange={(value) => onSettingChange("timeFormat", value)}
                        className="mt-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="12" id="12hour" />
                            <Label htmlFor="12hour">12-hour (3:30 PM)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="24" id="24hour" />
                            <Label htmlFor="24hour">24-hour (15:30)</Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>
    );
};

export default RegionalSettingsCard;
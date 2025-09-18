import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NotificationSettings } from '@/lib/types/notification';

interface NotificationOption {
    key: keyof NotificationSettings;
    label: string;
    description?: string;
}

interface NotificationCardProps {
    title: string;
    icon: LucideIcon;
    options: NotificationOption[];
    settings: NotificationSettings;
    onSettingChange: (key: keyof NotificationSettings, value: any) => void;
    children?: React.ReactNode;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
    title,
    icon: Icon,
    options,
    settings,
    onSettingChange,
    children
}) => {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon size={20} />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>

                <div className="space-y-4">
                    {options.map((option) => (
                        <div key={option.key} className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium">
                                    {option.label}
                                </Label>
                                {option.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                                )}
                            </div>
                            <Switch
                                checked={settings[option.key] as boolean}
                                onCheckedChange={(isActive) => onSettingChange(option.key, isActive)}
                            />
                        </div>
                    ))}

                    {children}
                </div>
            </CardContent>
        </Card>
    );
};
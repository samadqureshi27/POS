import React from 'react';
import { LucideIcon } from 'lucide-react';


import { NotificationSettings } from '@/types/notification';
import ButtonPage from '@/components/layout/UI/button';


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
        <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
                <Icon className="text-black" size={20} />
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>

            <div className="space-y-4">
                {options.map((option) => (
                    <div key={option.key} className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {option.label}
                            </label>
                            {option.description && (
                                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                            )}
                        </div>
                        <ButtonPage
                            checked={settings[option.key] as boolean}
                            onChange={(isActive) => onSettingChange(option.key, isActive)}
                        />
                    </div>
                ))}

                {children}
            </div>
        </div>
    );
};
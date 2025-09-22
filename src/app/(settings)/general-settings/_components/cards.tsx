import React from "react";
import { GeneralSettings } from '@/lib/types';
import CurrencyPricingCard from './currency-pricing-card';
import RegionalSettingsCard from './regional-settings-card';
import ReceiptSettingsCard from './receipt-settings-card';
import SecurityAccessCard from './security-access-card';
import OrderTimerCard from './order-timer-card';
import UnitManagementCard from './unit-management-card';

interface SettingsCardsProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const SettingsCards: React.FC<SettingsCardsProps> = ({ settings, onSettingChange }) => {
    return (
        <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-8">
            <CurrencyPricingCard settings={settings} onSettingChange={onSettingChange} />
            <RegionalSettingsCard settings={settings} onSettingChange={onSettingChange} />
            <ReceiptSettingsCard settings={settings} onSettingChange={onSettingChange} />
            <SecurityAccessCard settings={settings} onSettingChange={onSettingChange} />
            <OrderTimerCard settings={settings} onSettingChange={onSettingChange} />
            <UnitManagementCard />
        </div>
    );
};

export default SettingsCards;
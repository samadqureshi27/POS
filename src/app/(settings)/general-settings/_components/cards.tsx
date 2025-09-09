import React from "react";
import { GeneralSettings } from '../../../../types/types';
import CurrencyPricingCard from './CurrencyPricingCard';
import RegionalSettingsCard from './RegionalSettingsCard';
import ReceiptSettingsCard from './ReceiptSettingsCard';
import SecurityAccessCard from './SecurityAccessCard';
import OrderTimerCard from './OrderTimerCard';

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
        </div>
    );
};

export default SettingsCards;
import React from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import { GeneralSettings } from '../../../../types/types';
import { OPTIONS } from '../../../../lib/util/DropDownSettings';
import SettingsDropdown from './Dropdown';
import ButtonPage from "@/components/layout/UI/button";
=======
=======
>>>>>>> beb55c08b4ee4124d0d39b19090ca285e4f3d4f5

import { GeneralSettings } from '@/types';
import CurrencyPricingCard from './CurrencyPricingCard';
import RegionalSettingsCard from './RegionalSettingsCard';
import ReceiptSettingsCard from './ReceiptSettingsCard';
import SecurityAccessCard from './SecurityAccessCard';
import OrderTimerCard from './OrderTimerCard';

>>>>>>> fa4c0c4c5551bd77636fd1d5b27ca4fad7662fa6
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
import React from "react";
import { GeneralSettings } from '@/types';
import { OPTIONS } from '@/lib/util/dropDown-settings';
import SettingsDropdown from './Dropdown';

interface CurrencyPricingCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const CurrencyPricingCard: React.FC<CurrencyPricingCardProps> = ({ settings, onSettingChange }) => {
    return (
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 max-h-[450px]">
            <div className="flex items-center gap-2 mb-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <h2 className="text-xl font-semibold">Currency & Pricing</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Currency
                    </label>
                    <SettingsDropdown
                        value={settings.currency}
                        options={OPTIONS.currency}
                        onValueChange={(value) => onSettingChange("currency", value)}
                        placeholder="Select Currency"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Currency Position
                    </label>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="before"
                                checked={settings.currencyPosition === "before"}
                                onChange={(e) => onSettingChange("currencyPosition", e.target.value)}
                                className="mr-2 text-blue-600"
                            />
                            Before amount (PKR 100.00)
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="after"
                                checked={settings.currencyPosition === "after"}
                                onChange={(e) => onSettingChange("currencyPosition", e.target.value)}
                                className="mr-2 text-blue-600"
                            />
                            After amount (100.00 PKR)
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Decimal Places
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="4"
                        value={settings.decimalPlaces}
                        onChange={(e) => onSettingChange("decimalPlaces", parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                        placeholder="Enter number of decimal places"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Default Tax Rate (%)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={settings.taxRate}
                        onChange={(e) => onSettingChange("taxRate", parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                        placeholder="Enter tax rate"
                    />
                </div>
            </div>
        </div>
    );
};

export default CurrencyPricingCard;
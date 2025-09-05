import React from "react";
import { GeneralSettings } from '../../../../types/types';
import { OPTIONS } from '../../../../lib/utility/dropDown-settings';
import SettingsDropdown from './Dropdown';
import ButtonPage from "@/components/layout/UI/button";

interface SettingsCardsProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const SettingsCards: React.FC<SettingsCardsProps> = ({ settings, onSettingChange }) => {
    return (
        <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Currency & Pricing Card */}
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

            {/* Regional Settings Card */}
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

            {/* Receipt Settings Card */}
            <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[450px]">
                <div className="flex items-center gap-2 mb-8">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                        <polyline points="6,9 6,2 18,2 18,9"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    <h2 className="text-xl font-semibold">Receipt Settings</h2>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Auto Print Receipts
                            </label>
                            <p className="text-xs text-gray-500">
                                Print receipt after each sale
                            </p>
                        </div>
                        <ButtonPage
                            checked={settings.autoPrintReceipts}
                            onChange={(isActive) => onSettingChange("autoPrintReceipts", isActive)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                            Receipt Copies
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={settings.receiptCopies}
                            onChange={(e) => onSettingChange("receiptCopies", parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter number of copies"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                            Receipt Footer Message
                        </label>
                        <textarea
                            value={settings.receiptFooter}
                            onChange={(e) => onSettingChange("receiptFooter", e.target.value)}
                            rows={3}
                            placeholder="Enter thank you message..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Security & Access Card */}
            <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[450px]">
                <div className="flex items-center gap-2 mb-8">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold">Security & Access</h2>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Manager Approval for Refunds
                            </label>
                            <p className="text-xs text-gray-500">
                                Require manager password for refunds
                            </p>
                        </div>
                        <ButtonPage
                            checked={settings.requireManagerForRefunds}
                            onChange={(isActive) => onSettingChange("requireManagerForRefunds", isActive)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Manager Approval for Discounts
                            </label>
                            <p className="text-xs text-gray-500">
                                Require manager password for discounts
                            </p>
                        </div>
                        <ButtonPage
                            checked={settings.requireManagerForDiscounts}
                            onChange={(isActive) => onSettingChange("requireManagerForDiscounts", isActive)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                            Session Timeout (minutes)
                        </label>
                        <input
                            type="number"
                            min="5"
                            max="240"
                            value={settings.sessionTimeout}
                            onChange={(e) => onSettingChange("sessionTimeout", parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter timeout in minutes"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Auto logout after inactivity
                        </p>
                    </div>
                </div>
            </div>

            {/* Notifications & Alerts Card */}
            <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[450px]">
                <div className="flex items-center gap-2 mb-8">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <h2 className="text-xl font-semibold">Notifications & Alerts</h2>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Enable Notifications
                            </label>
                            <p className="text-xs text-gray-500">
                                Show system alerts and updates
                            </p>
                        </div>
                        <ButtonPage
                            checked={settings.enableNotifications}
                            onChange={(isActive) => onSettingChange("enableNotifications", isActive)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Enable Sound Effects
                            </label>
                            <p className="text-xs text-gray-500">
                                Play sounds for transactions and alerts
                            </p>
                        </div>
                        <ButtonPage
                            checked={settings.enableSounds}
                            onChange={(isActive) => onSettingChange("enableSounds", isActive)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsCards;
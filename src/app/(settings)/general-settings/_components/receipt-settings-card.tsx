import React from "react";
import { GeneralSettings } from '@/lib/types';
import ButtonPage from "@/components/layout/ui/button";

interface ReceiptSettingsCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const ReceiptSettingsCard: React.FC<ReceiptSettingsCardProps> = ({ settings, onSettingChange }) => {
    return (
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
    );
};

export default ReceiptSettingsCard;
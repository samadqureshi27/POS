import React from "react";
import { GeneralSettings } from '@/lib/types';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
                        <Label className="text-sm font-medium text-gray-500">
                            Auto Print Receipts
                        </Label>
                        <p className="text-xs text-gray-500">
                            Print receipt after each sale
                        </p>
                    </div>
                    <Switch
                        checked={settings.autoPrintReceipts}
                        onCheckedChange={(isActive) => onSettingChange("autoPrintReceipts", isActive)}
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2">
                        Receipt Copies
                    </Label>
                    <Input
                        type="number"
                        min="1"
                        max="5"
                        value={settings.receiptCopies}
                        onChange={(e) => onSettingChange("receiptCopies", parseInt(e.target.value))}
                        placeholder="Enter number of copies"
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2">
                        Receipt Footer Message
                    </Label>
                    <Textarea
                        value={settings.receiptFooter}
                        onChange={(e) => onSettingChange("receiptFooter", e.target.value)}
                        rows={3}
                        placeholder="Enter thank you message..."
                    />
                </div>
            </div>
        </div>
    );
};

export default ReceiptSettingsCard;
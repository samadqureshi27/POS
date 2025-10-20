import React from "react";
import { Printer, FileText, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneralSettings } from '@/lib/types';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ReceiptSettingsCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const ReceiptSettingsCard: React.FC<ReceiptSettingsCardProps> = ({ settings, onSettingChange }) => {
    const paperSizes = [
        { value: "80mm", label: "80mm (Standard)" },
        { value: "58mm", label: "58mm (Compact)" },
        { value: "A4", label: "A4 (Letter)" }
    ];

    const receiptFormats = [
        { value: "thermal", label: "Thermal Receipt" },
        { value: "standard", label: "Standard Receipt" },
        { value: "detailed", label: "Detailed Receipt" }
    ];

    return (
        <Card className="shadow-sm max-h-[450px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Printer size={24} />
                    Receipt Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(450px - 80px)' }}>
                {/* Print Settings Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText size={16} className="text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900">Print Settings</h3>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-700">
                                Auto Print Receipts
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                                Automatically print receipt after each successful transaction
                            </p>
                        </div>
                        <Switch
                            checked={settings.autoPrintReceipts}
                            onCheckedChange={(isActive) => onSettingChange("autoPrintReceipts", isActive)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Number of Copies
                                <Badge variant="outline" className="ml-2 text-xs">1-5</Badge>
                            </Label>
                            <Input
                                type="number"
                                min="1"
                                max="5"
                                value={settings.receiptCopies}
                                onChange={(e) => onSettingChange("receiptCopies", parseInt(e.target.value))}
                                placeholder="1"
                                className="h-10"
                            />
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Info size={12} />
                                Recommended: 1-2 copies for customer and merchant
                            </p>
                        </div>

                        <div className="space-y-2" >
                            <Label className="text-sm font-medium text-gray-700" >Paper Size</Label>
                            <Select
                                value={settings.paperSize || "80mm"}
                                onValueChange={(value) => onSettingChange("paperSize", value)}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select paper size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paperSizes.map((size) => (
                                        <SelectItem key={size.value} value={size.value}>
                                            {size.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Receipt Format Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Receipt Format</Label>
                        <Select
                            value={settings.receiptFormat || "thermal"}
                            onValueChange={(value) => onSettingChange("receiptFormat", value)}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                {receiptFormats.map((format) => (
                                    <SelectItem key={format.value} value={format.value}>
                                        {format.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Footer Message
                            <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                        </Label>
                        <Textarea
                            value={settings.receiptFooter}
                            onChange={(e) => onSettingChange("receiptFooter", e.target.value)}
                            rows={3}
                            placeholder="Thank you for your business!\nVisit us again soon."
                            className="resize-none"
                            maxLength={200}
                        />
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <AlertCircle size={12} />
                                Appears at the bottom of every receipt
                            </p>
                            <span className="text-xs text-gray-400">
                                {settings.receiptFooter?.length || 0}/200
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReceiptSettingsCard;
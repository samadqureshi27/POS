import React from "react";
import { DollarSign, Calculator, Percent, Info, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { GeneralSettings } from '@/lib/types';
import { OPTIONS } from '@/lib/util/drop-down-settings';
import SettingsDropdown from './Dropdown';
import { formatDecimal } from '@/lib/util/formatters';

interface CurrencyPricingCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const CurrencyPricingCard: React.FC<CurrencyPricingCardProps> = ({ settings, onSettingChange }) => {
    const formatPreview = (amount: number) => {
        const decimals = settings.decimalPlaces || 2;
        const formatted = formatDecimal(amount, decimals);
        const currency = settings.currency || "USD";
        return settings.currencyPosition === "after" ? `${formatted} ${currency}` : `${currency} ${formatted}`;
    };

    return (
        <Card className="shadow-sm max-h-[450px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign size={24} />
                    Currency & Pricing
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(450px - 80px)' }}>
                {/* Currency Configuration Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Globe size={16} className="text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900">Currency Configuration</h3>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Base Currency
                        </Label>
                        <SettingsDropdown
                            value={settings.currency}
                            options={OPTIONS.currency}
                            onValueChange={(value) => onSettingChange("currency", value)}
                            placeholder="Select Currency"
                        />
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Info size={12} />
                            This will be used for all transactions and pricing
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                            Currency Display Format
                        </Label>
                        <RadioGroup
                            value={settings.currencyPosition}
                            onValueChange={(value) => onSettingChange("currencyPosition", value)}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="before" id="before" />
                                    <div>
                                        <Label htmlFor="before" className="font-medium">Symbol Before</Label>
                                        <p className="text-xs text-gray-500">Standard format</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {formatPreview(100)}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="after" id="after" />
                                    <div>
                                        <Label htmlFor="after" className="font-medium">Symbol After</Label>
                                        <p className="text-xs text-gray-500">Regional format</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {formatPreview(100)}
                                </Badge>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                {/* Pricing Configuration Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <Calculator size={16} className="text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900">Pricing Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="decimal-places" className="text-sm font-medium text-gray-700">
                                Decimal Places
                                <Badge variant="outline" className="ml-2 text-xs">0-4</Badge>
                            </Label>
                            <Input
                                id="decimal-places"
                                type="number"
                                min="0"
                                max="4"
                                value={settings.decimalPlaces === 0 ? "" : settings.decimalPlaces || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  onSettingChange("decimalPlaces", val === '' ? 0 : parseInt(val));
                                }}
                                onFocus={(e) => e.target.select()}
                                placeholder="2"
                                className="h-10"
                            />
                            <p className="text-xs text-gray-500">
                                Preview: {formatPreview(99.999)}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tax-rate" className="text-sm font-medium text-gray-700">
                                <Percent size={14} className="inline mr-1" />
                                Default Tax Rate
                            </Label>
                            <div className="relative">
                                <Input
                                    id="tax-rate"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    value={settings.taxRate === 0 ? "" : settings.taxRate || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      onSettingChange("taxRate", val === '' ? 0 : parseFloat(val));
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0.0"
                                    className="h-10 pr-8"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Applied to new items by default
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Format Preview</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-blue-700">Subtotal:</span>
                            <span className="font-mono">{formatPreview(87.50)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-blue-700">Tax ({settings.taxRate || 0}%):</span>
                            <span className="font-mono">{formatPreview((87.50 * (settings.taxRate || 0)) / 100)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-1">
                            <span className="text-blue-900">Total:</span>
                            <span className="font-mono">{formatPreview(87.50 + (87.50 * (settings.taxRate || 0)) / 100)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrencyPricingCard;
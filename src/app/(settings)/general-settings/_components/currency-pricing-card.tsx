import React from "react";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GeneralSettings } from '@/lib/types';
import { OPTIONS } from '@/lib/util/drop-down-settings';
import SettingsDropdown from './Dropdown';

interface CurrencyPricingCardProps {
    settings: GeneralSettings;
    onSettingChange: (key: keyof GeneralSettings, value: any) => void;
}

const CurrencyPricingCard: React.FC<CurrencyPricingCardProps> = ({ settings, onSettingChange }) => {
    return (
        <Card className="shadow-sm max-h-[450px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign size={24} />
                    Currency & Pricing
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                        Currency
                    </Label>
                    <SettingsDropdown
                        value={settings.currency}
                        options={OPTIONS.currency}
                        onValueChange={(value) => onSettingChange("currency", value)}
                        placeholder="Select Currency"
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                        Currency Position
                    </Label>
                    <RadioGroup
                        value={settings.currencyPosition}
                        onValueChange={(value) => onSettingChange("currencyPosition", value)}
                        className="mt-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="before" id="before" />
                            <Label htmlFor="before">Before amount (PKR 100.00)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="after" id="after" />
                            <Label htmlFor="after">After amount (100.00 PKR)</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div>
                    <Label htmlFor="decimal-places" className="text-sm font-medium text-muted-foreground">
                        Decimal Places
                    </Label>
                    <Input
                        id="decimal-places"
                        type="number"
                        min="0"
                        max="4"
                        value={settings.decimalPlaces}
                        onChange={(e) => onSettingChange("decimalPlaces", parseInt(e.target.value))}
                        placeholder="Enter number of decimal places"
                    />
                </div>

                <div>
                    <Label htmlFor="tax-rate" className="text-sm font-medium text-muted-foreground">
                        Default Tax Rate (%)
                    </Label>
                    <Input
                        id="tax-rate"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={settings.taxRate}
                        onChange={(e) => onSettingChange("taxRate", parseFloat(e.target.value))}
                        placeholder="Enter tax rate"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrencyPricingCard;
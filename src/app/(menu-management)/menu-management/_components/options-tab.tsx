import React from "react";
// import { MenuItem } from "@/lib/util/menu1-api";

import {OptionsTabProps} from "@/lib/types/menum";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const sizeOptions = ["Small", "Regular", "Large", "Extra Large"];

const OptionsTab: React.FC<OptionsTabProps> = ({
    formData,
    updateFormData,
    handleFormFieldChange,
}) => {
    const handleAddOption = (size: string) => {
        if (size && !formData.OptionValue?.includes(size)) {
            updateFormData({
                OptionValue: [...(formData.OptionValue || []), size],
                OptionPrice: [...(formData.OptionPrice || []), 0],
            });
        }
    };

    const handleUpdateOptionValue = (idx: number, value: string) => {
        const updated = [...(formData.OptionValue || [])];
        updated[idx] = value;
        updateFormData({ OptionValue: updated });
    };

    const handleUpdateOptionPrice = (idx: number, price: number) => {
        const updated = [...(formData.OptionPrice || [])];
        updated[idx] = price || 0;
        updateFormData({ OptionPrice: updated });
    };

    const handleRemoveOption = (idx: number) => {
        const updatedValues = (formData.OptionValue || []).filter((_, i) => i !== idx);
        const updatedPrices = (formData.OptionPrice || []).filter((_, i) => i !== idx);
        updateFormData({
            OptionValue: updatedValues,
            OptionPrice: updatedPrices,
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Label className="text-sm font-medium text-gray-700 mb-1">
                Menu Item Option
            </Label>

            <div className="flex items-center gap-2 mb-4">
                <Select onValueChange={(value) => handleAddOption(value)}>
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Add New Size Option" />
                    </SelectTrigger>
                    <SelectContent>
                        {sizeOptions.map((size) => (
                            <SelectItem key={size} value={size}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                {(formData.OptionValue || []).map((opt, idx) => (
                    <div
                        key={idx}
                        className="border border-gray-200 rounded-sm p-4 bg-white flex justify-between items-center"
                    >
                        <div className="flex gap-4 flex-1">
                            <Input
                                type="text"
                                value={opt}
                                onChange={(e) => handleUpdateOptionValue(idx, e.target.value)}
                                className="flex-1"
                                placeholder="Size name"
                            />
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.OptionPrice?.[idx] || 0}
                                onChange={(e) => handleUpdateOptionPrice(idx, Number(e.target.value))}
                                className="w-24"
                                placeholder="0.00"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveOption(idx)}
                            className="text-black border-2 px-2 py-1 rounded hover:text-gray-700 ml-2 h-auto w-auto"
                        >
                            <X size={20} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OptionsTab;
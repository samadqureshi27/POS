import React from "react";
import { MenuItem } from "@/lib/util/menu1-api";

import { X } from "lucide-react";
const sizeOptions = ["Small", "Regular", "Large", "Extra Large"];

interface OptionsTabProps {
    formData: Omit<MenuItem, "ID">;
    updateFormData: (updates: Partial<Omit<MenuItem, "ID">>) => void;
    handleFormFieldChange: (field: keyof Omit<MenuItem, "ID">, value: any) => void;
}

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu Item Option
            </label>

            <div className="flex items-center gap-2 mb-4">
                <select
                    onChange={(e) => {
                        const size = e.target.value;
                        handleAddOption(size);
                        e.target.value = "";
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                >
                    <option value="">Add New Size Option</option>
                    {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-4">
                {(formData.OptionValue || []).map((opt, idx) => (
                    <div
                        key={idx}
                        className="border border-gray-200 rounded-sm p-4 bg-white flex justify-between items-center"
                    >
                        <div className="flex gap-4 flex-1">
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleUpdateOptionValue(idx, e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                                placeholder="Size name"
                            />
                            <input
                                type="number"
                                step="0.01"
                                value={formData.OptionPrice?.[idx] || 0}
                                onChange={(e) => handleUpdateOptionPrice(idx, Number(e.target.value))}
                                className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                                placeholder="0.00"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="text-black border-2 px-2 py-1 rounded hover:text-gray-700 ml-2"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OptionsTab;
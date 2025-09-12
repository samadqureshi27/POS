import React from "react";
import ButtonPage from "@/components/layout/ui/button";
import { MenuItem } from "@/lib/util/menu1-api";

const mealTimeOptions = ["Morning", "Afternoon", "Evening"];

interface DetailsTabProps {
    formData: Omit<MenuItem, "ID">;
    updateFormData: (updates: Partial<Omit<MenuItem, "ID">>) => void;
    handleFormFieldChange: (field: keyof Omit<MenuItem, "ID">, value: any) => void;
    handleStatusChange: (field: keyof Omit<MenuItem, "ID">, isActive: boolean) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
    formData,
    updateFormData,
    handleFormFieldChange,
    handleStatusChange,
}) => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meal Time
                    </label>
                    <select
                        value={formData.MealType}
                        onChange={(e) => handleFormFieldChange("MealType", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                    >
                        {mealTimeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                    </label>
                    <input
                        type="number"
                        value={formData.Priority || ""}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            handleFormFieldChange("Priority", value || 1);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                        placeholder="1"
                        min={1}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Quantity
                </label>
                <input
                    type="number"
                    value={formData.MinimumQuantity || ""}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleFormFieldChange("MinimumQuantity", value || 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                    placeholder="0"
                    min={0}
                />
            </div>

            <div className="space-y-4">
                {[
                    { key: "Featured", label: "Feature" },
                    { key: "StaffPick", label: "Staff pick" },
                    { key: "ShowOnMain", label: "Show on Main" },
                    { key: "SubTBE", label: "Subtract Stock" },
                ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                            {label}
                        </label>
                        <ButtonPage
                            checked={formData[key as keyof typeof formData] === "Active"}
                            onChange={(checked) =>
                                handleStatusChange(key as keyof typeof formData, checked)
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailsTab;
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const mealTimeOptions = ["Morning", "Afternoon", "Evening"];
import { DetailsTabProps,MenuItem } from "@/lib/types/menum";   // Correct - named import


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
                    <Label className="text-sm font-medium">
                        Meal Time
                    </Label>
                    <Select
                        value={formData.MealType}
                        onValueChange={(value) => handleFormFieldChange("MealType", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select meal time" />
                        </SelectTrigger>
                        <SelectContent>
                            {mealTimeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                    {time}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="text-sm font-medium">
                        Priority
                    </Label>
                    <Input
                        type="number"
                        value={formData.Priority || ""}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            handleFormFieldChange("Priority", value || 1);
                        }}
                        placeholder="1"
                        min={1}
                    />
                </div>
            </div>

            <div>
                <Label className="text-sm font-medium">
                    Minimum Quantity
                </Label>
                <Input
                    type="number"
                    value={formData.MinimumQuantity || ""}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleFormFieldChange("MinimumQuantity", value || 0);
                    }}
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
                        <Label className="text-sm font-medium">
                            {label}
                        </Label>
                        <Switch
                            checked={formData[key as keyof typeof formData] === "Active"}
                            onCheckedChange={(checked) =>
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
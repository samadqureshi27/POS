import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Infinity } from "lucide-react";
const mealTimeOptions = ["All Day", "Morning", "Evening"];
import { DetailsTabProps,MenuItem } from "@/lib/types/menum";   // Correct - named import


const DetailsTab: React.FC<DetailsTabProps> = ({
    formData,
    updateFormData,
    handleFormFieldChange,
    handleStatusChange,
}) => {
    return (
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
            {/* Inventory Settings Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="mealTime" className="text-sm font-medium text-gray-700">
                        Meal Time
                    </Label>
                    <Select
                        value={formData.MealType}
                        onValueChange={(value) => handleFormFieldChange("MealType", value)}
                    >
                        <SelectTrigger className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20">
                            <SelectValue placeholder="Select meal time" />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                            {mealTimeOptions.map((time) => (
                                <SelectItem key={time} value={time} className="cursor-pointer">
                                    {time}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">When this item is available</p>
                </div>

                {formData.SubTBE === "Active" ? (
                    <>
                        <div>
                            <Label htmlFor="minQuantity" className="text-sm font-medium text-gray-700">
                                Minimum Quantity
                            </Label>
                            <Input
                                id="minQuantity"
                                type="number"
                                value={formData.MinimumQuantity || ""}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    handleFormFieldChange("MinimumQuantity", value || 1);
                                }}
                                placeholder="1"
                                min={1}
                                className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum order quantity</p>
                        </div>
                        <div>
                            <Label htmlFor="stockQty" className="text-sm font-medium text-gray-700">
                                Stock Quantity
                            </Label>
                            <Input
                                id="stockQty"
                                type="text"
                                value={formData.StockQty || ""}
                                onChange={(e) => handleFormFieldChange("StockQty", e.target.value)}
                                placeholder="0"
                                className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                            />
                            <p className="text-xs text-gray-500 mt-1">Current stock quantity</p>
                        </div>
                    </>
                ) : (
                    <div>
                        <Label className="text-sm font-medium text-gray-700">
                            Stock Status
                        </Label>
                        <div className="mt-1 p-3 border border-gray-200 rounded-lg bg-green-50 flex items-center gap-2">
                            <Infinity className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Unlimited Stock</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Inventory tracking disabled</p>
                    </div>
                )}
            </div>

            {/* Feature Toggles Section */}
            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
                    Item Features
                </h3>
                <div className="space-y-4">
                    {[
                        { key: "Featured", label: "Featured Item", description: "Highlight this item in menus" },
                        { key: "ShowOnMain", label: "Show on Main", description: "This option is used for items available in deals or meals only" },
                        { key: "SubTBE", label: "Track Inventory", description: "Subtract from stock on sale" },
                    ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-800 cursor-pointer">
                                    {label}
                                </Label>
                                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                            </div>
                            <Switch
                                checked={formData[key as keyof typeof formData] === "Active"}
                                onCheckedChange={(checked) =>
                                    handleStatusChange(key as keyof typeof formData, checked)
                                }
                                className="ml-3"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailsTab;
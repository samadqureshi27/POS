import React from "react";
import ImageUpload from "./image-upload";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {MenuItemTabProps,MenuItem} from "@/lib/types/menum";

const MenuItemTab: React.FC<MenuItemTabProps> = ({
    formData,
    updateFormData,
    handleFormFieldChange,
    handleStatusChange,
    preview,
    setPreview,
    fileInputRef,
}) => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Menu Item Name
                </label>
                <Input
                    type="text"
                    value={formData.Name}
                    onChange={(e) => handleFormFieldChange("Name", e.target.value)}
                    placeholder="Sweet / Spicy Sausage Wrap"
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Category
                    </label>
                    <Input
                        type="text"
                        value={formData.Category}
                        onChange={(e) => handleFormFieldChange("Category", e.target.value)}
                        placeholder="Enter category"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Display Type
                    </label>
                    <Select
                        value={formData.Displaycat}
                        onValueChange={(value) => handleFormFieldChange("Displaycat", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select display type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Var">Var</SelectItem>
                            <SelectItem value="Qty">Qty</SelectItem>
                            <SelectItem value="Weight">Weight</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Price
                </label>
                <Input
                    type="number"
                    value={formData.Price || ""}
                    disabled={formData.Displaycat === "Var"}
                    onChange={(e) => handleFormFieldChange("Price", Number(e.target.value) || 0)}
                    className={formData.Displaycat === "Var" ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                    placeholder="0.00"
                />
            </div>

            <ImageUpload
                preview={preview}
                setPreview={setPreview}
                fileInputRef={fileInputRef}
            />

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Description
                </label>
                <Textarea
                    value={formData.Description}
                    onChange={(e) => handleFormFieldChange("Description", e.target.value)}
                    rows={3}
                    placeholder="Enter description"
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                    Status
                </label>
                <Switch
                    checked={formData.Status === "Active"}
                    onCheckedChange={(checked) => handleStatusChange("Status", checked)}
                />
            </div>
        </div>
    );
};

export default MenuItemTab;
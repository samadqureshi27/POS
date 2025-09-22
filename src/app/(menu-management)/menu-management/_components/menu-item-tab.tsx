import React, { useState, useEffect, useRef } from "react";
import ImageUpload from "./image-upload";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import {MenuItemTabProps,MenuItem} from "@/lib/types/menum";
import { useRecipeData } from "@/lib/hooks/useRecipeData";

const MenuItemTab: React.FC<MenuItemTabProps> = ({
    formData,
    updateFormData,
    handleFormFieldChange,
    handleStatusChange,
    preview,
    setPreview,
    fileInputRef,
    categories,
}) => {
    const { recipeOptions, refreshData } = useRecipeData();
    const [showNameDropdown, setShowNameDropdown] = useState(false);
    const [nameInputValue, setNameInputValue] = useState(formData.Name || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setNameInputValue(formData.Name || "");
    }, [formData.Name]);

    // Refresh recipes when dropdown is opened
    useEffect(() => {
        if (showNameDropdown) {
            refreshData();
        }
    }, [showNameDropdown, refreshData]);

    // Click outside handler for dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNameDropdown(false);
            }
        };

        if (showNameDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNameDropdown]);

    const activeRecipes = recipeOptions.filter(recipe => recipe.Status === "Active");

    const handleNameSelect = (recipeName: string) => {
        setNameInputValue(recipeName);
        handleFormFieldChange("Name", recipeName);
        setShowNameDropdown(false);
    };

    const handleNameInputChange = (value: string) => {
        setNameInputValue(value);
        handleFormFieldChange("Name", value);
    };

    return (
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6 pl-1">
            {/* Header Section 
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Menu Item Information
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                    Configure the basic details and pricing structure for this menu item
                </p>
            </div> */}

            {/* Menu Item Name Section */}
            <div className="space-y-4">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Menu Item Name <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">
                            Enter a custom name or select from existing recipes
                        </p>
                        <div className="relative" ref={dropdownRef}>
                            <div className="flex gap-2">
                                <Input
                                    id="name"
                                    type="text"
                                    value={nameInputValue}
                                    onChange={(e) => handleNameInputChange(e.target.value)}
                                    placeholder="Enter custom name or select from recipes"
                                    required
                                    className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-gray-500/20"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="px-3 transition-all duration-200 focus:ring-2 focus:ring-gray-500/20 hover:bg-gray-50"
                                    onClick={() => setShowNameDropdown(!showNameDropdown)}
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </div>
                            {showNameDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                    <div className="p-3 border-b border-gray-100">
                                        <p className="text-xs text-gray-600 font-medium">Available Recipes</p>
                                    </div>
                                    {activeRecipes.length > 0 ? (
                                        activeRecipes.map((recipe) => (
                                            <button
                                                key={recipe.ID}
                                                type="button"
                                                className="w-full text-left px-3 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 text-sm transition-colors"
                                                onClick={() => handleNameSelect(recipe.Name)}
                                            >
                                                <div className="font-medium text-gray-800">{recipe.Name}</div>
                                                {recipe.Description && (
                                                    <div className="text-xs text-gray-500 mt-1">{recipe.Description}</div>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-6 text-sm text-gray-500 text-center">
                                            No recipes available
                                        </div>
                                    )}
                                    <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                                        <p className="text-xs text-gray-500">Or enter a custom name above</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 border border-gray-200">
                        <div>
                            <Label className="text-sm font-medium text-gray-700">
                                Active Status
                            </Label>
                            <p className="text-xs text-gray-500">Enable this menu item</p>
                        </div>
                        <Switch
                            checked={formData.Status === "Active"}
                            onCheckedChange={(checked) => handleStatusChange("Status", checked)}
                        />
                    </div>
                </div>
            </div>

            {/* Pricing Configuration Section */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">
                    Pricing Configuration
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="displayType" className="text-sm font-medium text-gray-700">
                            Display Type <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">How this item appears in POS</p>
                        <Select
                            value={formData.Displaycat}
                            onValueChange={(value) => {
                                handleFormFieldChange("Displaycat", value);

                                // Handle different display type changes
                                if (value === "Var") {
                                    // Reset price and set up default variation
                                    handleFormFieldChange("Price", 0);
                                    // Add default "Usual" variation if none exist
                                    if (!formData.PName || formData.PName.length === 0) {
                                        handleFormFieldChange("PName", ["Usual"]);
                                        handleFormFieldChange("PPrice", [0]);
                                    }
                                } else if (value === "Weight") {
                                    // Set default unit for weight
                                    if (!formData.Unit) {
                                        handleFormFieldChange("Unit", "gm");
                                    }
                                } else if (value === "Qty") {
                                    // Clear unit for quantity
                                    handleFormFieldChange("Unit", "");
                                }
                            }}
                        >
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-gray-500/20">
                                <SelectValue placeholder="Select display type" />
                            </SelectTrigger>
                            <SelectContent className="z-[100]">
                                <SelectItem value="Var">Var (Variations)</SelectItem>
                                <SelectItem value="Qty">Qty (Quantity)</SelectItem>
                                <SelectItem value="Weight">Weight (Per Unit)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                            {formData.Displaycat === "Weight" ? "Price per Unit" : "Price"}
                            {formData.Displaycat && formData.Displaycat !== "Var" && <span className="text-red-500">*</span>}
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">
                            {formData.Displaycat === "Weight"
                                ? "Set price per unit weight"
                                : formData.Displaycat === "Var"
                                    ? "Configured in Price tab"
                                    : "Base price for this item"
                            }
                        </p>
                        {formData.Displaycat === "Weight" ? (
                            <div className="flex gap-2">
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.Price || ""}
                                    onChange={(e) => handleFormFieldChange("Price", Number(e.target.value) || 0)}
                                    placeholder="0.00"
                                    className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-gray-500/20"
                                />
                                <Select
                                    value={formData.Unit || "gm"}
                                    onValueChange={(value) => handleFormFieldChange("Unit", value)}
                                >
                                    <SelectTrigger className="w-20 transition-all duration-200 focus:ring-2 focus:ring-gray-500/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="z-[100]">
                                        <SelectItem value="gm">gm</SelectItem>
                                        <SelectItem value="kg">kg</SelectItem>
                                        <SelectItem value="ml">ml</SelectItem>
                                        <SelectItem value="l">l</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.Price || ""}
                                disabled={!formData.Displaycat || formData.Displaycat === "Var"}
                                onChange={(e) => handleFormFieldChange("Price", Number(e.target.value) || 0)}
                                className={`transition-all duration-200 focus:ring-2 focus:ring-gray-500/20 ${
                                    !formData.Displaycat || formData.Displaycat === "Var"
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : ""
                                }`}
                                placeholder={
                                    !formData.Displaycat
                                        ? "Select display type first"
                                        : formData.Displaycat === "Var"
                                            ? "Set in Price Tab"
                                            : "0.00"
                                }
                            />
                        )}
                    </div>

                    <div>
                        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                            Category <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">Menu category for organization</p>
                        <Select
                            value={formData.Category}
                            onValueChange={(value) => handleFormFieldChange("Category", value)}
                        >
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-gray-500/20">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="z-[100]">
                                {categories && categories.length > 0 ? (
                                    categories
                                        .filter((category) => category.Status === "Active")
                                        .map((category) => (
                                            <SelectItem key={category.ID} value={category.Name}>
                                                {category.Name}
                                            </SelectItem>
                                        ))
                                ) : (
                                    <SelectItem key="no-data" value="" disabled>
                                        No categories available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Media & Description Section */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">
                    Media & Description
                </h4>

                {/* Image Upload */}
                <div>
                    <Label className="text-sm font-medium text-gray-700">
                        Menu Item Image
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">Upload an image to showcase this menu item</p>
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                        <ImageUpload
                            preview={preview}
                            setPreview={setPreview}
                            fileInputRef={fileInputRef}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Description
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">Brief description that appears on menus and POS</p>
                    <Textarea
                        id="description"
                        value={formData.Description}
                        onChange={(e) => {
                            handleFormFieldChange("Description", e.target.value);
                            // Auto-resize functionality
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                        }}
                        className="min-h-[80px] resize-none transition-all duration-200 focus:ring-2 focus:ring-gray-500/20"
                        placeholder="Brief description of this menu item..."
                        rows={3}
                        style={{
                            height: 'auto',
                            minHeight: '80px',
                            maxHeight: '120px'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MenuItemTab;
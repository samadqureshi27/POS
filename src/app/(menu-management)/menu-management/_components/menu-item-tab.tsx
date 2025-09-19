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
    const { recipeOptions } = useRecipeData();
    const [showNameDropdown, setShowNameDropdown] = useState(false);
    const [nameInputValue, setNameInputValue] = useState(formData.Name || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setNameInputValue(formData.Name || "");
    }, [formData.Name]);

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
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
            {/* Menu Item Name and Status Row */}
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <Label htmlFor="name" className="text-sm font-medium">
                        Menu Item Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative mt-1" ref={dropdownRef}>
                        <div className="flex">
                            <Input
                                id="name"
                                type="text"
                                value={nameInputValue}
                                onChange={(e) => handleNameInputChange(e.target.value)}
                                placeholder="Enter custom name or select from recipes"
                                required
                                className="pr-20"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="ml-2 px-3"
                                onClick={() => setShowNameDropdown(!showNameDropdown)}
                            >
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>
                        {showNameDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                                <div className="p-2 border-b border-gray-100">
                                    <p className="text-xs text-gray-500 font-medium">Available Recipes</p>
                                </div>
                                {activeRecipes.length > 0 ? (
                                    activeRecipes.map((recipe) => (
                                        <button
                                            key={recipe.ID}
                                            type="button"
                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 text-sm"
                                            onClick={() => handleNameSelect(recipe.Name)}
                                        >
                                            <div className="font-medium">{recipe.Name}</div>
                                            {recipe.Description && (
                                                <div className="text-xs text-gray-500 mt-1">{recipe.Description}</div>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                        No recipes available
                                    </div>
                                )}
                                <div className="p-2 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">Or enter a custom name above</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">
                        Active
                    </Label>
                    <Switch
                        checked={formData.Status === "Active"}
                        onCheckedChange={(checked) => handleStatusChange("Status", checked)}
                    />
                </div>
            </div>

            {/* Category and Display Type Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                        Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formData.Category}
                        onValueChange={(value) => handleFormFieldChange("Category", value)}
                    >
                        <SelectTrigger className="mt-1">
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

                <div>
                    <Label htmlFor="displayType" className="text-sm font-medium">
                        Display Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formData.Displaycat}
                        onValueChange={(value) => handleFormFieldChange("Displaycat", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select display type" />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                            <SelectItem value="Var">Var</SelectItem>
                            <SelectItem value="Qty">Qty</SelectItem>
                            <SelectItem value="Weight">Weight</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Price */}
            <div>
                <Label htmlFor="price" className="text-sm font-medium">
                    Price {formData.Displaycat !== "Var" && <span className="text-destructive">*</span>}
                </Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.Price || ""}
                    disabled={formData.Displaycat === "Var"}
                    onChange={(e) => handleFormFieldChange("Price", Number(e.target.value) || 0)}
                    className={`mt-1 ${formData.Displaycat === "Var" ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}`}
                    placeholder={formData.Displaycat === "Var" ? "Price varies by options" : "0.00"}
                />
                {formData.Displaycat === "Var" && (
                    <p className="text-xs text-gray-500 mt-1">
                        Price will be determined by selected options
                    </p>
                )}
            </div>

            {/* Image Upload */}
            <div>
                <Label className="text-sm font-medium">
                    Menu Item Image
                </Label>
                <div className="mt-1">
                    <ImageUpload
                        preview={preview}
                        setPreview={setPreview}
                        fileInputRef={fileInputRef}
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <Label htmlFor="description" className="text-sm font-medium">
                    Description
                </Label>
                <Textarea
                    id="description"
                    value={formData.Description}
                    onChange={(e) => handleFormFieldChange("Description", e.target.value)}
                    className="mt-1 min-h-[80px] resize-none"
                    placeholder="Brief description of this menu item..."
                    rows={3}
                    style={{
                        height: 'auto',
                        minHeight: '80px',
                        maxHeight: '120px'
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                />
            </div>
        </div>
    );
};

export default MenuItemTab;
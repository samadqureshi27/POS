"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Sparkles, X, Info } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import { Combobox } from "@/components/ui/combobox";
import { RecipeIngredientsList } from "../../recipes-management/_components/recipe-ingredients-list";
import { RecipeVariant, RecipeVariantFormData, VariantIngredient } from "@/lib/types/recipe-variants";
import { toast } from "sonner";

interface RecipeVariantModalProps {
  isOpen: boolean;
  editingItem: RecipeVariant | null;
  recipes: any[];
  ingredients: any[];
  onClose: () => void;
  onSubmit: (data: RecipeVariantFormData) => Promise<{ success: boolean; error?: string }>;
  actionLoading: boolean;
}

export default function RecipeVariantModal({
  isOpen,
  onClose,
  editingItem,
  recipes,
  ingredients,
  onSubmit,
  actionLoading,
}: RecipeVariantModalProps) {
  const [loading, setLoading] = useState(false);

  // Internal state uses array for UI convenience, but we send single recipeId to backend
  const [formData, setFormData] = useState<{
    recipeId: string[];
    name: string;
    description: string;
    type: "size" | "flavor" | "crust" | "custom";
    sizeMultiplier?: number;
    baseCostAdjustment?: number;
    crustType?: string;
    ingredients: VariantIngredient[];
    metadata: {
      menuDisplayName?: string;
      availability?: string[];
      appliesTo?: string[];
    };
  }>({
    recipeId: [],
    name: "",
    description: "",
    type: "size",
    sizeMultiplier: 1,
    baseCostAdjustment: 0,
    crustType: "",
    ingredients: [],
    metadata: {
      menuDisplayName: "",
      availability: [],
      appliesTo: [],
    },
  });

  const [variantIngredients, setVariantIngredients] = useState<VariantIngredient[]>([]);
  const [ingredientInputs, setIngredientInputs] = useState<{[key: number]: string}>({});
  const [showSuggestions, setShowSuggestions] = useState<{[key: number]: boolean}>({});
  const [focusedIngredientIndex, setFocusedIngredientIndex] = useState<number | null>(null);

  useEffect(() => {

    if (isOpen) {
      if (editingItem) {

        // Handle both camelCase and PascalCase field names from API
        const existingIngredients = editingItem.ingredients || (editingItem as any).Ingredients || [];

        // Handle recipeId which can be a string, object {_id, name, slug}, or array
        let recipeId = editingItem.recipeId || (editingItem as any).RecipeId || (editingItem as any).recipeID;

        // If recipeId is an object (populated), extract the _id
        if (recipeId && typeof recipeId === 'object' && !Array.isArray(recipeId)) {
          recipeId = (recipeId as any)._id;
        }

        const recipeIds = Array.isArray(recipeId)
          ? recipeId
          : [recipeId];

        const variantName = editingItem.name || (editingItem as any).Name || "";
        const variantDesc = editingItem.description || (editingItem as any).Description || "";
        const variantType = editingItem.type || (editingItem as any).Type || "size";
        const sizeMultiplier = editingItem.sizeMultiplier ?? (editingItem as any).SizeMultiplier ?? 1;
        const baseCostAdj = editingItem.baseCostAdjustment ?? (editingItem as any).BaseCostAdjustment ?? 0;
        const crustType = editingItem.crustType || (editingItem as any).CrustType || "";

        const newFormData = {
          recipeId: recipeIds.filter(Boolean), // Remove any null/undefined values
          name: variantName,
          description: variantDesc,
          type: variantType as "size" | "flavor" | "crust" | "custom",
          sizeMultiplier: sizeMultiplier,
          baseCostAdjustment: baseCostAdj,
          crustType: crustType,
          ingredients: existingIngredients,
          metadata: {
            menuDisplayName: editingItem.metadata?.menuDisplayName || (editingItem as any).Metadata?.MenuDisplayName || "",
            availability: editingItem.metadata?.availability || (editingItem as any).Metadata?.Availability || [],
            appliesTo: recipeIds.filter(Boolean),
          },
        };

        setFormData(newFormData);
        setVariantIngredients(existingIngredients);

        const inputs: {[key: number]: string} = {};
        existingIngredients.forEach((ing, index) => {
          inputs[index] = ing.nameSnapshot || "";
        });
        setIngredientInputs(inputs);
        setShowSuggestions({});

      } else {
        setFormData({
          recipeId: [],
          name: "",
          description: "",
          type: "size",
          sizeMultiplier: 1,
          baseCostAdjustment: 0,
          crustType: "",
          ingredients: [],
          metadata: { menuDisplayName: "", availability: [], appliesTo: [] },
        });
        setVariantIngredients([]);
        setIngredientInputs({});
        setShowSuggestions({});
      }
    }
  }, [isOpen, editingItem]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecipesChange = (selectedRecipes: string[]) => {
    setFormData((prev) => ({
      ...prev,
      recipeId: selectedRecipes,
      metadata: {
        ...prev.metadata,
        appliesTo: selectedRecipes,
      },
    }));
  };

  const handleAddIngredient = () => {
    const newIndex = variantIngredients.length;
    setVariantIngredients([
      ...variantIngredients,
      {
        sourceType: "inventory",
        sourceId: "",
        nameSnapshot: "",
        quantity: 0,
        unit: "",
        costPerUnit: 0,
      },
    ]);
    setIngredientInputs({ ...ingredientInputs, [newIndex]: "" });
    setShowSuggestions({ ...showSuggestions, [newIndex]: false });
  };

  const handleIngredientInputChange = (index: number, value: string) => {
    setIngredientInputs({ ...ingredientInputs, [index]: value });
    setShowSuggestions({ ...showSuggestions, [index]: true });
  };

  const handleToggleDropdown = (index: number) => {
    const currentState = showSuggestions[index] || false;
    setShowSuggestions({ ...showSuggestions, [index]: !currentState });
  };

  const getCompatibleUnits = (baseUnit: string): { value: string; label: string }[] => {
    const unit = baseUnit.toLowerCase();

    const weightUnits = ['g', 'kg', 'gram', 'grams', 'kilogram', 'kilograms', 'oz', 'ounce', 'ounces', 'lb', 'lbs', 'pound', 'pounds'];
    if (weightUnits.includes(unit)) {
      return [
        { value: 'g', label: 'Grams (g)' },
        { value: 'kg', label: 'Kilograms (kg)' },
        { value: 'oz', label: 'Ounces (oz)' },
        { value: 'lb', label: 'Pounds (lb)' },
      ];
    }

    const volumeUnits = ['ml', 'l', 'liter', 'liters', 'milliliter', 'milliliters', 'cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp', 'teaspoon', 'teaspoons', 'gallon', 'gallons', 'quart', 'quarts', 'pint', 'pints'];
    if (volumeUnits.includes(unit)) {
      return [
        { value: 'ml', label: 'Milliliters (ml)' },
        { value: 'L', label: 'Liters (L)' },
        { value: 'cup', label: 'Cups' },
        { value: 'tbsp', label: 'Tablespoons (tbsp)' },
        { value: 'tsp', label: 'Teaspoons (tsp)' },
      ];
    }

    const countUnits = ['pc', 'pcs', 'piece', 'pieces', 'count', 'unit', 'units', 'item', 'items', 'portion', 'portions'];
    if (countUnits.includes(unit)) {
      return [
        { value: 'pc', label: 'Pieces (pc)' },
        { value: 'portion', label: 'Portions' },
      ];
    }

    return [];
  };

  const selectIngredient = (index: number, item: any, sourceType: "inventory" | "recipe") => {
    const updated = [...variantIngredients];
    const itemId = item._id || item.id || item.ID;
    const itemName = item.Name || item.name;
    const itemUnit = item.Unit || item.baseUnit || (sourceType === "recipe" ? "portion" : "pc");

    updated[index] = {
      ...updated[index],
      sourceType,
      sourceId: String(itemId),
      nameSnapshot: itemName,
      unit: itemUnit,
    };

    setVariantIngredients(updated);
    setIngredientInputs({ ...ingredientInputs, [index]: itemName });
    setShowSuggestions({ ...showSuggestions, [index]: false });
  };

  const handleUpdateIngredient = (index: number, field: keyof VariantIngredient, value: any) => {
    const updated = [...variantIngredients];

    if (field === "sourceType") {
      updated[index] = {
        sourceType: value as "inventory" | "recipe",
        sourceId: "",
        nameSnapshot: "",
        quantity: updated[index].quantity || 0,
        unit: updated[index].unit || "",
        costPerUnit: updated[index].costPerUnit || 0,
      };
      setIngredientInputs({ ...ingredientInputs, [index]: "" });
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    setVariantIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setVariantIngredients(variantIngredients.filter((_, i) => i !== index));
    const newInputs = { ...ingredientInputs };
    const newSuggestions = { ...showSuggestions };
    delete newInputs[index];
    delete newSuggestions[index];

    const reindexedInputs: {[key: number]: string} = {};
    const reindexedSuggestions: {[key: number]: boolean} = {};
    Object.keys(newInputs).forEach((key) => {
      const oldIndex = parseInt(key);
      const newIndex = oldIndex > index ? oldIndex - 1 : oldIndex;
      reindexedInputs[newIndex] = newInputs[oldIndex];
    });
    Object.keys(newSuggestions).forEach((key) => {
      const oldIndex = parseInt(key);
      const newIndex = oldIndex > index ? oldIndex - 1 : oldIndex;
      reindexedSuggestions[newIndex] = newSuggestions[oldIndex];
    });

    setIngredientInputs(reindexedInputs);
    setShowSuggestions(reindexedSuggestions);
  };

  const getIngredientValidation = (ingredient: VariantIngredient): string[] => {
    const errors: string[] = [];
    if (!ingredient.sourceId) errors.push("Item not selected");
    if (!ingredient.quantity || ingredient.quantity <= 0) errors.push("Quantity");
    if (!ingredient.unit) errors.push("Unit");
    return errors;
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please enter a variation name", {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    const recipeIds = Array.isArray(formData.recipeId) ? formData.recipeId : [formData.recipeId];
    if (recipeIds.length === 0 || !recipeIds[0]) {
      toast.error("Please select at least one recipe", {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    const invalidIngredients = variantIngredients.filter(ing => {
      const errors = getIngredientValidation(ing);
      return errors.length > 0;
    });

    if (invalidIngredients.length > 0) {
      toast.error(`${invalidIngredients.length} ingredient(s) have missing information`, {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    // Send array of recipe IDs (supporting multiple recipes per variant)
    const submitData: RecipeVariantFormData = {
      ...formData,
      recipeId: recipeIds, // Send array of recipe IDs
      ingredients: variantIngredients,
      metadata: {
        ...formData.metadata,
        appliesTo: recipeIds, // Also set in metadata for clarity
      },
    };

    setLoading(true);
    try {
      await onSubmit(submitData);
    } finally {
      setLoading(false);
    }
  };

  // Professional POS variation types
  const variationTypes = [
    { value: "size", label: "Size (Small, Medium, Large, XL)" },
    { value: "flavor", label: "Flavor (Original, Spicy, Sweet, etc.)" },
    { value: "crust", label: "Crust Type (Thin, Thick, Stuffed, etc.)" },
    { value: "custom", label: "Custom Modifier" },
  ];

  // Convert recipes to multi-select options
  const recipeOptions = recipes.map((recipe) => ({
    value: String(recipe._id || recipe.ID),
    label: recipe.name || recipe.Name,
  }));

  const selectedRecipes = Array.isArray(formData.recipeId) ? formData.recipeId : [formData.recipeId];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="4xl" fullHeight onInteractOutside={(e) => e.preventDefault()}>
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0 flex flex-col">
          <DialogTitle className="text-xl font-bold text-gray-900 flex  gap-2">
            <Sparkles className="h-5 w-5 text-gray-700" />
            {editingItem ? "Edit Recipe Variant" : "Create Recipe Variant"}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {editingItem ? "Update variant details" : "Create a modifier that can be applied to multiple recipes"}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 min-h-0">
          {/* Recipe Selection - Multi-Select */}
          <div className="space-y-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Applies To Recipes</h3>
                <p className="text-xs text-blue-700 mb-3">
                  Select one or more recipes this variation applies to. In professional POS systems like Square and Toast,
                  modifiers can be shared across multiple menu items for efficiency.
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="recipes" className="text-sm font-medium text-gray-700">
                Select Recipes <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Type to search and select multiple recipes
              </p>
              <MultiSelectCombobox
                options={recipeOptions}
                value={selectedRecipes.filter(Boolean)}
                onChange={handleRecipesChange}
                placeholder="Search and select recipes..."
                searchPlaceholder="Type to search recipes..."
                emptyText="No recipes found"
                className="w-full"
              />
            </div>
          </div>

          {/* Variant Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Variant Details</h3>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Variant Name <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Clear, descriptive name (e.g., "Large", "Extra Spicy", "Stuffed Crust")
              </p>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="e.g., Large, Extra Spicy, Gluten-Free"
                className="h-10 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Customer-facing description of this variation..."
                className="min-h-[80px] resize-none rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {/* Type - Combobox with Search */}
            <div>
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                Variation Type <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Category helps organize modifiers in your POS
              </p>
              <Combobox
                options={variationTypes}
                value={formData.type}
                onChange={(value: any) => handleFieldChange("type", value)}
                placeholder="Select variation type..."
                searchPlaceholder="Search types..."
                className="w-full"
              />
            </div>

            {/* Conditional Fields Based on Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Size Multiplier (if type is size) */}
              {formData.type === "size" && (
                <div>
                  <Label htmlFor="sizeMultiplier" className="text-sm font-medium text-gray-700">
                    Size Multiplier
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Portion size (1.0 = regular, 2.0 = double)
                  </p>
                  <Input
                    id="sizeMultiplier"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.sizeMultiplier ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleFieldChange("sizeMultiplier", val === '' ? 1 : parseFloat(val) || 1);
                    }}
                    onFocus={(e) => e.target.select()}
                    placeholder="1.0"
                    className="h-10 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Crust Type (if type is crust) */}
              {formData.type === "crust" && (
                <div>
                  <Label htmlFor="crustType" className="text-sm font-medium text-gray-700">
                    Crust Type
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Specify the crust style
                  </p>
                  <Input
                    id="crustType"
                    value={formData.crustType ?? ''}
                    onChange={(e) => handleFieldChange("crustType", e.target.value)}
                    placeholder="e.g., Stuffed, Thin, Pan"
                    className="h-10 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Base Cost Adjustment */}
              <div>
                <Label htmlFor="baseCostAdjustment" className="text-sm font-medium text-gray-700">
                  Price Modifier ($)
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Additional charge for this option
                </p>
                <Input
                  id="baseCostAdjustment"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.baseCostAdjustment === 0 ? '' : (formData.baseCostAdjustment ?? '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleFieldChange("baseCostAdjustment", val === '' ? 0 : parseFloat(val) || 0);
                  }}
                  onFocus={(e) => e.target.select()}
                  placeholder="0.00"
                  className="h-10 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Additional Ingredients</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Add extra ingredients or adjust quantities for this variation
                </p>
              </div>
              <Button
                type="button"
                onClick={handleAddIngredient}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Ingredients List */}
            <RecipeIngredientsList
              ingredients={variantIngredients}
              ingredientInputs={ingredientInputs}
              showSuggestions={showSuggestions}
              inventoryItems={ingredients}
              availableRecipes={recipes}
              getIngredientValidation={getIngredientValidation}
              getCompatibleUnits={getCompatibleUnits}
              onIngredientInputChange={handleIngredientInputChange}
              onToggleDropdown={handleToggleDropdown}
              onSelectIngredient={selectIngredient}
              onUpdateIngredient={handleUpdateIngredient as any}
              onRemoveIngredient={handleRemoveIngredient}
              setFocusedIngredientIndex={setFocusedIngredientIndex}
              setShowSuggestions={setShowSuggestions}
              recipeType="final"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
          <div className="text-xs text-gray-600">
            Applies to {selectedRecipes.filter(Boolean).length} recipe(s) • {variantIngredients.length} ingredient{variantIngredients.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="h-9"
              disabled={loading || actionLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || selectedRecipes.filter(Boolean).length === 0 || loading || actionLoading}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-9"
            >
              {loading || actionLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {editingItem ? "Update" : "Create"} Variant
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, UtensilsCrossed, Sparkles, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { RecipeIngredientsList } from "./recipe-ingredients-list";
import { RecipeVariantInput } from "./recipe-variant-input";
import { RecipeVariantInline } from "@/lib/types/recipes";
import { toast } from "sonner";

// API Recipe structure
interface RecipeIngredient {
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot?: string;
  quantity: number;
  unit: string;
  convertToUnit?: string;
}

interface Recipe {
  _id?: string;
  name: string;
  type: "sub" | "final";
  description?: string;
  ingredients: RecipeIngredient[];
  isActive?: boolean;
  totalCost?: number;
  createdAt?: string;
  updatedAt?: string;
  variations?: RecipeVariantInline[];
}

interface RecipeOption {
  ID: number;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  type?: "sub" | "final";
  Priority?: number;
  _id?: string;
  ingredients?: RecipeIngredient[];
}

interface InventoryItem {
  ID?: number | string;
  _id?: string;
  id?: string;
  Name?: string;
  name?: string;
  Unit?: string;
  baseUnit?: string;
  type?: "stock" | "service";
  quantity?: number;
  reorderPoint?: number;
  sku?: string;
}

interface RecipeModalProps {
  isOpen: boolean;
  editingItem: RecipeOption | null;
  ingredients: InventoryItem[];
  availableRecipeOptions: any[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
  actionLoading: boolean;
}

export default function RecipeModal({
  isOpen,
  onClose,
  editingItem,
  ingredients,
  availableRecipeOptions,
  onSubmit,
  actionLoading,
}: RecipeModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Recipe>>({
    name: "",
    type: "final",
    description: "",
    ingredients: [],
    isActive: true,
    variations: [],
  });

  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [ingredientInputs, setIngredientInputs] = useState<{[key: number]: string}>({});
  const [showSuggestions, setShowSuggestions] = useState<{[key: number]: boolean}>({});
  const [focusedIngredientIndex, setFocusedIngredientIndex] = useState<number | null>(null);
  const [variants, setVariants] = useState<RecipeVariantInline[]>([]);
  const [isVariantsExpanded, setIsVariantsExpanded] = useState(false);
  const [isIngredientsExpanded, setIsIngredientsExpanded] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Debug logging
      console.log("🔍 Recipe Modal Opened");
      console.log("📦 Available Inventory Items:", ingredients?.length || 0, ingredients);
      console.log("🍲 Available Recipe Options:", availableRecipeOptions?.length || 0);

      if (editingItem) {
        const existingIngredients = editingItem.ingredients || [];
        const existingVariants: RecipeVariantInline[] = (editingItem as any).variations || [];
        setFormData({
          name: editingItem.Name,
          type: editingItem.type || "sub",
          description: editingItem.Description,
          isActive: editingItem.Status === "Active",
          ingredients: existingIngredients,
          variations: existingVariants,
        });
        setRecipeIngredients(existingIngredients);
        setVariants(existingVariants);
        setIsVariantsExpanded(existingVariants.length > 0);
        setIsIngredientsExpanded(true);

        const inputs: {[key: number]: string} = {};
        existingIngredients.forEach((ing, index) => {
          inputs[index] = ing.nameSnapshot || "";
        });
        setIngredientInputs(inputs);
        setShowSuggestions({});
      } else {
        setFormData({
          name: "",
          type: "sub",
          description: "",
          ingredients: [],
          isActive: true,
          variations: [],
        });
        setRecipeIngredients([]);
        setVariants([]);
        setIsVariantsExpanded(false);
        setIsIngredientsExpanded(true);
        setIngredientInputs({});
        setShowSuggestions({});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingItem]);

  const handleFieldChange = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddIngredient = () => {
    const newIndex = recipeIngredients.length;
    setRecipeIngredients([
      ...recipeIngredients,
      {
        sourceType: "inventory",
        sourceId: "",
        nameSnapshot: "",
        quantity: 0,
        unit: "",
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
    const updated = [...recipeIngredients];
    const itemId = item._id || item.id || item.ID;
    const itemName = item.Name || item.name;
    const itemUnit = item.Unit || item.baseUnit || (sourceType === "recipe" ? "portion" : "pc");

    updated[index] = {
      ...updated[index],
      sourceType,
      sourceId: String(itemId),
      nameSnapshot: itemName,
      unit: itemUnit,
      convertToUnit: undefined,
    };

    setRecipeIngredients(updated);
    setIngredientInputs({ ...ingredientInputs, [index]: itemName });
    setShowSuggestions({ ...showSuggestions, [index]: false });
  };

  const handleUpdateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    const updated = [...recipeIngredients];

    if (field === "sourceType") {
      updated[index] = {
        sourceType: value as "inventory" | "recipe",
        sourceId: "",
        nameSnapshot: "",
        quantity: updated[index].quantity || 0,
        unit: updated[index].unit || "",
      };
      setIngredientInputs({ ...ingredientInputs, [index]: "" });
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    setRecipeIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
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

  const getIngredientValidation = (ingredient: RecipeIngredient): string[] => {
    const errors: string[] = [];
    if (!ingredient.sourceId) errors.push("Item not selected");
    if (!ingredient.quantity || ingredient.quantity <= 0) errors.push("Quantity");
    if (!ingredient.unit) errors.push("Unit");
    return errors;
  };

  // Variant management functions
  const handleAddVariant = () => {
    const newVariant: RecipeVariantInline = {
      name: "",
      description: "",
      type: "size",
      sizeMultiplier: 1,
      baseCostAdjustment: 0,
      ingredients: [],
      isActive: true,
    };
    setVariants([...variants, newVariant]);
    setIsVariantsExpanded(true);
  };

  const handleUpdateVariant = (index: number, field: keyof RecipeVariantInline, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please enter a recipe name", {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    const invalidIngredients = recipeIngredients.filter(ing => {
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

    // Validate variants if any exist
    const invalidVariants = variants.filter(v => !v.name || !v.type);
    if (invalidVariants.length > 0) {
      toast.error(`${invalidVariants.length} variant(s) are missing required fields (name or type)`, {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    const submitData = {
      ...formData,
      ingredients: recipeIngredients,
      variations: variants.length > 0 ? variants : undefined, // Only include if variants exist
    };

    setLoading(true);
    try {
      await onSubmit(submitData);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = (recipeType: "sub" | "final") => (
    <div className="space-y-8">
      {/* Name */}
      <div>
        <Label className="text-sm font-medium text-[#656565] mb-1.5">
          Recipe Name <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder={recipeType === "sub" ? "e.g., Burger Sauce, Grilled Patty" : "e.g., Cheeseburger, Caesar Salad"}
          className="mt-1.5"
        />
      </div>

      {/* Description */}
      <div>
        <Label className="text-sm font-medium text-[#656565] mb-1.5">Description (Optional)</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Brief description..."
          className="mt-1.5 min-h-[80px] resize-none"
          rows={3}
        />
      </div>

      {/* Active Status */}
      <div className="w-full">
        <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3 w-full">
          <span className="text-[#1f2937] text-sm font-medium">Active</span>
          <Switch
            checked={formData.isActive === true}
            onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
          />
        </div>
      </div>

      {/* Variants Section - Only for Final Recipes */}
      {recipeType === "final" && (
        <div className="space-y-3">
          {/* Variants Section Header */}
          <div className="border border-[#d5d5dd] bg-[#f8f8fa] rounded-sm p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-[#656565]">
                  Recipe Variants
                </Label>
                <CustomTooltip label="Add size, flavor, or crust variants for this recipe" direction="right">
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                </CustomTooltip>
                {variants.length > 0 && (
                  <span className="text-xs font-semibold bg-[#1f2937] text-white px-2 py-0.5 rounded-full">
                    {variants.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsVariantsExpanded(!isVariantsExpanded)}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
              >
                {isVariantsExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Variants List */}
          {isVariantsExpanded && (
            <div className="space-y-3 animate-in slide-in-from-top-2">
              {variants.length > 0 ? (
                <>
                  {variants.map((variant, index) => (
                    <RecipeVariantInput
                      key={index}
                      variant={variant}
                      index={index}
                      ingredients={ingredients}
                      availableRecipeOptions={availableRecipeOptions}
                      onUpdate={handleUpdateVariant}
                      onRemove={handleRemoveVariant}
                    />
                  ))}

                  {/* Add Variant Button - Full Width Below List */}
                  <Button
                    type="button"
                    onClick={handleAddVariant}
                    variant="outline"
                    className="w-full mt-4 px-8 h-11 border-gray-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative overflow-hidden rounded-sm border border-dashed border-[#d5d5dd] bg-[#f8f8fa] p-12 text-center transition-all">
                    <div className="relative z-10">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-[#1f2937] shadow-lg">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-[#1f2937]">No Variants Yet</h3>
                      <p className="mx-auto max-w-sm text-sm text-[#656565]">
                        Start building your recipe by clicking the <span className="font-semibold text-[#1f2937]">"Add Variant"</span> button below
                      </p>
                    </div>
                  </div>
                  
                  {/* Add Variant Button - Below empty state */}
                  <Button
                    type="button"
                    onClick={handleAddVariant}
                    variant="outline"
                    className="w-full mt-4 px-8 h-11 border-gray-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ingredients Section Header */}
      <div className="border border-[#d5d5dd] bg-[#f8f8fa] rounded-sm p-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-[#656565]">Ingredients</Label>
            <CustomTooltip label={recipeType === "sub" ? "Add inventory items to this sub recipe" : "Add inventory items or sub recipes to this recipe"} direction="right">
              <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
            </CustomTooltip>
            {recipeIngredients.length > 0 && (
              <span className="text-xs font-semibold bg-[#1f2937] text-white px-2 py-0.5 rounded-full">
                {recipeIngredients.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsIngredientsExpanded(!isIngredientsExpanded)}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
          >
            {isIngredientsExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Ingredients List */}
      {isIngredientsExpanded && (
        <div className="relative space-y-3 animate-in slide-in-from-top-2">
          <RecipeIngredientsList
            ingredients={recipeIngredients}
            ingredientInputs={ingredientInputs}
            showSuggestions={showSuggestions}
            inventoryItems={ingredients}
            availableRecipes={availableRecipeOptions}
            getIngredientValidation={getIngredientValidation}
            getCompatibleUnits={getCompatibleUnits}
            onIngredientInputChange={handleIngredientInputChange}
            onToggleDropdown={handleToggleDropdown}
            onSelectIngredient={selectIngredient}
            onUpdateIngredient={handleUpdateIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            setFocusedIngredientIndex={setFocusedIngredientIndex}
            setShowSuggestions={setShowSuggestions}
            recipeType={recipeType}
          />
          
          {/* Add Ingredient Button - Full Width Below List */}
          <Button
            type="button"
            onClick={handleAddIngredient}
            variant="outline"
            className="w-full mt-4 px-8 h-11 border-gray-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        size="4xl" 
        fullHeight 
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingItem ? "Edit Recipe" : "Create Recipe"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={formData.type}
          onValueChange={(value) => handleFieldChange("type", value as "sub" | "final")}
        >
          <div className="px-8 pb-6 pt-2 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="final">
                Final Recipe
              </TabsTrigger>
              <TabsTrigger value="sub">
                Sub Recipe
              </TabsTrigger>
            </TabsList>
          </div>

          <DialogBody className="space-y-8">
            <TabsContent value="final" className="mt-0 h-full">
              {renderTabContent("final")}
            </TabsContent>
            <TabsContent value="sub" className="mt-0 h-full">
              {renderTabContent("sub")}
            </TabsContent>
          </DialogBody>
        </Tabs>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!formData.name || loading || actionLoading}
            className="bg-black hover:bg-gray-800 text-white px-8 h-11"
          >
            {loading || actionLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {editingItem ? "Update" : "Submit"}
              </>
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-8 h-11 border-gray-300"
            disabled={loading || actionLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, UtensilsCrossed, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="space-y-5">
      {/* Name */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Recipe Name <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder={recipeType === "sub" ? "e.g., Burger Sauce, Grilled Patty" : "e.g., Cheeseburger, Caesar Salad"}
          className="h-10 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Description (Optional)</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Brief description..."
          className="min-h-[80px] resize-none rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Active Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold text-gray-900">Active Status</Label>
          <p className="text-xs text-gray-600 mt-0.5">
            {formData.isActive ? "Recipe is active" : "Recipe is inactive"}
          </p>
        </div>
        <Switch
          checked={formData.isActive === true}
          onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
          className="data-[state=checked]:bg-green-600"
        />
      </div>

      {/* Variants Section - Only for Final Recipes */}
      {recipeType === "final" && (
        <div className="space-y-3">
          {/* Accordion Header */}
          <div className="bg-gradient-to-r from-amber-50 to-white border-2 border-amber-200 rounded-lg">
            <button
              type="button"
              onClick={() => setIsVariantsExpanded(!isVariantsExpanded)}
              className="w-full p-4 flex items-center justify-between hover:bg-amber-50/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold text-gray-900">
                  Recipe Variants (Optional)
                </Label>
                {variants.length > 0 && (
                  <span className="text-xs font-semibold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    {variants.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-600">
                  Add size, flavor, or crust variants
                </p>
                {isVariantsExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
              </div>
            </button>
          </div>

          {/* Accordion Content */}
          {isVariantsExpanded && (
            <div className="space-y-3 animate-in slide-in-from-top-2">
              <p className="text-xs text-muted-foreground px-1">
                Create variants for this recipe (e.g., Small/Medium/Large sizes, different flavors).
                You can also manage variants separately from the Recipes Options page.
              </p>

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

              <Button
                type="button"
                onClick={handleAddVariant}
                variant="outline"
                className="w-full border-dashed border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Ingredients Section Header */}
      <div className={`bg-gradient-to-r ${recipeType === "sub" ? "from-purple-50 to-white border-purple-200" : "from-blue-50 to-white border-blue-200"} border-2 rounded-lg p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-semibold text-gray-900">Ingredients</Label>
            <p className="text-xs text-gray-600 mt-0.5">
              {recipeType === "sub" ? "Add inventory items" : "Add inventory items or sub recipes"}
            </p>
          </div>
          <div className="text-xs font-semibold text-gray-600">
            {recipeIngredients.length} item{recipeIngredients.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="relative">
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

        {/* Floating Add Button - Bottom Right */}
        <button
          type="button"
          onClick={handleAddIngredient}
          className={`fixed bottom-24 right-11 z-50 w-14 h-14 rounded-full shadow-xl ${recipeType === "sub" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"} text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-opacity-50 ${recipeType === "sub" ? "focus:ring-purple-400" : "focus:ring-blue-400"}`}
          title="Add Ingredient"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="4xl" fullHeight onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Recipe" : "Create Recipe"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={formData.type}
          onValueChange={(value) => handleFieldChange("type", value as "sub" | "final")}
        >
          <div className="px-8 pb-6 pt-2 flex-shrink-0 border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="final">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Final Recipe
              </TabsTrigger>
              <TabsTrigger value="sub">
                <UtensilsCrossed className="h-3.5 w-3.5 mr-1.5" />
                Sub Recipe
              </TabsTrigger>
            </TabsList>
          </div>

          <DialogBody className="space-y-6">
            <TabsContent value="final" className="mt-0 space-y-6 h-full">
              {renderTabContent("final")}
            </TabsContent>
            <TabsContent value="sub" className="mt-0 space-y-6 h-full">
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

"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, UtensilsCrossed, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RecipeIngredientsList } from "./recipe-ingredients-list";

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
  showToast: (message: string, type?: "success" | "error" | "warning" | "info") => void;
}

export default function RecipeModal({
  isOpen,
  onClose,
  editingItem,
  ingredients,
  availableRecipeOptions,
  onSubmit,
  actionLoading,
  showToast,
}: RecipeModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Recipe>>({
    name: "",
    type: "final",
    description: "",
    ingredients: [],
    isActive: true,
  });

  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [ingredientInputs, setIngredientInputs] = useState<{[key: number]: string}>({});
  const [showSuggestions, setShowSuggestions] = useState<{[key: number]: boolean}>({});
  const [focusedIngredientIndex, setFocusedIngredientIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        const existingIngredients = editingItem.ingredients || [];
        setFormData({
          name: editingItem.Name,
          type: editingItem.type || "sub",
          description: editingItem.Description,
          isActive: editingItem.Status === "Active",
          ingredients: existingIngredients,
        });
        setRecipeIngredients(existingIngredients);

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
        });
        setRecipeIngredients([]);
        setIngredientInputs({});
        setShowSuggestions({});
      }
    }
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

  const handleSave = async () => {
    if (!formData.name) {
      showToast("Please enter a recipe name", "error");
      return;
    }

    const invalidIngredients = recipeIngredients.filter(ing => {
      const errors = getIngredientValidation(ing);
      return errors.length > 0;
    });

    if (invalidIngredients.length > 0) {
      showToast(`${invalidIngredients.length} ingredient(s) have missing information`, "error");
      return;
    }

    const submitData = {
      ...formData,
      ingredients: recipeIngredients,
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

      {/* Add Ingredient Button */}
      <div className={`bg-gradient-to-r ${recipeType === "sub" ? "from-purple-50 to-white border-purple-200" : "from-blue-50 to-white border-blue-200"} border-2 rounded-lg p-4 flex items-center justify-between`}>
        <div>
          <Label className="text-sm font-semibold text-gray-900">Ingredients</Label>
          <p className="text-xs text-gray-600 mt-0.5">
            {recipeType === "sub" ? "Add inventory items" : "Add inventory items or sub recipes"}
          </p>
        </div>
        <Button
          type="button"
          onClick={handleAddIngredient}
          size="sm"
          className={`${recipeType === "sub" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Ingredients List */}
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
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="4xl" fullHeight>
      <DialogContent size="4xl" fullHeight>
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-gray-700" />
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingItem ? "Edit Recipe" : "Create Recipe"}
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {editingItem ? "Update recipe details" : "Build your recipe by adding ingredients"}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <Tabs
            value={formData.type}
            onValueChange={(value) => handleFieldChange("type", value as "sub" | "final")}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Tab List */}
            <div className="px-5 pt-3 pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex flex-col gap-2">
                <div className="flex justify-center">
                  <TabsList className="grid w-full max-w-sm grid-cols-2 h-9">
                    <TabsTrigger value="final" className="text-sm gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Final Recipe
                    </TabsTrigger>
                    <TabsTrigger value="sub" className="text-sm gap-1.5">
                      <UtensilsCrossed className="h-3.5 w-3.5" />
                      Sub Recipe
                    </TabsTrigger>
                  </TabsList>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {formData.type === "sub"
                    ? "Components that can be reused in other recipes"
                    : "Complete menu items ready to serve"}
                </p>
              </div>
            </div>
              
              

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 min-h-0">
              <TabsContent value="final" className="mt-0">
                {renderTabContent("final")}
              </TabsContent>
              <TabsContent value="sub" className="mt-0">
                {renderTabContent("sub")}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
          <div className="text-xs text-gray-600">
            {recipeIngredients.length} ingredient{recipeIngredients.length !== 1 ? 's' : ''} added
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="h-9"
              disabled={loading || actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || loading || actionLoading}
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
                  {editingItem ? "Update" : "Create"} Recipe
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

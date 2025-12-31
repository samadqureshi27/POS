"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, X, Search, UtensilsCrossed, Sparkles, Package, ChefHat, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { cn } from "@/lib/utils";
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

interface RecipeVariantInline {
  name: string;
  description?: string;
  type: "size" | "flavor" | "crust" | "addon" | "custom";
  sizeMultiplier?: number;
  baseCostAdjustment?: number;
  ingredients?: RecipeIngredient[];
  isActive: boolean;
  crustType?: string;
}

interface Recipe {
  _id?: string;
  name: string;
  type: "sub" | "final";
  description?: string;
  ingredients: RecipeIngredient[];
  isActive?: boolean;
  totalCost?: number;
  yield?: number;
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

export default function RecipeModalNew({
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
    yield: 1,
  });

  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [variants, setVariants] = useState<RecipeVariantInline[]>([]);

  // Search states
  const [inventorySearch, setInventorySearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");

  // Drag and drop states
  const [draggedInventory, setDraggedInventory] = useState<string | null>(null);
  const [draggedRecipe, setDraggedRecipe] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
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
          yield: 1,
        });
        setRecipeIngredients(existingIngredients);
        setVariants(existingVariants);
      } else {
        setFormData({
          name: "",
          type: "final",
          description: "",
          ingredients: [],
          isActive: true,
          variations: [],
          yield: 1,
        });
        setRecipeIngredients([]);
        setVariants([]);
      }
      setInventorySearch("");
      setRecipeSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingItem]);

  const handleFieldChange = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Drag handlers for inventory items
  const handleInventoryDragStart = (itemId: string) => {
    setDraggedInventory(itemId);
  };

  const handleInventoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleInventoryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedInventory) return;

    const item = ingredients.find(
      (inv) => String(inv._id || inv.id || inv.ID) === draggedInventory
    );

    if (item) {
      const itemId = String(item._id || item.id || item.ID);
      const itemName = item.Name || item.name || "";
      const itemUnit = item.Unit || item.baseUnit || "pc";

      // Check if already added
      const exists = recipeIngredients.some(ing => ing.sourceId === itemId);
      if (exists) {
        toast.error("This item is already added to ingredients", {
          duration: 3000,
          position: "top-right",
        });
        setDraggedInventory(null);
        return;
      }

      const newIngredient: RecipeIngredient = {
        sourceType: "inventory",
        sourceId: itemId,
        nameSnapshot: itemName,
        quantity: 1,
        unit: itemUnit,
      };

      setRecipeIngredients([...recipeIngredients, newIngredient]);
      toast.success(`Added ${itemName} to ingredients`, {
        duration: 2000,
        position: "top-right",
      });
    }

    setDraggedInventory(null);
  };

  // Drag handlers for sub recipes
  const handleRecipeDragStart = (recipeId: string) => {
    setDraggedRecipe(recipeId);
  };

  const handleRecipeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRecipeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedRecipe) return;

    const recipe = availableRecipeOptions.find(
      (rec) => String(rec._id || rec.ID) === draggedRecipe
    );

    if (recipe) {
      const recipeId = String(recipe._id || recipe.ID);
      const recipeName = recipe.Name || "";

      // Check if already added
      const exists = recipeIngredients.some(ing => ing.sourceId === recipeId);
      if (exists) {
        toast.error("This recipe is already added to ingredients", {
          duration: 3000,
          position: "top-right",
        });
        setDraggedRecipe(null);
        return;
      }

      const newIngredient: RecipeIngredient = {
        sourceType: "recipe",
        sourceId: recipeId,
        nameSnapshot: recipeName,
        quantity: 1,
        unit: "portion",
      };

      setRecipeIngredients([...recipeIngredients, newIngredient]);
      toast.success(`Added ${recipeName} to ingredients`, {
        duration: 2000,
        position: "top-right",
      });
    }

    setDraggedRecipe(null);
  };

  // Ingredient management
  const handleRemoveIngredient = (index: number) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  };

  const handleUpdateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    const updated = [...recipeIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipeIngredients(updated);
  };

  // Variant management
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
  };

  // Add standard size variants
  const handleAddStandardSize = (sizeName: string, multiplier: number) => {
    // Check if size already exists
    const exists = variants.some(v => v.name.toLowerCase() === sizeName.toLowerCase() && v.type === "size");
    if (exists) {
      toast.error(`${sizeName} size variant already exists`, {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    const newVariant: RecipeVariantInline = {
      name: sizeName,
      description: `${sizeName} size`,
      type: "size",
      sizeMultiplier: multiplier,
      baseCostAdjustment: 0,
      ingredients: [],
      isActive: true,
    };
    setVariants([...variants, newVariant]);
    toast.success(`${sizeName} size added`, {
      duration: 2000,
      position: "top-right",
    });
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

    if (recipeIngredients.length === 0) {
      toast.error("Please add at least one ingredient", {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    const invalidIngredients = recipeIngredients.filter(
      (ing) => !ing.sourceId || !ing.quantity || ing.quantity <= 0 || !ing.unit
    );

    if (invalidIngredients.length > 0) {
      toast.error(`${invalidIngredients.length} ingredient(s) have missing information`, {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    // Validate variants if any exist
    const invalidVariants = variants.filter((v) => !v.name || !v.type);
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
      variations: variants.length > 0 ? variants : undefined,
    };

    setLoading(true);
    try {
      await onSubmit(submitData);
    } finally {
      setLoading(false);
    }
  };

  // Filter inventory and recipes
  const filteredInventory = ingredients.filter((item) => {
    const name = (item.Name || item.name || "").toLowerCase();
    const sku = (item.sku || "").toLowerCase();
    const search = inventorySearch.toLowerCase();
    return name.includes(search) || sku.includes(search);
  });

  const filteredRecipes = availableRecipeOptions.filter((recipe) => {
    const name = (recipe.Name || "").toLowerCase();
    const search = recipeSearch.toLowerCase();
    return name.includes(search) && recipe.type === "sub";
  });

  const getCompatibleUnits = (baseUnit: string): string[] => {
    const unit = baseUnit.toLowerCase();

    const weightUnits = ["g", "kg", "gram", "grams", "kilogram", "kilograms", "oz", "ounce", "ounces", "lb", "lbs", "pound", "pounds"];
    if (weightUnits.includes(unit)) {
      return ["g", "kg", "oz", "lb"];
    }

    const volumeUnits = ["ml", "l", "liter", "liters", "milliliter", "milliliters", "cup", "cups", "tbsp", "tablespoon", "tablespoons", "tsp", "teaspoon", "teaspoons", "gallon", "gallons"];
    if (volumeUnits.includes(unit)) {
      return ["ml", "l", "cup", "tbsp", "tsp"];
    }

    const countUnits = ["pc", "pcs", "piece", "pieces", "portion", "portions"];
    if (countUnits.includes(unit)) {
      return ["pc", "portion"];
    }

    return [baseUnit];
  };

  const renderTabContent = (recipeType: "sub" | "final") => (
    <div className="flex gap-4 h-full">
      {/* Left Panel - Inventory Items */}
      <div className="w-72 flex flex-col border-r border-[#d5d5dd] pr-4 shrink-0">
        <div className="mb-3 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-[#656565]" />
            <Label className="text-xs font-bold text-[#656565] uppercase tracking-wider">
              Inventory Items
            </Label>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              placeholder="Search inventory..."
              className="pl-9 h-9 text-sm border-[#d5d5dd]"
            />
          </div>
        </div>

        <div className="overflow-y-auto space-y-1.5 pr-1 scrollbar-invisible" style={{ maxHeight: 'calc(90vh - 340px)' }}>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No inventory items</p>
            </div>
          ) : (
            filteredInventory.map((item) => {
              const itemId = String(item._id || item.id || item.ID);
              const itemName = item.Name || item.name || "";
              const itemUnit = item.Unit || item.baseUnit || "pc";
              const isAdded = recipeIngredients.some(ing => ing.sourceId === itemId);

              return (
                <div
                  key={itemId}
                  draggable
                  onDragStart={() => handleInventoryDragStart(itemId)}
                  className={cn(
                    "group relative bg-white border border-[#d5d5dd] rounded-sm p-2.5 cursor-grab active:cursor-grabbing transition-all duration-200",
                    isAdded
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-blue-400 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-sm flex items-center justify-center bg-orange-50/50 border border-orange-100/50 text-orange-600 shrink-0">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{itemName}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {itemUnit}
                      </div>
                    </div>
                  </div>
                  {isAdded && (
                    <div className="absolute top-1 right-1">
                      <span className="text-[9px] font-black bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                        ADDED
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Center Panel - Recipe Form */}
      <div className="flex-1 px-2 overflow-hidden flex flex-col">
        <div className="space-y-6 overflow-y-auto pr-2 scrollbar-invisible" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {/* Name */}
          <div>
            <Label className="text-sm font-medium text-[#656565] mb-1.5">
              Recipe Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder={
                recipeType === "sub"
                  ? "e.g., Burger Sauce, Grilled Patty"
                  : "e.g., Cheeseburger, Caesar Salad"
              }
              className="mt-1.5 border-[#d5d5dd]"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-[#656565] mb-1.5">Description (Optional)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Brief description..."
              className="mt-1.5 min-h-[80px] resize-none border-[#d5d5dd]"
              rows={3}
            />
          </div>

          {/* Yield */}
          <div>
            <Label className="text-sm font-medium text-[#656565] mb-1.5">
              Yield (Portions)
            </Label>
            <Input
              type="number"
              min="1"
              value={formData.yield || 1}
              onChange={(e) => handleFieldChange("yield", parseInt(e.target.value) || 1)}
              className="mt-1.5 border-[#d5d5dd]"
            />
          </div>

          {/* Active Status */}
          <div className="w-full">
            <div className="flex items-center justify-between rounded-sm border border-[#d5d5dd] bg-[#f8f8fa] px-4 py-3 w-full">
              <span className="text-[#1f2937] text-sm font-medium">Active</span>
              <Switch
                checked={formData.isActive === true}
                onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
              />
            </div>
          </div>

          {/* Ingredients Drop Zone */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Label className="text-sm font-medium text-[#656565]">
                Ingredients <span className="text-red-500">*</span>
              </Label>
              <CustomTooltip
                label="Drag items from the side panels or click to add"
                direction="right"
              >
                <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
              </CustomTooltip>
              {recipeIngredients.length > 0 && (
                <span className="text-xs font-semibold bg-[#1f2937] text-white px-2 py-0.5 rounded-full">
                  {recipeIngredients.length}
                </span>
              )}
            </div>

            <div
              onDragOver={(e) => {
                handleInventoryDragOver(e);
                handleRecipeDragOver(e);
              }}
              onDrop={(e) => {
                if (draggedInventory) handleInventoryDrop(e);
                if (draggedRecipe) handleRecipeDrop(e);
              }}
              className={cn(
                "rounded-sm border-2 border-dashed p-4 transition-all duration-200 min-h-[200px] max-h-[300px] overflow-y-auto scrollbar-invisible",
                recipeIngredients.length > 0
                  ? "bg-blue-50/30 border-blue-300"
                  : "bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
              )}
            >
              {recipeIngredients.length === 0 ? (
                <div className="text-center py-8">
                  <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-600 mb-1">No ingredients yet</p>
                  <p className="text-xs text-gray-400">
                    Drag items from left or right panel
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pr-1">
                  {recipeIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="bg-white border border-[#d5d5dd] rounded-sm p-3 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {ingredient.sourceType === "inventory" ? (
                              <Package className="h-4 w-4 text-orange-600" />
                            ) : (
                              <ChefHat className="h-4 w-4 text-purple-600" />
                            )}
                            <span className="text-sm font-bold text-gray-900">
                              {ingredient.nameSnapshot}
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest border text-gray-600 bg-gray-50 border-gray-200">
                              {ingredient.sourceType}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-gray-500 mb-1">Quantity</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={ingredient.quantity}
                                onChange={(e) =>
                                  handleUpdateIngredient(index, "quantity", parseFloat(e.target.value) || 0)
                                }
                                className="h-8 text-sm border-[#d5d5dd]"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500 mb-1">Unit</Label>
                              <select
                                value={ingredient.unit}
                                onChange={(e) =>
                                  handleUpdateIngredient(index, "unit", e.target.value)
                                }
                                className="h-8 w-full text-sm border border-[#d5d5dd] rounded-sm px-2 bg-white"
                              >
                                {getCompatibleUnits(ingredient.unit).map((unit) => (
                                  <option key={unit} value={unit}>
                                    {unit}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="shrink-0 h-6 w-6 rounded-sm flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variants Section - Only for Final Recipes */}
          {recipeType === "final" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-[#656565]">Recipe Variants</Label>
                  <CustomTooltip label="Add size, flavor, or crust variants" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                  {variants.length > 0 && (
                    <span className="text-xs font-semibold bg-[#1f2937] text-white px-2 py-0.5 rounded-full">
                      {variants.length}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleAddVariant}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 border-gray-300"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Custom Variant
                </Button>
              </div>

              {/* Standard Size Buttons */}
              <div className="mb-4 p-4 rounded-sm border border-[#d5d5dd] bg-[#f8f8fa]">
                <Label className="text-xs font-bold text-[#656565] uppercase tracking-wider mb-2 block">
                  Standard Sizes
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddStandardSize("Small", 1)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-sm border-2 border-dashed border-[#d5d5dd] bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
                  >
                    <div className="text-xs font-black text-gray-900 group-hover:text-blue-600">SMALL</div>
                    <div className="text-[10px] font-bold text-gray-400 group-hover:text-blue-500">1x</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddStandardSize("Medium", 1.5)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-sm border-2 border-dashed border-[#d5d5dd] bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
                  >
                    <div className="text-xs font-black text-gray-900 group-hover:text-blue-600">MEDIUM</div>
                    <div className="text-[10px] font-bold text-gray-400 group-hover:text-blue-500">1.5x</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddStandardSize("Large", 2)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-sm border-2 border-dashed border-[#d5d5dd] bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
                  >
                    <div className="text-xs font-black text-gray-900 group-hover:text-blue-600">LARGE</div>
                    <div className="text-[10px] font-bold text-gray-400 group-hover:text-blue-500">2x</div>
                  </button>
                </div>
              </div>

              {variants.length === 0 ? (
                <div className="rounded-sm border border-dashed border-[#d5d5dd] bg-white p-8 text-center">
                  <Sparkles className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No variants yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click standard sizes above or add custom variant</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-invisible">
                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className="bg-white border border-[#d5d5dd] rounded-sm p-4 hover:border-blue-300 transition-colors"
                    >
                      {/* Header with Name and Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-[2px] text-[9px] font-black tracking-widest border",
                            variant.type === "size" ? "bg-blue-50 text-blue-600 border-blue-100" :
                            variant.type === "flavor" ? "bg-purple-50 text-purple-600 border-purple-100" :
                            variant.type === "crust" ? "bg-orange-50 text-orange-600 border-orange-100" :
                            "bg-gray-50 text-gray-600 border-gray-100"
                          )}>
                            {variant.type.toUpperCase()}
                          </span>
                          {variant.type === "size" && (
                            <span className="text-xs font-bold text-blue-600">
                              {variant.sizeMultiplier}x multiplier
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="shrink-0 h-6 w-6 rounded-sm flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1">Variant Name</Label>
                          <Input
                            value={variant.name}
                            onChange={(e) => handleUpdateVariant(index, "name", e.target.value)}
                            placeholder="e.g., Large, Spicy"
                            className="h-8 text-sm border-[#d5d5dd]"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1">Type</Label>
                          <select
                            value={variant.type}
                            onChange={(e) => handleUpdateVariant(index, "type", e.target.value)}
                            className="h-8 w-full text-sm border border-[#d5d5dd] rounded-sm px-2 bg-white"
                          >
                            <option value="size">Size</option>
                            <option value="flavor">Flavor</option>
                            <option value="crust">Crust</option>
                            <option value="addon">Addon</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1">
                            Size Multiplier
                            {variant.type === "size" && (
                              <span className="text-blue-600 ml-1">*</span>
                            )}
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={variant.sizeMultiplier || 1}
                            onChange={(e) =>
                              handleUpdateVariant(index, "sizeMultiplier", parseFloat(e.target.value) || 1)
                            }
                            className="h-8 text-sm border-[#d5d5dd]"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1">Cost Adjustment</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.baseCostAdjustment || 0}
                            onChange={(e) =>
                              handleUpdateVariant(index, "baseCostAdjustment", parseFloat(e.target.value) || 0)
                            }
                            className="h-8 text-sm border-[#d5d5dd]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Sub Recipes */}
      <div className="w-72 flex flex-col border-l border-[#d5d5dd] pl-4 shrink-0">
        <div className="mb-3 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="h-4 w-4 text-[#656565]" />
            <Label className="text-xs font-bold text-[#656565] uppercase tracking-wider">
              Sub Recipes
            </Label>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={recipeSearch}
              onChange={(e) => setRecipeSearch(e.target.value)}
              placeholder="Search recipes..."
              className="pl-9 h-9 text-sm border-[#d5d5dd]"
            />
          </div>
        </div>

        <div className="overflow-y-auto space-y-1.5 pr-1 scrollbar-invisible" style={{ maxHeight: 'calc(90vh - 340px)' }}>
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-8">
              <ChefHat className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No sub recipes</p>
            </div>
          ) : (
            filteredRecipes.map((recipe) => {
              const recipeId = String(recipe._id || recipe.ID);
              const recipeName = recipe.Name || "";
              const isAdded = recipeIngredients.some(ing => ing.sourceId === recipeId);

              return (
                <div
                  key={recipeId}
                  draggable
                  onDragStart={() => handleRecipeDragStart(recipeId)}
                  className={cn(
                    "group relative bg-white border border-[#d5d5dd] rounded-sm p-2.5 cursor-grab active:cursor-grabbing transition-all duration-200",
                    isAdded
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-purple-400 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-sm flex items-center justify-center bg-purple-50/50 border border-purple-100/50 text-purple-600 shrink-0">
                      <ChefHat className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{recipeName}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        Sub Recipe
                      </div>
                    </div>
                  </div>
                  {isAdded && (
                    <div className="absolute top-1 right-1">
                      <span className="text-[9px] font-black bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                        ADDED
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        size="5xl"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh]"
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
          <div className="px-8 pb-4 pt-2 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="final">Final Recipe</TabsTrigger>
              <TabsTrigger value="sub">Sub Recipe</TabsTrigger>
            </TabsList>
          </div>

          <DialogBody className="px-8 overflow-hidden scrollbar-invisible" style={{ maxHeight: 'calc(90vh - 200px)' }}>
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
              <>{editingItem ? "Update" : "Submit"}</>
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

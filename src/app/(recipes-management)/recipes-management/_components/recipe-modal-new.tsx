"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, X, Search, UtensilsCrossed, Sparkles, Package, ChefHat, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RecipeVariantInput } from "./recipe-variant-input";

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

  // Collapsible panel states
  const [inventoryExpanded, setInventoryExpanded] = useState(true);
  const [subRecipesExpanded, setSubRecipesExpanded] = useState(true);
  const [recipeFormExpanded, setRecipeFormExpanded] = useState(true);

  // Bulk recipe state - list of recipes to be created
  const [recipesList, setRecipesList] = useState<Array<{
    id: string;
    name: string;
    type: "sub" | "final";
    description: string;
    ingredients: RecipeIngredient[];
    variations: RecipeVariantInline[];
    yield: number;
    isActive: boolean;
  }>>([]);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

  // Refs for auto-focus and scroll
  const ingredientRefs = React.useRef<{ [key: number]: HTMLInputElement | null }>({});
  const variantRefs = React.useRef<{ [key: number]: HTMLDivElement | null }>({});

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
      setRecipesList([]);
      setActiveRecipeId(null);
      setRecipeFormExpanded(true);
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

      const newIndex = recipeIngredients.length;
      setRecipeIngredients([...recipeIngredients, newIngredient]);

      // Auto-focus and scroll to the new ingredient
      setTimeout(() => {
        const inputRef = ingredientRefs.current[newIndex];
        if (inputRef) {
          inputRef.focus();
          inputRef.select();
          inputRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

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

      const newIndex = recipeIngredients.length;
      setRecipeIngredients([...recipeIngredients, newIngredient]);

      // Auto-focus and scroll to the new ingredient
      setTimeout(() => {
        const inputRef = ingredientRefs.current[newIndex];
        if (inputRef) {
          inputRef.focus();
          inputRef.select();
          inputRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

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
    const newIndex = variants.length;
    setVariants([...variants, newVariant]);

    // Auto-scroll to the new variant
    setTimeout(() => {
      const variantRef = variantRefs.current[newIndex];
      if (variantRef) {
        variantRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
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

  const handleUpdateVariantIngredient = (vIndex: number, iIndex: number, field: keyof RecipeIngredient, value: any) => {
    const updatedVariants = [...variants];
    const updatedIngredients = [...(updatedVariants[vIndex].ingredients || [])];
    updatedIngredients[iIndex] = { ...updatedIngredients[iIndex], [field]: value };
    updatedVariants[vIndex] = { ...updatedVariants[vIndex], ingredients: updatedIngredients };
    setVariants(updatedVariants);
  };

  const handleRemoveVariantIngredient = (vIndex: number, iIndex: number) => {
    const updatedVariants = [...variants];
    const updatedIngredients = (updatedVariants[vIndex].ingredients || []).filter((_, i) => i !== iIndex);
    updatedVariants[vIndex] = { ...updatedVariants[vIndex], ingredients: updatedIngredients };
    setVariants(updatedVariants);
  };

  const handleVariantIngredientDrop = (vIndex: number, e: React.DragEvent) => {
    e.preventDefault();

    let itemToAdd: RecipeIngredient | null = null;
    let itemName = "";

    if (draggedInventory) {
      const item = ingredients.find(
        (inv) => String(inv._id || inv.id || inv.ID) === draggedInventory
      );
      if (item) {
        itemName = item.Name || item.name || "";
        itemToAdd = {
          sourceType: "inventory",
          sourceId: String(item._id || item.id || item.ID),
          nameSnapshot: itemName,
          quantity: 1,
          unit: item.Unit || item.baseUnit || "pc",
        };
      }
    } else if (draggedRecipe) {
      const recipe = availableRecipeOptions.find(
        (rec) => String(rec._id || rec.ID) === draggedRecipe
      );
      if (recipe) {
        itemName = recipe.Name || "";
        itemToAdd = {
          sourceType: "recipe",
          sourceId: String(recipe._id || recipe.ID),
          nameSnapshot: itemName,
          quantity: 1,
          unit: "portion",
        };
      }
    }

    if (itemToAdd) {
      const updatedVariants = [...variants];
      const variant = updatedVariants[vIndex];
      const existingIngredients = variant.ingredients || [];

      if (existingIngredients.some(ing => ing.sourceId === itemToAdd!.sourceId)) {
        toast.error(`${itemName} is already added to this variant`, {
          duration: 3000,
          position: "top-right"
        });
        return;
      }

      updatedVariants[vIndex] = {
        ...variant,
        ingredients: [...existingIngredients, itemToAdd]
      };
      setVariants(updatedVariants);
      toast.success(`Added ${itemName} to ${variant.name || `Variant ${vIndex + 1}`}`, {
        duration: 2000,
        position: "top-right"
      });
    }

    setDraggedInventory(null);
    setDraggedRecipe(null);
  };

  // Bulk recipe management
  const handleAddToList = () => {
    if (!formData.name) {
      toast.error("Please enter a recipe name before adding to list", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (recipeIngredients.length === 0) {
      toast.error("Please add at least one ingredient before adding to list", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    const newRecipe = {
      id: `temp-${Date.now()}`,
      name: formData.name || "",
      type: formData.type || "final",
      description: formData.description || "",
      ingredients: [...recipeIngredients],
      variations: [...variants],
      yield: formData.yield || 1,
      isActive: formData.isActive ?? true,
    };

    setRecipesList([...recipesList, newRecipe]);

    // Reset form for next recipe
    setFormData({
      name: "",
      type: formData.type, // Keep the same type
      description: "",
      ingredients: [],
      isActive: true,
      variations: [],
      yield: 1,
    });
    setRecipeIngredients([]);
    setVariants([]);

    toast.success(`"${newRecipe.name}" added to list`, {
      duration: 2000,
      position: "top-right",
    });
  };

  const handleRemoveFromList = (id: string) => {
    const recipe = recipesList.find(r => r.id === id);
    setRecipesList(recipesList.filter(r => r.id !== id));
    if (recipe) {
      toast.success(`"${recipe.name}" removed from list`, {
        duration: 2000,
        position: "top-right",
      });
    }
  };

  const handleEditFromList = (id: string) => {
    const recipe = recipesList.find(r => r.id === id);
    if (recipe) {
      // Save current form if it has content
      if (formData.name && recipeIngredients.length > 0) {
        handleAddToList();
      }

      // Load selected recipe into form
      setFormData({
        name: recipe.name,
        type: recipe.type,
        description: recipe.description,
        ingredients: recipe.ingredients,
        isActive: recipe.isActive,
        variations: recipe.variations,
        yield: recipe.yield,
      });
      setRecipeIngredients([...recipe.ingredients]);
      setVariants([...recipe.variations]);

      // Remove from list since it's now being edited
      setRecipesList(recipesList.filter(r => r.id !== id));
      setActiveRecipeId(null);
    }
  };

  const handleSave = async () => {
    const parseNum = (val: any, fallback: number = 0) => {
      if (val === "" || val === null || val === undefined) return fallback;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    };

    const finalRecipesToSubmit: any[] = [...recipesList];
    const isEditingMode = !!editingItem;

    // 1. Validate and capture current form content
    const hasCurrentFormContent = formData.name || recipeIngredients.length > 0;
    let currentFormValid = false;

    if (hasCurrentFormContent) {
      if (!formData.name) {
        toast.error("Please enter a recipe name", { duration: 5000, position: "top-right" });
        return;
      }

      if (recipeIngredients.length === 0) {
        toast.error("Please add at least one ingredient", { duration: 5000, position: "top-right" });
        return;
      }

      const invalidIngredients = recipeIngredients.filter(
        (ing) => !ing.sourceId || !ing.quantity || parseNum(ing.quantity, 0) <= 0 || !ing.unit
      );

      if (invalidIngredients.length > 0) {
        toast.error(`Current recipe has ${invalidIngredients.length} ingredient(s) with missing information`, {
          duration: 5000,
          position: "top-right",
        });
        return;
      }

      const invalidVariants = variants.filter((v) => !v.name || !v.type);
      if (invalidVariants.length > 0) {
        toast.error(`Current recipe has ${invalidVariants.length} variant(s) missing required fields`, {
          duration: 5000,
          position: "top-right",
        });
        return;
      }

      // Add current form to the submission queue
      finalRecipesToSubmit.push({
        name: formData.name,
        type: formData.type || "final",
        description: formData.description || "",
        ingredients: [...recipeIngredients],
        variations: [...variants],
        yield: formData.yield || 1,
        isActive: formData.isActive ?? true,
      });
      currentFormValid = true;
    }

    // 2. Logic Check: What are we actually submitting?
    if (finalRecipesToSubmit.length === 0 && !isEditingMode) {
      toast.error("No recipes to submit. Add ingredients to create a recipe.", {
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    // 3. Execution Phase
    setLoading(true);
    try {
      console.log('📤 Submitting recipes:', finalRecipesToSubmit);

      // Submit each recipe in the queue
      for (const recipe of finalRecipesToSubmit) {
        const submitData = {
          ...recipe,
          yield: parseNum(recipe.yield, 1),
          ingredients: recipe.ingredients.map((ing: any) => ({
            ...ing,
            quantity: parseNum(ing.quantity, 0)
          })),
          variations: recipe.variations && recipe.variations.length > 0
            ? recipe.variations.map((v: any) => ({
              ...v,
              sizeMultiplier: parseNum(v.sizeMultiplier, 1),
              baseCostAdjustment: parseNum(v.baseCostAdjustment, 0),
              ingredients: v.ingredients && v.ingredients.length > 0
                ? v.ingredients.map((ing: any) => ({
                  ...ing,
                  quantity: parseNum(ing.quantity, 0)
                }))
                : undefined
            }))
            : undefined,
        };

        await onSubmit(submitData);
      }

      if (finalRecipesToSubmit.length > 1) {
        toast.success(`Successfully created ${finalRecipesToSubmit.length} recipes`, {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error("Some recipes failed to save", {
        duration: 5000,
        position: "top-right",
      });
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
    <div className="flex h-full w-full">
      {/* Left Panel - Inventory Items */}
      <div className="w-72 flex flex-col border-r border-[#e5e5e5] shrink-0 bg-white">
        <div
          className="flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#e5e5e5]"
          onClick={() => setInventoryExpanded(!inventoryExpanded)}
        >
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#6b7280]" />
            <span className="text-[14px] font-semibold text-[#374151] uppercase leading-[14px]">
              Inventory Items
            </span>
            {filteredInventory.length > 0 && (
              <span className="text-[10px] font-medium text-[#6b7280] bg-white border border-[#e5e7eb] px-1.5 py-0.5 rounded leading-[10px]">
                {filteredInventory.length}
              </span>
            )}
          </div>
          {inventoryExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
          )}
        </div>

        {inventoryExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-[41px] px-3 flex items-center bg-white relative border-b border-[#e5e5e5]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search inventory..."
                className="pl-9 h-full w-full border-0 p-0 focus:ring-0 focus:outline-none bg-transparent text-[15px] leading-tight"
              />
            </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {filteredInventory.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 text-[#d1d5db] mx-auto mb-2" />
                  <p className="text-sm text-[#9ca3af]">No inventory items</p>
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
                      draggable={!isAdded}
                      onDragStart={() => !isAdded && handleInventoryDragStart(itemId)}
                      className={cn(
                        "group relative flex items-center h-[41px] px-3 bg-white border-b border-[#e5e7eb] transition-all",
                        isAdded
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-grab active:cursor-grabbing hover:bg-[#e0f2fe]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#ea580c] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#111827] truncate leading-tight">{itemName}</div>
                          <div className="text-[10px] text-[#9ca3af] font-medium uppercase leading-tight">
                            {itemUnit}
                          </div>
                        </div>
                      </div>
                      {isAdded && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-3">
                          <span className="text-[9px] font-semibold bg-[#22c55e] text-white px-1.5 py-0.5 rounded">
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
        )}
      </div>

      {/* Center Panel - Recipe Form */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-white">
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden m-0 p-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Saved Recipes List - Each as collapsible section */}
          {recipesList.map((recipe, recipeIndex) => (
            <div key={recipe.id}>
              <div
                className="sticky top-0 z-20 flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f0fdf4] hover:bg-[#dcfce7] transition-colors border-b border-[#e5e5e5]"
                onClick={() => setActiveRecipeId(activeRecipeId === recipe.id ? null : recipe.id)}
              >
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#22c55e] text-white flex items-center justify-center text-[10px] font-semibold">
                    {recipeIndex + 1}
                  </div>
                  <span className={cn(
                    "text-xs font-semibold px-1.5 rounded uppercase h-5 flex items-center leading-none",
                    recipe.type === "final" ? "bg-[#eff6ff] text-[#3b82f6]" : "bg-[#faf5ff] text-[#9333ea]"
                  )}>
                    {recipe.type}
                  </span>
                  <span className="text-xs font-semibold text-[#374151] leading-none">
                    {recipe.name} ({recipe.ingredients.length} ingredients)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFromList(recipe.id);
                    }}
                    className="flex items-center justify-center text-[#6b7280] hover:text-[#3b82f6] transition-colors"
                    title="Edit in form"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromList(recipe.id);
                    }}
                    className="flex items-center justify-center text-[#6b7280] hover:text-[#ef4444] transition-colors"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {activeRecipeId === recipe.id ? (
                    <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
                  )}
                </div>
              </div>
              {activeRecipeId === recipe.id && (
                <div className="p-4 bg-[#f9fafb] border-t border-[#e5e5e5]">
                  <div className="text-xs text-[#6b7280] space-y-2">
                    {recipe.description && <p><span className="font-medium">Description:</span> {recipe.description}</p>}
                    <p><span className="font-medium">Yield:</span> {recipe.yield} portion(s)</p>
                    <p><span className="font-medium">Status:</span> {recipe.isActive ? "Active" : "Inactive"}</p>
                    <div>
                      <span className="font-medium">Ingredients:</span>
                      <ul className="mt-1 ml-4 list-disc">
                        {recipe.ingredients.map((ing, i) => (
                          <li key={i}>{ing.nameSnapshot} - {ing.quantity} {ing.unit}</li>
                        ))}
                      </ul>
                    </div>
                    {recipe.variations.length > 0 && (
                      <div>
                        <span className="font-medium">Variants:</span>
                        <ul className="mt-1 ml-4 list-disc">
                          {recipe.variations.map((v, i) => (
                            <li key={i}>{v.name} ({v.type})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Current Recipe Form - Collapsible Header */}
          <div
            className="sticky top-0 z-20 flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#e5e5e5]"
            onClick={() => setRecipeFormExpanded(!recipeFormExpanded)}
          >
            <div className="flex items-center gap-2">
              {recipesList.length > 0 && (
                <div className="h-4 w-4 rounded-full bg-[#e5e7eb] text-[#6b7280] flex items-center justify-center text-[10px] font-semibold">
                  {recipesList.length + 1}
                </div>
              )}
              <UtensilsCrossed className="h-4 w-4 text-[#6b7280]" />
              <span className="text-[14px] font-semibold text-[#374151] uppercase leading-[14px]">
                {editingItem ? "Edit Recipe" : (formData.name?.trim() || "New Recipe")}
              </span>
              {!formData.name?.trim() && recipesList.length > 0 && (
                <span className="text-[10px] text-[#9ca3af] leading-[10px]">(optional)</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {recipeFormExpanded ? (
                <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
              )}
            </div>
          </div>

          {recipeFormExpanded && (
            <div className="p-4">
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">
                    Recipe Name <span className="text-[#ef4444]">*</span>
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder={
                      recipeType === "sub"
                        ? "e.g., Burger Sauce, Grilled Patty"
                        : "e.g., Cheeseburger, Caesar Salad"
                    }
                    className="h-14 text-[15px]"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Description (Optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Brief description..."
                    className="min-h-[72px] resize-none text-[15px]"
                    rows={2}
                  />
                </div>

                {/* Yield & Active Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-[#374151] mb-1.5 block">
                      Yield (Portions)
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.yield ?? ""}
                      onChange={(e) => {
                        handleFieldChange("yield", e.target.value);
                      }}
                      onFocus={(e) => e.target.select()}
                      placeholder="1"
                      className="h-14 text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Status</Label>
                    <div className="flex items-center justify-between rounded-sm border border-[#d5d5dd] bg-[#f8f8fa] px-4 h-14 w-full">
                      <span className="text-[#111827] text-sm font-medium">Active</span>
                      <Switch
                        checked={formData.isActive === true}
                        onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Ingredients Drop Zone */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm font-medium text-[#374151]">
                      Ingredients <span className="text-[#ef4444]">*</span>
                    </Label>
                    <CustomTooltip
                      label="Drag items from the side panels"
                      direction="right"
                    >
                      <Info className="h-3.5 w-3.5 text-[#9ca3af] cursor-pointer" />
                    </CustomTooltip>
                    {recipeIngredients.length > 0 && (
                      <span className="text-[10px] font-semibold bg-[#111827] text-white px-2 py-0.5 rounded-full">
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
                      "rounded-sm border-2 border-dashed p-3 transition-all min-h-[160px]",
                      recipeIngredients.length > 0
                        ? "bg-[#f8f8fa] border-[#111827]"
                        : "bg-[#f9fafb] border-[#d1d5db] hover:border-[#111827] hover:bg-gray-50"
                    )}
                  >
                    {recipeIngredients.length === 0 ? (
                      <div className="relative overflow-hidden rounded-sm border border-dashed border-[#d5d5dd] bg-[#f8f8fa] p-12 text-center transition-all">
                        <div className="relative z-10">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-[#111827] shadow-lg">
                            <UtensilsCrossed className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="mb-2 text-lg font-bold text-[#111827]">No Ingredients Yet</h3>
                          <p className="mx-auto max-w-sm text-sm text-[#656565]">
                            Start building your recipe by dragging items from the side panels
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 p-1">
                        {recipeIngredients.map((ingredient, index) => (
                          <div
                            key={index}
                            className="p-3 border border-[#d5d5dd] rounded-sm bg-white transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className="min-w-0 flex-1">
                                  <div className="text-[14px] font-semibold text-[#111827] truncate">
                                    {ingredient.nameSnapshot}
                                  </div>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className={cn(
                                      "text-[9px] font-bold uppercase tracking-wider text-[#656565]"
                                    )}>
                                      {ingredient.sourceType}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                                className="text-[#9ca3af] hover:text-[#ef4444] transition-colors p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-[11px] font-medium text-[#656565] mb-1 block">Quantity</Label>
                                <Input
                                  ref={(el) => {
                                    ingredientRefs.current[index] = el;
                                  }}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={ingredient.quantity ?? ""}
                                  onChange={(e) => {
                                    handleUpdateIngredient(index, "quantity", e.target.value);
                                  }}
                                  onFocus={(e) => e.target.select()}
                                  placeholder="0"
                                  className="h-9 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </div>
                              <div>
                                <Label className="text-[11px] font-medium text-[#656565] mb-1 block">Unit</Label>
                                <div className="flex h-9 items-center px-4 rounded-sm bg-[#f8f8fa] border border-[#d5d5dd] text-xs font-medium text-[#656565]">
                                  {ingredient.unit || "—"}
                                </div>
                              </div>
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
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-[#374151]">Recipe Variants</Label>
                        <CustomTooltip label="Add size, flavor, or crust variants" direction="right">
                          <Info className="h-3.5 w-3.5 text-[#9ca3af] cursor-pointer" />
                        </CustomTooltip>
                        {variants.length > 0 && (
                          <span className="text-[10px] font-semibold bg-[#111827] text-white px-2 py-0.5 rounded-full">
                            {variants.length}
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddVariant}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs border-[#e5e7eb]"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Custom
                      </Button>
                    </div>

                    {/* Standard Size Buttons */}
                    <div className="mb-4 p-4 rounded-sm border border-[#d5d5dd] bg-[#f8f8fa]">
                      <Label className="text-[10px] font-bold text-[#656565] uppercase tracking-wider mb-3 block">
                        Quick Add Sizes
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => handleAddStandardSize("Small", 1)}
                          className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-md border border-[#e5e7eb] bg-white hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all group"
                        >
                          <div className="text-xs font-semibold text-[#374151] group-hover:text-[#3b82f6]">Small</div>
                          <div className="text-[10px] text-[#9ca3af] group-hover:text-[#3b82f6]">1x</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddStandardSize("Medium", 1.5)}
                          className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-md border border-[#e5e7eb] bg-white hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all group"
                        >
                          <div className="text-xs font-semibold text-[#374151] group-hover:text-[#3b82f6]">Medium</div>
                          <div className="text-[10px] text-[#9ca3af] group-hover:text-[#3b82f6]">1.5x</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddStandardSize("Large", 2)}
                          className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-md border border-[#e5e7eb] bg-white hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all group"
                        >
                          <div className="text-xs font-semibold text-[#374151] group-hover:text-[#3b82f6]">Large</div>
                          <div className="text-[10px] text-[#9ca3af] group-hover:text-[#3b82f6]">2x</div>
                        </button>
                      </div>
                    </div>

                    {variants.length === 0 ? (
                      <div className="relative overflow-hidden rounded-sm border border-dashed border-[#d5d5dd] bg-[#f8f8fa] p-12 text-center transition-all">
                        <div className="relative z-10">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-[#111827] shadow-lg">
                            <Sparkles className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="mb-2 text-lg font-bold text-[#111827]">No Variants Yet</h3>
                          <p className="mx-auto max-w-sm text-sm text-[#656565]">
                            Use quick add or create a custom variant above
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 p-1">
                        {variants.map((variant, index) => (
                          <RecipeVariantInput
                            key={index}
                            variant={variant}
                            index={index}
                            ingredients={ingredients}
                            availableRecipeOptions={availableRecipeOptions}
                            onUpdate={handleUpdateVariant}
                            onRemove={handleRemoveVariant}
                            onIngredientUpdate={handleUpdateVariantIngredient}
                            onIngredientRemove={handleRemoveVariantIngredient}
                            onIngredientDrop={handleVariantIngredientDrop}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Fixed Center Action Bar - Unified with container flow, top border only */}
        {!editingItem && (
          <Button
            type="button"
            onClick={handleAddToList}
            variant="outline"
            className={cn(
              "shrink-0 w-full h-[41px] rounded-none border-t border-x-0 border-b-0 border-[#e5e7eb] bg-white text-[15px] font-medium transition-all duration-200 hover:bg-[#111827] hover:text-white hover:border-[#111827] text-[#374151]",
              (!formData.name || recipeIngredients.length === 0) && "opacity-50 grayscale cursor-not-allowed"
            )}
            disabled={!formData.name || recipeIngredients.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Recipe
          </Button>
        )}
      </div>

      {/* Right Panel - Sub Recipes */}
      <div className="w-72 flex flex-col shrink-0 border-l border-[#e5e5e5] bg-white">
        <div
          className="flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#e5e5e5]"
          onClick={() => setSubRecipesExpanded(!subRecipesExpanded)}
        >
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-[#6b7280]" />
            <span className="text-[14px] font-semibold text-[#374151] uppercase leading-[14px]">
              Sub Recipes
            </span>
            {filteredRecipes.length > 0 && (
              <span className="text-[10px] font-medium text-[#6b7280] bg-white border border-[#e5e7eb] px-1.5 py-0.5 rounded leading-[10px]">
                {filteredRecipes.length}
              </span>
            )}
          </div>
          {subRecipesExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
          )}
        </div>

        {subRecipesExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-[41px] px-3 flex items-center bg-white relative border-b border-[#e5e5e5]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Search recipes..."
                className="pl-9 h-full w-full focus:ring-0 focus:outline-none bg-transparent text-[15px] leading-tight"
              />
            </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <ChefHat className="h-10 w-10 text-[#d1d5db] mx-auto mb-2" />
                  <p className="text-sm text-[#9ca3af]">No sub recipes</p>
                </div>
              ) : (
                filteredRecipes.map((recipe) => {
                  const recipeId = String(recipe._id || recipe.ID);
                  const recipeName = recipe.Name || "";
                  const isAdded = recipeIngredients.some(ing => ing.sourceId === recipeId);

                  return (
                    <div
                      key={recipeId}
                      draggable={!isAdded}
                      onDragStart={() => !isAdded && handleRecipeDragStart(recipeId)}
                      className={cn(
                        "group relative flex items-center h-[41px] px-3 bg-white border-b border-[#e5e7eb] transition-all",
                        isAdded
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-grab active:cursor-grabbing hover:bg-[#f3e8ff]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ChefHat className="h-4 w-4 text-[#9333ea] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#111827] truncate leading-tight">{recipeName}</div>
                          <div className="text-[10px] text-[#9ca3af] font-medium uppercase leading-tight">
                            Sub Recipe
                          </div>
                        </div>
                      </div>
                      {isAdded && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-3">
                          <span className="text-[9px] font-semibold bg-[#22c55e] text-white px-1.5 py-0.5 rounded">
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
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        size="full"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="!h-[95vh] !max-h-[95vh] flex flex-col overflow-hidden"
      >
        <DialogHeader className="shrink-0 pb-2">
          <DialogTitle className="text-xl">
            {editingItem ? "Edit Recipe" : "Create Recipe"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={formData.type}
          onValueChange={(value) => handleFieldChange("type", value as "sub" | "final")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-8 pb-1 pt-2 shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="final">Final Recipe</TabsTrigger>
              <TabsTrigger value="sub">Sub Recipe</TabsTrigger>
            </TabsList>
          </div>

          <DialogBody className="flex-1 overflow-hidden px-8 pt-0 pb-2">
            <TabsContent value="final" className="mt-0 h-full data-[state=active]:flex">
              <div className="flex-1 border border-[#e5e5e5] rounded-sm overflow-hidden">
                {renderTabContent("final")}
              </div>
            </TabsContent>
            <TabsContent value="sub" className="mt-0 h-full data-[state=active]:flex">
              <div className="flex-1 border border-[#e5e5e5] rounded-sm overflow-hidden">
                {renderTabContent("sub")}
              </div>
            </TabsContent>
          </DialogBody>
        </Tabs>

        <DialogFooter className="shrink-0 pt-3 bg-white">
          <Button
            onClick={handleSave}
            disabled={!formData.name || loading || actionLoading}
            className="bg-[#111827] hover:bg-[#1f2937] text-white px-6 h-11 text-[15px]"
          >
            {loading || actionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>{editingItem ? "Update Recipe" : "Create Recipe"}</>
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 h-11 border-[#e5e7eb] text-[15px]"
            disabled={loading || actionLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState, useEffect } from "react";
import { X, Save, ChevronDown, Package, UtensilsCrossed, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecipeVariant, RecipeVariantFormData, RecipeVariantIngredient } from "@/lib/types/recipe-options";
import { RecipeService, Recipe } from "@/lib/services/recipe-service";
import { IngredientService } from "@/lib/services/ingredient-service";

interface RecipeVariantModalProps {
  isOpen: boolean;
  editingItem: RecipeVariant | null;
  onClose: () => void;
  onSubmit: (data: RecipeVariantFormData) => void;
  actionLoading: boolean;
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

const RecipeVariantModal: React.FC<RecipeVariantModalProps> = ({
  isOpen,
  editingItem,
  onClose,
  onSubmit,
  actionLoading,
}) => {
  const [formData, setFormData] = useState<RecipeVariantFormData>({
    recipeId: "",
    name: "",
    description: "",
    type: "size",
    sizeMultiplier: 1,
    baseCostAdjustment: 0,
    crustType: "",
    ingredients: [],
    metadata: {
      menuDisplayName: "",
      availability: []
    }
  });

  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [ingredientInputs, setIngredientInputs] = useState<{ [key: number]: string }>({});
  const [showSuggestions, setShowSuggestions] = useState<{ [key: number]: boolean }>({});
  const [focusedIngredientIndex, setFocusedIngredientIndex] = useState<number | null>(null);

  // Load available recipes and inventory items
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load recipes
        const recipesResponse = await RecipeService.listRecipes();
        if (recipesResponse.success && recipesResponse.data) {
          setAvailableRecipes(recipesResponse.data);
        }

        // Load inventory items
        const inventoryResponse = await IngredientService.listIngredients();
        if (inventoryResponse.success && inventoryResponse.data) {
          setInventoryItems(inventoryResponse.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Initialize form data
  useEffect(() => {
    if (editingItem) {
      setFormData({
        recipeId: editingItem.recipeId,
        name: editingItem.name,
        description: editingItem.description || "",
        type: editingItem.type,
        sizeMultiplier: editingItem.sizeMultiplier || 1,
        baseCostAdjustment: editingItem.baseCostAdjustment || 0,
        crustType: editingItem.crustType || "",
        ingredients: editingItem.ingredients || [],
        metadata: editingItem.metadata || { menuDisplayName: "", availability: [] }
      });

      // Initialize ingredient inputs
      const inputs: { [key: number]: string } = {};
      editingItem.ingredients?.forEach((ingredient, index) => {
        inputs[index] = ingredient.nameSnapshot;
      });
      setIngredientInputs(inputs);
    } else {
      setFormData({
        recipeId: "",
        name: "",
        description: "",
        type: "size",
        sizeMultiplier: 1,
        baseCostAdjustment: 0,
        crustType: "",
        ingredients: [],
        metadata: { menuDisplayName: "", availability: [] }
      });
      setIngredientInputs({});
    }
  }, [editingItem, isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (!formData.recipeId || !formData.name.trim()) {
      return;
    }
    onSubmit(formData);
  };

  const addIngredient = () => {
    const newIngredient: RecipeVariantIngredient = {
      sourceType: "inventory",
      sourceId: "",
      nameSnapshot: "",
      quantity: 0,
      unit: "",
      costPerUnit: 0
    };
    
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, newIngredient]
    });
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: updatedIngredients });
    
    // Clean up ingredient inputs
    const newInputs = { ...ingredientInputs };
    delete newInputs[index];
    setIngredientInputs(newInputs);
  };

  const updateIngredient = (index: number, field: keyof RecipeVariantIngredient, value: any) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleIngredientInputChange = (index: number, value: string) => {
    setIngredientInputs({ ...ingredientInputs, [index]: value });
    setShowSuggestions({ ...showSuggestions, [index]: true });
  };

  const selectIngredient = (index: number, item: any, sourceType: "inventory" | "recipe") => {
    const itemId = item._id || item.id || item.ID;
    const itemName = item.Name || item.name;
    const itemUnit = item.Unit || item.baseUnit || (sourceType === "recipe" ? "portion" : "pc");

    updateIngredient(index, "sourceType", sourceType);
    updateIngredient(index, "sourceId", String(itemId));
    updateIngredient(index, "nameSnapshot", itemName);
    updateIngredient(index, "unit", itemUnit);
    
    setIngredientInputs({ ...ingredientInputs, [index]: itemName });
    setShowSuggestions({ ...showSuggestions, [index]: false });
  };

  const getFilteredSuggestions = (index: number) => {
    const ingredient = formData.ingredients[index];
    const query = (ingredientInputs[index] || "").toLowerCase();

    let filteredInventory: any[] = [];
    let filteredRecipes: any[] = [];

    if (ingredient?.sourceType === "inventory") {
      filteredInventory = inventoryItems.filter((item) => {
        const name = (item.Name || item.name || "").toLowerCase();
        const sku = (item.sku || "").toLowerCase();
        return name.includes(query) || sku.includes(query);
      });
    } else {
      filteredRecipes = availableRecipes
        .filter((recipe) => recipe.type === "sub")
        .filter((recipe) => {
          const name = (recipe.name || "").toLowerCase();
          return name.includes(query);
        });
    }

    return { inventory: filteredInventory, recipes: filteredRecipes };
  };

  const selectedRecipe = availableRecipes.find(recipe => recipe._id === formData.recipeId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[60vw] max-w-4xl max-h-[85vh] min-h-[85vh] flex flex-col gap-0" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {editingItem ? "Edit Recipe Variant" : "Add Recipe Variant"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6 pl-1">
          {/* Header Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Recipe Variant Configuration
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Create variations of existing recipes with different sizes, flavors, or crust types
            </p>
          </div>

          {/* Recipe Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipe" className="text-sm font-medium text-gray-700">
                Base Recipe <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Select the base recipe for this variant
              </p>
              <Select value={formData.recipeId} onValueChange={(value) => setFormData({ ...formData, recipeId: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a recipe..." />
                </SelectTrigger>
                <SelectContent>
                  {availableRecipes.map((recipe) => (
                    <SelectItem key={recipe._id} value={recipe._id || ""}>
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4" />
                        <span>{recipe.name}</span>
                        <span className="text-xs text-gray-500">({recipe.type})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Variant Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Variant Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Variant Name <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Name for this specific variant
                </p>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Large Stuffed Crust"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Variant Type */}
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Variant Type <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Type of variation
                </p>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="flavor">Flavor</SelectItem>
                    <SelectItem value="crust">Crust</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Optional description for this variant
              </p>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this variant..."
                rows={3}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Variant Properties */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Size Multiplier */}
              <div>
                <Label htmlFor="sizeMultiplier" className="text-sm font-medium text-gray-700">
                  Size Multiplier
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Portion size multiplier
                </p>
                <Input
                  id="sizeMultiplier"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.sizeMultiplier || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const value = Number(val);
                    setFormData({ ...formData, sizeMultiplier: val === '' ? 1 : (isNaN(value) ? 1 : value) });
                  }}
                  onFocus={(e) => e.target.select()}
                  placeholder="1.0"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Base Cost Adjustment */}
              <div>
                <Label htmlFor="baseCostAdjustment" className="text-sm font-medium text-gray-700">
                  Cost Adjustment
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Additional cost for this variant
                </p>
                <Input
                  id="baseCostAdjustment"
                  type="number"
                  step="0.01"
                  value={formData.baseCostAdjustment === 0 ? '' : (formData.baseCostAdjustment || '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    const value = Number(val);
                    setFormData({ ...formData, baseCostAdjustment: val === '' ? 0 : (isNaN(value) ? 0 : value) });
                  }}
                  onFocus={(e) => e.target.select()}
                  placeholder="0.00"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Crust Type */}
              <div>
                <Label htmlFor="crustType" className="text-sm font-medium text-gray-700">
                  Crust Type
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Specific crust type (if applicable)
                </p>
                <Input
                  id="crustType"
                  type="text"
                  value={formData.crustType}
                  onChange={(e) => setFormData({ ...formData, crustType: e.target.value })}
                  placeholder="e.g., Stuffed Crust"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Variant Ingredients
                  </Label>
                  <p className="text-xs text-gray-500">
                    Additional or modified ingredients for this variant
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Ingredient
                </Button>
              </div>

              {/* Ingredients List */}
              {formData.ingredients.map((ingredient, index) => {
                const suggestions = getFilteredSuggestions(index);
                const showDropdown = showSuggestions[index] && focusedIngredientIndex === index;

                return (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Ingredient {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Source Type */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Source Type</Label>
                        <Select
                          value={ingredient.sourceType}
                          onValueChange={(value: any) => updateIngredient(index, "sourceType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inventory">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Inventory Item
                              </div>
                            </SelectItem>
                            <SelectItem value="recipe">
                              <div className="flex items-center gap-2">
                                <UtensilsCrossed className="h-4 w-4" />
                                Sub Recipe
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Ingredient Selection */}
                      <div className="relative">
                        <Label className="text-sm font-medium text-gray-700">
                          {ingredient.sourceType === "inventory" ? "Inventory Item" : "Sub Recipe"}
                        </Label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={ingredientInputs[index] || ""}
                            onChange={(e) => handleIngredientInputChange(index, e.target.value)}
                            onFocus={() => {
                              setFocusedIngredientIndex(index);
                              setShowSuggestions({ ...showSuggestions, [index]: true });
                            }}
                            onBlur={() =>
                              setTimeout(() => {
                                setShowSuggestions({ ...showSuggestions, [index]: false });
                              }, 200)
                            }
                            placeholder="Type to search..."
                            className="pr-8"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFocusedIngredientIndex(index);
                              setShowSuggestions({ ...showSuggestions, [index]: !showSuggestions[index] });
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>

                          {/* Dropdown */}
                          {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                              {suggestions.inventory.length > 0 && (
                                <div>
                                  <div className="sticky top-0 z-10 border-b bg-green-50 px-3 py-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
                                      <Package className="h-3 w-3" />
                                      INVENTORY ITEMS
                                    </div>
                                  </div>
                                  {suggestions.inventory.map((item) => (
                                    <button
                                      key={item._id || item.id || item.ID}
                                      type="button"
                                      onClick={() => selectIngredient(index, item, "inventory")}
                                      className="w-full border-b border-gray-100 px-3 py-2 text-left transition-all hover:bg-blue-50 last:border-0"
                                    >
                                      <div className="font-medium text-sm text-gray-900">{item.Name || item.name}</div>
                                      <div className="text-xs text-gray-500">
                                        Unit: <span className="font-medium text-blue-600">{item.Unit || item.baseUnit || "pc"}</span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {suggestions.recipes.length > 0 && (
                                <div>
                                  <div className="sticky top-0 z-10 border-b bg-purple-50 px-3 py-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                                      <UtensilsCrossed className="h-3 w-3" />
                                      SUB RECIPES
                                    </div>
                                  </div>
                                  {suggestions.recipes.map((recipe) => (
                                    <button
                                      key={recipe._id}
                                      type="button"
                                      onClick={() => selectIngredient(index, recipe, "recipe")}
                                      className="w-full border-b border-gray-100 px-3 py-2 text-left transition-all hover:bg-purple-50 last:border-0"
                                    >
                                      <div className="font-medium text-sm text-gray-900">{recipe.name}</div>
                                      <div className="text-xs text-gray-500">Type: {recipe.type}</div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Quantity */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Quantity</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={ingredient.quantity === 0 ? '' : (ingredient.quantity || '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            const value = Number(val);
                            updateIngredient(index, "quantity", val === '' ? 0 : (isNaN(value) ? 0 : value));
                          }}
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      {/* Unit */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Unit</Label>
                        <Input
                          type="text"
                          value={ingredient.unit}
                          onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                          placeholder="e.g., g, ml, pc"
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      {/* Cost Per Unit */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Cost Per Unit</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={ingredient.costPerUnit === 0 ? '' : (ingredient.costPerUnit || '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            const value = Number(val);
                            updateIngredient(index, "costPerUnit", val === '' ? 0 : (isNaN(value) ? 0 : value));
                          }}
                          onFocus={(e) => e.target.select()}
                          placeholder="0.00"
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Metadata Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Additional Settings</Label>
                <p className="text-xs text-gray-500">Optional metadata for this variant</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Menu Display Name */}
                <div>
                  <Label htmlFor="menuDisplayName" className="text-sm font-medium text-gray-700">
                    Menu Display Name
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Name shown on menu (if different from variant name)
                  </p>
                  <Input
                    id="menuDisplayName"
                    type="text"
                    value={formData.metadata?.menuDisplayName || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, menuDisplayName: e.target.value }
                    })}
                    placeholder="Optional menu display name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Availability */}
                <div>
                  <Label htmlFor="availability" className="text-sm font-medium text-gray-700">
                    Availability
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Locations where this variant is available (comma-separated)
                  </p>
                  <Input
                    id="availability"
                    type="text"
                    value={formData.metadata?.availability?.join(', ') || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: {
                        ...formData.metadata,
                        availability: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }
                    })}
                    placeholder="e.g., Riyadh, Jeddah"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Information Card */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Recipe Variants</h4>
                  <p className="text-xs text-blue-700">
                    Recipe variants allow you to create different versions of existing recipes with modified ingredients, 
                    sizes, or costs. This is useful for offering size variations, different crust types, or flavor modifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-100 bg-white flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
            className="w-full sm:w-auto"
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.recipeId || !formData.name.trim() || actionLoading}
            className="w-full sm:w-auto"
          >
            {actionLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                {editingItem ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {editingItem ? "Update Variant" : "Save Variant"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeVariantModal;
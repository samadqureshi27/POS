"use client";

import React from "react";
import { Trash2, Package, UtensilsCrossed, ChevronDown, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RecipeIngredient {
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot?: string;
  quantity: number;
  unit: string;
  convertToUnit?: string;
}

interface RecipeIngredientsListProps {
  ingredients: RecipeIngredient[];
  ingredientInputs: { [key: number]: string };
  showSuggestions: { [key: number]: boolean };
  inventoryItems: any[];
  availableRecipes: any[];
  getIngredientValidation: (ingredient: RecipeIngredient) => string[];
  getCompatibleUnits: (baseUnit: string) => { value: string; label: string }[];
  onIngredientInputChange: (index: number, value: string) => void;
  onToggleDropdown: (index: number) => void;
  onSelectIngredient: (index: number, item: any, sourceType: "inventory" | "recipe") => void;
  onUpdateIngredient: (index: number, field: keyof RecipeIngredient, value: any) => void;
  onRemoveIngredient: (index: number) => void;
  setFocusedIngredientIndex: (index: number | null) => void;
  setShowSuggestions: (value: { [key: number]: boolean }) => void;
  recipeType: "sub" | "final";
}

export function RecipeIngredientsList({
  ingredients,
  ingredientInputs,
  showSuggestions,
  inventoryItems,
  availableRecipes,
  getIngredientValidation,
  getCompatibleUnits,
  onIngredientInputChange,
  onToggleDropdown,
  onSelectIngredient,
  onUpdateIngredient,
  onRemoveIngredient,
  setFocusedIngredientIndex,
  setShowSuggestions: setShowSuggestionsParent,
  recipeType,
}: RecipeIngredientsListProps) {
  const getFilteredSuggestions = (index: number) => {
    const ingredient = ingredients[index];
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
      // For recipes, only show sub recipes
      filteredRecipes = availableRecipes
        .filter((opt) => opt.type === "sub")
        .filter((opt) => {
          const name = (opt.Name || opt.name || "").toLowerCase();
          return name.includes(query);
        });
    }

    return { inventory: filteredInventory, recipes: filteredRecipes };
  };

  if (ingredients.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-12 text-center transition-all hover:border-blue-300 hover:shadow-sm">
        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">No Ingredients Yet</h3>
          <p className="mx-auto max-w-sm text-sm text-gray-600">
            Start building your recipe by clicking the <span className="font-semibold text-blue-600">"Add Ingredient"</span> button above
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ingredients.map((ingredient, index) => {
        const errors = getIngredientValidation(ingredient);
        const hasErrors = errors.length > 0;
        const suggestions = getFilteredSuggestions(index);
        const showDropdown = showSuggestions[index] && (suggestions.inventory.length > 0 || suggestions.recipes.length > 0);

        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-lg border-2 bg-white transition-all ${
              hasErrors
                ? "border-red-300 bg-red-50/30"
                : ingredient.sourceId
                ? "border-green-300 bg-green-50/20"
                : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
            }`}
          >
            <div className="p-3">
              {/* Compact Header */}
              <div className="mb-3 flex items-center gap-2">
                {/* Ingredient Number */}
                <div
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md font-bold text-xs ${
                    hasErrors
                      ? "bg-red-500 text-white"
                      : ingredient.sourceId
                      ? "bg-green-600 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Ingredient Name & Type */}
                <div className="min-w-0 flex-1">
                  {ingredient.nameSnapshot ? (
                    <>
                      <div className="truncate font-semibold text-sm text-gray-900">{ingredient.nameSnapshot}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {ingredient.sourceType === "inventory" ? (
                          <>
                            <Package className="h-3 w-3" />
                            <span>Inventory</span>
                          </>
                        ) : (
                          <>
                            <UtensilsCrossed className="h-3 w-3" />
                            <span>Sub Recipe</span>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs italic text-gray-400">Select ingredient...</div>
                  )}
                </div>

                {/* Delete Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveIngredient(index)}
                  className="h-8 w-8 flex-shrink-0 p-0 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Source Type Toggle */}
              <div className="mb-3 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateIngredient(index, "sourceType", "inventory")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-all ${
                    ingredient.sourceType === "inventory"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Package className="h-3.5 w-3.5" />
                  Inventory
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateIngredient(index, "sourceType", "recipe")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-all ${
                    ingredient.sourceType === "recipe"
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  Sub Recipe
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-3">
                <Label className="mb-1.5 block text-xs font-medium text-gray-700">
                  {ingredient.sourceType === "inventory" ? "Search Inventory" : "Search Sub Recipe"}
                </Label>
                <div className="relative group">
                  <Input
                    value={ingredientInputs[index] || ""}
                    onChange={(e) => onIngredientInputChange(index, e.target.value)}
                    onFocus={() => {
                      setFocusedIngredientIndex(index);
                      setShowSuggestionsParent({ ...showSuggestions, [index]: true });
                    }}
                    onBlur={() =>
                      setTimeout(() => {
                        setShowSuggestionsParent({ ...showSuggestions, [index]: false });
                      }, 200)
                    }
                    placeholder="Type to search..."
                    className={`h-9 rounded-md border pr-8 text-sm transition-all ${
                      hasErrors && !ingredient.sourceId
                        ? "border-red-300 focus:border-red-500"
                        : ingredient.sourceId
                        ? "border-green-300 focus:border-green-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    id={`ingredient-input-${index}`}
                  />
                  <button
                    type="button"
                    onClick={() => onToggleDropdown(index)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute left-0 right-0 top-full z-[300] mt-1 max-h-56 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-xl">
                      {suggestions.inventory.length > 0 && (
                        <div>
                          <div className="sticky top-0 z-10 border-b bg-blue-50 px-3 py-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                              <Package className="h-3 w-3" />
                              INVENTORY
                            </div>
                          </div>
                          {suggestions.inventory.map((item) => (
                            <button
                              key={item._id || item.id || item.ID}
                              type="button"
                              onClick={() => onSelectIngredient(index, item, "inventory")}
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
                              key={recipe._id || recipe.ID}
                              type="button"
                              onClick={() => onSelectIngredient(index, recipe, "recipe")}
                              className="w-full border-b border-gray-100 px-3 py-2 text-left transition-all hover:bg-purple-50 last:border-0"
                            >
                              <div className="font-medium text-sm text-gray-900">{recipe.Name || recipe.name}</div>
                              <div className="text-xs text-purple-600">Sub Recipe</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                    </div>
              </div>

              {/* Quantity & Unit Row - Professional POS Layout */}
              <div className="space-y-2">
                <Label className="block text-xs font-medium text-gray-700">Quantity & Unit</Label>
                <div className="flex items-center gap-2">
                  {/* Quantity Input - Compact */}
                  <div className="w-24">
                    <Input
                      type="number"
                      step="any"
                      min="0"
                      value={ingredient.quantity === 0 ? "" : (ingredient.quantity || "")}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateIngredient(index, "quantity", val === '' ? 0 : parseFloat(val) || 0);
                      }}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className={`h-9 rounded-md border text-center font-semibold text-sm ${
                        hasErrors && (!ingredient.quantity || ingredient.quantity <= 0)
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  {/* Base Unit Display - Minimal */}
                  <div className="flex h-9 min-w-[60px] items-center justify-center rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700">
                    {ingredient.unit || "—"}
                  </div>

                  {/* Arrow Icon */}
                  {ingredient.unit && getCompatibleUnits(ingredient.unit).length > 0 && (
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  )}

                  {/* Convert To Dropdown - Only if conversions available */}
                  {ingredient.unit && getCompatibleUnits(ingredient.unit).length > 0 ? (
                    <div className="flex-1 min-w-[100px]">
                      <Select
                        value={ingredient.convertToUnit || "none"}
                        onValueChange={(value) =>
                          onUpdateIngredient(index, "convertToUnit", value === "none" ? undefined : value)
                        }
                      >
                        <SelectTrigger className="h-9 rounded-md border border-gray-300 text-sm">
                          <SelectValue placeholder="Convert to..." />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="none">
                            <span className="text-gray-500">No conversion</span>
                          </SelectItem>
                          {getCompatibleUnits(ingredient.unit).map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    ingredient.unit && (
                      <div className="flex-1 text-xs italic text-gray-400">
                        No conversions available
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Error Messages */}
              {hasErrors && (
                <div className="mt-2 flex items-start gap-1.5 rounded-md border border-red-200 bg-red-50 p-2">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-600 mt-0.5" />
                  <div className="text-xs text-red-700">
                    <strong>Missing:</strong> {errors.join(", ")}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

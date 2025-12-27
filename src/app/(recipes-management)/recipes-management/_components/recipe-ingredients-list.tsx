"use client";

import React from "react";
import { Trash2, Package, UtensilsCrossed, ChevronDown, AlertCircle } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-sm border border-dashed border-[#d5d5dd] bg-[#f8f8fa] p-12 text-center">
        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-[#1f2937]">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-[#1f2937]">No Ingredients Yet</h3>
          <p className="mx-auto max-w-sm text-sm text-[#656565]">
            Start building your recipe by clicking the <span className="font-medium text-[#1f2937]">"Add Ingredient"</span> button above
          </p>
        </div>
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
            className={`group relative overflow-hidden rounded-sm border bg-white transition-all ${
              hasErrors
                ? "border-red-300 bg-red-50/30"
                : ingredient.sourceId
                ? "border-green-300 bg-green-50/20"
                : "border-[#d5d5dd] hover:border-[#d5d5dd]"
            }`}
          >
            <div className="p-4 space-y-4">
              {/* Compact Header */}
              <div className="flex items-center gap-3">
                {/* Ingredient Number */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm font-bold text-sm ${
                    hasErrors
                      ? "bg-red-500 text-white"
                      : ingredient.sourceId
                      ? "bg-green-600 text-white"
                      : "bg-[#1f2937] text-white"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Ingredient Name */}
                <div className="min-w-0 flex-1">
                  {ingredient.nameSnapshot ? (
                    <div className="truncate font-medium text-[15px] text-[#1f2937]">{ingredient.nameSnapshot}</div>
                  ) : (
                    <div className="text-sm italic text-[#656565]">Select ingredient...</div>
                  )}
                </div>

                {/* Delete Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveIngredient(index)}
                  className="h-8 w-8 flex-shrink-0 p-0 text-[#656565] hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Source Type Toggle */}
              <div>
                <Label className="block text-sm font-medium text-[#656565] mb-1.5">Source Type</Label>
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateIngredient(index, "sourceType", "inventory")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-sm border h-14 px-4 text-[15px] font-medium transition-all cursor-pointer ${
                      ingredient.sourceType === "inventory"
                        ? "border-[#1f2937] bg-[#1f2937] text-white"
                        : "border-[#d5d5dd] bg-white text-[#656565] hover:bg-[#f8f8fa]"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    Inventory
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateIngredient(index, "sourceType", "recipe")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-sm border h-14 px-4 text-[15px] font-medium transition-all cursor-pointer ${
                      ingredient.sourceType === "recipe"
                        ? "border-[#1f2937] bg-[#1f2937] text-white"
                        : "border-[#d5d5dd] bg-white text-[#656565] hover:bg-[#f8f8fa]"
                    }`}
                  >
                    <UtensilsCrossed className="h-4 w-4" />
                    Sub Recipe
                  </button>
                </div>
              </div>

              {/* Search Input */}
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-[#656565]">
                  {ingredient.sourceType === "inventory" ? "Search Inventory" : "Search Sub Recipe"}
                </Label>
                <div className="relative group mt-1.5">
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
                    className={`pr-10 ${
                      hasErrors && !ingredient.sourceId
                        ? "border-red-300"
                        : ingredient.sourceId
                        ? "border-green-300"
                        : ""
                    }`}
                    id={`ingredient-input-${index}`}
                  />
                  <button
                    type="button"
                    onClick={() => onToggleDropdown(index)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#656565] hover:text-[#1f2937] z-10 cursor-pointer"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute left-0 right-0 top-full z-[300] mt-1 max-h-56 overflow-y-auto rounded-sm border border-[#dcdfe3] bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {suggestions.inventory.length > 0 && (
                        <div>
                          <div className="sticky top-0 z-10 border-b border-[#dcdfe3] bg-[#f8f8fa] px-3 py-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#656565]">
                              <Package className="h-3 w-3" />
                              INVENTORY
                            </div>
                          </div>
                          {suggestions.inventory.map((item) => (
                            <button
                              key={item._id || item.id || item.ID}
                              type="button"
                              onClick={() => onSelectIngredient(index, item, "inventory")}
                              className="w-full border-b border-[#dcdfe3] px-3 py-2 text-left transition-colors hover:bg-[#f8f8fa] last:border-0 cursor-pointer"
                            >
                              <div className="font-medium text-sm text-[#1f2937]">{item.Name || item.name}</div>
                              <div className="text-xs text-[#656565]">
                                Unit: <span className="font-medium">{item.Unit || item.baseUnit || "pc"}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {suggestions.recipes.length > 0 && (
                        <div>
                          <div className="sticky top-0 z-10 border-b border-[#dcdfe3] bg-[#f8f8fa] px-3 py-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#656565]">
                              <UtensilsCrossed className="h-3 w-3" />
                              SUB RECIPES
                            </div>
                          </div>
                          {suggestions.recipes.map((recipe) => (
                            <button
                              key={recipe._id || recipe.ID}
                              type="button"
                              onClick={() => onSelectIngredient(index, recipe, "recipe")}
                              className="w-full border-b border-[#dcdfe3] px-3 py-2 text-left transition-colors hover:bg-[#f8f8fa] last:border-0 cursor-pointer"
                            >
                              <div className="font-medium text-sm text-[#1f2937]">{recipe.Name || recipe.name}</div>
                              <div className="text-xs text-[#656565]">Sub Recipe</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                    </div>
              </div>

              {/* Quantity & Unit Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Quantity Input */}
                <div>
                  <Label className="block text-sm font-medium text-[#656565] mb-1.5">Quantity</Label>
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
                    className={`mt-1.5 ${
                      hasErrors && (!ingredient.quantity || ingredient.quantity <= 0)
                        ? "border-red-300"
                        : ""
                    }`}
                  />
                </div>

                {/* Unit Display */}
                <div>
                  <Label className="block text-sm font-medium text-[#656565] mb-1.5">Unit</Label>
                  <div className="flex h-14 mt-1.5 min-w-[100px] items-center justify-center rounded-sm bg-[#f8f8fa] border border-[#d5d5dd] px-4 text-[15px] font-medium text-[#656565]">
                    {ingredient.unit || "—"}
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {hasErrors && (
                <div className="mt-2 flex items-start gap-1.5 rounded-sm border border-red-300 bg-red-50 p-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-700">
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

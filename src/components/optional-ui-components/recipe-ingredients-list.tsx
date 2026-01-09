"use client";

import React from "react";
import { Trash2, Package, UtensilsCrossed, ChevronDown, AlertCircle, X } from "lucide-react";
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
            className={`group relative overflow-hidden rounded-sm border bg-white transition-all ${hasErrors
              ? "border-red-300"
              : "border-[#d5d5dd]"
              }`}
          >
            <div className="p-3 space-y-4">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold text-[#111827] truncate">
                      {ingredient.nameSnapshot || "New Ingredient"}
                    </div>
                    {ingredient.sourceId && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#656565]">
                          {ingredient.sourceType}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(index)}
                  className="text-[#9ca3af] hover:text-[#ef4444] transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </div>

              {!ingredient.sourceId && (
                <div className="space-y-4">
                  {/* Source Type Selection */}
                  <div>
                    <Label className="text-[11px] font-medium text-[#656565] mb-2 block">Source Type</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateIngredient(index, "sourceType", "inventory")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-sm border h-10 px-4 text-sm font-medium transition-all cursor-pointer ${ingredient.sourceType === "inventory"
                          ? "border-[#111827] bg-[#111827] text-white"
                          : "border-[#d5d5dd] bg-white text-[#656565] hover:bg-[#f8f8fa]"
                          }`}
                      >
                        <Package className="h-3.5 w-3.5" />
                        Inventory
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateIngredient(index, "sourceType", "recipe")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-sm border h-10 px-4 text-sm font-medium transition-all cursor-pointer ${ingredient.sourceType === "recipe"
                          ? "border-[#111827] bg-[#111827] text-white"
                          : "border-[#d5d5dd] bg-white text-[#656565] hover:bg-[#f8f8fa]"
                          }`}
                      >
                        <UtensilsCrossed className="h-3.5 w-3.5" />
                        Sub Recipe
                      </button>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div>
                    <Label className="text-[11px] font-medium text-[#656565] mb-2 block">
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
                        className={`h-10 text-sm pr-10 bg-white ${hasErrors && !ingredient.sourceId
                          ? "border-red-300"
                          : ingredient.sourceId
                            ? "border-green-300"
                            : "border-[#d5d5dd]"
                          }`}
                        id={`ingredient-input-${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => onToggleDropdown(index)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#656565] hover:text-[#111827] z-10 cursor-pointer"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      {/* Dropdown with premium shadow */}
                      {showDropdown && (
                        <div className="absolute left-0 right-0 top-full z-[300] mt-1 max-h-56 overflow-y-auto rounded-sm border border-[#dcdfe3] bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] [&::-webkit-scrollbar]:hidden">
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
                                  className="w-full border-b border-[#dcdfe3] px-3 py-2 text-left transition-colors hover:bg-gray-50 last:border-0 cursor-pointer"
                                >
                                  <div className="font-semibold text-sm text-[#111827]">{item.Name || item.name}</div>
                                  <div className="text-[11px] text-[#656565] mt-0.5 uppercase tracking-tight">
                                    Unit: <span className="font-bold">{item.Unit || item.baseUnit || "pc"}</span>
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
                                  className="w-full border-b border-[#dcdfe3] px-3 py-2 text-left transition-colors hover:bg-gray-50 last:border-0 cursor-pointer"
                                >
                                  <div className="font-semibold text-sm text-[#111827]">{recipe.Name || recipe.name}</div>
                                  <div className="text-[11px] text-[#656565] mt-0.5 uppercase tracking-tight font-bold">Sub Recipe</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity & Unit Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-medium text-[#656565] mb-2 block">Quantity</Label>
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    value={ingredient.quantity ?? ""}
                    onChange={(e) => {
                      onUpdateIngredient(index, "quantity", e.target.value);
                    }}
                    onFocus={(e) => e.target.select()}
                    placeholder="0"
                    className={`h-9 text-sm bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${hasErrors && (!ingredient.quantity || ingredient.quantity <= 0)
                      ? "border-red-300"
                      : "border-[#d5d5dd]"
                      }`}
                  />
                </div>

                <div>
                  <Label className="text-[11px] font-medium text-[#656565] mb-2 block">Unit</Label>
                  <div className="flex h-9 items-center px-4 rounded-sm bg-[#f8f8fa] border border-[#d5d5dd] text-xs font-medium text-[#656565]">
                    {ingredient.unit || "—"}
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {hasErrors && (
                <div className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 p-3 mt-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-700 leading-tight">
                    <span className="font-bold">Required Detail:</span> {errors.join(", ")}
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

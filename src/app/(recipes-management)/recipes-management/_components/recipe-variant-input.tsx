"use client";

import React from "react";
import { X, Info, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { RecipeVariantInline, RecipeIngredient } from "@/lib/types/recipes";
import { cn } from "@/lib/utils";

interface RecipeVariantInputProps {
  variant: RecipeVariantInline;
  index: number;
  ingredients: any[]; // Inventory items
  availableRecipeOptions: any[]; // Sub-recipes
  onUpdate: (index: number, field: keyof RecipeVariantInline, value: any) => void;
  onRemove: (index: number) => void;
  onIngredientUpdate?: (vIndex: number, iIndex: number, field: keyof RecipeIngredient, value: any) => void;
  onIngredientRemove?: (vIndex: number, iIndex: number) => void;
  onIngredientDrop?: (vIndex: number, e: React.DragEvent) => void;
}

export function RecipeVariantInput({
  variant,
  index,
  ingredients,
  availableRecipeOptions,
  onUpdate,
  onRemove,
  onIngredientUpdate,
  onIngredientRemove,
  onIngredientDrop,
}: RecipeVariantInputProps) {
  return (
    <div className="p-4 border border-[#d5d5dd] rounded-sm bg-white hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-[#111827] text-white text-[11px] font-bold">
            {index + 1}
          </div>
          <div className="text-[15px] font-semibold text-[#111827]">
            Variant {index + 1}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-[#9ca3af] hover:text-[#ef4444] transition-colors p-1 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Basic Fields Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-[#656565] mb-2 block">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`variant-name-${index}`}
              value={variant.name}
              onChange={(e) => onUpdate(index, "name", e.target.value)}
              placeholder="e.g., Small (8 inch)"
              className="h-14 text-[15px] bg-white border-[#d5d5dd]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-[#656565] mb-2 block">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={variant.type}
              onValueChange={(value) => onUpdate(index, "type", value)}
            >
              <SelectTrigger id={`variant-type-${index}`} className="h-14 text-[15px] bg-white border-[#d5d5dd]">
                <SelectValue placeholder="Select type" />
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

        {/* Secondary Fields Grid (Conditional) */}
        <div className="grid grid-cols-2 gap-4">
          {variant.type === "size" ? (
            <div>
              <Label className="text-sm font-medium text-[#656565] mb-2 block">
                Size Multiplier
              </Label>
              <Input
                id={`variant-multiplier-${index}`}
                type="number"
                step="0.1"
                min="0"
                value={variant.sizeMultiplier ?? ""}
                onChange={(e) => {
                  onUpdate(index, "sizeMultiplier", e.target.value);
                }}
                onFocus={(e) => e.target.select()}
                placeholder="1.0"
                className="h-14 text-[15px] bg-white border-[#d5d5dd] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ) : (
            <div>
              <Label className="text-sm font-medium text-[#656565] mb-2 block">Description</Label>
              <Input
                id={`variant-description-grid-${index}`}
                value={variant.description || ""}
                onChange={(e) => onUpdate(index, "description", e.target.value)}
                placeholder="Brief description..."
                className="h-14 text-[15px] bg-white border-[#d5d5dd]"
              />
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-[#656565] mb-2 block">
              Base Cost Adjustment ($)
            </Label>
            <Input
              id={`variant-cost-${index}`}
              type="number"
              step="0.01"
              value={variant.baseCostAdjustment ?? ""}
              onChange={(e) => {
                onUpdate(index, "baseCostAdjustment", e.target.value);
              }}
              onFocus={(e) => e.target.select()}
              placeholder="0.00"
              className="h-14 text-[15px] bg-white border-[#d5d5dd] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Description (Standalone for Size type only) */}
        {variant.type === "size" && (
          <div>
            <Label className="text-sm font-medium text-[#656565] mb-2 block">Description</Label>
            <Textarea
              id={`variant-description-${index}`}
              value={variant.description || ""}
              onChange={(e) => onUpdate(index, "description", e.target.value)}
              placeholder="Describe this variant..."
              rows={2}
              className="bg-white border-[#d5d5dd] resize-none text-[15px]"
            />
          </div>
        )}

        {/* Variant-specific Ingredients */}
        {variant.type !== "size" && (
          <div className="mt-2 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium text-[#374151]">
                Variant Ingredients
              </Label>
              <CustomTooltip
                label="Drag items from the side panels"
                direction="right"
              >
                <Info className="h-3.5 w-3.5 text-[#9ca3af] cursor-pointer" />
              </CustomTooltip>
              {variant.ingredients && variant.ingredients.length > 0 && (
                <span className="text-[10px] font-semibold bg-[#111827] text-white px-2 py-0.5 rounded-full">
                  {variant.ingredients.length}
                </span>
              )}
            </div>

            <div
              className={cn(
                "rounded-sm border-2 border-dashed transition-all hover:border-[#111827] hover:bg-gray-50 cursor-pointer",
                variant.ingredients && variant.ingredients.length > 0
                  ? "bg-[#f8f8fa] border-[#d5d5dd] p-4"
                  : "bg-[#f8f8fa] border-[#d5d5dd] p-8 text-center"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onIngredientDrop?.(index, e);
              }}
            >
              {variant.ingredients && variant.ingredients.length > 0 ? (
                <div className="space-y-3">
                  {variant.ingredients.map((ing, iIndex) => (
                    <div
                      key={iIndex}
                      className="p-3 bg-white border border-[#d5d5dd] rounded-sm group relative"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-[#111827] truncate">
                              {ing.nameSnapshot}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#656565]">
                                {ing.sourceType}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onIngredientRemove?.(index, iIndex)}
                          className="text-[#9ca3af] hover:text-[#ef4444] transition-colors p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-[11px] font-medium text-[#656565] mb-1 block">Qty</Label>
                          <Input
                            type="number"
                            value={ing.quantity}
                            onChange={(e) => onIngredientUpdate?.(index, iIndex, "quantity", e.target.value)}
                            className="h-9 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            onFocus={(e) => e.target.select()}
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] font-medium text-[#656565] mb-1 block">Unit</Label>
                          <div className="h-9 flex items-center px-3 border border-[#d5d5dd] rounded-sm bg-[#f8f8fa] text-xs font-medium text-[#656565]">
                            {ing.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-sm bg-[#111827] shadow-md">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="mb-1 text-sm font-bold text-[#111827]">No Ingredients Yet</h4>
                  <p className="text-[11px] text-[#656565]">
                    Drag items from the side panels
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Status - Bottom Unified Placement */}
        <div className="flex items-center justify-between rounded-sm border border-[#d5d5dd] bg-[#f8f8fa] px-4 h-14 w-full">
          <span className="text-[#111827] text-sm font-medium">Active Status</span>
          <Switch
            id={`variant-active-${index}`}
            checked={variant.isActive}
            onCheckedChange={(checked) => onUpdate(index, "isActive", checked)}
          />
        </div>
      </div>
    </div>
  );
}

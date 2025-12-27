"use client";

import React from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { RecipeVariantInline, RecipeIngredient } from "@/lib/types/recipes";
// Removed RecipeIngredientsList import - using simplified ingredient input for variants

interface RecipeVariantInputProps {
  variant: RecipeVariantInline;
  index: number;
  ingredients: any[];
  availableRecipeOptions: any[];
  onUpdate: (index: number, field: keyof RecipeVariantInline, value: any) => void;
  onRemove: (index: number) => void;
}

export function RecipeVariantInput({
  variant,
  index,
  ingredients,
  availableRecipeOptions,
  onUpdate,
  onRemove,
}: RecipeVariantInputProps) {
  return (
    <div className="border border-[#d5d5dd] rounded-sm p-4 space-y-4 bg-white">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm font-bold text-sm bg-[#1f2937] text-white">
          {index + 1}
        </div>
        <h4 className="text-[15px] font-medium text-[#1f2937] flex-1">
          Variant {index + 1}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="h-8 w-8 p-0 text-[#656565] hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <Label htmlFor={`variant-name-${index}`} className="text-sm font-medium text-[#656565] mb-1.5">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`variant-name-${index}`}
            value={variant.name}
            onChange={(e) => onUpdate(index, "name", e.target.value)}
            placeholder="e.g., Small (8 inch)"
            className="mt-1.5"
            required
          />
        </div>

        {/* Type */}
        <div>
          <Label htmlFor={`variant-type-${index}`} className="text-sm font-medium text-[#656565] mb-1.5">
            Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={variant.type}
            onValueChange={(value) => onUpdate(index, "type", value)}
          >
            <SelectTrigger id={`variant-type-${index}`} className="mt-1.5">
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

        {/* Size Multiplier - Only for size type */}
        {variant.type === "size" && (
          <div>
            <Label htmlFor={`variant-multiplier-${index}`} className="text-sm font-medium text-[#656565] mb-1.5">
              Size Multiplier
            </Label>
            <Input
              id={`variant-multiplier-${index}`}
              type="number"
              step="0.1"
              min="0"
              value={variant.sizeMultiplier === 1 ? "" : (variant.sizeMultiplier || "")}
              onChange={(e) => {
                const val = e.target.value;
                onUpdate(index, "sizeMultiplier", val === '' ? 1 : parseFloat(val));
              }}
              onFocus={(e) => e.target.select()}
              placeholder="1.0"
              className="mt-1.5"
            />
          </div>
        )}

        {/* Crust Type - Only for crust type */}
        {variant.type === "crust" && (
          <div>
            <Label htmlFor={`variant-crust-${index}`} className="text-sm font-medium text-[#656565] mb-1.5">Crust Type</Label>
            <Input
              id={`variant-crust-${index}`}
              value={variant.crustType || ""}
              onChange={(e) => onUpdate(index, "crustType", e.target.value)}
              placeholder="e.g., Thin, Thick, Stuffed"
              className="mt-1.5"
            />
          </div>
        )}

        {/* Base Cost Adjustment */}
        <div>
          <Label htmlFor={`variant-cost-${index}`} className="text-sm font-medium text-[#656565] mb-1.5">
            Base Cost Adjustment ($)
          </Label>
          <Input
            id={`variant-cost-${index}`}
            type="number"
            step="0.01"
            value={variant.baseCostAdjustment === 0 ? "" : (variant.baseCostAdjustment || "")}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate(index, "baseCostAdjustment", val === '' ? 0 : parseFloat(val));
            }}
            onFocus={(e) => e.target.select()}
            placeholder="0.00"
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor={`variant-description-${index}`} className="text-sm font-medium text-[#656565] mb-1.5">Description</Label>
        <Textarea
          id={`variant-description-${index}`}
          value={variant.description || ""}
          onChange={(e) => onUpdate(index, "description", e.target.value)}
          placeholder="Describe this variant..."
          rows={2}
          className="mt-1.5"
        />
      </div>

      {/* Active Status */}
      <div className="w-full">
        <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3 w-full">
          <span className="text-[#1f2937] text-[15px] font-medium">Active</span>
          <Switch
            id={`variant-active-${index}`}
            checked={variant.isActive}
            onCheckedChange={(checked) => onUpdate(index, "isActive", checked)}
          />
        </div>
      </div>

      {/* Variant-specific Ingredients - Simplified for now */}
      <div>
        <Label className="text-sm font-medium text-[#656565] mb-1.5">Variant-Specific Ingredients (Optional)</Label>
        {variant.ingredients && variant.ingredients.length > 0 && (
          <div className="text-sm text-[#656565] bg-[#f8f8fa] border border-[#d5d5dd] p-3 rounded-sm mt-1.5">
            {variant.ingredients.length} ingredient(s) configured
          </div>
        )}
      </div>
    </div>
  );
}

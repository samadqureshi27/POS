"use client";

import React from "react";
import { Trash2, Plus, X } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
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

          {/* Type */}
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

          {/* Size Multiplier - Only for size type */}
          {variant.type === "size" && (
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
                className="h-14 text-[15px] bg-white border-[#d5d5dd]"
              />
            </div>
          )}

          {/* Crust Type - Only for crust type */}
          {variant.type === "crust" && (
            <div>
              <Label className="text-sm font-medium text-[#656565] mb-2 block">Crust Type</Label>
              <Input
                id={`variant-crust-${index}`}
                value={variant.crustType || ""}
                onChange={(e) => onUpdate(index, "crustType", e.target.value)}
                placeholder="e.g., Thin, Thick, Stuffed"
                className="h-14 text-[15px] bg-white border-[#d5d5dd]"
              />
            </div>
          )}

          {/* Base Cost Adjustment */}
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
              className="h-14 text-[15px] bg-white border-[#d5d5dd]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <Label className="text-sm font-medium text-[#656565] mb-2 block">Description</Label>
          <Textarea
            id={`variant-description-${index}`}
            value={variant.description || ""}
            onChange={(e) => onUpdate(index, "description", e.target.value)}
            placeholder="Describe this variant..."
            rows={2}
            className="bg-white border-[#d5d5dd] resize-none"
          />
        </div>

        {/* Active Status */}
        <div className="w-full">
          <div className="flex items-center justify-between rounded-sm border border-[#d5d5dd] bg-[#f8f8fa] px-4 h-14 w-full">
            <span className="text-[#111827] text-[15px] font-semibold">Active</span>
            <Switch
              id={`variant-active-${index}`}
              checked={variant.isActive}
              onCheckedChange={(checked) => onUpdate(index, "isActive", checked)}
            />
          </div>
        </div>

        {/* Variant-specific Ingredients - Simplified for now */}
        <div>
          <Label className="text-sm font-medium text-[#656565] mb-2 block">Variant-Specific Ingredients (Optional)</Label>
          {variant.ingredients && variant.ingredients.length > 0 && (
            <div className="text-sm text-[#656565] bg-[#f8f8fa] border border-[#d5d5dd] p-3 rounded-sm">
              {variant.ingredients.length} ingredient(s) configured
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          Variant {index + 1}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor={`variant-name-${index}`}>
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`variant-name-${index}`}
            value={variant.name}
            onChange={(e) => onUpdate(index, "name", e.target.value)}
            placeholder="e.g., Small (8 inch)"
            required
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor={`variant-type-${index}`}>
            Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={variant.type}
            onValueChange={(value) => onUpdate(index, "type", value)}
          >
            <SelectTrigger id={`variant-type-${index}`}>
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
          <div className="space-y-2">
            <Label htmlFor={`variant-multiplier-${index}`}>
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
            />
          </div>
        )}

        {/* Crust Type - Only for crust type */}
        {variant.type === "crust" && (
          <div className="space-y-2">
            <Label htmlFor={`variant-crust-${index}`}>Crust Type</Label>
            <Input
              id={`variant-crust-${index}`}
              value={variant.crustType || ""}
              onChange={(e) => onUpdate(index, "crustType", e.target.value)}
              placeholder="e.g., Thin, Thick, Stuffed"
            />
          </div>
        )}

        {/* Base Cost Adjustment */}
        <div className="space-y-2">
          <Label htmlFor={`variant-cost-${index}`}>
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
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <Switch
            id={`variant-active-${index}`}
            checked={variant.isActive}
            onCheckedChange={(checked) => onUpdate(index, "isActive", checked)}
          />
          <Label htmlFor={`variant-active-${index}`}>Active</Label>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor={`variant-description-${index}`}>Description</Label>
        <Textarea
          id={`variant-description-${index}`}
          value={variant.description || ""}
          onChange={(e) => onUpdate(index, "description", e.target.value)}
          placeholder="Describe this variant..."
          rows={2}
        />
      </div>

      {/* Variant-specific Ingredients - Simplified for now */}
      <div className="space-y-2">
        <Label>Variant-Specific Ingredients (Optional)</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Additional ingredients for this variant can be managed separately.
          For now, focus on the basic variant properties.
        </p>
        {variant.ingredients && variant.ingredients.length > 0 && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            {variant.ingredients.length} ingredient(s) configured
          </div>
        )}
      </div>
    </div>
  );
}

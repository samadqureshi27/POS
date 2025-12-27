// components/OptionValuesForm.tsx
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MenuItemOptions, OptionValuesFormProps, AddonItemValue } from '@/lib/types/menuItemOptions';
import { InventoryService, InventoryItem } from '@/lib/services/inventory-service';
import { RecipeService, Recipe } from '@/lib/services/recipe-service';
import { logError } from '@/lib/util/logger';

const OptionValuesForm: React.FC<OptionValuesFormProps> = ({ formData, onFormDataChange }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize addon items if not present
  useEffect(() => {
    if (!formData.addonItems) {
      onFormDataChange({
        ...formData,
        addonItems: [],
      });
    }
  }, []);

  // Load inventory items and recipes
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inventoryRes, recipeRes] = await Promise.all([
        InventoryService.listItems({ limit: 1000 }),
        RecipeService.listRecipes(),
      ]);

      if (inventoryRes.success && inventoryRes.data) {
        setInventoryItems(inventoryRes.data);
      }

      if (recipeRes.success && recipeRes.data) {
        setRecipes(recipeRes.data);
      }
    } catch (error) {
      logError('Error loading data', error, {
        component: 'OptionValuesForm',
        action: 'loadData',
      });
    } finally {
      setLoading(false);
    }
  };

  const addAddonItem = () => {
    const newItem: AddonItemValue = {
      sourceType: "inventory",
      sourceId: "",
      nameSnapshot: "",
      price: 0,
      unit: "unit",
      isRequired: false,
      displayOrder: (formData.addonItems?.length || 0) + 1,
    };

    onFormDataChange({
      ...formData,
      addonItems: [...(formData.addonItems || []), newItem],
    });
  };

  const removeAddonItem = (index: number) => {
    onFormDataChange({
      ...formData,
      addonItems: (formData.addonItems || []).filter((_, i) => i !== index),
    });
  };

  const updateAddonItem = (index: number, updates: Partial<AddonItemValue>) => {
    const updated = [...(formData.addonItems || [])];
    updated[index] = { ...updated[index], ...updates };
    onFormDataChange({
      ...formData,
      addonItems: updated,
    });
  };

  const handleSourceChange = (index: number, sourceType: "inventory" | "recipe") => {
    const updates: Partial<AddonItemValue> = {
      sourceType,
      sourceId: "",
      nameSnapshot: "",
    };
    
    // If switching to recipe, remove unit. If switching to inventory, set default unit
    if (sourceType === "recipe") {
      updates.unit = undefined;
    } else {
      updates.unit = "unit";
    }
    
    updateAddonItem(index, updates);
  };

  const handleItemSelect = (index: number, sourceId: string) => {
    const item = formData.addonItems?.[index];
    if (!item) return;

    let name = "";
    let unit = "";
    
    if (item.sourceType === "inventory") {
      const invItem = inventoryItems.find(i => (i._id || i.id) === sourceId);
      name = invItem?.name || "";
      // Fetch unit from inventory item (check multiple possible property names)
      unit = invItem?.baseUnit || invItem?.Unit || invItem?.unit || "unit";
    } else {
      const recipe = recipes.find(r => r._id === sourceId);
      name = recipe?.name || "";
      // For recipes, don't set unit (it will be hidden)
    }

    const updates: Partial<AddonItemValue> = {
      sourceId,
      nameSnapshot: name,
    };

    // Only update unit if source type is inventory
    if (item.sourceType === "inventory" && unit) {
      updates.unit = unit;
    }

    updateAddonItem(index, updates);
  };


  const getSourceItems = (sourceType: "inventory" | "recipe") => {
    if (sourceType === "inventory") {
      return inventoryItems;
    }
    return recipes;
  };

  const hasItems = formData.addonItems && formData.addonItems.length > 0;

  return (
    <div className="space-y-3">
      {hasItems ? (
        <>
          {/* Card Layout for All Screen Sizes */}
          <div className="space-y-3">
            {(formData.addonItems || []).map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-[#d5d5dd] rounded-sm bg-white hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      Item #{idx + 1}
                    </div>
                    <div className="text-xs text-gray-500">{item.nameSnapshot || 'Not selected'}</div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddonItem(idx)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors flex-shrink-0 ml-2 cursor-pointer"
                  >
                    <X size={16} />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-[#656565] mb-1.5 block">
                      Source Type
                    </Label>
                    <Select
                      value={item.sourceType}
                      onValueChange={(val) => handleSourceChange(idx, val as "inventory" | "recipe")}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="recipe">Recipe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#656565] mb-1.5 block">
                      Item
                    </Label>
                    <Select
                      value={item.sourceId}
                      onValueChange={(val) => handleItemSelect(idx, val)}
                      disabled={!item.sourceType}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSourceItems(item.sourceType).map((sourceItem: any) => (
                          <SelectItem key={sourceItem._id || sourceItem.id} value={sourceItem._id || sourceItem.id || ''}>
                            {sourceItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={item.sourceType === "recipe" ? "" : "grid grid-cols-1 sm:grid-cols-2 gap-6"}>
                    <div>
                      <Label className="text-sm font-medium text-[#656565] mb-1.5 block">
                        Price
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price === 0 ? "" : item.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateAddonItem(idx, { price: val === '' ? 0 : Number(val) });
                        }}
                        onFocus={(e) => e.target.select()}
                        placeholder="0.00"
                        className="mt-1.5"
                      />
                    </div>
                    {item.sourceType === "inventory" && (
                      <div>
                        <Label className="text-sm font-medium text-[#656565] mb-1.5 block">
                          Unit
                        </Label>
                        <Input
                          type="text"
                          value={item.unit || 'unit'}
                          disabled
                          placeholder="unit"
                          className="mt-1.5"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox
                      id={`required-${idx}`}
                      checked={item.isRequired || false}
                      onCheckedChange={(checked) => updateAddonItem(idx, { isRequired: checked as boolean })}
                    />
                    <Label htmlFor={`required-${idx}`} className="text-sm font-medium text-[#656565] cursor-pointer">
                      Required
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button - Full Width Below List */}
          <Button
            type="button"
            onClick={addAddonItem}
            variant="outline"
            className="w-full mt-4 px-8 h-11 border-gray-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </>
      ) : (
        <>
          {/* Empty State */}
          <div className="relative overflow-hidden rounded-sm border border-dashed border-[#d5d5dd] bg-[#f8f8fa] p-12 text-center transition-all">
            <div className="relative z-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-[#1f2937] shadow-lg">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#1f2937]">No Items Yet</h3>
              <p className="mx-auto max-w-sm text-sm text-[#656565]">
                Start building your add-on by clicking the <span className="font-semibold text-[#1f2937]">"Add Item"</span> button below
              </p>
            </div>
          </div>
          
          {/* Add Item Button - Below empty state */}
          <Button
            type="button"
            onClick={addAddonItem}
            variant="outline"
            className="w-full mt-4 px-8 h-11 border-gray-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </>
      )}
    </div>
  );
};

export default OptionValuesForm;

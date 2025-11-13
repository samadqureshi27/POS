// components/OptionValuesForm.tsx
import React, { useState, useEffect } from 'react';
import { Plus, X, Grip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import DragTable from '@/components/ui/drag-table';
import { MenuItemOptions, OptionValuesFormProps, AddonItemValue } from '@/lib/types/menuItemOptions';
import { InventoryService, InventoryItem } from '@/lib/services/inventory-service';
import { RecipeService, Recipe } from '@/lib/services/recipe-service';

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
      console.error('Error loading data:', error);
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
    updateAddonItem(index, {
      sourceType,
      sourceId: "",
      nameSnapshot: "",
    });
  };

  const handleItemSelect = (index: number, sourceId: string) => {
    const item = formData.addonItems?.[index];
    if (!item) return;

    let name = "";
    if (item.sourceType === "inventory") {
      const invItem = inventoryItems.find(i => (i._id || i.id) === sourceId);
      name = invItem?.name || "";
    } else {
      const recipe = recipes.find(r => r._id === sourceId);
      name = recipe?.name || "";
    }

    updateAddonItem(index, {
      sourceId,
      nameSnapshot: name,
    });
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const items = Array.from(formData.addonItems || []);
    const [movedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, movedItem);

    // Update display orders
    const updatedItems = items.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    onFormDataChange({
      ...formData,
      addonItems: updatedItems,
    });
  };

  const getSourceItems = (sourceType: "inventory" | "recipe") => {
    if (sourceType === "inventory") {
      return inventoryItems;
    }
    return recipes;
  };

  // Prepare data for DragTable
  const tableData = (formData.addonItems || []).map((item, idx) => ({
    ...item,
    index: idx
  }));

  const tableColumns = [
    {
      key: 'sourceType',
      label: 'Source Type',
      width: '140px',
      render: (value: string, item: AddonItemValue, index: number) => (
        <Select
          value={value}
          onValueChange={(val) => handleSourceChange(index, val as "inventory" | "recipe")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="recipe">Recipe</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    {
      key: 'sourceId',
      label: 'Item',
      width: 'minmax(200px, 1fr)',
      render: (value: string, item: AddonItemValue, index: number) => (
        <Select
          value={value}
          onValueChange={(val) => handleItemSelect(index, val)}
          disabled={!item.sourceType}
        >
          <SelectTrigger className="w-full">
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
      )
    },
    {
      key: 'price',
      label: 'Price',
      width: '100px',
      render: (value: number, item: AddonItemValue, index: number) => (
        <Input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => updateAddonItem(index, { price: Number(e.target.value) || 0 })}
          className="w-full text-center"
          placeholder="0.00"
        />
      )
    },
    {
      key: 'unit',
      label: 'Unit',
      width: '100px',
      render: (value: string, item: AddonItemValue, index: number) => (
        <Input
          type="text"
          value={value || 'unit'}
          onChange={(e) => updateAddonItem(index, { unit: e.target.value })}
          className="w-full"
          placeholder="unit"
        />
      )
    },
    {
      key: 'isRequired',
      label: 'Required',
      width: '80px',
      render: (value: boolean, item: AddonItemValue, index: number) => (
        <div className="flex justify-center">
          <Checkbox
            checked={value || false}
            onCheckedChange={(checked) => updateAddonItem(index, { isRequired: checked as boolean })}
          />
        </div>
      )
    }
  ];

  const hasItems = formData.addonItems && formData.addonItems.length > 0;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section - Non-scrollable */}
      <div className="flex-shrink-0 space-y-4 p-6 bg-white">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Add-on Items
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Add items from inventory or recipes as add-on options
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAddonItem}
          className="flex items-center gap-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 hover:bg-blue-50"
        >
          <Plus size={16} />
          Add Item
        </Button>
      </div>

      {/* Scrollable Content Area with Fixed Height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {hasItems ? (
          <div className="h-full flex flex-col">
            {/* Section Header - Sticky */}
            <div className="flex-shrink-0 px-6 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
              <h4 className="text-sm font-medium text-gray-700">
                Items ({formData.addonItems?.length || 0})
              </h4>
            </div>

            {/* Scrollable Items List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
              {/* Desktop Table Layout */}
              <div className="hidden lg:block h-full">
                <div className="overflow-x-auto h-full">
                  <div className="min-w-full">
                    <DragTable
                      data={tableData}
                      columns={tableColumns}
                      onReorder={handleDragEnd}
                      onDelete={removeAddonItem}
                      droppableId="addon-items"
                      emptyMessage="No items added"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Card Layout */}
              <div className="lg:hidden space-y-3">
                {(formData.addonItems || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0 mt-0.5">
                          <Grip size={16} className="text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            Item #{idx + 1}
                          </div>
                          <div className="text-xs text-gray-500">{item.nameSnapshot || 'Not selected'}</div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAddonItem(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors flex-shrink-0 ml-2"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1 block">
                          Source Type
                        </Label>
                        <Select
                          value={item.sourceType}
                          onValueChange={(val) => handleSourceChange(idx, val as "inventory" | "recipe")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inventory">Inventory</SelectItem>
                            <SelectItem value="recipe">Recipe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1 block">
                          Item
                        </Label>
                        <Select
                          value={item.sourceId}
                          onValueChange={(val) => handleItemSelect(idx, val)}
                          disabled={!item.sourceType}
                        >
                          <SelectTrigger>
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
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1 block">
                            Price
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={(e) => updateAddonItem(idx, { price: Number(e.target.value) || 0 })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1 block">
                            Unit
                          </Label>
                          <Input
                            type="text"
                            value={item.unit || 'unit'}
                            onChange={(e) => updateAddonItem(idx, { unit: e.target.value })}
                            placeholder="unit"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`required-${idx}`}
                          checked={item.isRequired || false}
                          onCheckedChange={(checked) => updateAddonItem(idx, { isRequired: checked as boolean })}
                        />
                        <Label htmlFor={`required-${idx}`} className="text-xs font-medium text-gray-700">
                          Required
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State - Centered in available space */
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center py-12 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200 max-w-sm w-full">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">No items added</h4>
              <p className="text-xs text-gray-500 px-4">
                Add items from inventory or recipes to provide choices for customers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionValuesForm;

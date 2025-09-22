import React, { useState, useEffect } from "react";
import { Grip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DragTable from "@/components/ui/drag-table";

// Unit conversion helper - for now hardcoded, later to be managed in settings
const getUnitOptions = (baseUnit: string): { value: string; label: string }[] => {
  const unitMappings: Record<string, { value: string; label: string }[]> = {
    // Weight units
    'kg': [
      { value: 'gs', label: 'Grams (gs)' },
      { value: 'kgs', label: 'Kilograms (kgs)' },
      { value: 'lbs', label: 'Pounds (lbs)' },
      { value: 'oz', label: 'Ounces (oz)' }
    ],
    'g': [
      { value: 'gs', label: 'Grams (gs)' },
      { value: 'kgs', label: 'Kilograms (kgs)' },
      { value: 'lbs', label: 'Pounds (lbs)' },
      { value: 'oz', label: 'Ounces (oz)' }
    ],
    'gs': [
      { value: 'gs', label: 'Grams (gs)' },
      { value: 'kgs', label: 'Kilograms (kgs)' },
      { value: 'lbs', label: 'Pounds (lbs)' },
      { value: 'oz', label: 'Ounces (oz)' }
    ],
    'grams': [
      { value: 'gs', label: 'Grams (gs)' },
      { value: 'kgs', label: 'Kilograms (kgs)' },
      { value: 'lbs', label: 'Pounds (lbs)' },
      { value: 'oz', label: 'Ounces (oz)' }
    ],

    // Volume units
    'l': [
      { value: 'ml', label: 'Milliliters (ml)' },
      { value: 'ltrs', label: 'Liters (ltrs)' },
      { value: 'cups', label: 'Cups' },
      { value: 'fl oz', label: 'Fluid Ounces (fl oz)' }
    ],
    'ltrs': [
      { value: 'ml', label: 'Milliliters (ml)' },
      { value: 'ltrs', label: 'Liters (ltrs)' },
      { value: 'cups', label: 'Cups' },
      { value: 'fl oz', label: 'Fluid Ounces (fl oz)' }
    ],
    'ml': [
      { value: 'ml', label: 'Milliliters (ml)' },
      { value: 'ltrs', label: 'Liters (ltrs)' },
      { value: 'cups', label: 'Cups' },
      { value: 'fl oz', label: 'Fluid Ounces (fl oz)' }
    ],
    'liters': [
      { value: 'ml', label: 'Milliliters (ml)' },
      { value: 'ltrs', label: 'Liters (ltrs)' },
      { value: 'cups', label: 'Cups' },
      { value: 'fl oz', label: 'Fluid Ounces (fl oz)' }
    ],

    // Quantity units
    'pcs': [
      { value: 'pcs', label: 'Pieces (pcs)' },
      { value: 'slices', label: 'Slices' },
      { value: 'dozen', label: 'Dozen' },
      { value: 'count', label: 'Count' }
    ],
    'pieces': [
      { value: 'pcs', label: 'Pieces (pcs)' },
      { value: 'slices', label: 'Slices' },
      { value: 'dozen', label: 'Dozen' },
      { value: 'count', label: 'Count' }
    ],
    'slices': [
      { value: 'pcs', label: 'Pieces (pcs)' },
      { value: 'slices', label: 'Slices' },
      { value: 'dozen', label: 'Dozen' },
      { value: 'count', label: 'Count' }
    ],
    'count': [
      { value: 'pcs', label: 'Pieces (pcs)' },
      { value: 'slices', label: 'Slices' },
      { value: 'dozen', label: 'Dozen' },
      { value: 'count', label: 'Count' }
    ]
  };

  const normalized = baseUnit?.toLowerCase() || '';
  return unitMappings[normalized] || [{ value: baseUnit || 'pcs', label: baseUnit || 'Pieces (pcs)' }];
};

interface RecipeOption {
  ID: number;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  OptionValue: string[];
  OptionPrice: number[];
  IngredientValue: string[];
  IngredientPrice: number[];
  Priority: number;
}

interface Ingredient {
  ID: number;
  Name: string;
  Unit?: string;
  price?: number;
}

interface RecipeIngredientsTabProps {
  formData: Omit<RecipeOption, "ID">;
  ingredients: Ingredient[];
  onFormDataChange: (data: Omit<RecipeOption, "ID">) => void;
  tabType: "option" | "ingredient";
}

const RecipeIngredientsTab: React.FC<RecipeIngredientsTabProps> = ({
  formData,
  ingredients,
  onFormDataChange,
  tabType,
}) => {
  const isOption = tabType === "option";
  const values = isOption ? formData.OptionValue : formData.IngredientValue;
  const prices = isOption ? formData.OptionPrice : formData.IngredientPrice;

  // Track selected units for each ingredient (only for ingredients, not options)
  const [selectedUnits, setSelectedUnits] = useState<Record<number, string>>({});

  // Update unit for specific ingredient
  const updateUnit = (index: number, unit: string) => {
    setSelectedUnits(prev => ({ ...prev, [index]: unit }));
  };

  const addIngredient = (ingredientName: string) => {
    if (!values.includes(ingredientName)) {
      let defaultPrice = 0;

      if (isOption) {
        // For options, try to get the actual price from the option data
        const optionData = dataToUse.find(item => item.Name === ingredientName);
        if (optionData && optionData.price !== undefined) {
          // Use the actual option price as default
          defaultPrice = optionData.price || 0;
        }

        onFormDataChange({
          ...formData,
          OptionValue: [...values, ingredientName],
          OptionPrice: [...prices, defaultPrice],
        });
      } else {
        onFormDataChange({
          ...formData,
          IngredientValue: [...values, ingredientName],
          IngredientPrice: [...prices, defaultPrice],
        });
      }
    }
  };

  const removeIngredient = (idx: number) => {
    const updatedValues = values.filter((_, i) => i !== idx);
    const updatedPrices = prices.filter((_, i) => i !== idx);
    
    if (isOption) {
      onFormDataChange({
        ...formData,
        OptionValue: updatedValues,
        OptionPrice: updatedPrices,
      });
    } else {
      onFormDataChange({
        ...formData,
        IngredientValue: updatedValues,
        IngredientPrice: updatedPrices,
      });
    }
  };

  const updatePrice = (idx: number, value: number) => {
    const updated = [...prices];
    updated[idx] = value;
    
    if (isOption) {
      onFormDataChange({
        ...formData,
        OptionPrice: updated,
      });
    } else {
      onFormDataChange({
        ...formData,
        IngredientPrice: updated,
      });
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const newValues = Array.from(values);
    const [movedValue] = newValues.splice(source.index, 1);
    newValues.splice(destination.index, 0, movedValue);

    const newPrices = Array.from(prices);
    const [movedPrice] = newPrices.splice(source.index, 1);
    newPrices.splice(destination.index, 0, movedPrice);

    if (isOption) {
      onFormDataChange({
        ...formData,
        OptionValue: newValues,
        OptionPrice: newPrices,
      });
    } else {
      onFormDataChange({
        ...formData,
        IngredientValue: newValues,
        IngredientPrice: newPrices,
      });
    }
  };

  const title = isOption ? "Recipe Options" : "Ingredients";
  const priceLabel = isOption ? "Price" : "Amount";

  // Use real data from management tables
  const dataToUse = ingredients || [];

  // Initialize units when values change
  useEffect(() => {
    if (!isOption) {
      const newUnits: Record<number, string> = {};
      values.forEach((name: string, index: number) => {
        const ingredient = dataToUse.find(ing => ing.Name === name);
        if (ingredient?.Unit && !selectedUnits[index]) {
          newUnits[index] = ingredient.Unit;
        }
      });
      if (Object.keys(newUnits).length > 0) {
        setSelectedUnits(prev => ({ ...prev, ...newUnits }));
      }
    }
  }, [values, isOption, dataToUse, selectedUnits]);

  // Prepare data for DragTable
  const tableData = values.map((name: string, idx: number) => {
    const ingredient = dataToUse.find(ing => ing.Name === name);
    return {
      name: name,
      price: prices[idx] || 0,
      unit: ingredient?.Unit || '',
      selectedUnit: selectedUnits[idx] || ingredient?.Unit || '',
      index: idx
    };
  });

  const tableColumns = [
    {
      key: 'name',
      label: 'Item Name',
      width: 'minmax(200px, 1fr)',
      render: (value: string, item: any) => (
        <div>
          <div className="font-medium text-gray-800">{value}</div>
          {!isOption && item.unit && (
            <div className="text-xs text-blue-600">Unit: {item.unit}</div>
          )}
        </div>
      )
    },
    {
      key: 'price',
      label: priceLabel,
      width: '120px',
      render: (value: number, item: any, index: number) => (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <Input
              type="number"
              step={isOption ? "0.01" : "1"}
              value={value}
              onChange={(e) => updatePrice(index, Number(e.target.value) || 0)}
              className="w-16 text-center transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              placeholder="0"
            />
            {!isOption && item.unit && (
              <Select
                value={item.selectedUnit}
                onValueChange={(unit) => updateUnit(index, unit)}
              >
                <SelectTrigger className="w-14 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getUnitOptions(item.unit).map((unitOption) => (
                    <SelectItem key={unitOption.value} value={unitOption.value} className="text-xs">
                      {unitOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          {!isOption && item.unit && (
            <span className="text-xs text-gray-500">per {item.selectedUnit}</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="pr-1 py-4 space-y-6">
      {/* Header Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          {title} Configuration
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Add and configure {title.toLowerCase()} for this recipe with pricing
        </p>

        {/* Add Item Selector */}
        <div className="flex-1">
          <Label className="text-sm font-medium text-gray-700">
            Add {title.slice(0, -1)}
          </Label>
          <Select onValueChange={(value) => addIngredient(value)}>
            <SelectTrigger className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20">
              <SelectValue placeholder={`Select ${title.toLowerCase().slice(0, -1)} to add...`} />
            </SelectTrigger>
            <SelectContent className="max-h-60 z-[100]">
              {dataToUse && dataToUse.length > 0 ? (
                dataToUse
                  .filter((ingredient) => !values.includes(ingredient.Name))
                  .map((ingredient) => (
                    <SelectItem key={ingredient.ID} value={ingredient.Name} className="cursor-pointer">
                      <div>
                        <div className="font-medium">{ingredient.Name}</div>
                        {!isOption && ingredient.Unit && (
                          <div className="text-xs text-gray-500">Unit: {ingredient.Unit}</div>
                        )}
                        {isOption && ingredient.price !== undefined && (
                          <div className="text-xs text-green-600">Price: ${ingredient.price}</div>
                        )}
                      </div>
                    </SelectItem>
                  ))
              ) : (
                <SelectItem key="no-data" value="" disabled>
                  No {title.toLowerCase()} available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Items Display */}
      {values && values.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">
            {title} Items ({values.length})
          </h4>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <DragTable
              data={tableData}
              columns={tableColumns}
              onReorder={onDragEnd}
              onDelete={removeIngredient}
              droppableId={`${tabType}-items`}
              emptyMessage={`No ${title.toLowerCase()} added`}
            />
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {values.map((opt, idx) => {
              const ingredient = dataToUse.find(ing => ing.Name === opt);
              return (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Grip size={16} className="text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-800">{opt}</div>
                        {!isOption && ingredient?.Unit && (
                          <div className="text-xs text-blue-600">Unit: {ingredient.Unit}</div>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">
                      {priceLabel}
                      {!isOption && ingredient?.Unit && (
                        <span className="ml-1 text-gray-500">(per {selectedUnits[idx] || ingredient.Unit})</span>
                      )}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step={isOption ? "0.01" : "1"}
                        value={prices[idx] || 0}
                        onChange={(e) => {
                          const value = Number(e.target.value) || 0;
                          updatePrice(idx, value);
                        }}
                        placeholder="0"
                        className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                      />
                      {!isOption && ingredient?.Unit && (
                        <Select
                          value={selectedUnits[idx] || ingredient.Unit}
                          onValueChange={(unit) => updateUnit(idx, unit)}
                        >
                          <SelectTrigger className="w-16 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getUnitOptions(ingredient.Unit).map((unitOption) => (
                              <SelectItem key={unitOption.value} value={unitOption.value} className="text-xs">
                                {unitOption.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!values || values.length === 0) && (
        <div className="text-center py-12 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">No {title.toLowerCase()} added</h4>
          <p className="text-xs text-gray-500">
            Select {title.toLowerCase()} from the dropdown above to add them to this recipe
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeIngredientsTab;
import React from "react";
import { Grip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  const addIngredient = (ingredientName: string) => {
    if (!values.includes(ingredientName)) {
      if (isOption) {
        onFormDataChange({
          ...formData,
          OptionValue: [...values, ingredientName],
          OptionPrice: [...prices, 0],
        });
      } else {
        onFormDataChange({
          ...formData,
          IngredientValue: [...values, ingredientName],
          IngredientPrice: [...prices, 0],
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
                        {ingredient.Unit && (
                          <div className="text-xs text-gray-500">Unit: {ingredient.Unit}</div>
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
            <div className="border border-gray-200 rounded-lg bg-gray-50/50">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="w-12 p-3 text-center text-xs font-medium text-gray-500 uppercase"></th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                    <th className="w-24 p-3 text-center text-xs font-medium text-gray-500 uppercase">{priceLabel}</th>
                    <th className="w-12 p-3 text-center text-xs font-medium text-gray-500 uppercase"></th>
                  </tr>
                </thead>
              </table>
            </div>

            <div className="border-l border-r border-b border-gray-200 rounded-b-lg min-h-[120px] overflow-y-auto bg-white">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`${tabType}-items`}>
                  {(provided) => (
                    <table className="w-full border-collapse">
                      <tbody ref={provided.innerRef} {...provided.droppableProps}>
                        {values.map((opt, idx) => (
                          <Draggable
                            key={idx}
                            draggableId={`${tabType}-item-${idx}`}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`hover:bg-gray-50 transition-colors ${
                                  snapshot.isDragging ? "bg-blue-50 shadow-lg" : ""
                                } border-b border-gray-100 last:border-b-0`}
                              >
                                <td
                                  className="p-3 text-center cursor-grab w-12"
                                  {...provided.dragHandleProps}
                                >
                                  <Grip size={16} className="text-gray-400 mx-auto" />
                                </td>
                                <td className="p-3">
                                  <div className="font-medium text-gray-800">{opt}</div>
                                  <div className="text-xs text-gray-500">{title.slice(0, -1)} component</div>
                                </td>
                                <td className="p-3 text-center">
                                  <Input
                                    type="number"
                                    step={isOption ? "0.01" : "1"}
                                    value={prices[idx] || 0}
                                    onChange={(e) => {
                                      const value = Number(e.target.value) || 0;
                                      updatePrice(idx, value);
                                    }}
                                    className="w-20 text-center mx-auto transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="0"
                                  />
                                </td>
                                <td className="p-3 text-center w-12">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeIngredient(idx)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors px-2 py-1 rounded h-auto w-auto"
                                  >
                                    <X size={16} />
                                  </Button>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                    </table>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {values.map((opt, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Grip size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-800">{opt}</div>
                      <div className="text-xs text-gray-500">{title.slice(0, -1)} component</div>
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
                  <Label className="text-xs font-medium text-gray-700 mb-1 block">{priceLabel}</Label>
                  <Input
                    type="number"
                    step={isOption ? "0.01" : "1"}
                    value={prices[idx] || 0}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      updatePrice(idx, value);
                    }}
                    placeholder="0"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            ))}
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
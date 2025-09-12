import React from "react";
import { ChevronDown, Grip, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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
  Unit: string;
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

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Add Ingredient Button */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="w-full flex items-center justify-between px-4 py-2 mb-2 text-black rounded-sm hover:bg-gray-300 transition-colors cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]">
            <span className="text-sm">Add New {title}</span>
            <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="w-full min-w-[280px] max-w-[90vw] sm:min-w-[510px] rounded-sm bg-white shadow-sm border border-gray-200 p-1 outline-none overflow-visible z-[99999]"
              sideOffset={6}
              avoidCollisions={true}
              collisionPadding={20}
            >
              <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
              <div className="max-h-60 overflow-y-auto">
                {ingredients.map((ingredient) => (
                  <DropdownMenu.Item
                    key={ingredient.ID}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none select-none"
                    onSelect={() => addIngredient(ingredient.Name)}
                  >
                    {ingredient.Name}
                  </DropdownMenu.Item>
                ))}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Mobile Card Layout */}
      <div className="block sm:hidden overflow-y-auto max-h-[300px]">
        <div className="space-y-3 pb-4">
          {values.map((opt, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Grip size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-700">
                    {isOption ? "Option" : "Ingredient"} {idx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={opt}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-gray-100 text-sm"
                    placeholder="Ingredient name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {priceLabel}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={prices[idx]}
                    onChange={(e) => {
                      const value = Number(e.target.value.replace(/\D/g, "")) || 0;
                      updatePrice(idx, value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:flex sm:flex-col flex-1 min-h-0">
        {/* Fixed Header */}
        <div className="border border-gray-200 rounded-t-sm bg-gray-50 flex-shrink-0">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="w-24 p-3 text-left text-sm font-medium text-gray-700">{priceLabel}</th>
                <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body */}
        <div
          className="border-l border-r border-b border-gray-200 rounded-b-sm overflow-y-auto bg-white max-h-[250px] min-h-[250px]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f1f5f9",
          }}
        >
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
                            className={`hover:bg-gray-50 ${
                              snapshot.isDragging
                                ? "bg-gray-100 shadow-sm"
                                : ""
                            } border-b border-gray-200`}
                          >
                            {/* Drag Handle */}
                            <td
                              className="p-3 text-center cursor-grab w-12"
                              {...provided.dragHandleProps}
                            >
                              <Grip size={18} className="text-gray-500 mx-auto" />
                            </td>

                            {/* Ingredient Name (readonly) */}
                            <td className="p-3">
                              <input
                                type="text"
                                value={opt}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-gray-100"
                                placeholder="Ingredient name"
                              />
                            </td>

                            {/* Price/Amount */}
                            <td className="p-3 text-center w-24">
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={prices[idx]}
                                onChange={(e) => {
                                  const value = Number(e.target.value.replace(/\D/g, "")) || 0;
                                  updatePrice(idx, value);
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-center"
                                placeholder="0"
                              />
                            </td>

                            {/* Delete Button */}
                            <td className="p-3 text-center w-12">
                              <button
                                type="button"
                                onClick={() => removeIngredient(idx)}
                                className="text-black border-2 px-2 py-1 rounded-sm hover:text-gray-700"
                              >
                                <X size={20} />
                              </button>
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
    </div>
  );
};

export default RecipeIngredientsTab;
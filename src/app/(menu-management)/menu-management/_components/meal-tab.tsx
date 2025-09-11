"use client";

import React from "react";
import { ChevronDown, Plus, X, Grip } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Toggle from "./toggle";

interface MealTabProps {
  formData: any;
  setFormData: (data: any) => void;
  handleStatusChange: (field: string, isActive: boolean) => void;
}

const sizeOptionss = ["Cheese", "Pepperoni", "Olives", "Onions", "Bacon", "Pineapple"];

const MealTab: React.FC<MealTabProps> = ({ formData, setFormData, handleStatusChange }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Menu Item Option
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="w-full sm:flex-1 flex items-center justify-between px-4 py-2 text-black rounded-sm hover:bg-gray-300 transition-colors cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]">
            <span className="text-sm">Add New Option</span>
            <ChevronDown size={16} className="text-gray-500" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="w-full min-w-[300px] rounded-sm bg-white shadow-md border border-gray-200 p-1 relative outline-none max-h-60 overflow-y-auto z-100"
              sideOffset={6}
            >
              <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 z-100" />
              {sizeOptionss.map((size, i) => (
                <DropdownMenu.Item
                  key={i}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                  onClick={() => {
                    if (!formData.MealValue?.includes(size)) {
                      setFormData({
                        ...formData,
                        MealValue: [...(formData.MealValue || []), size],
                        MealPrice: [...(formData.MealPrice || []), 0],
                      });
                    }
                  }}
                >
                  {size}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <div className="flex flex-col items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Deal?
          </label>
          <Toggle
            checked={formData.Deal === "Active"}
            onChange={(checked) => handleStatusChange("Deal", checked)}
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="border border-gray-200 rounded-t-lg bg-gray-50">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="w-24 p-3 text-center text-sm font-medium text-gray-700">Price</th>
                <th className="w-20 p-3 text-center text-sm font-medium text-gray-700">Override</th>
                <th className="w-20 p-3 text-center text-sm font-medium text-gray-700">Status</th>
                <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="border-l border-r border-b border-gray-200 rounded-b-lg min-h-[197px] overflow-y-auto bg-white">
          <DragDropContext
            onDragEnd={(result) => {
              const { source, destination } = result;
              if (!destination || source.index === destination.index) return;

              const newMealValue = Array.from(formData.MealValue || []);
              const [movedValue] = newMealValue.splice(source.index, 1);
              newMealValue.splice(destination.index, 0, movedValue);

              const newMealPrice = Array.from(formData.MealPrice || []);
              const [movedPrice] = newMealPrice.splice(source.index, 1);
              newMealPrice.splice(destination.index, 0, movedPrice);

              setFormData({
                ...formData,
                MealValue: newMealValue,
                MealPrice: newMealPrice,
              });
            }}
          >
            <Droppable droppableId="meal-sizes">
              {(provided) => (
                <table className="w-full border-collapse">
                  <tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {(formData.MealValue || []).map((opt: string, idx: number) => (
                      <Draggable key={idx} draggableId={`meal-${idx}`} index={idx}>
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`hover:bg-gray-50 ${
                              snapshot.isDragging ? "bg-gray-100 shadow-lg" : ""
                            } border-b border-gray-200`}
                          >
                            <td
                              className="p-3 text-center cursor-grab w-12"
                              {...provided.dragHandleProps}
                            >
                              <Grip size={18} className="text-gray-500 mx-auto" />
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...(formData.MealValue || [])];
                                  updated[idx] = e.target.value;
                                  setFormData({
                                    ...formData,
                                    MealValue: updated,
                                  });
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                                placeholder="Size name"
                              />
                            </td>
                            <td className="p-3 text-center">
                              <input
                                type="number"
                                step="0.01"
                                value={formData.MealPrice?.[idx] || 0}
                                onChange={(e) => {
                                  const updated = [...(formData.MealPrice || [])];
                                  updated[idx] = Number(e.target.value) || 0;
                                  setFormData({
                                    ...formData,
                                    MealPrice: updated,
                                  });
                                }}
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-center mx-auto"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="p-3 text-center">
                              <Toggle
                                checked={formData.OverRide?.[idx] === "Active"}
                                onChange={(checked) => {
                                  const updated = [...(formData.OverRide || [])];
                                  updated[idx] = checked ? "Active" : "Inactive";
                                  setFormData({
                                    ...formData,
                                    OverRide: updated,
                                  });
                                }}
                              />
                            </td>
                            <td className="p-3 text-center">
                              <Toggle
                                checked={formData.status?.[idx] === "Active"}
                                onChange={(checked) => {
                                  const updated = [...(formData.status || [])];
                                  updated[idx] = checked ? "Active" : "Inactive";
                                  setFormData({
                                    ...formData,
                                    status: updated,
                                  });
                                }}
                              />
                            </td>
                            <td className="p-3 text-center w-12">
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedValues = (formData.MealValue || []).filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  const updatedPrices = (formData.MealPrice || []).filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  setFormData({
                                    ...formData,
                                    MealValue: updatedValues,
                                    MealPrice: updatedPrices,
                                  });
                                }}
                                className="text-black border-2 px-2 py-1 rounded hover:text-gray-700"
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

      {/* Mobile Card View for Meal Tab */}
      <div className="lg:hidden space-y-4">
        {(formData.MealValue || []).map((opt: string, idx: number) => (
          <div key={idx} className="border border-gray-200 rounded-sm p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <Grip size={18} className="text-gray-500" />
              <button
                type="button"
                onClick={() => {
                  const updatedValues = (formData.MealValue || []).filter(
                    (_: any, i: number) => i !== idx
                  );
                  const updatedPrices = (formData.MealPrice || []).filter(
                    (_: any, i: number) => i !== idx
                  );
                  setFormData({
                    ...formData,
                    MealValue: updatedValues,
                    MealPrice: updatedPrices,
                  });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...(formData.MealValue || [])];
                    updated[idx] = e.target.value;
                    setFormData({
                      ...formData,
                      MealValue: updated,
                    });
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  placeholder="Size name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.MealPrice?.[idx] || 0}
                  onChange={(e) => {
                    const updated = [...(formData.MealPrice || [])];
                    updated[idx] = Number(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      MealPrice: updated,
                    });
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-700">Override</label>
                <Toggle
                  checked={formData.OverRide?.[idx] === "Active"}
                  onChange={(checked) => {
                    const updated = [...(formData.OverRide || [])];
                    updated[idx] = checked ? "Active" : "Inactive";
                    setFormData({
                      ...formData,
                      OverRide: updated,
                    });
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-700">Status</label>
                <Toggle
                  checked={formData.status?.[idx] === "Active"}
                  onChange={(checked) => {
                    const updated = [...(formData.status || [])];
                    updated[idx] = checked ? "Active" : "Inactive";
                    setFormData({
                      ...formData,
                      status: updated,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealTab;
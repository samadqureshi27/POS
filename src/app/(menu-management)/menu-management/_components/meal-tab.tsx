"use client";

import React from "react";
import { Plus, X, Grip } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {MealTabProps} from "@/lib/types/menum";

const sizeOptionss = ["Cheese", "Pepperoni", "Olives", "Onions", "Bacon", "Pineapple"];

const MealTab: React.FC<MealTabProps> = ({ formData, setFormData, handleStatusChange }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Label className="text-sm font-medium">
        Menu Item Option
      </Label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <Select onValueChange={(value) => {
          if (!formData.MealValue?.includes(value)) {
            setFormData({
              ...formData,
              MealValue: [...(formData.MealValue || []), value],
              MealPrice: [...(formData.MealPrice || []), 0],
            });
          }
        }}>
          <SelectTrigger className="w-full sm:flex-1">
            <SelectValue placeholder="Add New Option" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {sizeOptionss.map((size, i) => (
              <SelectItem key={i} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col items-center gap-2">
          <Label className="text-sm font-medium">
            Deal?
          </Label>
          <Switch
            checked={formData.Deal === "Active"}
            onCheckedChange={(checked) => handleStatusChange("Deal", checked)}
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
                              <Input
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
                                placeholder="Size name"
                              />
                            </td>
                            <td className="p-3 text-center">
                              <Input
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
                                className="w-20 text-center mx-auto"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="p-3 text-center">
                              <Switch
                                checked={formData.OverRide?.[idx] === "Active"}
                                onCheckedChange={(checked) => {
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
                              <Switch
                                checked={formData.status?.[idx] === "Active"}
                                onCheckedChange={(checked) => {
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
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
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
                                className="text-black hover:text-gray-700 h-8 w-8"
                              >
                                <X size={20} />
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

      {/* Mobile Card View for Meal Tab */}
      <div className="lg:hidden space-y-4">
        {(formData.MealValue || []).map((opt: string, idx: number) => (
          <div key={idx} className="border border-gray-200 rounded-sm p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <Grip size={18} className="text-gray-500" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
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
                className="text-red-500 hover:text-red-700 h-8 w-8"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-gray-700">Name</Label>
                <Input
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
                  placeholder="Size name"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-700">Price</Label>
                <Input
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
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-gray-700">Override</Label>
                <Switch
                  checked={formData.OverRide?.[idx] === "Active"}
                  onCheckedChange={(checked) => {
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
                <Label className="text-xs font-medium text-gray-700">Status</Label>
                <Switch
                  checked={formData.status?.[idx] === "Active"}
                  onCheckedChange={(checked) => {
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
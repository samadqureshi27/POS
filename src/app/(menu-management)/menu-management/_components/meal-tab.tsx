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

const MealTab: React.FC<MealTabProps> = ({ formData, setFormData, handleStatusChange, menuItems }) => {
  return (
    <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
      {/* Header Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Meal Components
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Add menu items that can be part of this meal with custom pricing and options
        </p>

        {/* Add Menu Item and Deal Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700">
              Add Menu Item
            </Label>
            <Select onValueChange={(value) => {
              if (!formData.MealValue?.includes(value)) {
                setFormData({
                  ...formData,
                  MealValue: [...(formData.MealValue || []), value],
                  MealPrice: [...(formData.MealPrice || []), 0],
                  OverRide: [...(formData.OverRide || []), "Inactive"],
                  status: [...(formData.status || []), "Active"],
                });
              }
            }}>
              <SelectTrigger className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20">
                <SelectValue placeholder="Select menu item to add..." />
              </SelectTrigger>
              <SelectContent className="max-h-60 z-[100]">
                {menuItems && menuItems.length > 0 ? (
                  menuItems
                    .filter((item) => !formData.MealValue?.includes(item.Name))
                    .map((item) => (
                      <SelectItem key={item.ID} value={item.Name} className="cursor-pointer">
                        <div>
                          <div className="font-medium">{item.Name}</div>
                          <div className="text-xs text-gray-500">${item.Price}</div>
                        </div>
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem key="no-data" value="" disabled>
                    No menu items available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>


          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
            <Label className="text-sm font-medium text-gray-700">
              Deal Package
            </Label>
            <Switch
              checked={formData.Deal === "Active"}
              onCheckedChange={(checked) => handleStatusChange("Deal", checked)}
            />
          </div>
        </div>
      </div>

      {/* Meal Items Display */}
      {formData.MealValue && formData.MealValue.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">
            Meal Items ({formData.MealValue.length})
          </h4>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="border border-gray-200 rounded-lg bg-gray-50/50">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="w-12 p-3 text-center text-xs font-medium text-gray-500 uppercase"></th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                    <th className="w-24 p-3 text-center text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="w-20 p-3 text-center text-xs font-medium text-gray-500 uppercase">Override</th>
                    <th className="w-20 p-3 text-center text-xs font-medium text-gray-500 uppercase">Active</th>
                    <th className="w-12 p-3 text-center text-xs font-medium text-gray-500 uppercase"></th>
                  </tr>
                </thead>
              </table>
            </div>

            <div className="border-l border-r border-b border-gray-200 rounded-b-lg min-h-[120px] overflow-y-auto bg-white">
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

                  const newOverRide = Array.from(formData.OverRide || []);
                  const [movedOverRide] = newOverRide.splice(source.index, 1);
                  newOverRide.splice(destination.index, 0, movedOverRide);

                  const newStatus = Array.from(formData.status || []);
                  const [movedStatus] = newStatus.splice(source.index, 1);
                  newStatus.splice(destination.index, 0, movedStatus);

                  setFormData({
                    ...formData,
                    MealValue: newMealValue,
                    MealPrice: newMealPrice,
                    OverRide: newOverRide,
                    status: newStatus,
                  });
                }}
              >
                <Droppable droppableId="meal-items">
                  {(provided) => (
                    <table className="w-full border-collapse">
                      <tbody ref={provided.innerRef} {...provided.droppableProps}>
                        {(formData.MealValue || []).map((itemName: string, idx: number) => (
                          <Draggable key={idx} draggableId={`meal-${idx}`} index={idx}>
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
                                  <div className="font-medium text-gray-800">{itemName}</div>
                                  <div className="text-xs text-gray-500">Menu item component</div>
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
                                    className="w-20 text-center mx-auto transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
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
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updatedValues = (formData.MealValue || []).filter(
                                        (_: any, i: number) => i !== idx
                                      );
                                      const updatedPrices = (formData.MealPrice || []).filter(
                                        (_: any, i: number) => i !== idx
                                      );
                                      const updatedOverRide = (formData.OverRide || []).filter(
                                        (_: any, i: number) => i !== idx
                                      );
                                      const updatedStatus = (formData.status || []).filter(
                                        (_: any, i: number) => i !== idx
                                      );
                                      setFormData({
                                        ...formData,
                                        MealValue: updatedValues,
                                        MealPrice: updatedPrices,
                                        OverRide: updatedOverRide,
                                        status: updatedStatus,
                                      });
                                    }}
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
            {(formData.MealValue || []).map((itemName: string, idx: number) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Grip size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-800">{itemName}</div>
                      <div className="text-xs text-gray-500">Menu item component</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updatedValues = (formData.MealValue || []).filter(
                        (_: any, i: number) => i !== idx
                      );
                      const updatedPrices = (formData.MealPrice || []).filter(
                        (_: any, i: number) => i !== idx
                      );
                      const updatedOverRide = (formData.OverRide || []).filter(
                        (_: any, i: number) => i !== idx
                      );
                      const updatedStatus = (formData.status || []).filter(
                        (_: any, i: number) => i !== idx
                      );
                      setFormData({
                        ...formData,
                        MealValue: updatedValues,
                        MealPrice: updatedPrices,
                        OverRide: updatedOverRide,
                        status: updatedStatus,
                      });
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <X size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">Price</Label>
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
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
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
                      <Label className="text-xs font-medium text-gray-700">Active</Label>
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!formData.MealValue || formData.MealValue.length === 0) && (
        <div className="text-center py-12 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">No meal items added</h4>
          <p className="text-xs text-gray-500">
            Select menu items from the dropdown above to create a meal combination
          </p>
        </div>
      )}
    </div>
  );
};

export default MealTab;
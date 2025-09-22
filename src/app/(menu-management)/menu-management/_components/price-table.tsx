"use client";

import React from "react";
import { Plus, X, Grip } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {PriceTabProps} from "@/lib/types/menum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PriceTab: React.FC<PriceTabProps> = ({ formData, setFormData }) => {
  return (
    <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
      {/* Header Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Price Variations
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Create different pricing options for this menu item with custom names and prices
        </p>

        {/* Add Variation Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setFormData({
              ...formData,
              PName: [...(formData.PName || []), ""],
              PPrice: [...(formData.PPrice || []), ""],
            })
          }
          className="flex items-center gap-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 hover:bg-blue-50"
        >
          <Plus size={16} />
          Add Price Variation
        </Button>
      </div>

      {/* Variations Display */}
      {formData.PName && formData.PName.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">
            Price Variations ({formData.PName.length})
          </h4>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="border border-gray-200 rounded-lg bg-gray-50/50">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="w-12 p-3 text-center text-xs font-medium text-gray-500 uppercase"></th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Variation Name</th>
                    <th className="w-24 p-3 text-center text-xs font-medium text-gray-500 uppercase">Price</th>
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

                  const newPValue = Array.from(formData.PName || []);
                  const [movedValue] = newPValue.splice(source.index, 1);
                  newPValue.splice(destination.index, 0, movedValue);

                  const newPPrice = Array.from(formData.PPrice || []);
                  const [movedPrice] = newPPrice.splice(source.index, 1);
                  newPPrice.splice(destination.index, 0, movedPrice);

                  setFormData({
                    ...formData,
                    PName: newPValue,
                    PPrice: newPPrice,
                  });
                }}
              >
                <Droppable droppableId="p-values">
                  {(provided) => (
                    <table className="w-full border-collapse">
                      <tbody ref={provided.innerRef} {...provided.droppableProps}>
                        {(formData.PName || []).map((opt: string, idx: number) => (
                          <Draggable key={idx} draggableId={`p-${idx}`} index={idx}>
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
                                  <Input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const updated = [...(formData.PName || [])];
                                      updated[idx] = e.target.value;
                                      setFormData({
                                        ...formData,
                                        PName: updated,
                                      });
                                    }}
                                    placeholder="Variation name (e.g., Small, Medium, Large)"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                  />
                                </td>
                                <td className="p-3 text-center">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={(formData.PPrice || [])[idx] || ""}
                                    onChange={(e) => {
                                      const updated = [...(formData.PPrice || [])];
                                      updated[idx] = e.target.value === "" ? "" : Number(e.target.value);
                                      setFormData({
                                        ...formData,
                                        PPrice: updated,
                                      });
                                    }}
                                    placeholder="0.00"
                                    className="w-20 text-center mx-auto transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                  />
                                </td>
                                <td className="p-3 text-center w-12">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updatedValues = (formData.PName || []).filter(
                                        (_: any, i: number) => i !== idx
                                      );
                                      const updatedPrices = (formData.PPrice || []).filter(
                                        (_: any, i: number) => i !== idx
                                      );
                                      setFormData({
                                        ...formData,
                                        PName: updatedValues,
                                        PPrice: updatedPrices,
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
            {(formData.PName || []).map((opt: string, idx: number) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Grip size={16} className="text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">Variation #{idx + 1}</div>
                      <div className="text-xs text-gray-500">Price option</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updatedValues = (formData.PName || []).filter(
                        (_: any, i: number) => i !== idx
                      );
                      const updatedPrices = (formData.PPrice || []).filter(
                        (_: any, i: number) => i !== idx
                      );
                      setFormData({
                        ...formData,
                        PName: updatedValues,
                        PPrice: updatedPrices,
                      });
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <X size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">Name</Label>
                    <Input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...(formData.PName || [])];
                        updated[idx] = e.target.value;
                        setFormData({
                          ...formData,
                          PName: updated,
                        });
                      }}
                      placeholder="Variation name"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={(formData.PPrice || [])[idx] || ""}
                      onChange={(e) => {
                        const updated = [...(formData.PPrice || [])];
                        updated[idx] = e.target.value === "" ? "" : Number(e.target.value);
                        setFormData({
                          ...formData,
                          PPrice: updated,
                        });
                      }}
                      placeholder="0.00"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!formData.PName || formData.PName.length === 0) && (
        <div className="text-center py-12 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">No price variations added</h4>
          <p className="text-xs text-gray-500">
            Add price variations to offer different sizes or options for this menu item
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceTab;
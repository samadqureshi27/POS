"use client";

import React from "react";
import { Plus, X, Grip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import DragTable from "@/components/ui/drag-table";

import {MealTabProps} from "@/lib/types/menum";

const MealTab: React.FC<MealTabProps> = ({ formData, setFormData, handleStatusChange, menuItems }) => {

  // Helper function for reordering meal items
  const handleMealReorder = (result: any) => {
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
  };

  // Helper function for removing meal items
  const handleRemoveMealItem = (idx: number) => {
    const updatedValues = (formData.MealValue || []).filter((_: any, i: number) => i !== idx);
    const updatedPrices = (formData.MealPrice || []).filter((_: any, i: number) => i !== idx);
    const updatedOverRide = (formData.OverRide || []).filter((_: any, i: number) => i !== idx);
    const updatedStatus = (formData.status || []).filter((_: any, i: number) => i !== idx);

    setFormData({
      ...formData,
      MealValue: updatedValues,
      MealPrice: updatedPrices,
      OverRide: updatedOverRide,
      status: updatedStatus,
    });
  };

  // Helper function for updating field values
  const handleUpdateField = (index: number, field: string, value: any) => {
    if (field === 'price') {
      const updated = [...(formData.MealPrice || [])];
      updated[index] = Number(value) || 0;
      setFormData({ ...formData, MealPrice: updated });
    } else if (field === 'override') {
      const updated = [...(formData.OverRide || [])];
      updated[index] = value ? "Active" : "Inactive";
      setFormData({ ...formData, OverRide: updated });
    } else if (field === 'status') {
      const updated = [...(formData.status || [])];
      updated[index] = value ? "Active" : "Inactive";
      setFormData({ ...formData, status: updated });
    }
  };

  // Prepare data for DragTable
  const tableData = (formData.MealValue || []).map((itemName: string, idx: number) => ({
    name: itemName,
    price: formData.MealPrice?.[idx] || 0,
    override: formData.OverRide?.[idx] === "Active",
    status: formData.status?.[idx] === "Active",
    index: idx
  }));

  const tableColumns = [
    {
      key: 'name',
      label: 'Item Name',
      width: 'minmax(200px, 1fr)',
      render: (value: string) => (
        <div>
          <div className="font-medium text-gray-800">{value}</div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      width: '100px',
      render: (value: number, item: any, index: number) => (
        <Input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => handleUpdateField(index, 'price', e.target.value)}
          className="w-20 text-center mx-auto transition-all duration-200 focus:ring-2 focus:ring-gray-500/20"
          placeholder="0.00"
        />
      )
    },
    {
      key: 'override',
      label: 'Override',
      width: '80px',
      render: (value: boolean, item: any, index: number) => (
        <div className="flex justify-center">
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleUpdateField(index, 'override', checked)}
          />
        </div>
      )
    },
    {
      key: 'status',
      label: 'Active',
      width: '80px',
      render: (value: boolean, item: any, index: number) => (
        <div className="flex justify-center">
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleUpdateField(index, 'status', checked)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6 pl-1">
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
              <SelectTrigger className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-gray-500/20">
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
                  <div className="px-2 py-4 text-center text-sm text-gray-500">
                    No menu items available
                  </div>
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
            <DragTable
              data={tableData}
              columns={tableColumns}
              onReorder={handleMealReorder}
              onDelete={handleRemoveMealItem}
              droppableId="meal-items"
              emptyMessage="No meal items added"
            />
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
                                </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMealItem(idx)}
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
                      onChange={(e) => handleUpdateField(idx, 'price', e.target.value)}
                      placeholder="0.00"
                      className="transition-all duration-200 focus:ring-2 focus:ring-gray-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">Override</Label>
                      <Switch
                        checked={formData.OverRide?.[idx] === "Active"}
                        onCheckedChange={(checked) => handleUpdateField(idx, 'override', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">Active</Label>
                      <Switch
                        checked={formData.status?.[idx] === "Active"}
                        onCheckedChange={(checked) => handleUpdateField(idx, 'status', checked)}
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
import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit2, Save, XCircle } from "lucide-react";

interface UnitCategory {
  type: "weight" | "volume" | "quantity";
  units: { value: string; label: string }[];
}

interface UnitManagementCardProps {
  // This would connect to settings when fully integrated
  onUnitChange?: (categories: UnitCategory[]) => void;
}

const UnitManagementCard: React.FC<UnitManagementCardProps> = ({ onUnitChange }) => {
  // Default unit categories - this would come from settings in full implementation
  const [unitCategories, setUnitCategories] = useState<UnitCategory[]>([
    {
      type: "weight",
      units: [
        { value: "gs", label: "Grams (gs)" },
        { value: "kgs", label: "Kilograms (kgs)" },
        { value: "lbs", label: "Pounds (lbs)" },
        { value: "oz", label: "Ounces (oz)" }
      ]
    },
    {
      type: "volume",
      units: [
        { value: "ml", label: "Milliliters (ml)" },
        { value: "ltrs", label: "Liters (ltrs)" },
        { value: "cups", label: "Cups" },
        { value: "fl oz", label: "Fluid Ounces (fl oz)" }
      ]
    },
    {
      type: "quantity",
      units: [
        { value: "pcs", label: "Pieces (pcs)" },
        { value: "slices", label: "Slices" },
        { value: "dozen", label: "Dozen" },
        { value: "count", label: "Count" }
      ]
    }
  ]);

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newUnit, setNewUnit] = useState({ value: "", label: "", category: "" });
  const [editingUnit, setEditingUnit] = useState<{categoryType: string, unitIndex: number, value: string, label: string} | null>(null);

  const handleAddUnit = () => {
    if (newUnit.value && newUnit.label && newUnit.category) {
      setUnitCategories(prev => prev.map(category => {
        if (category.type === newUnit.category) {
          return {
            ...category,
            units: [...category.units, { value: newUnit.value, label: newUnit.label }]
          };
        }
        return category;
      }));
      setNewUnit({ value: "", label: "", category: "" });
    }
  };

  const handleRemoveUnit = (categoryType: string, unitIndex: number) => {
    setUnitCategories(prev => prev.map(category => {
      if (category.type === categoryType) {
        return {
          ...category,
          units: category.units.filter((_, index) => index !== unitIndex)
        };
      }
      return category;
    }));
  };

  const handleEditUnit = (categoryType: string, unitIndex: number) => {
    const category = unitCategories.find(c => c.type === categoryType);
    const unit = category?.units[unitIndex];
    if (unit) {
      setEditingUnit({
        categoryType,
        unitIndex,
        value: unit.value,
        label: unit.label
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingUnit) {
      setUnitCategories(prev => prev.map(category => {
        if (category.type === editingUnit.categoryType) {
          return {
            ...category,
            units: category.units.map((unit, index) =>
              index === editingUnit.unitIndex
                ? { value: editingUnit.value, label: editingUnit.label }
                : unit
            )
          };
        }
        return category;
      }));
      setEditingUnit(null);
    }
  };

  const getCategoryTitle = (type: string) => {
    switch (type) {
      case "weight": return "Weight Units";
      case "volume": return "Volume Units";
      case "quantity": return "Quantity Units";
      default: return "Units";
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "weight": return "bg-blue-50 text-blue-700 border-blue-200";
      case "volume": return "bg-green-50 text-green-700 border-green-200";
      case "quantity": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="shadow-sm max-h-[450px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={24} />
          Unit Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(450px - 80px)' }}>
        {/* Add New Unit Section */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Unit</h3>
            <p className="text-sm text-gray-500">Create a custom unit for your ingredients</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Category</Label>
                <Select value={newUnit.category} onValueChange={(value) => setNewUnit(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">⚖️ Weight</SelectItem>
                    <SelectItem value="volume">🥤 Volume</SelectItem>
                    <SelectItem value="quantity">📦 Quantity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Unit Code</Label>
                  <Input
                    value={newUnit.value}
                    onChange={(e) => setNewUnit(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="e.g., kg, ml, pcs"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Display Name</Label>
                  <Input
                    value={newUnit.label}
                    onChange={(e) => setNewUnit(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Kilograms (kg)"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                onClick={handleAddUnit}
                size="lg"
                disabled={!newUnit.value || !newUnit.label || !newUnit.category}
                className="px-8 py-3 bg-primary hover:bg-primary/90"
              >
                <Plus size={18} className="mr-2" />
                Add New Unit
              </Button>
            </div>
          </div>
        </div>

        {/* Unit Categories */}
        {unitCategories.map((category) => (
          <div key={category.type} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">{getCategoryTitle(category.type)}</h3>
              <Badge variant="outline" className={getCategoryColor(category.type)}>
                {category.units.length} units
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {category.units.map((unit, index) => (
                <div key={`${category.type}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                  {editingUnit?.categoryType === category.type && editingUnit?.unitIndex === index ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingUnit.value}
                        onChange={(e) => setEditingUnit(prev => prev ? { ...prev, value: e.target.value } : null)}
                        className="h-6 text-xs flex-1"
                      />
                      <Input
                        value={editingUnit.label}
                        onChange={(e) => setEditingUnit(prev => prev ? { ...prev, label: e.target.value } : null)}
                        className="h-6 text-xs flex-1"
                      />
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={handleSaveEdit} className="h-6 w-6 p-0">
                          <Save size={12} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingUnit(null)} className="h-6 w-6 p-0">
                          <XCircle size={12} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{unit.value}</span>
                        <span className="text-xs text-gray-500 ml-2">{unit.label}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditUnit(category.type, index)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveUnit(category.type, index)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <strong>Note:</strong> These units will be available when adding ingredients to recipes.
          Changes here will affect how unit dropdowns appear throughout the system.
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitManagementCard;
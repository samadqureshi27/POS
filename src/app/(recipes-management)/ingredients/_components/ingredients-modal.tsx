import React from 'react';
import { X, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryItem {
  ID: string;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Unit: string;
  Threshold: number;
  Priority: number;
}

interface IngredientsModalProps {
  isOpen: boolean;
  editItem: InventoryItem | null;
  formData: InventoryItem;
  setFormData: (data: InventoryItem) => void;
  onClose: () => void;
  onSave: () => void;
  actionLoading: boolean;
}

const IngredientsModal: React.FC<IngredientsModalProps> = ({
  isOpen,
  editItem,
  formData,
  setFormData,
  onClose,
  onSave,
  actionLoading
}) => {
  const handleStatusChange = (isActive: boolean) => {
    setFormData({
      ...formData,
      Status: isActive ? "Active" : "Inactive",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg lg:max-w-2xl h-[80vh] max-h-[800px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {editItem ? "Edit Ingredients" : "Add New Ingredients"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
          {/* Header Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Ingredient Details
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Configure the basic information and properties for this ingredient
            </p>
          </div>

          {/* Ingredient Information Section */}
          <div className="space-y-6">
            {/* Name and Status Row */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Ingredient Name <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Name that will appear in ingredient lists and recipes
                </p>
                <Input
                  id="name"
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  placeholder="Enter ingredient name (e.g., Tomatoes, Flour, Salt)"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 border border-gray-200">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Active Status
                  </Label>
                  <p className="text-xs text-gray-500">Enable this ingredient</p>
                </div>
                <Switch
                  checked={formData.Status === "Active"}
                  onCheckedChange={handleStatusChange}
                />
              </div>
            </div>

            {/* Unit and Threshold Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
                  Unit of Measurement <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Select the unit type from the dropdown menu
                </p>
                <Select
                  value={formData.Unit}
                  onValueChange={(value) =>
                    setFormData({ ...formData, Unit: value })
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-gray-500/20">
                    <SelectValue placeholder="Select unit of measurement..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weight in Grams">Weight in Grams</SelectItem>
                    <SelectItem value="Quantity Count">Quantity Count</SelectItem>
                    <SelectItem value="Volume in Liters">Volume in Liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-32">
                <Label htmlFor="threshold" className="text-sm font-medium text-gray-700">
                  Threshold
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Minimum stock level
                </p>
                <Input
                  id="threshold"
                  type="number"
                  value={formData.Threshold || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      setFormData({
                        ...formData,
                        Threshold: value === '' ? 0 : Number(value)
                      });
                    }
                  }}
                  placeholder="0"
                  min={0}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Priority */}
            <div className="flex gap-4">
              <div className="w-32">
                <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                  Priority
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Display order
                </p>
                <Input
                  id="priority"
                  type="number"
                  value={formData.Priority || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      setFormData({
                        ...formData,
                        Priority: value === '' ? 0 : Number(value)
                      });
                    }
                  }}
                  placeholder="1"
                  min={1}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Brief description of the ingredient and its uses
              </p>
              <Textarea
                id="description"
                value={formData.Description}
                onChange={(e) =>
                  setFormData({ ...formData, Description: e.target.value })
                }
                placeholder="Brief description of this ingredient..."
                required
                className="min-h-[80px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                rows={3}
                style={{
                  height: 'auto',
                  minHeight: '80px',
                  maxHeight: '120px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
            </div>

            {/* Information Card */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Usage</h4>
                  <p className="text-xs text-blue-700">
                    Ingredients can be added to recipes to track recipe costs and nutritional information. Make sure to set the correct unit of measurement for accurate calculations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-100 bg-white flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={!formData.Name.trim() || !formData.Description.trim() || !formData.Unit || actionLoading}
          >
            {actionLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                {editItem ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {editItem ? "Update Ingredient" : "Save & Close"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientsModal;
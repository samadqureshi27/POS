import React from 'react';
import { X, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface InventoryItem {
  ID: string;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Unit: string;
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
      <DialogContent className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {editItem ? "Edit Ingredients" : "Add New Ingredients"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
          {/* Name */}
          <div className="md:col-span-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.Name}
              onChange={(e) =>
                setFormData({ ...formData, Name: e.target.value })
              }
              placeholder="Enter item name"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              type="text"
              value={formData.Description}
              onChange={(e) =>
                setFormData({ ...formData, Description: e.target.value })
              }
              placeholder="Enter description"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <Label htmlFor="unit" className="text-sm font-medium">
              Unit
            </Label>
            <Input
              id="unit"
              type="text"
              value={formData.Unit}
              onChange={(e) =>
                setFormData({ ...formData, Unit: e.target.value })
              }
              placeholder="Unit (e.g. Kg, Bottles)"
            />
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority
            </Label>
            <Input
              id="priority"
              type="text"
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
              required
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Status
            </Label>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.Status === "Active"}
                onCheckedChange={handleStatusChange}
              />
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex flex-col p-2 md:flex-row gap-3 pt-6 justify-end md:pr-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
            className="order-2 md:order-1"
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={!formData.Name.trim() || actionLoading}
            className="order-1 md:order-2"
          >
            {actionLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                {editItem ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {editItem ? "Update Item" : "Add Item"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientsModal;
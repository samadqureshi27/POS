import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RecipeOption {
  ID: number;
  Name: string;
  price: number;
}

interface RecipeModalProps {
  isOpen: boolean;
  editingItem: RecipeOption | null;
  onClose: () => void;
  onSubmit: (data: Omit<RecipeOption, "ID">) => void;
  actionLoading: boolean;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  editingItem,
  onClose,
  onSubmit,
  actionLoading,
}) => {
  const [formData, setFormData] = useState<Omit<RecipeOption, "ID">>({
    Name: "",
    price: 0,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        price: editingItem.price,
      });
    } else {
      setFormData({
        Name: "",
        price: 0,
      });
    }
  }, [editingItem, isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (!formData.Name.trim()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {editingItem ? "Edit Option" : "Add Option"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6 pl-1">
          {/* Header Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Recipe Option Details
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Configure the name and pricing for this recipe option
            </p>
          </div>

          {/* Option Configuration */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Option Name <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Name that will appear in recipe option lists
              </p>
              <Input
                id="name"
                type="text"
                value={formData.Name}
                onChange={(e) =>
                  setFormData({ ...formData, Name: e.target.value })
                }
                placeholder="Enter option name (e.g., Extra Cheese, Spicy Level)"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Additional cost for selecting this option
              </p>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setFormData({
                    ...formData,
                    price: isNaN(value) ? 0 : value
                  });
                }}
                placeholder="0.00"
                required
                className="w-full sm:w-32 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Information Card */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Usage</h4>
                  <p className="text-xs text-blue-700">
                    Recipe options can be used to provide customization choices for recipes, allowing customers to add extras or modify ingredients with associated pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-6 sm:justify-end border-t border-gray-200 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
            className="w-full sm:w-auto"
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.Name.trim() || actionLoading}
            className="w-full sm:w-auto"
          >
            {actionLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                {editingItem ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {editingItem ? "Update" : "Save & Close"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
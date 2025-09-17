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
        <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-1 py-2">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.Name}
              onChange={(e) =>
                setFormData({ ...formData, Name: e.target.value })
              }
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" className="text-sm font-medium">
              Price <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setFormData({
                    ...formData,
                    price: value === '' ? 0 : Number(value)
                  });
                }
              }}
              placeholder="Enter price"
              required
            />
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
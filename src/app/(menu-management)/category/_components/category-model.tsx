"use client";

import React, { useState, useEffect } from "react";
import { X, Save, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryItem, CategoryFormData, CategoryModalProps } from '@/lib/types/category';

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  editingItem,
  actionLoading,
  categories,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    Name: "",
    Status: "Active",
    Description: "",
    Parent: "",
    Priority: 1,
    Image: "",
  });

  // Modal form effect
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Status: editingItem.Status,
        Description: editingItem.Description,
        Parent: editingItem.Parent,
        Priority: editingItem.Priority,
        Image: editingItem.Image || "",
      });
    } else {
      setFormData({
        Name: "",
        Status: "Active",
        Description: "",
        Parent: "",
        Priority: 1,
        Image: "",
      });
    }
  }, [editingItem, isOpen]);

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

  const handleStatusChange = (isActive: boolean) => {
    setFormData({
      ...formData,
      Status: isActive ? "Active" : "Inactive",
    });
  };

  const handleSubmit = () => {
    if (!formData.Name.trim()) {
      return;
    }

    if (editingItem) {
      onUpdate(formData);
    } else {
      onCreate(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col"
        showCloseButton={false}
        onWheel={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {editingItem ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
          {/* Name and Status Row */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="name" className="text-sm font-medium">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.Name}
                onChange={(e) =>
                  setFormData({ ...formData, Name: e.target.value })
                }
                placeholder="e.g., Beverages, Appetizers"
                required
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">
                Active
              </Label>
              <Switch
                checked={formData.Status === "Active"}
                onCheckedChange={handleStatusChange}
              />
            </div>
          </div>

          {/* Parent and Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parent" className="text-sm font-medium">
                Parent Category
              </Label>
              <Select
                value={formData.Parent || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, Parent: value === "none" ? "" : value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="No parent category" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="none">No parent category</SelectItem>
                  {categories
                    .filter(cat => cat.Status === "Active" && (!editingItem || cat.ID !== editingItem.ID))
                    .map((category) => (
                      <SelectItem key={category.ID} value={category.Name}>
                        {category.Name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority" className="text-sm font-medium">
                Display Priority
              </Label>
              <Input
                id="priority"
                type="number"
                min="1"
                value={formData.Priority || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    Priority: value === '' ? 1 : Number(value)
                  });
                }}
                placeholder="1"
                className="mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.Description}
              onChange={(e) =>
                setFormData({ ...formData, Description: e.target.value })
              }
              className="mt-1 min-h-[80px] resize-none"
              placeholder="Brief description of this category..."
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

          {/* Icon Selection */}
          <div>
            <Label className="text-sm font-medium">
              Category Icon
            </Label>
            <div className="mt-2 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Icon selector will be implemented here
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Choose from food & beverage icons
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex gap-3 pt-6 justify-end border-t border-gray-200 mt-auto">
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
            onClick={handleSubmit}
            disabled={
              !formData.Name.trim() ||
              actionLoading
            }
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

export default CategoryModal;
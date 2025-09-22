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
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6 pl-1">
          {/* Header Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Category Information
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Configure the basic details and organization settings for this category
            </p>
          </div>

          {/* Category Name Section */}
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Name that will appear in menus and POS system
                </p>
                <Input
                  id="name"
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  placeholder="e.g., Beverages, Appetizers, Main Courses"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-gray-500/20"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 border border-gray-200">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Active Status
                  </Label>
                  <p className="text-xs text-gray-500">Enable this category</p>
                </div>
                <Switch
                  checked={formData.Status === "Active"}
                  onCheckedChange={handleStatusChange}
                />
              </div>
            </div>
          </div>

          {/* Organization Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">
              Organization Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent" className="text-sm font-medium text-gray-700">
                  Parent Category
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Optional parent for hierarchical organization
                </p>
                <Select
                  value={formData.Parent || "none"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, Parent: value === "none" ? "" : value })
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-gray-500/20">
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
                <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                  Display Priority
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Order in menus (lower numbers appear first)
                </p>
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
                  className="transition-all duration-200 focus:ring-2 focus:ring-gray-500/20"
                />
              </div>
            </div>
          </div>

          {/* Description & Media Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">
              Description & Media
            </h4>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Brief description for this category (optional)
              </p>
              <Textarea
                id="description"
                value={formData.Description}
                onChange={(e) =>
                  setFormData({ ...formData, Description: e.target.value })
                }
                className="min-h-[80px] resize-none transition-all duration-200 focus:ring-2 focus:ring-gray-500/20"
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
              <Label className="text-sm font-medium text-gray-700">
                Category Icon
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Choose an icon to represent this category visually
              </p>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 mb-3">
                    <ImageIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Icon Selection</h5>
                  <p className="text-xs text-gray-500 mb-2">
                    Icon selector will be implemented here
                  </p>
                  <p className="text-xs text-gray-400">
                    Choose from food & beverage icons
                  </p>
                </div>
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
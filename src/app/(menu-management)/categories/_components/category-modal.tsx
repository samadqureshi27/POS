"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuCategoryOption, MenuCategoryPayload } from "@/lib/types/menu";

interface CategoryModalProps {
  isOpen: boolean;
  editingItem: MenuCategoryOption | null;
  onClose: () => void;
  onSubmit: (data: MenuCategoryPayload) => Promise<any>;
  actionLoading: boolean;
  parentCategories: MenuCategoryOption[];
}

export default function CategoryModal({
  isOpen,
  onClose,
  editingItem,
  onSubmit,
  actionLoading,
  parentCategories,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<Partial<MenuCategoryPayload>>({
    name: "",
    slug: "",
    code: "",
    description: "",
    parentId: null,
    isActive: true,
    displayOrder: 0,
    metadata: {},
  });

  useEffect(() => {
    if (isOpen) {
      if (editingItem && editingItem._raw) {
        // Use raw data for editing
        const raw = editingItem._raw;
        setFormData({
          name: raw.name,
          slug: raw.slug,
          code: raw.code,
          description: raw.description || "",
          parentId: raw.parentId || null,
          isActive: raw.isActive !== false,
          displayOrder: raw.displayOrder || 0,
          metadata: raw.metadata || {},
        });
      } else if (editingItem) {
        // Fallback if no raw data
        setFormData({
          name: editingItem.Name,
          slug: editingItem.Name.toLowerCase().replace(/\s+/g, '-'),
          code: editingItem.Code,
          description: editingItem.Description || "",
          parentId: editingItem.ParentCategory || null,
          isActive: editingItem.Status === "Active",
          displayOrder: editingItem.DisplayOrder || 0,
          metadata: {},
        });
      } else {
        // New category
        setFormData({
          name: "",
          slug: "",
          code: "",
          description: "",
          parentId: null,
          isActive: true,
          displayOrder: 0,
          metadata: {},
        });
      }
    }
  }, [isOpen, editingItem]);

  const handleFieldChange = (field: keyof MenuCategoryPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from name
    if (field === "name" && typeof value === "string") {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug || !formData.code) {
      alert("Please fill in all required fields (Name, Slug, Code)");
      return;
    }

    try {
      const payload: MenuCategoryPayload = {
        name: formData.name!,
        slug: formData.slug!,
        code: formData.code!,
        description: formData.description,
        parentId: formData.parentId || null,
        isActive: formData.isActive !== false,
        displayOrder: formData.displayOrder || 0,
        metadata: formData.metadata || {},
      };

      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-semibold">
          {editingItem ? "Edit Category" : "Add New Category"}
        </DialogTitle>

        <div className="space-y-6 mt-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="e.g., Pizzas"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug || ""}
                onChange={(e) => handleFieldChange("slug", e.target.value)}
                placeholder="e.g., pizzas"
              />
              <p className="text-xs text-gray-500">URL-friendly identifier</p>
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code || ""}
                onChange={(e) => handleFieldChange("code", e.target.value)}
                placeholder="e.g., CAT-PIZ"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Describe this category..."
                rows={3}
              />
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Organization</h3>

            {/* Parent Category */}
            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(value) => handleFieldChange("parentId", value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {parentCategories.map((cat) => (
                    <SelectItem key={cat.ID} value={cat.ID}>
                      {cat.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder || 0}
                onChange={(e) => handleFieldChange("displayOrder", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">Lower numbers appear first</p>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Status</h3>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="isActive" className="text-base font-medium">
                  Active Category
                </Label>
                <p className="text-sm text-gray-500">
                  Category will be visible on the menu
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive !== false}
                onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={actionLoading}
            className="bg-gray-900 hover:bg-black"
          >
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingItem ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

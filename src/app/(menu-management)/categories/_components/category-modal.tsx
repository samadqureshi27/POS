"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("basic");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (editingItem && editingItem._raw) {
        // Use raw data for editing
        const raw = editingItem._raw;
        setFormData({
          name: raw.name,
          slug: raw.slug || "",
          code: raw.code || "",
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
          slug: (editingItem as any).Slug || "",
          code: editingItem.Code || "",
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
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please fill in all required fields (Name)");
      return;
    }

    try {
      // Slug and code are not sent to backend - they're auto-generated
      const payload: Partial<MenuCategoryPayload> = {
        name: formData.name!,
        description: formData.description,
        parentId: formData.parentId || null,
        isActive: formData.isActive !== false,
        displayOrder: formData.displayOrder || 0,
        metadata: formData.metadata || {},
      };

      await onSubmit(payload as MenuCategoryPayload);
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="3xl" fullHeight onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-8 pb-6 pt-2 flex-shrink-0 border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
            </TabsList>
          </div>

          <DialogBody className="space-y-6">
              <TabsContent value="basic" className="mt-0 space-y-6">
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

            {/* Slug (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (Auto-generated)</Label>
              <Input
                id="slug"
                value={formData.slug || "Will be generated from name"}
                disabled
                className="bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">This field is automatically generated by the system</p>
            </div>

            {/* Code (Future functionality) */}
            <div className="space-y-2">
              <Label htmlFor="code">Code (Future functionality)</Label>
              <Input
                id="code"
                value={formData.code || "Coming soon"}
                disabled
                className="bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">This feature will be available in a future update</p>
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
              </TabsContent>

              <TabsContent value="organization" className="mt-0 space-y-6">
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
                value={formData.displayOrder === 0 ? "" : formData.displayOrder || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleFieldChange("displayOrder", val === '' ? 0 : parseInt(val) || 0);
                }}
                onFocus={(e) => e.target.select()}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">Lower numbers appear first</p>
            </div>

                {/* Active Status */}
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
              </TabsContent>
          </DialogBody>
        </Tabs>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={actionLoading}
            className="bg-black hover:bg-gray-800 text-white px-8 h-11"
          >
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingItem ? "Update" : "Submit"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-8 h-11 border-gray-300"
            disabled={actionLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

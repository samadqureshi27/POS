"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Save, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryItem, CategoryFormData, CategoryModalProps } from '@/lib/types/category';

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  editingItem,
  actionLoading,
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
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      setPreview(editingItem.Image || null);
    } else {
      setFormData({
        Name: "",
        Status: "Active",
        Description: "",
        Parent: "",
        Priority: 0,
        Image: "",
      });
      setPreview(null);
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, Image: objectUrl }));
      setPreview(objectUrl);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, Image: objectUrl }));
      setPreview(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, Image: "" }));
    setPreview(null);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (
      !formData.Name.trim() ||
      !formData.Description.trim() ||
      formData.Priority < 1
    ) {
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
      <DialogContent className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {editingItem ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1 py-2">
          {/* Name */}
          <div className="md:col-span-2 mt-2">
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

          {/* Description */}
          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.Description}
              onChange={(e) =>
                setFormData({ ...formData, Description: e.target.value })
              }
              className="h-32 resize-none"
              placeholder="Enter description"
              required
            />
          </div>

          {/* Image Upload with Drag & Drop */}
          <div className="md:col-span-2">
            <Label className="text-sm font-medium">
              Image
            </Label>
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-sm p-4 h-32 bg-white flex flex-col justify-center items-center hover:bg-gray-50 transition cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={handleClickUpload}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-24 object-contain mb-2"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-gray-800"
                    title="Remove image"
                  >
                    ×
                  </button>
                </>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm text-center">
                    Click or drag & drop your image here
                  </p>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                title="Upload Image"
              />
            </div>
          </div>

          {/* Parent */}
          <div>
            <Label htmlFor="parent" className="text-sm font-medium">
              Parent
            </Label>
            <Input
              id="parent"
              type="text"
              value={formData.Parent}
              onChange={(e) =>
                setFormData({ ...formData, Parent: e.target.value })
              }
              placeholder="Parent category"
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
                // Only allow numbers and empty string
                if (value === '' || /^\d+$/.test(value)) {
                  setFormData({
                    ...formData,
                    Priority: value === '' ? 0 : Number(value)
                  });
                }
                // If invalid input, just ignore it (don't update state)
              }}
              placeholder="1"
              required
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Status
            </Label>
            <Switch
              checked={formData.Status === "Active"}
              onCheckedChange={handleStatusChange}
            />
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
              !formData.Description.trim() ||
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
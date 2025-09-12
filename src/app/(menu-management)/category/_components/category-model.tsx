"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Save, ImageIcon } from "lucide-react";
import ButtonPage from "@/components/layout/ui/button";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
      <div className="bg-white rounded-sm p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {editingItem ? "Edit Category" : "Add New Category"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1 py-2">
          {/* Name */}
          <div className="md:col-span-2 mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.Name}
              onChange={(e) =>
                setFormData({ ...formData, Name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.Description}
              onChange={(e) =>
                setFormData({ ...formData, Description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] h-32 resize-none"
              placeholder="Enter description"
              required
            />
          </div>

          {/* Image Upload with Drag & Drop */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent
            </label>
            <input
              type="text"
              value={formData.Parent}
              onChange={(e) =>
                setFormData({ ...formData, Parent: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              placeholder="Parent category"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <input
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
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              placeholder="1"
              min={1}
              required
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <ButtonPage
              checked={formData.Status === "Active"}
              onChange={handleStatusChange}
            />
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex gap-3 pt-6 justify-end border-t border-gray-200 mt-auto">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !formData.Name.trim() ||
              !formData.Description.trim() ||
              actionLoading
            }
            className={`px-6 py-2 rounded-sm transition-colors flex items-center gap-2 ${!formData.Name.trim() ||
                !formData.Description.trim() ||
                actionLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#2C2C2C] text-white hover:bg-gray-700"
              }`}
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
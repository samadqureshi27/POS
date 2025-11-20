"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { EffectiveMenuItem, BranchMenuConfig } from "@/lib/services/branch-menu-service";

interface BranchMenuModalProps {
  isOpen: boolean;
  item: EffectiveMenuItem | null;
  branchObjectId: string | null;
  onClose: () => void;
  onSave: (data: Partial<BranchMenuConfig>) => Promise<void>;
  onUpdate: (id: string, data: Partial<BranchMenuConfig>) => Promise<void>;
  actionLoading: boolean;
}

const BranchMenuModal: React.FC<BranchMenuModalProps> = ({
  isOpen,
  item,
  branchObjectId,
  onClose,
  onSave,
  onUpdate,
  actionLoading,
}) => {
  // Determine if we're editing an existing config or creating a new one
  const isEditing = Boolean(item?.branchConfig);

  // Form state
  const [formData, setFormData] = useState<Partial<BranchMenuConfig>>({
    branchId: branchObjectId || "",
    menuItemId: "",
    sellingPrice: 0,
    isAvailable: true,
    isVisibleInPOS: true,
    isVisibleInOnline: true,
    priceIncludesTax: false,
    displayOrder: 1,
    isFeatured: false,
    isRecommended: false,
    labels: [],
  });

  // Update form data when item or branchObjectId changes
  useEffect(() => {
    if (item) {
      if (item.branchConfig) {
        // Editing existing config
        setFormData({
          branchId: item.branchConfig.branchId,
          menuItemId: item.branchConfig.menuItemId,
          sellingPrice: item.branchConfig.sellingPrice || item.basePrice || 0,
          isAvailable: item.branchConfig.isAvailable ?? true,
          isVisibleInPOS: item.branchConfig.isVisibleInPOS ?? true,
          isVisibleInOnline: item.branchConfig.isVisibleInOnline ?? true,
          priceIncludesTax: item.branchConfig.priceIncludesTax ?? false,
          displayOrder: item.branchConfig.displayOrder ?? 1,
          isFeatured: item.branchConfig.isFeatured ?? false,
          isRecommended: item.branchConfig.isRecommended ?? false,
          labels: item.branchConfig.labels || [],
        });
      } else {
        // Adding new item to branch
        const itemId = item._id || item.id || "";
        setFormData({
          branchId: branchObjectId || "",
          menuItemId: itemId,
          sellingPrice: item.basePrice || 0,
          isAvailable: true,
          isVisibleInPOS: true,
          isVisibleInOnline: true,
          priceIncludesTax: false,
          displayOrder: 1,
          isFeatured: false,
          isRecommended: false,
          labels: [],
        });
      }
    }
  }, [item, branchObjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.branchId) {
      return;
    }

    if (!formData.menuItemId) {
      return;
    }

    if (isEditing && item?.branchConfig) {
      const configId = item.branchConfig._id || item.branchConfig.id;
      if (configId) {
        await onUpdate(configId, formData);
      }
    } else {
      await onSave(formData);
    }
  };

  const handleToggle = (field: keyof BranchMenuConfig, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (field: keyof BranchMenuConfig, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen || !item) return null;

  // Show loading state if branch ObjectId is not available yet
  if (!branchObjectId) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">Loading branch information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Menu Configuration" : "Add to Branch Menu"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {item.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={actionLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Selling Price */}
            <div>
              <Label htmlFor="sellingPrice" className="text-sm font-medium text-gray-700">
                Selling Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice || 0}
                onChange={(e) => handleInputChange("sellingPrice", parseFloat(e.target.value) || 0)}
                className="mt-1"
                disabled={actionLoading}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Base price: {item.basePrice?.toFixed(2) || '0.00'}
              </p>
            </div>

            {/* Display Order */}
            <div>
              <Label htmlFor="displayOrder" className="text-sm font-medium text-gray-700">
                Display Order
              </Label>
              <Input
                id="displayOrder"
                type="number"
                min="1"
                step="1"
                value={formData.displayOrder || 1}
                onChange={(e) => handleInputChange("displayOrder", parseInt(e.target.value) || 1)}
                className="mt-1"
                disabled={actionLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first
              </p>
            </div>

            {/* Availability Toggles */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900">Availability Settings</h3>

              {/* Is Available */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                    Available
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Item can be ordered when enabled
                  </p>
                </div>
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable ?? true}
                  onCheckedChange={(checked) => handleToggle("isAvailable", checked)}
                  disabled={actionLoading}
                />
              </div>

              {/* Visible in POS */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="isVisibleInPOS" className="text-sm font-medium text-gray-700">
                    Visible in POS
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Show item in Point of Sale system
                  </p>
                </div>
                <Switch
                  id="isVisibleInPOS"
                  checked={formData.isVisibleInPOS ?? true}
                  onCheckedChange={(checked) => handleToggle("isVisibleInPOS", checked)}
                  disabled={actionLoading}
                />
              </div>

              {/* Visible in Online */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="isVisibleInOnline" className="text-sm font-medium text-gray-700">
                    Visible in Online Ordering
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Show item in online/mobile ordering
                  </p>
                </div>
                <Switch
                  id="isVisibleInOnline"
                  checked={formData.isVisibleInOnline ?? true}
                  onCheckedChange={(checked) => handleToggle("isVisibleInOnline", checked)}
                  disabled={actionLoading}
                />
              </div>

              {/* Price Includes Tax */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="priceIncludesTax" className="text-sm font-medium text-gray-700">
                    Price Includes Tax
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Selling price already includes tax
                  </p>
                </div>
                <Switch
                  id="priceIncludesTax"
                  checked={formData.priceIncludesTax ?? false}
                  onCheckedChange={(checked) => handleToggle("priceIncludesTax", checked)}
                  disabled={actionLoading}
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900">Promotional Settings</h3>

              {/* Is Featured */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                    Featured Item
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Highlight this item in featured section
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured ?? false}
                  onCheckedChange={(checked) => handleToggle("isFeatured", checked)}
                  disabled={actionLoading}
                />
              </div>

              {/* Is Recommended */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="isRecommended" className="text-sm font-medium text-gray-700">
                    Recommended Item
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Show as recommended to customers
                  </p>
                </div>
                <Switch
                  id="isRecommended"
                  checked={formData.isRecommended ?? false}
                  onCheckedChange={(checked) => handleToggle("isRecommended", checked)}
                  disabled={actionLoading}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={actionLoading}
            className="px-6 bg-gray-900 hover:bg-black text-white"
          >
            {actionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{isEditing ? "Update Configuration" : "Add to Menu"}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchMenuModal;

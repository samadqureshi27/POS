"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EffectiveMenuItem, BranchMenuConfig } from "@/lib/services/branch-menu-service";
import { MenuItemService, type TenantMenuItem } from "@/lib/services/menu-item-service";
import { toast } from "sonner";

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

  // Check if we need to show the menu item dropdown (when adding new item without pre-selection)
  const showMenuItemDropdown = !isEditing && (!item?._id || !item?.id);

  // Available menu items from main menu
  const [availableMenuItems, setAvailableMenuItems] = useState<TenantMenuItem[]>([]);
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);

  // Form state matching API structure
  const [formData, setFormData] = useState<Partial<BranchMenuConfig>>({
    branchId: branchObjectId || "",
    menuItemId: "",
    isAvailable: true,
    isVisibleInPOS: true,
    isVisibleInOnline: true,
    sellingPrice: undefined,
    priceIncludesTax: false,
    displayOrder: 1,
    isFeatured: false,
    isRecommended: false,
    labels: [],
    metadata: {},
  });

  // Load available menu items when modal opens for adding new items
  useEffect(() => {
    if (isOpen && showMenuItemDropdown) {
      loadAvailableMenuItems();
    }
  }, [isOpen, showMenuItemDropdown]);

  // Update form data when item or branchObjectId changes
  useEffect(() => {
    if (item) {
      if (item.branchConfig) {
        // Editing existing config
        setFormData({
          branchId: item.branchConfig.branchId,
          menuItemId: item.branchConfig.menuItemId,
          isAvailable: item.branchConfig.isAvailable ?? true,
          isVisibleInPOS: item.branchConfig.isVisibleInPOS ?? true,
          isVisibleInOnline: item.branchConfig.isVisibleInOnline ?? true,
          sellingPrice: item.branchConfig.sellingPrice,
          priceIncludesTax: item.branchConfig.priceIncludesTax ?? false,
          displayOrder: item.branchConfig.displayOrder ?? 1,
          isFeatured: item.branchConfig.isFeatured ?? false,
          isRecommended: item.branchConfig.isRecommended ?? false,
          labels: item.branchConfig.labels || [],
          metadata: item.branchConfig.metadata || {},
        });
      } else {
        // Adding new item to branch
        const itemId = item._id || item.id || "";
        setFormData({
          branchId: branchObjectId || "",
          menuItemId: itemId,
          isAvailable: true,
          isVisibleInPOS: true,
          isVisibleInOnline: true,
          sellingPrice: item.basePrice || undefined,
          priceIncludesTax: false,
          displayOrder: 1,
          isFeatured: false,
          isRecommended: false,
          labels: [],
          metadata: {},
        });
      }
    }
  }, [item, branchObjectId]);

  const loadAvailableMenuItems = async () => {
    try {
      setLoadingMenuItems(true);
      const response = await MenuItemService.listItems({ limit: 1000 });
      if (response.success && response.data) {
        setAvailableMenuItems(response.data);
      }
    } catch (error) {
      console.error("Error loading menu items:", error);
      toast.error("Failed to load available menu items");
    } finally {
      setLoadingMenuItems(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.branchId) {
      toast.error("Branch ID is missing. Please try again.");
      return;
    }

    if (!formData.menuItemId) {
      toast.error("Please select a menu item");
      return;
    }

    // Build payload matching API structure
    const payload: Partial<BranchMenuConfig> = {
      branchId: formData.branchId,
      menuItemId: formData.menuItemId,
      isAvailable: formData.isAvailable ?? true,
      isVisibleInPOS: formData.isVisibleInPOS ?? true,
      isVisibleInOnline: formData.isVisibleInOnline ?? true,
      priceIncludesTax: formData.priceIncludesTax ?? false,
      displayOrder: formData.displayOrder ?? 1,
      isFeatured: formData.isFeatured ?? false,
      isRecommended: formData.isRecommended ?? false,
      labels: formData.labels || [],
      metadata: formData.metadata || {},
    };

    // Only include sellingPrice if it's set
    if (formData.sellingPrice !== undefined && formData.sellingPrice !== null) {
      payload.sellingPrice = formData.sellingPrice;
    }

    if (isEditing && item?.branchConfig) {
      const configId = item.branchConfig._id || item.branchConfig.id;
      if (configId) {
        await onUpdate(configId, payload);
      }
    } else {
      await onSave(payload);
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

  if (!isOpen) return null;

  if (!item) {
    return null;
  }

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Menu Configuration" : "Add to Branch Menu"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {showMenuItemDropdown ? "Select a menu item from the dropdown below" : item.name}
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
            {/* Menu Item Selection - Show dropdown when adding via "Browse Items" */}
            {showMenuItemDropdown && (
              <div>
                <Label htmlFor="menuItemId" className="text-sm font-medium text-gray-700">
                  Menu Item <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.menuItemId}
                  onValueChange={(value) => {
                    handleInputChange("menuItemId", value);
                    // Find the selected item and set its base price
                    const selectedItem = availableMenuItems.find(
                      (mi) => (mi._id || mi.id) === value
                    );
                    if (selectedItem) {
                      // Note: MenuItemService doesn't have pricing, so we'll leave it empty
                      handleInputChange("sellingPrice", undefined);
                    }
                  }}
                  disabled={loadingMenuItems || actionLoading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a menu item to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingMenuItems ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                    ) : availableMenuItems.length === 0 ? (
                      <div className="text-sm text-gray-500 py-4 text-center">
                        No menu items available
                      </div>
                    ) : (
                      availableMenuItems.map((menuItem) => (
                        <SelectItem
                          key={menuItem._id || menuItem.id}
                          value={menuItem._id || menuItem.id || ""}
                        >
                          {menuItem.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Select the menu item to add to this branch
                </p>
              </div>
            )}

            {/* Show item name when editing or adding from grid */}
            {!showMenuItemDropdown && item && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                <Label className="text-sm font-medium text-gray-700">Menu Item</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{item.name}</p>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
            )}

            {/* Selling Price */}
            <div>
              <Label htmlFor="sellingPrice" className="text-sm font-medium text-gray-700">
                Selling Price (Optional)
              </Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange("sellingPrice", val ? parseFloat(val) : undefined);
                }}
                onFocus={(e) => e.target.select()}
                className="mt-1"
                disabled={actionLoading}
                placeholder="Leave empty to use base price"
              />
              <p className="text-xs text-gray-500 mt-1">
                Override the base menu item price for this branch
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
                min="0"
                step="1"
                value={formData.displayOrder === 0 ? "" : formData.displayOrder || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange("displayOrder", val === '' ? 0 : parseInt(val) || 0);
                }}
                onFocus={(e) => e.target.select()}
                className="mt-1"
                disabled={actionLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first in the menu
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

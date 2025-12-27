"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Info } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CustomTooltip } from "@/components/ui/custom-tooltip";
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
  const formId = "branch-menu-modal-form";
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

  if (!isOpen || !item) return null;

  const loadingShell = (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        size="3xl" 
        fullHeight 
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogBody className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            <p className="text-sm text-muted-foreground">Loading branch information...</p>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );

  if (!branchObjectId) {
    return loadingShell;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        size="3xl" 
        fullHeight 
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Menu Configuration" : "Add to Branch Menu"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="flex-1 overflow-y-auto min-h-0 p-0">
          <form id={formId} onSubmit={handleSubmit} className="pl-8 pr-[34px] space-y-8">
            {showMenuItemDropdown && (
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="menuItemId" className="text-sm font-medium text-[#656565]">
                    Menu Item <span className="text-red-500">*</span>
                  </Label>
                  <CustomTooltip label="Select the menu item to add to this branch" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Select
                  value={formData.menuItemId}
                  onValueChange={(value) => {
                    handleInputChange("menuItemId", value);
                    const selectedItem = availableMenuItems.find(
                      (mi) => (mi._id || mi.id) === value
                    );
                    if (selectedItem) {
                      handleInputChange("sellingPrice", undefined);
                    }
                  }}
                  disabled={loadingMenuItems || actionLoading}
                >
                  <SelectTrigger className="mt-1.5">
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
              </div>
            )}

            {!showMenuItemDropdown && item && (
              <div className="bg-[#f8f8fa] border border-[#d4d7dd] rounded-sm p-4">
                <Label className="text-sm font-medium text-[#656565]">Menu Item</Label>
                <p className="text-lg font-semibold text-[#1f2937] mt-1">{item.name}</p>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="sellingPrice" className="text-sm font-medium text-[#656565]">
                    Selling Price
                  </Label>
                  <CustomTooltip label="Override the base menu item price for this branch. Leave empty to use base price." direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
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
                  className="mt-1.5"
                  disabled={actionLoading}
                  placeholder="Leave empty to use base price"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="displayOrder" className="text-sm font-medium text-[#656565]">
                    Display Order
                  </Label>
                  <CustomTooltip label="Lower numbers appear first in the menu" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
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
                  className="mt-1.5"
                  disabled={actionLoading}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#d5d5dd]">
              <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="isAvailable" className="text-sm font-medium text-[#1f2937]">
                    Available
                  </Label>
                  <CustomTooltip label="Item can be ordered when enabled" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable ?? true}
                  onCheckedChange={(checked) => handleToggle("isAvailable", checked)}
                  disabled={actionLoading}
                />
              </div>

              <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="isVisibleInPOS" className="text-sm font-medium text-[#1f2937]">
                    Visible in POS
                  </Label>
                  <CustomTooltip label="Show item in Point of Sale system" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Switch
                  id="isVisibleInPOS"
                  checked={formData.isVisibleInPOS ?? true}
                  onCheckedChange={(checked) => handleToggle("isVisibleInPOS", checked)}
                  disabled={actionLoading}
                />
              </div>

              <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="isVisibleInOnline" className="text-sm font-medium text-[#1f2937]">
                    Visible in Online Ordering
                  </Label>
                  <CustomTooltip label="Show item in online/mobile ordering" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Switch
                  id="isVisibleInOnline"
                  checked={formData.isVisibleInOnline ?? true}
                  onCheckedChange={(checked) => handleToggle("isVisibleInOnline", checked)}
                  disabled={actionLoading}
                />
              </div>

              <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="priceIncludesTax" className="text-sm font-medium text-[#1f2937]">
                    Price Includes Tax
                  </Label>
                  <CustomTooltip label="Selling price already includes tax" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Switch
                  id="priceIncludesTax"
                  checked={formData.priceIncludesTax ?? false}
                  onCheckedChange={(checked) => handleToggle("priceIncludesTax", checked)}
                  disabled={actionLoading}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#d5d5dd]">
              <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="isFeatured" className="text-sm font-medium text-[#1f2937]">
                    Featured Item
                  </Label>
                  <CustomTooltip label="Highlight this item in featured section" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured ?? false}
                  onCheckedChange={(checked) => handleToggle("isFeatured", checked)}
                  disabled={actionLoading}
                />
              </div>

              <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="isRecommended" className="text-sm font-medium text-[#1f2937]">
                    Recommended Item
                  </Label>
                  <CustomTooltip label="Show as recommended to customers" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Switch
                  id="isRecommended"
                  checked={formData.isRecommended ?? false}
                  onCheckedChange={(checked) => handleToggle("isRecommended", checked)}
                  disabled={actionLoading}
                />
              </div>
            </div>
          </form>
        </DialogBody>

        <DialogFooter className="flex items-center justify-start gap-3">
          <Button
            type="submit"
            form={formId}
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
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
            className="px-6"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BranchMenuModal;

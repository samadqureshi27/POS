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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import type { BranchInventoryItem } from "@/lib/services/branch-inventory-service";
import { InventoryService, type InventoryItem } from "@/lib/services/inventory-service";
import { toast } from "sonner";

interface BranchInventoryModalProps {
  isOpen: boolean;
  editingItem: BranchInventoryItem | null;
  branchObjectId: string | null;
  onClose: () => void;
  onSave: (data: Partial<BranchInventoryItem>) => Promise<void>;
  actionLoading: boolean;
}

const BranchInventoryModal: React.FC<BranchInventoryModalProps> = ({
  isOpen,
  editingItem,
  branchObjectId,
  onClose,
  onSave,
  actionLoading,
}) => {
  const formId = "branch-inventory-modal-form";
  // Available items from inventory
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<BranchInventoryItem>>({
    branchId: branchObjectId || "",
    itemId: "",
    quantity: 0,
    reorderPoint: 0,
    minStock: 0,
    maxStock: 0,
    costPerUnit: 0,
    sellingPrice: 0,
    isActive: true,
  });

  // Load available items when modal opens
  useEffect(() => {
    if (isOpen && !editingItem) {
      loadAvailableItems();
    }
  }, [isOpen, editingItem]);

  // Update form data when editing item changes or branchObjectId changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        branchId: editingItem.branchId,
        itemId: editingItem.itemId,
        quantity: editingItem.quantity || 0,
        reorderPoint: editingItem.reorderPoint || 0,
        minStock: editingItem.minStock || 0,
        maxStock: editingItem.maxStock || 0,
        costPerUnit: editingItem.costPerUnit || 0,
        sellingPrice: editingItem.sellingPrice || 0,
        isActive: editingItem.isActive !== false,
      });
    } else {
      setFormData({
        branchId: branchObjectId || "",
        itemId: "",
        quantity: 0,
        reorderPoint: 0,
        minStock: 0,
        maxStock: 0,
        costPerUnit: 0,
        sellingPrice: 0,
        isActive: true,
      });
    }
  }, [editingItem, branchObjectId]);

  const loadAvailableItems = async () => {
    try {
      setLoadingItems(true);
      const response = await InventoryService.listItems({ limit: 1000 });
      if (response.success && response.data) {
        setAvailableItems(response.data);
      }
    } catch (error) {
      console.error("Error loading items:", error);
      toast.error("Failed to load available items");
    } finally {
      setLoadingItems(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.branchId) {
      toast.error("Branch ID is missing. Please try again.");
      return;
    }

    if (!formData.itemId) {
      toast.error("Please select an item");
      return;
    }

    if (formData.quantity === undefined || formData.quantity < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    await onSave(formData);
  };

  const handleChange = (field: keyof BranchInventoryItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

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

  if (!branchObjectId && !editingItem) {
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
            {editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-0">
          <form id={formId} onSubmit={handleSubmit} className="pl-8 pr-8 space-y-8 max-w-full">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Label htmlFor="itemId" className="text-sm font-medium text-[#656565]">
                  Item <span className="text-red-500">*</span>
                </Label>
                <CustomTooltip 
                  label={editingItem ? "Item cannot be changed after creation" : "Select the inventory item to add to this branch"} 
                  direction="right"
                >
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                </CustomTooltip>
              </div>
              {editingItem ? (
                <Input
                  id="itemId"
                  value={formData.itemId}
                  disabled
                  className="mt-1.5"
                />
              ) : (
                <Select
                  value={formData.itemId}
                  onValueChange={(value) => handleChange("itemId", value)}
                  disabled={loadingItems || actionLoading}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingItems ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                    ) : availableItems.length === 0 ? (
                      <div className="text-sm text-gray-500 py-4 text-center">
                        No items available
                      </div>
                    ) : (
                      availableItems.map((item) => (
                        <SelectItem
                          key={item._id || item.id}
                          value={item._id || item.id || ""}
                        >
                          {item.name} {item.sku && `(${item.sku})`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="quantity" className="text-sm font-medium text-[#656565]">
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <CustomTooltip label="Current stock quantity in this branch" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.quantity === 0 ? "" : formData.quantity || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("quantity", val === '' ? 0 : parseInt(val) || 0);
                  }}
                  onFocus={(e) => e.target.select()}
                  className="mt-1.5"
                  disabled={actionLoading}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="reorderPoint" className="text-sm font-medium text-[#656565]">
                    Reorder Point
                  </Label>
                  <CustomTooltip label="Minimum stock level that triggers a reorder alert" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Input
                  id="reorderPoint"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.reorderPoint === 0 ? "" : formData.reorderPoint || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("reorderPoint", val === '' ? 0 : parseInt(val) || 0);
                  }}
                  onFocus={(e) => e.target.select()}
                  className="mt-1.5"
                  disabled={actionLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="minStock" className="text-sm font-medium text-[#656565]">
                    Min Stock
                  </Label>
                  <CustomTooltip label="Minimum stock level to maintain" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.minStock === 0 ? "" : formData.minStock || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("minStock", val === '' ? 0 : parseInt(val) || 0);
                  }}
                  onFocus={(e) => e.target.select()}
                  className="mt-1.5"
                  disabled={actionLoading}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="maxStock" className="text-sm font-medium text-[#656565]">
                    Max Stock
                  </Label>
                  <CustomTooltip label="Maximum stock level to maintain" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.maxStock === 0 ? "" : formData.maxStock || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("maxStock", val === '' ? 0 : parseInt(val) || 0);
                  }}
                  onFocus={(e) => e.target.select()}
                  className="mt-1.5"
                  disabled={actionLoading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Label htmlFor="costPerUnit" className="text-sm font-medium text-[#656565]">
                  Cost Per Unit
                </Label>
                <CustomTooltip label="Purchase or cost price per unit" direction="right">
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                </CustomTooltip>
              </div>
              <Input
                id="costPerUnit"
                type="number"
                min="0"
                step="0.01"
                value={formData.costPerUnit === 0 ? "" : formData.costPerUnit || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange("costPerUnit", val === '' ? 0 : parseFloat(val) || 0);
                }}
                onFocus={(e) => e.target.select()}
                className="mt-1.5"
                disabled={actionLoading}
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="sellingPrice" className="text-sm font-medium text-[#656565]">
                    Selling Price
                  </Label>
                  <CustomTooltip label="Retail or selling price per unit" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Input
                  id="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.sellingPrice === 0 ? "" : formData.sellingPrice || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("sellingPrice", val === '' ? 0 : parseFloat(val) || 0);
                  }}
                  onFocus={(e) => e.target.select()}
                  className="mt-1.5"
                  disabled={actionLoading}
                  placeholder="0.00"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="isActive" className="text-sm font-medium text-[#656565]">
                    Status
                  </Label>
                  <CustomTooltip label="Active items are available for use in this branch" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Select
                  value={formData.isActive ? "active" : "inactive"}
                  onValueChange={(value) => handleChange("isActive", value === "active")}
                  disabled={actionLoading}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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
                {editingItem ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{editingItem ? "Update Item" : "Add Item"}</>
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

export default BranchInventoryModal;

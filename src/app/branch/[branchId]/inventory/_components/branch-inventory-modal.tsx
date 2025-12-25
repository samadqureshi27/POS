"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
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

  // Show loading state if branch ObjectId is not available yet
  if (!branchObjectId && !editingItem) {
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
              {editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {editingItem
                ? "Update the inventory item details"
                : "Add a new item to branch inventory"}
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
            {/* Item Selection */}
            <div>
              <Label htmlFor="itemId" className="text-sm font-medium text-gray-700">
                Item <span className="text-red-500">*</span>
              </Label>
              {editingItem ? (
                <Input
                  id="itemId"
                  value={formData.itemId}
                  disabled
                  className="mt-1"
                />
              ) : (
                <Select
                  value={formData.itemId}
                  onValueChange={(value) => handleChange("itemId", value)}
                  disabled={loadingItems || actionLoading}
                >
                  <SelectTrigger className="mt-1">
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
              <p className="text-xs text-gray-500 mt-1">
                {editingItem
                  ? "Item cannot be changed after creation"
                  : "Select the inventory item to add to this branch"}
              </p>
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </Label>
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
                className="mt-1"
                disabled={actionLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current stock quantity
              </p>
            </div>

            {/* Stock Levels Row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Reorder Point */}
              <div>
                <Label htmlFor="reorderPoint" className="text-sm font-medium text-gray-700">
                  Reorder Point
                </Label>
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
                  className="mt-1"
                  disabled={actionLoading}
                />
              </div>

              {/* Min Stock */}
              <div>
                <Label htmlFor="minStock" className="text-sm font-medium text-gray-700">
                  Min Stock
                </Label>
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
                  className="mt-1"
                  disabled={actionLoading}
                />
              </div>

              {/* Max Stock */}
              <div>
                <Label htmlFor="maxStock" className="text-sm font-medium text-gray-700">
                  Max Stock
                </Label>
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
                  className="mt-1"
                  disabled={actionLoading}
                />
              </div>
            </div>

            {/* Pricing Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Cost Per Unit */}
              <div>
                <Label htmlFor="costPerUnit" className="text-sm font-medium text-gray-700">
                  Cost Per Unit
                </Label>
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
                  className="mt-1"
                  disabled={actionLoading}
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Purchase/Cost price
                </p>
              </div>

              {/* Selling Price */}
              <div>
                <Label htmlFor="sellingPrice" className="text-sm font-medium text-gray-700">
                  Selling Price
                </Label>
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
                  className="mt-1"
                  disabled={actionLoading}
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Retail/Selling price
                </p>
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => handleChange("isActive", value === "active")}
                disabled={actionLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Active items are available for use
              </p>
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
                {editingItem ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{editingItem ? "Update Item" : "Add Item"}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchInventoryModal;

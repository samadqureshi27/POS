"use client";
import React, { useState } from "react";
import { X, Plus, Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InventoryInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inventory: InventoryData) => void;
}

interface InventoryData {
  itemName: string;
  category: string;
  quantity: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  costPerUnit: number;
  supplier?: string;
  lastRestocked?: string;
  actionType: "add" | "remove" | "adjust";
  reason: string;
}

const inventoryCategories = [
  "Coffee & Beans",
  "Milk & Dairy",
  "Tea & Matcha",
  "Food Items",
  "Pastries & Baked Goods",
  "Syrups & Sauces",
  "Packaging",
  "Cleaning Supplies",
  "Equipment Parts",
  "Other"
];

const units = ["kg", "L", "pcs", "boxes", "bottles", "bags"];

const actionTypes = [
  { value: "add", label: "Add Stock", icon: TrendingUp, color: "green" },
  { value: "remove", label: "Remove Stock", icon: TrendingDown, color: "red" },
  { value: "adjust", label: "Adjust Stock", icon: AlertTriangle, color: "amber" }
];

export const InventoryInputModal: React.FC<InventoryInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<InventoryData>({
    itemName: "",
    category: "",
    quantity: 0,
    minimumStock: 0,
    maximumStock: 0,
    unit: "",
    costPerUnit: 0,
    supplier: "",
    lastRestocked: new Date().toISOString().split('T')[0],
    actionType: "add",
    reason: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemName) newErrors.itemName = "Item name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.quantity < 0) newErrors.quantity = "Stock cannot be negative";
    if (formData.minimumStock < 0) newErrors.minimumStock = "Minimum stock cannot be negative";
    if (formData.maximumStock <= formData.minimumStock) {
      newErrors.maximumStock = "Maximum stock must be greater than minimum";
    }
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (formData.costPerUnit < 0) newErrors.costPerUnit = "Cost cannot be negative";
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (!formData.reason) newErrors.reason = "Reason is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        itemName: "",
        category: "",
        quantity: 0,
        minimumStock: 0,
        maximumStock: 0,
        unit: "",
        costPerUnit: 0,
        supplier: "",
        lastRestocked: new Date().toISOString().split('T')[0],
        actionType: "add",
        reason: ""
      });
      onClose();
    }
  };

  const handleInputChange = (field: keyof InventoryData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  const selectedAction = actionTypes.find(action => action.value === formData.actionType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Inventory Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Item Information */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Package size={20} className="mr-2" />
              Item Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange("itemName", e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.itemName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Arabica Coffee Beans"
                />
                {errors.itemName && <p className="text-red-500 text-sm mt-1">{errors.itemName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select category</option>
                  {inventoryCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.unit ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select unit</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Unit (PKR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPerUnit}
                  onChange={(e) => handleInputChange("costPerUnit", parseFloat(e.target.value) || 0)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.costPerUnit ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.costPerUnit && <p className="text-red-500 text-sm mt-1">{errors.costPerUnit}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier (Optional)</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Supplier name"
              />
            </div>
          </div>

          {/* Stock Levels */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Stock Levels</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", parseFloat(e.target.value) || 0)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumStock}
                  onChange={(e) => handleInputChange("minimumStock", parseFloat(e.target.value) || 0)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.minimumStock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.minimumStock && <p className="text-red-500 text-sm mt-1">{errors.minimumStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.maximumStock}
                  onChange={(e) => handleInputChange("maximumStock", parseFloat(e.target.value) || 0)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.maximumStock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.maximumStock && <p className="text-red-500 text-sm mt-1">{errors.maximumStock}</p>}
              </div>
            </div>
          </div>

          {/* Stock Action */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Stock Action</h3>

            <div className="grid grid-cols-3 gap-3">
              {actionTypes.map((action) => (
                <button
                  key={action.value}
                  type="button"
                  onClick={() => handleInputChange("actionType", action.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.actionType === action.value
                      ? `border-${action.color}-500 bg-${action.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <action.icon
                    size={20}
                    className={`mx-auto mb-2 ${
                      formData.actionType === action.value
                        ? `text-${action.color}-600`
                        : "text-gray-500"
                    }`}
                  />
                  <div className={`text-sm font-medium ${
                    formData.actionType === action.value
                      ? `text-${action.color}-700`
                      : "text-gray-700"
                  }`}>
                    {action.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", parseFloat(e.target.value) || 0)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0"
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Restocked</label>
                <input
                  type="date"
                  value={formData.lastRestocked}
                  onChange={(e) => handleInputChange("lastRestocked", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Action</label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.reason ? "border-red-500" : "border-gray-300"
                }`}
                rows={2}
                placeholder="e.g., Received new shipment, Damaged items, Stock count adjustment..."
              />
              {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 text-white ${
                selectedAction?.color === "green"
                  ? "bg-green-600 hover:bg-green-700"
                  : selectedAction?.color === "red"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {selectedAction?.icon && <selectedAction.icon size={16} className="mr-2" />}
              {selectedAction?.label}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
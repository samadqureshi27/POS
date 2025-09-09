"use client";

import React, { useEffect } from "react";
import { X, Save, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { InventoryItem, InventoryModalFormData } from "@/types/inventory";

interface InventoryModalProps {
    isOpen: boolean;
    editingItem: InventoryItem | null;
    formData: InventoryModalFormData;
    actionLoading: boolean;
    branchId: number;
    onClose: () => void;
    onSubmit: () => void;
    onFormDataChange: (updates: Partial<InventoryModalFormData>) => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
    isOpen,
    editingItem,
    formData,
    actionLoading,
    branchId,
    onClose,
    onSubmit,
    onFormDataChange,
}) => {
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71 px-4">
            <div className="bg-white rounded-sm p-4 sm:p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        {editingItem ? "Edit Inventory Item" : `Add New Inventory Item - Branch #${branchId}`}
                    </h2>
                </div>

                {/* Scrollable Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1 pl-1">
                    {/* Item Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Item Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.Name}
                            onChange={(e) => onFormDataChange({ Name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter item name"
                            required
                        />
                    </div>

                    {/* Supplier */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Supplier <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.supplier}
                            onChange={(e) => onFormDataChange({ supplier: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter supplier name"
                            required
                        />
                    </div>

                    {/* Unit */}
                    <div className="sm:col-span-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit Measurement
                        </label>
                        <div className="flex items-center gap-2">
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger className="px-3 py-2 w-full rounded-sm text-sm bg-white border border-gray-300 outline-none flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]">
                                    {formData.Unit || "Select Unit"}
                                    <ChevronDown size={16} className="text-gray-500" />
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content
                                        className="min-w-[240px] rounded-sm bg-white shadow-md border border-gray-200 p-1 relative outline-none z-100"
                                        sideOffset={6}
                                    >
                                        <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 z-100" />

                                        <DropdownMenu.Item
                                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                            onClick={() => onFormDataChange({ Unit: "" })}
                                        >
                                            Select Unit
                                        </DropdownMenu.Item>

                                        {[
                                            "Kilograms (Kg's)",
                                            "Grams (g)",
                                            "Liters",
                                            "Milliliters (ml)",
                                            "Pieces",
                                            "Boxes",
                                            "Bottles",
                                            "Cans",
                                            "Packs"
                                        ].map(unit => (
                                            <DropdownMenu.Item
                                                key={unit}
                                                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                                onClick={() => onFormDataChange({ Unit: unit })}
                                            >
                                                {unit}
                                            </DropdownMenu.Item>
                                        ))}
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                        </div>
                    </div>

                    {/* Threshold */}
                    <div className="sm:col-span-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Low Stock Threshold
                            <span className="text-xs text-gray-500 ml-1">
                                (Alert when below)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.Threshold || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d+$/.test(value)) {
                                    onFormDataChange({
                                        Threshold: value === '' ? 0 : Number(value)
                                    });
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    {/* Initial Stock */}
                    <div className="sm:col-span-1 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Initial Stock
                            <span className="text-xs text-gray-500 ml-1">
                                (Starting quantity)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.InitialStock || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d+$/.test(value)) {
                                    onFormDataChange({
                                        InitialStock: value === '' ? 0 : Number(value)
                                    });
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    {/* Added Stock */}
                    <div className="sm:col-span-1 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Stock
                            <span className="text-xs text-gray-500 ml-1">
                                (Stock to add)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.AddedStock || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d+$/.test(value)) {
                                    onFormDataChange({
                                        AddedStock: value === '' ? 0 : Number(value)
                                    });
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    {/* Current Stock Display */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Current Stock
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-gray-50 text-gray-600">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <span className="font-medium text-lg">
                                    {(formData.InitialStock || 0) + (formData.AddedStock || 0)}{" "}
                                    {formData.Unit || "units"}
                                </span>
                                <div className="text-sm text-gray-500">
                                    Initial: {formData.InitialStock || 0} + Added:{" "}
                                    {formData.AddedStock || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stock Status Indicator */}
                    {(formData.InitialStock || 0) + (formData.AddedStock || 0) > 0 && (
                        <div className="col-span-1 sm:col-span-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Status
                                <span className="text-xs text-gray-500 ml-1">
                                    (Auto-calculated based on threshold)
                                </span>
                            </label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-sm border bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-4 h-4 rounded-full ${formData.Status === "Low"
                                            ? "bg-red-500"
                                            : formData.Status === "Medium"
                                                ? "bg-yellow-500"
                                                : "bg-green-500"
                                            }`}
                                    ></div>
                                    <span
                                        className={`text-sm font-semibold ${formData.Status === "Low"
                                            ? "text-red-600"
                                            : formData.Status === "Medium"
                                                ? "text-yellow-600"
                                                : "text-green-600"
                                            }`}
                                    >
                                        {formData.Status.toUpperCase()} STOCK
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 sm:ml-auto">
                                    Threshold: {formData.Threshold || 0}{" "}
                                    {formData.Unit || "units"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 justify-end border-t border-gray-200 mt-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={actionLoading}
                        className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X size={16} />
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!formData.Name.trim() || !formData.supplier.trim() || actionLoading}
                        className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 ${!formData.Name.trim() || !formData.supplier.trim() || actionLoading
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
                                {editingItem ? "Update Item" : "Add Item"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryModal;
"use client";

import React, { useState, useEffect } from "react";
import { Package, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryItem, InventoryModalFormData } from "@/lib/types/inventory";

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
    const [activeTab, setActiveTab] = useState("basic-info");

    useEffect(() => {
        if (isOpen) {
            setActiveTab("basic-info");
        }
    }, [isOpen]);

    const isFormValid = () => {
        return formData.Name.trim() && formData.supplier.trim();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent size="3xl" fullHeight>
                {/* Header */}
                <div className="p-5 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-gray-700" />
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            {editingItem ? "Edit Inventory Item" : `Add Inventory Item - Branch #${branchId}`}
                        </DialogTitle>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {editingItem ? "Update inventory item details and stock levels" : "Create a new inventory item with initial stock"}
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                        {/* Tab List */}
                        <div className="px-5 pt-3 pb-3 border-b border-gray-100 flex-shrink-0">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-center">
                                    <TabsList className="grid w-full max-w-sm grid-cols-2 h-9">
                                        <TabsTrigger value="basic-info" className="text-sm">
                                            Basic Info
                                        </TabsTrigger>
                                        <TabsTrigger value="stock-levels" className="text-sm">
                                            Stock Levels
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <p className="text-xs text-gray-600 text-center">
                                    {activeTab === "basic-info"
                                        ? "Enter item name, supplier, and unit measurement"
                                        : "Configure initial stock and threshold alerts"}
                                </p>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-5 min-h-0">
                            <TabsContent value="basic-info" className="mt-0 space-y-4">
                                {/* Item Name */}
                                <div>
                                    <Label htmlFor="itemName" className="text-sm font-medium">
                                        Item Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="itemName"
                                        type="text"
                                        value={formData.Name}
                                        onChange={(e) => onFormDataChange({ Name: e.target.value })}
                                        placeholder="Enter item name"
                                        className="mt-1.5"
                                        required
                                    />
                                </div>

                                {/* Supplier */}
                                <div>
                                    <Label htmlFor="supplier" className="text-sm font-medium">
                                        Supplier <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="supplier"
                                        type="text"
                                        value={formData.supplier}
                                        onChange={(e) => onFormDataChange({ supplier: e.target.value })}
                                        placeholder="Enter supplier name"
                                        className="mt-1.5"
                                        required
                                    />
                                </div>

                                {/* Unit */}
                                <div>
                                    <Label htmlFor="unit" className="text-sm font-medium">
                                        Unit Measurement
                                    </Label>
                                    <Select value={formData.Unit} onValueChange={(value) => onFormDataChange({ Unit: value })}>
                                        <SelectTrigger className="mt-1.5">
                                            <SelectValue placeholder="Select Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Kilograms (Kg's)">Kilograms (Kg's)</SelectItem>
                                            <SelectItem value="Grams (g)">Grams (g)</SelectItem>
                                            <SelectItem value="Liters">Liters</SelectItem>
                                            <SelectItem value="Milliliters (ml)">Milliliters (ml)</SelectItem>
                                            <SelectItem value="Pieces">Pieces</SelectItem>
                                            <SelectItem value="Boxes">Boxes</SelectItem>
                                            <SelectItem value="Bottles">Bottles</SelectItem>
                                            <SelectItem value="Cans">Cans</SelectItem>
                                            <SelectItem value="Packs">Packs</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            <TabsContent value="stock-levels" className="mt-0 space-y-4">
                                {/* Threshold */}
                                <div>
                                    <Label htmlFor="threshold" className="text-sm font-medium">
                                        Low Stock Threshold
                                        <span className="text-xs text-muted-foreground ml-1">
                                            (Alert when below)
                                        </span>
                                    </Label>
                                    <Input
                                        id="threshold"
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
                                        placeholder="0"
                                        className="mt-1.5"
                                        min="0"
                                    />
                                </div>

                                {/* Initial Stock */}
                                <div>
                                    <Label htmlFor="initialStock" className="text-sm font-medium">
                                        Initial Stock
                                        <span className="text-xs text-muted-foreground ml-1">
                                            (Starting quantity)
                                        </span>
                                    </Label>
                                    <Input
                                        id="initialStock"
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
                                        placeholder="0"
                                        className="mt-1.5"
                                        min="0"
                                    />
                                </div>

                                {/* Added Stock */}
                                <div>
                                    <Label htmlFor="addedStock" className="text-sm font-medium">
                                        Additional Stock
                                        <span className="text-xs text-muted-foreground ml-1">
                                            (Stock to add)
                                        </span>
                                    </Label>
                                    <Input
                                        id="addedStock"
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
                                        placeholder="0"
                                        className="mt-1.5"
                                        min="0"
                                    />
                                </div>

                                {/* Current Stock Display */}
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <Label className="text-sm font-medium mb-2 block">
                                        Total Current Stock
                                    </Label>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <span className="font-bold text-xl text-gray-900">
                                            {(formData.InitialStock || 0) + (formData.AddedStock || 0)}{" "}
                                            <span className="text-sm text-gray-600">{formData.Unit || "units"}</span>
                                        </span>
                                        <div className="text-sm text-gray-500">
                                            Initial: {formData.InitialStock || 0} + Added:{" "}
                                            {formData.AddedStock || 0}
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Status Indicator */}
                                {(formData.InitialStock || 0) + (formData.AddedStock || 0) > 0 && (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <Label className="text-sm font-medium mb-2 block">
                                            Stock Status
                                            <span className="text-xs text-muted-foreground ml-1">
                                                (Auto-calculated based on threshold)
                                            </span>
                                        </Label>
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
                                            <span className="text-xs text-gray-500 ml-auto">
                                                Threshold: {formData.Threshold || 0}{" "}
                                                {formData.Unit || "units"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end items-center gap-2 flex-shrink-0">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        size="sm"
                        className="h-9"
                        disabled={actionLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!isFormValid() || actionLoading}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-9"
                    >
                        {actionLoading ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                {editingItem ? "Updating..." : "Saving..."}
                            </>
                        ) : (
                            <>
                                {editingItem ? "Update Item" : "Save & Close"}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InventoryModal;

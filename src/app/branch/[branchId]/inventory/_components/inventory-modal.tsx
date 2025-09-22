"use client";

import React, { useEffect } from "react";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col gap-1">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-semibold">
                        {editingItem ? "Edit Inventory Item" : `Add New Inventory Item - Branch #${branchId}`}
                    </DialogTitle>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1 pl-1">
                    {/* Item Name */}
                    <div className="md:col-span-2">
                        <Label htmlFor="itemName" className="text-sm font-medium">
                            Item Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="itemName"
                            type="text"
                            value={formData.Name}
                            onChange={(e) => onFormDataChange({ Name: e.target.value })}
                            placeholder="Enter item name"
                            required
                        />
                    </div>

                    {/* Supplier */}
                    <div className="md:col-span-2">
                        <Label htmlFor="supplier" className="text-sm font-medium">
                            Supplier <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="supplier"
                            type="text"
                            value={formData.supplier}
                            onChange={(e) => onFormDataChange({ supplier: e.target.value })}
                            placeholder="Enter supplier name"
                            required
                        />
                    </div>

                    {/* Unit */}
                    <div className="sm:col-span-2 md:col-span-2">
                        <Label htmlFor="unit" className="text-sm font-medium">
                            Unit Measurement
                        </Label>
                        <Select value={formData.Unit} onValueChange={(value) => onFormDataChange({ Unit: value })}>
                            <SelectTrigger>
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

                    {/* Threshold */}
                    <div className="sm:col-span-2 md:col-span-2">
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
                            min="0"
                        />
                    </div>

                    {/* Initial Stock */}
                    <div className="sm:col-span-1 md:col-span-1">
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
                            min="0"
                        />
                    </div>

                    {/* Added Stock */}
                    <div className="sm:col-span-1 md:col-span-1">
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
                            min="0"
                        />
                    </div>

                    {/* Current Stock Display */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-2">
                        <Label className="text-sm font-medium">
                            Total Current Stock
                        </Label>
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
                            <Label className="text-sm font-medium">
                                Stock Status
                                <span className="text-xs text-muted-foreground ml-1">
                                    (Auto-calculated based on threshold)
                                </span>
                            </Label>
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
                <div className="flex-shrink-0 pt-4 border-t border-gray-100 bg-white flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={actionLoading}
                        className="w-full sm:w-auto"
                    >
                        <X size={16} />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onSubmit}
                        disabled={!formData.Name.trim() || !formData.supplier.trim() || actionLoading}
                        className="w-full sm:w-auto"
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
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InventoryModal;
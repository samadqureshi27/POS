"use client";

import React, { useEffect } from "react";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PosItem, PosModalFormData } from "@/lib/types/pos";
interface PosModalProps {
    isOpen: boolean;
    editingItem: PosItem | null;
    formData: PosModalFormData;
    actionLoading: boolean;
    branchId: string;
    onClose: () => void;
    onSubmit: () => void;
    onFormDataChange: (updates: Partial<PosModalFormData>) => void;
    onStatusChange: (isActive: boolean) => void;
}

const PosModal: React.FC<PosModalProps> = ({
    isOpen,
    editingItem,
    formData,
    actionLoading,
    branchId,
    onClose,
    onSubmit,
    onFormDataChange,
    onStatusChange,
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
            <DialogContent className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-semibold">
                        {editingItem ? "Edit POS" : `Add New POS - Branch #${branchId}`}
                    </DialogTitle>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-1 pl-1">
                    {/* POS Name */}
                    <div className="mb-4">
                        <Label htmlFor="posName" className="text-sm font-medium">
                            POS Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="posName"
                            type="text"
                            value={formData.POS_Name}
                            onChange={(e) =>
                                onFormDataChange({ POS_Name: e.target.value })
                            }
                            placeholder="Enter POS name"
                            required
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                            Status
                        </Label>
                        <Switch
                            checked={formData.Status === "Active"}
                            onCheckedChange={onStatusChange}
                        />
                    </div>
                </div>

                {/* Fixed Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 justify-end border-t border-gray-200 mt-auto">
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
                        disabled={!formData.POS_Name.trim() || actionLoading}
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
                                {editingItem ? "Update POS" : "Add POS"}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PosModal;
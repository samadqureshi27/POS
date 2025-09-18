// _components/BranchModal.tsx
"use client";

import React from "react";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BranchModalProps } from "@/lib/types/branch";

const BranchModal: React.FC<BranchModalProps> = ({
    isOpen,
    editingItem,
    formData,
    actionLoading,
    onClose,
    onSubmit,
    onFormDataChange,
    onStatusChange,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-semibold">
                        {editingItem ? "Edit Branch" : "Add New Branch"}
                    </DialogTitle>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1 p-2">
                    {/* Branch Name */}
                    <div className="md:col-span-2">
                        <Label htmlFor="branchName" className="text-sm font-medium">
                            Branch Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="branchName"
                            type="text"
                            value={formData.Branch_Name}
                            onChange={(e) =>
                                onFormDataChange({ Branch_Name: e.target.value })
                            }
                            placeholder="Enter branch name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                            <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                onFormDataChange({ email: e.target.value })
                            }
                            placeholder="Enter email address"
                        />
                    </div>

                    {/* Address */}
                    <div className="col-span-2">
                        <Label htmlFor="address" className="text-sm font-medium">
                            Address <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="address"
                            value={formData.Address}
                            onChange={(e) =>
                                onFormDataChange({ Address: e.target.value })
                            }
                            className="h-32 resize-none"
                            placeholder="Enter branch address"
                            required
                        />
                    </div>

                    {/* Postal Code */}
                    <div className="md:col-span-2">
                        <Label htmlFor="postalCode" className="text-sm font-medium">
                            Postal Code
                            <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                        </Label>
                        <Input
                            id="postalCode"
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) =>
                                onFormDataChange({ postalCode: e.target.value })
                            }
                            placeholder="Enter postal code"
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="sm:col-span-2 flex items-center justify-between">
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
                        disabled={
                            !formData.Branch_Name.trim() ||
                            !formData.Address.trim() ||
                            actionLoading
                        }
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
                                {editingItem ? "Update Branch" : "Add Branch"}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BranchModal;
"use client";
import React, { useEffect } from "react";
import { X, Save } from "lucide-react";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VendorModalProps } from "@/lib/types/vendors";

const VendorModal: React.FC<VendorModalProps> = ({
    isOpen,
    onClose,
    editingItem,
    formData,
    actionLoading,
    branchId,
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

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent size="3xl" fullHeight onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="space-y-1.5 pb-3">
                    <DialogTitle className="text-xl">
                        {editingItem ? "Edit Vendor" : `Add New Vendor - Branch #${branchId}`}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Manage vendor details and contact information
                    </p>
                </DialogHeader>

                <DialogBody className="flex-1 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="companyName" className="text-sm font-medium">
                                Company Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="companyName"
                                type="text"
                                value={formData.Company_Name}
                                onChange={(e) =>
                                    onFormDataChange({ Company_Name: e.target.value })
                                }
                                placeholder="Enter company name"
                                className="mt-1.5"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="contactName" className="text-sm font-medium">
                                Contact Person Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="contactName"
                                type="text"
                                value={formData.Name}
                                onChange={(e) =>
                                    onFormDataChange({ Name: e.target.value })
                                }
                                placeholder="Enter contact person name"
                                className="mt-1.5"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="contactNumber" className="text-sm font-medium">
                                Contact Number
                                <span className="text-xs text-muted-foreground ml-1">
                                    (Phone/Mobile)
                                </span>
                            </Label>
                            <Input
                                id="contactNumber"
                                type="text"
                                value={formData.Contact}
                                onChange={(e) =>
                                    onFormDataChange({ Contact: e.target.value })
                                }
                                placeholder="Enter contact number"
                                className="mt-1.5"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                                <span className="text-xs text-muted-foreground ml-1">
                                    (Business email)
                                </span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.Email}
                                onChange={(e) =>
                                    onFormDataChange({ Email: e.target.value })
                                }
                                placeholder="Enter email address"
                                className="mt-1.5"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="address" className="text-sm font-medium">
                                Business Address
                                <span className="text-xs text-muted-foreground ml-1">
                                    (Complete address)
                                </span>
                            </Label>
                            <Textarea
                                id="address"
                                value={formData.Address}
                                onChange={(e) =>
                                    onFormDataChange({ Address: e.target.value })
                                }
                                className="h-24 resize-none mt-1.5"
                                placeholder="Enter complete business address..."
                                rows={3}
                            />
                        </div>
                    </div>
                </DialogBody>

                <DialogFooter className="flex justify-start gap-2">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            !formData.Name.trim() ||
                            !formData.Company_Name.trim() ||
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
                                {editingItem ? "Update Vendor" : "Add Vendor"}
                            </>
                        )}
                    </Button>
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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default VendorModal;
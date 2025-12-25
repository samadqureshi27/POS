"use client";
import React, { useEffect } from "react";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
            <DialogContent className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col gap-0" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-2">
                        {editingItem ? "Edit Vendor" : `Add New Vendor - Branch #${branchId}`}
                    </DialogTitle>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1 pl-1">
                    {/* Company Name */}
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
                            required
                        />
                    </div>

                    {/* Contact Person Name */}
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
                            required
                        />
                    </div>

                    {/* Contact Number */}
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
                        />
                    </div>

                    {/* Email */}
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
                        />
                    </div>

                    {/* Address */}
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
                            className="h-24 resize-none"
                            placeholder="Enter complete business address..."
                            rows={3}
                        />
                    </div>
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
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VendorModal;
// _components/BranchModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
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
    const [activeTab, setActiveTab] = useState("basic-info");

    useEffect(() => {
        if (isOpen) {
            setActiveTab("basic-info");
        }
    }, [isOpen]);

    const isFormValid = () => {
        return formData.Branch_Name.trim() && formData.Address.trim();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                size="3xl"
                fullHeight
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {editingItem ? "Edit Branch" : "Add New Branch"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <div className="px-8 pb-6 pt-2 flex-shrink-0 min-w-0 max-w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                            <TabsTrigger value="contact">Contact & Status</TabsTrigger>
                        </TabsList>
                    </div>

                    <DialogBody className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-0">
                        <div className="pl-8 pr-8 space-y-8 min-w-0 max-w-full">
                            <TabsContent value="basic-info" className="mt-0 space-y-8">
                                {/* Branch Name */}
                                <div>
                                    <Label htmlFor="branchName" className="text-sm font-medium text-[#656565] mb-1.5">
                                        Branch Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="branchName"
                                        type="text"
                                        value={formData.Branch_Name}
                                        onChange={(e) =>
                                            onFormDataChange({ Branch_Name: e.target.value })
                                        }
                                        placeholder="Enter branch name"
                                        className="mt-1.5"
                                        required
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <Label htmlFor="address" className="text-sm font-medium text-[#656565] mb-1.5">
                                        Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="address"
                                        value={formData.Address}
                                        onChange={(e) =>
                                            onFormDataChange({ Address: e.target.value })
                                        }
                                        className="mt-1.5 h-32 resize-none"
                                        placeholder="Enter branch address"
                                        required
                                    />
                                </div>

                                {/* Postal Code */}
                                <div>
                                    <Label htmlFor="postalCode" className="text-sm font-medium text-[#656565] mb-1.5">
                                        Postal Code
                                    </Label>
                                    <Input
                                        id="postalCode"
                                        type="text"
                                        value={formData.postalCode}
                                        onChange={(e) =>
                                            onFormDataChange({ postalCode: e.target.value })
                                        }
                                        placeholder="Enter postal code"
                                        className="mt-1.5"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="contact" className="mt-0 space-y-8">
                                {/* Email */}
                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium text-[#656565] mb-1.5">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            onFormDataChange({ email: e.target.value })
                                        }
                                        placeholder="Enter email address"
                                        className="mt-1.5"
                                    />
                                </div>

                                {/* Status Toggle */}
                                <div className="w-full">
                                    <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3 w-full">
                                        <span className="text-[#1f2937] text-sm font-medium">Active</span>
                                        <Switch
                                            checked={formData.Status === "Active"}
                                            onCheckedChange={onStatusChange}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </DialogBody>
                </Tabs>

                <DialogFooter className="flex justify-start gap-2">
                    <Button
                        onClick={onSubmit}
                        disabled={!isFormValid() || actionLoading}
                        className="bg-black hover:bg-gray-800 text-white px-8 h-11"
                    >
                        {actionLoading ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                {editingItem ? "Updating..." : "Saving..."}
                            </>
                        ) : (
                            <>
                                {editingItem ? "Update" : "Submit"}
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="px-8 h-11 border-gray-300"
                        disabled={actionLoading}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BranchModal;

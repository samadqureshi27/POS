// _components/BranchModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            <DialogContent size="3xl" fullHeight>
                <DialogHeader>
                    <DialogTitle>
                        {editingItem ? "Edit Branch" : "Add New Branch"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="px-8 pb-6 pt-2 flex-shrink-0 border-b border-gray-200">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                            <TabsTrigger value="contact">Contact & Status</TabsTrigger>
                        </TabsList>
                    </div>

                    <DialogBody className="space-y-6">
                            <TabsContent value="basic-info" className="mt-0 space-y-4">
                                {/* Branch Name */}
                                <div>
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
                                        className="mt-1.5"
                                        required
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <Label htmlFor="address" className="text-sm font-medium">
                                        Address <span className="text-destructive">*</span>
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
                                        className="mt-1.5"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="contact" className="mt-0 space-y-4">
                                {/* Email */}
                                <div>
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
                                        className="mt-1.5"
                                    />
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">
                                            Branch Status
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            {formData.Status === "Active"
                                                ? "This branch is currently active and operational"
                                                : "This branch is currently inactive"}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.Status === "Active"}
                                        onCheckedChange={onStatusChange}
                                    />
                                </div>
                            </TabsContent>
                    </DialogBody>
                </Tabs>

                <DialogFooter>
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

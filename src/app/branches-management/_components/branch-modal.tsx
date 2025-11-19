// _components/BranchModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
                {/* Header */}
                <div className="p-5 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-700" />
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            {editingItem ? "Edit Branch" : "Add New Branch"}
                        </DialogTitle>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {editingItem ? "Update branch information and settings" : "Create a new branch location"}
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
                                        <TabsTrigger value="contact" className="text-sm">
                                            Contact & Status
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <p className="text-xs text-gray-600 text-center">
                                    {activeTab === "basic-info"
                                        ? "Enter branch name and location details"
                                        : "Configure contact information and branch status"}
                                </p>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-5 min-h-0">
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
                                {editingItem ? "Update Branch" : "Save & Close"}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BranchModal;

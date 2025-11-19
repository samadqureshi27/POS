"use client";

import React, { useState, useEffect } from "react";
import { MonitorCheck, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    const [activeTab, setActiveTab] = useState("basic-info");

    useEffect(() => {
        if (isOpen) {
            setActiveTab("basic-info");
        }
    }, [isOpen]);

    const isFormValid = () => {
        return formData.POS_Name.trim();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent size="3xl" fullHeight>
                {/* Header */}
                <div className="p-5 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <MonitorCheck className="h-5 w-5 text-gray-700" />
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            {editingItem ? "Edit POS Terminal" : `Add POS Terminal - Branch #${branchId}`}
                        </DialogTitle>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {editingItem ? "Update POS terminal configuration and status" : "Create a new POS terminal for this branch"}
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
                                        <TabsTrigger value="settings" className="text-sm">
                                            Settings
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <p className="text-xs text-gray-600 text-center">
                                    {activeTab === "basic-info"
                                        ? "Enter POS terminal name and identifier"
                                        : "Configure terminal status and availability"}
                                </p>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-5 min-h-0">
                            <TabsContent value="basic-info" className="mt-0 space-y-4">
                                {/* POS Name */}
                                <div>
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
                                        placeholder="e.g., Counter 1, Drive-through, Main Register"
                                        className="mt-1.5"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Give this POS terminal a descriptive name to easily identify it
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="settings" className="mt-0 space-y-4">
                                {/* Status Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">
                                            Terminal Status
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            {formData.Status === "Active"
                                                ? "This terminal is active and ready to accept orders"
                                                : "This terminal is currently inactive"}
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
                                {editingItem ? "Update POS" : "Save & Close"}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PosModal;

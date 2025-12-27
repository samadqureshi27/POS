"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Info } from "lucide-react";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { BranchService } from "@/lib/services/branch-service";
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
    const [branchName, setBranchName] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            setActiveTab("basic-info");
            // Fetch branch name
            if (branchId) {
                BranchService.getBranch(branchId)
                    .then((response) => {
                        if (response.success && response.data) {
                            setBranchName(response.data.name || "");
                        }
                    })
                    .catch(() => {
                        // Silently fail, will just show branchId
                    });
            }
        }
    }, [isOpen, branchId]);

    const isFormValid = () => {
        return formData.POS_Name.trim() && formData.machineId?.trim();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                size="3xl" 
                fullHeight 
                onInteractOutside={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {editingItem ? "Edit POS Terminal" : `Add POS Terminal${branchName ? ` - ${branchName}` : branchId ? ` - Branch #${branchId}` : ""}`}
                    </DialogTitle>
                </DialogHeader>

                <DialogBody className="flex-1 flex flex-col min-h-0 p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                        <div className="px-8 pb-6 pt-2 flex-shrink-0 min-w-0 max-w-full">
                            <TabsList className="w-full grid grid-cols-2">
                                <TabsTrigger value="basic-info">
                                    Basic Info
                                </TabsTrigger>
                                <TabsTrigger value="settings">
                                    Settings
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pl-8 pr-8 space-y-8 pt-4 min-w-0 max-w-full">
                            <TabsContent value="basic-info" className="mt-0 space-y-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Label htmlFor="posName" className="text-sm font-medium text-[#656565]">
                                            POS Name <span className="text-red-500">*</span>
                                        </Label>
                                        <CustomTooltip label="Give this POS terminal a descriptive name to easily identify it" direction="right">
                                            <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                                        </CustomTooltip>
                                    </div>
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
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Label htmlFor="machineId" className="text-sm font-medium text-[#656565]">
                                            Machine ID <span className="text-red-500">*</span>
                                        </Label>
                                        <CustomTooltip label="Unique identifier for this POS terminal device" direction="right">
                                            <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                                        </CustomTooltip>
                                    </div>
                                    <Input
                                        id="machineId"
                                        type="text"
                                        value={formData.machineId || ""}
                                        onChange={(e) =>
                                            onFormDataChange({ machineId: e.target.value })
                                        }
                                        placeholder="e.g., POS-01, TERMINAL-A1"
                                        className="mt-1.5"
                                        required
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Label htmlFor="ipAddress" className="text-sm font-medium text-[#656565]">
                                            IP Address
                                        </Label>
                                        <CustomTooltip label="Network IP address for this terminal (optional)" direction="right">
                                            <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                                        </CustomTooltip>
                                    </div>
                                    <Input
                                        id="ipAddress"
                                        type="text"
                                        value={formData.metadata?.ip || ""}
                                        onChange={(e) =>
                                            onFormDataChange({
                                                metadata: {
                                                    ...formData.metadata,
                                                    ip: e.target.value
                                                }
                                            })
                                        }
                                        placeholder="e.g., 10.0.0.5"
                                        className="mt-1.5"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="settings" className="mt-0 space-y-8">
                                <div className="w-full">
                                    <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3 w-full">
                                        <span className="text-[#1f2937] text-sm font-medium">Active</span>
                                        <Switch
                                            checked={formData.Status === "active"}
                                            onCheckedChange={onStatusChange}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </DialogBody>

                <DialogFooter>
                    <Button
                        onClick={onSubmit}
                        disabled={!isFormValid() || actionLoading}
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
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={actionLoading}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PosModal;

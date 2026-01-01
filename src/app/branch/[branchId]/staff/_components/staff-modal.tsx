"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Info } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChipMultiSelect, type ChipOption } from "@/components/ui/chip-multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import type { TenantStaff } from "@/lib/services/staff-service";
import { StaffService } from "@/lib/services/staff-service";
import { BranchService, type TenantBranch } from "@/lib/services/branch-service";
import { PosService, type PosTerminal } from "@/lib/services/pos-service";
import { toast } from "sonner";

interface StaffModalProps {
  isOpen: boolean;
  item: TenantStaff | null;
  branchId: string | null;
  onClose: () => void;
  onSave: (data: Partial<TenantStaff>) => Promise<void>;
  onUpdate: (id: string, data: Partial<TenantStaff>) => Promise<void>;
  actionLoading: boolean;
}

const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  item,
  branchId,
  onClose,
  onSave,
  onUpdate,
  actionLoading,
}) => {
  const formId = "staff-modal-form";
  // Determine if we're editing
  const isEditing = Boolean(item?._id || item?.id);

  // Branches state
  const [branches, setBranches] = useState<TenantBranch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // POS Terminals state
  const [posTerminals, setPosTerminals] = useState<PosTerminal[]>([]);
  const [loadingTerminals, setLoadingTerminals] = useState(false);

  // Available roles
  const availableRoles = ["staff", "cashier", "supervisor", "manager", "waiter", "chef", "cleaner"];

  // Form state matching API structure
  const [formData, setFormData] = useState<Partial<TenantStaff>>({
    fullName: "",
    email: "",
    password: "",
    branchIds: branchId ? [branchId] : [],
    roles: [],
    roleGrants: [],
    pin: "",
    status: "active",
    metadata: {},
  });

  // Single branch ID state
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branchId || "");

  // Phone number state (separate from TenantStaff type)
  const [phone, setPhone] = useState<string>("");

  // POS IDs state (separate from TenantStaff type)
  const [posIds, setPosIds] = useState<string[]>([]);

  // Check roles for conditional fields
  const isCashier = formData.roles?.includes("cashier");
  const isManager = formData.roles?.includes("manager");
  const showPosTerminals = isCashier || isManager;
  const hasOtherRoles = !formData.roles || formData.roles.length === 0 || formData.roles.some(role => role !== "cashier" && role !== "manager");

  // Convert roles to ChipOption format
  const roleOptions = useMemo<ChipOption[]>(() => {
    return availableRoles.map((role) => ({
      id: role,
      label: role.charAt(0).toUpperCase() + role.slice(1),
    }));
  }, []);

  // Convert POS terminals to ChipOption format
  const posTerminalOptions = useMemo<ChipOption[]>(() => {
    return posTerminals.map((terminal) => ({
      id: terminal._id || terminal.id || "",
      label: terminal.name,
    }));
  }, [posTerminals]);

  // Load branches when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBranches();
      // If editing, fetch full staff details to get phone, pin, posIds, etc.
      if (item && (item._id || item.id)) {
        loadFullStaffDetails(item._id || item.id!);
      }
    }
  }, [isOpen, item?._id, item?.id]);

  const loadFullStaffDetails = async (staffId: string) => {
    try {
      const response = await StaffService.getStaff(staffId);
      if (response.success && response.data) {
        const fullStaff = response.data;
        // Update form data with full staff details
        setFormData({
          fullName: fullStaff.fullName || "",
          email: fullStaff.email || "",
          password: "", // Never populate password
          branchIds: fullStaff.branchIds || (branchId ? [branchId] : []),
          roles: fullStaff.roles || [],
          roleGrants: fullStaff.roleGrants || [],
          pin: fullStaff.pin || "",
          status: fullStaff.status || "active",
          metadata: fullStaff.metadata || {},
        });
        // Set single branch from branchIds array
        const staffBranchId = fullStaff.branchIds && fullStaff.branchIds.length > 0 ? fullStaff.branchIds[0] : (branchId || "");
        setSelectedBranchId(staffBranchId);
        // Set phone from full staff data
        setPhone((fullStaff as any).phone || (fullStaff.metadata as any)?.phone || "");
        // Set POS IDs from full staff data
        setPosIds((fullStaff as any).posIds || []);
      }
    } catch (error) {
      console.error("Error loading full staff details:", error);
      // Don't show error toast as the item prop might still have basic data
    }
  };

  // Load POS terminals when branch or roles change (for cashier/manager)
  useEffect(() => {
    if (isOpen && showPosTerminals && selectedBranchId) {
      loadPosTerminals();
    } else {
      // Clear terminals if conditions not met
      setPosTerminals([]);
      // Also clear selected POS IDs if roles don't require terminals
      if (!showPosTerminals) {
        setPosIds([]);
      }
    }
  }, [isOpen, showPosTerminals, selectedBranchId]);

  // Filter out invalid POS IDs when terminals list changes
  useEffect(() => {
    if (posTerminals.length > 0 && posIds.length > 0) {
      const validTerminalIds = posTerminals.map((t) => t._id || t.id || "").filter(Boolean);
      const validPosIds = posIds.filter((id) => validTerminalIds.includes(id));
      if (validPosIds.length !== posIds.length) {
        setPosIds(validPosIds);
      }
    }
  }, [posTerminals]);

  const loadBranches = async () => {
    try {
      setLoadingBranches(true);
      const response = await BranchService.listBranches({ limit: 100 });
      if (response.success && response.data) {
        setBranches(response.data);
      }
    } catch (error) {
      console.error("Error loading branches:", error);
      toast.error("Failed to load branches");
    } finally {
      setLoadingBranches(false);
    }
  };

  const loadPosTerminals = async () => {
    if (!selectedBranchId) {
      setPosTerminals([]);
      return;
    }

    try {
      setLoadingTerminals(true);
      const result = await PosService.getTerminalsByBranch(selectedBranchId);

      if (result.success && result.data) {
        setPosTerminals(result.data);
      } else {
        setPosTerminals([]);
      }
    } catch (error) {
      console.error("Error loading POS terminals:", error);
      toast.error("Failed to load POS terminals");
      setPosTerminals([]);
    } finally {
      setLoadingTerminals(false);
    }
  };

  // Update form data when item changes (for initial load from list)
  // Note: If editing, loadFullStaffDetails will override this with complete data
  useEffect(() => {
    if (item) {
      // Set basic data from item prop (might be partial from list view)
      // This provides initial values while full details are being fetched
      setFormData({
        fullName: item.fullName || "",
        email: item.email || "",
        password: "", // Never populate password
        branchIds: item.branchIds || (branchId ? [branchId] : []),
        roles: item.roles || [],
        roleGrants: item.roleGrants || [],
        pin: item.pin || "",
        status: item.status || "active",
        metadata: item.metadata || {},
      });
      // Set single branch from branchIds array
      const itemBranchId = item.branchIds && item.branchIds.length > 0 ? item.branchIds[0] : (branchId || "");
      setSelectedBranchId(itemBranchId);
      // Set phone from item if available (check both top-level and metadata)
      setPhone((item as any).phone || (item.metadata as any)?.phone || "");
      // Set POS IDs from item if available
      setPosIds((item as any).posIds || []);
    } else {
      // Reset for new staff
      setFormData({
        fullName: "",
        email: "",
        password: "",
        branchIds: branchId ? [branchId] : [],
        roles: [],
        roleGrants: [],
        pin: "",
        status: "active",
        metadata: {},
      });
      setSelectedBranchId(branchId || "");
      setPhone("");
      setPosIds([]);
    }
  }, [item, branchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName?.trim()) {
      toast.error("Please enter staff member's full name");
      return;
    }

    if (hasOtherRoles) {
    if (!formData.email?.trim()) {
      toast.error("Please enter email address");
      return;
      }
      if (!isEditing && !formData.password?.trim()) {
        toast.error("Please enter password for new staff member");
        return;
      }
    }

    if (isCashier && !isEditing) {
      if (!formData.pin || formData.pin.length !== 6) {
        toast.error("Please enter a 6-digit PIN for the cashier");
        return;
      }
    }

    if (!selectedBranchId) {
      toast.error("Please select a branch");
      return;
    }

    // Build payload matching API structure - only include necessary fields
    const payload: any = {
      fullName: formData.fullName,
      email: formData.email,
      roles: formData.roles || [],
      isStaff: true,
      status: formData.status || "active",
      // Backend requires branchIds as array with at least 1 item
      branchIds: [selectedBranchId],
    };

    // Include phone if provided - always check current state value
    const phoneValue = phone?.trim() || "";
    if (phoneValue) {
      payload.phone = phoneValue;
    }

    // Check if POS terminals are being assigned
    const hasCashierOrManager = formData.roles?.some(role => role === "cashier" || role === "manager");

    // Always include posIds array when cashier/manager role is selected
    if (hasCashierOrManager) {
      payload.posIds = Array.isArray(posIds) ? posIds : [];
    }

    // Include assignedBranchId when posIds is being sent (even if empty array)
    // Backend requires this field when posIds field is present in payload
    if (hasCashierOrManager) {
      payload.assignedBranchId = selectedBranchId;
    }

    // Debug: Log payload before sending
    console.log("Payload being sent:", JSON.stringify(payload, null, 2));
    console.log("Roles:", formData.roles);
    console.log("Has cashier/manager:", hasCashierOrManager);
    console.log("Selected Branch ID:", selectedBranchId);

    // Only include password if provided (for non-cashier roles)
    if (formData.password) {
      payload.password = formData.password;
    }

    // Optional fields
    if (formData.pin) payload.pin = formData.pin;
    if (formData.roleGrants && formData.roleGrants.length > 0) {
      payload.roleGrants = formData.roleGrants;
    }
    // Include other metadata fields if any
    if (formData.metadata && Object.keys(formData.metadata).length > 0) {
      payload.metadata = formData.metadata;
    }

    if (isEditing && (item?._id || item?.id)) {
      await onUpdate(item._id || item.id!, payload);
    } else {
      await onSave(payload);
    }
  };

  const handleInputChange = (field: keyof TenantStaff, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranchId(value);
  };

  const handleRoleChange = (selectedIds: string[]) => {
    handleInputChange("roles", selectedIds);
  };

  const handlePosTerminalChange = (selectedIds: string[]) => {
    setPosIds(selectedIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        size="3xl" 
        fullHeight 
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-8">
          <form id={formId} onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-1">
                <Label htmlFor="fullName" className="text-sm font-medium text-[#656565]">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName || ""}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="mt-1.5"
                  disabled={actionLoading}
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email - Conditional */}
              {hasOtherRoles && (
              <div className="md:col-span-1">
                <Label htmlFor="email" className="text-sm font-medium text-[#656565]">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1.5"
                  disabled={actionLoading}
                  placeholder="staff@example.com"
                  required
                />
              </div>
              )}

              {/* Password - Conditional */}
              {hasOtherRoles && (
              <div className="md:col-span-1">
                <Label htmlFor="password" className="text-sm font-medium text-[#656565]">
                  Password {!isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="mt-1.5"
                  disabled={actionLoading}
                  placeholder={isEditing ? "Leave empty to keep current password" : "Enter password"}
                  required={!isEditing}
                />
              </div>
              )}

              {/* Phone Number */}
              <div className="md:col-span-1">
                <Label htmlFor="phone" className="text-sm font-medium text-[#656565]">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5"
                  disabled={actionLoading}
                  placeholder="+966501234569"
                />
              </div>

              {/* PIN - Only for cashier role, and only when creating (not editing) */}
              {isCashier && !isEditing && (
              <div className="md:col-span-1">
                <Label htmlFor="pin" className="text-sm font-medium text-[#656565]">
                    PIN (6 digits) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pin"
                  type="text"
                  value={formData.pin || ""}
                  onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    handleInputChange("pin", value);
                  }}
                  className="mt-1.5"
                  disabled={actionLoading}
                    placeholder="123456"
                    maxLength={6}
                    required
                />
              </div>
              )}

            </div>

            {/* Branch - Single select - Full width */}
            <div className="w-full">
              <div className="flex items-center gap-2 mb-1.5">
                <Label className="text-sm font-medium text-[#656565]">
                  Assigned Branch <span className="text-red-500">*</span>
                </Label>
                <CustomTooltip label="Select the branch to assign this staff member to" direction="right">
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                </CustomTooltip>
              </div>
              <Select
                value={selectedBranchId}
                onValueChange={handleBranchChange}
                disabled={actionLoading || loadingBranches}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.length > 0 ? (
                    branches.map((branch) => (
                      <SelectItem key={branch._id || branch.id} value={branch._id || branch.id || ""}>
                        {branch.code ? `${branch.name} (${branch.code})` : branch.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-center text-sm text-gray-500">
                      {loadingBranches ? "Loading branches..." : "No branches available"}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Roles - Multi-select - Full width */}
            <div className="w-full">
              <div className="flex items-center gap-2 mb-1.5">
                <Label className="text-sm font-medium text-[#656565]">
                  Roles <span className="text-red-500">*</span>
                </Label>
                <CustomTooltip label="Select one or more roles for this staff member" direction="right">
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                </CustomTooltip>
              </div>
              <ChipMultiSelect
                value={formData.roles || []}
                options={roleOptions}
                placeholder="Nothing selected"
                disabled={actionLoading}
                onChange={handleRoleChange}
              />
            </div>

            {/* POS Terminals - Conditional on cashier/manager role - Full width */}
            {showPosTerminals && (
              <div className="w-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <Label className="text-sm font-medium text-[#656565]">
                    POS Terminals
                  </Label>
                  <CustomTooltip
                    label={!selectedBranchId
                      ? "Select a branch first to see available POS terminals"
                      : "Select POS terminals for this staff member (optional)"}
                    direction="right"
                  >
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <ChipMultiSelect
                  value={posIds}
                  options={posTerminalOptions}
                  placeholder="Nothing selected"
                  loading={loadingTerminals}
                  disabled={actionLoading || loadingBranches || !selectedBranchId}
                  onChange={handlePosTerminalChange}
                />
              </div>
            )}

            {/* Status at end, full width */}
            <div className="w-full">
              <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3 w-full">
                <span className="text-[#1f2937] text-sm font-medium">Active</span>
                <Switch
                  checked={(formData.status || "active") === "active"}
                  onCheckedChange={(checked) =>
                    handleInputChange("status", checked ? "active" : "inactive")
                  }
                  disabled={actionLoading}
                />
              </div>
            </div>
          </form>
        </DialogBody>

        <DialogFooter className="flex items-center justify-start gap-2">
          <Button
            type="submit"
            form={formId}
            disabled={actionLoading}
            className="px-6 bg-gray-900 hover:bg-black text-white"
          >
            {actionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{isEditing ? "Update Staff Member" : "Add Staff Member"}</>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
            className="px-6"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffModal;

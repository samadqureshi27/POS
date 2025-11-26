"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TenantStaff } from "@/lib/services/staff-service";
import { BranchService, type TenantBranch } from "@/lib/services/branch-service";
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
  // Determine if we're editing
  const isEditing = Boolean(item?._id || item?.id);

  // Branches state
  const [branches, setBranches] = useState<TenantBranch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  // Roles dropdown state
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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
    position: "",
    status: "active",
    metadata: {},
  });

  // Load branches when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBranches();
    }
  }, [isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (branchDropdownOpen && !target.closest('.branch-dropdown-container')) {
        setBranchDropdownOpen(false);
      }
      if (roleDropdownOpen && !target.closest('.role-dropdown-container')) {
        setRoleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [branchDropdownOpen, roleDropdownOpen]);

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

  // Update form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        fullName: item.fullName || "",
        email: item.email || "",
        password: "", // Never populate password
        branchIds: item.branchIds || (branchId ? [branchId] : []),
        roles: item.roles || [],
        roleGrants: item.roleGrants || [],
        pin: item.pin || "",
        position: item.position || "",
        status: item.status || "active",
        metadata: item.metadata || {},
      });
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
        position: "",
        status: "active",
        metadata: {},
      });
    }
  }, [item, branchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName?.trim()) {
      toast.error("Please enter staff member's full name");
      return;
    }

    if (!formData.email?.trim()) {
      toast.error("Please enter email address");
      return;
    }

    if (!formData.branchIds || formData.branchIds.length === 0) {
      toast.error("Please select at least one branch");
      return;
    }

    if (!isEditing && !formData.password?.trim()) {
      toast.error("Please enter password for new staff member");
      return;
    }

    // Build payload matching API structure
    const payload: Partial<TenantStaff> = {
      fullName: formData.fullName,
      email: formData.email,
      branchIds: formData.branchIds || [],
      roles: formData.roles || [],
      roleGrants: formData.roleGrants || [],
      status: formData.status || "active",
    };

    // Only include password if provided
    if (formData.password) {
      payload.password = formData.password;
    }

    // Optional fields
    if (formData.pin) payload.pin = formData.pin;
    if (formData.position) payload.position = formData.position;
    if (formData.metadata) payload.metadata = formData.metadata;
    if (branchId) payload.branchId = branchId;

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

  const handleToggleRole = (role: string) => {
    const currentRoles = formData.roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    handleInputChange("roles", newRoles);
  };

  const handleToggleBranch = (branchObjId: string) => {
    const currentBranchIds = formData.branchIds || [];
    const newBranchIds = currentBranchIds.includes(branchObjId)
      ? currentBranchIds.filter(id => id !== branchObjId)
      : [...currentBranchIds, branchObjId];
    handleInputChange("branchIds", newBranchIds);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing ? "Update staff member details" : "Fill in the details to add a new staff member"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={actionLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName || ""}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="mt-1"
                disabled={actionLoading}
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1"
                disabled={actionLoading}
                placeholder="staff@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password {!isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="mt-1"
                disabled={actionLoading}
                placeholder={isEditing ? "Leave empty to keep current password" : "Enter password"}
                required={!isEditing}
              />
              <p className="text-xs text-gray-500 mt-1">
                {isEditing ? "Leave empty to keep current password" : "Minimum 8 characters recommended"}
              </p>
            </div>

            {/* Branches - Multi-select */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Assigned Branches <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 relative branch-dropdown-container">
                <div
                  className="min-h-[40px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => !actionLoading && !loadingBranches && setBranchDropdownOpen(!branchDropdownOpen)}
                >
                  {loadingBranches ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading branches...</span>
                    </div>
                  ) : formData.branchIds && formData.branchIds.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.branchIds.map((branchObjId) => {
                        const branch = branches.find(b => (b._id || b.id) === branchObjId);
                        return branch ? (
                          <span
                            key={branchObjId}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                          >
                            {branch.name}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-blue-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleBranch(branchObjId);
                              }}
                            />
                          </span>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-400">Select branches...</span>
                  )}
                </div>

                {/* Dropdown */}
                {branchDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {branches.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500">No branches available</div>
                    ) : (
                      branches.map((branch) => {
                        const branchObjId = branch._id || branch.id || "";
                        const isSelected = formData.branchIds?.includes(branchObjId);
                        return (
                          <div
                            key={branchObjId}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => handleToggleBranch(branchObjId)}
                          >
                            <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-sm text-gray-700">{branch.name}</span>
                            {branch.code && (
                              <span className="text-xs text-gray-400">({branch.code})</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select one or more branches to assign this staff member to
              </p>
            </div>

            {/* Position */}
            <div>
              <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                Position
              </Label>
              <Input
                id="position"
                type="text"
                value={formData.position || ""}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className="mt-1"
                disabled={actionLoading}
                placeholder="e.g., Cashier, Manager, Waiter"
              />
            </div>

            {/* PIN */}
            <div>
              <Label htmlFor="pin" className="text-sm font-medium text-gray-700">
                PIN (4 digits)
              </Label>
              <Input
                id="pin"
                type="text"
                value={formData.pin || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  handleInputChange("pin", value);
                }}
                className="mt-1"
                disabled={actionLoading}
                placeholder="1234"
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                4-digit PIN for quick access
              </p>
            </div>

            {/* Roles - Multi-select */}
            <div className="pt-4 border-t border-gray-200">
              <Label className="text-sm font-medium text-gray-700">
                Roles <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 relative role-dropdown-container">
                <div
                  className="min-h-[40px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => !actionLoading && setRoleDropdownOpen(!roleDropdownOpen)}
                >
                  {formData.roles && formData.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium capitalize"
                        >
                          {role}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-purple-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRole(role);
                            }}
                          />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">Select roles...</span>
                  )}
                </div>

                {/* Dropdown */}
                {roleDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {availableRoles.map((role) => {
                      const isSelected = formData.roles?.includes(role);
                      return (
                        <div
                          key={role}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => handleToggleRole(role)}
                        >
                          <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-sm text-gray-700 capitalize">{role}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select one or more roles for this staff member
              </p>
            </div>

            {/* Status */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900">Status</h3>

              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={formData.status || "active"}
                  onValueChange={(value: "active" | "inactive" | "suspended") =>
                    handleInputChange("status", value)
                  }
                  disabled={actionLoading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
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
        </div>
      </div>
    </div>
  );
};

export default StaffModal;

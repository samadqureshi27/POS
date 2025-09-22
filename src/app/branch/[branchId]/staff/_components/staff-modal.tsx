import React from "react";
import { Save, ChevronDown, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StaffFormData } from "@/lib/types/staff-management";
import { formatCNIC } from "@/lib/util/Staff-formatters";

interface StaffModalProps {
    isOpen: boolean;
    isEditing: boolean;
    formData: StaffFormData;
    setFormData: (data: StaffFormData | ((prev: StaffFormData) => StaffFormData)) => void;
    onSubmit: () => void;
    onClose: () => void;
    onStatusChange: (isActive: boolean) => void;
    actionLoading: boolean;
    isFormValid: () => boolean;
    showToast: (message: string, type: "success" | "error") => void;
}

const StaffModal: React.FC<StaffModalProps> = ({
    isOpen,
    isEditing,
    formData,
    setFormData,
    onSubmit,
    onClose,
    onStatusChange,
    actionLoading,
    isFormValid,
    showToast,
}) => {
    const handleSubmit = () => {
        if (!formData.Name.trim() || !formData.CNIC.trim()) {
            return;
        }

        if (
            (formData.Role === "Cashier" || formData.Role === "Manager") &&
            (!formData.Access_Code || formData.Access_Code.length !== 4)
        ) {
            showToast(
                `${formData.Role} role requires a 4-digit access code`,
                "error"
            );
            return;
        }

        onSubmit();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col gap-0">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-2">
                        {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
                    </DialogTitle>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <Label htmlFor="staffName" className="font-medium">
                                Staff Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="staffName"
                                type="text"
                                value={formData.Name}
                                onChange={(e) =>
                                    setFormData({ ...formData, Name: e.target.value })
                                }
                                placeholder="Enter staff name"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <Label htmlFor="contact" className="font-medium">
                                Contact Number
                            </Label>
                            <Input
                                id="contact"
                                type="tel"
                                value={formData.Contact}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d+\-\s]/g, "");
                                    setFormData({ ...formData, Contact: value });
                                }}
                                placeholder="03001234567"
                            />
                        </div>

                        {/* CNIC */}
                        <div>
                            <Label htmlFor="cnic" className="font-medium">
                                CNIC <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="cnic"
                                type="text"
                                value={formData.CNIC}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        CNIC: formatCNIC(e.target.value),
                                    })
                                }
                                placeholder="35202-1234567-8"
                                maxLength={15}
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <Label htmlFor="address" className="font-medium">
                                Address
                            </Label>
                            <Textarea
                                id="address"
                                value={formData.Address}
                                onChange={(e) =>
                                    setFormData({ ...formData, Address: e.target.value })
                                }
                                className="resize-none"
                                placeholder="Enter complete address"
                                rows={3}
                            />
                        </div>

                        {/* Role Dropdown */}
                        <div className="flex flex-col gap-1 relative ">
                            <Label htmlFor="role" className="font-medium">
                                Role
                            </Label>
                            <Select
                            
                                value={formData.Role}
                                onValueChange={(value) => setFormData({ ...formData, Role: value })}
                            >
                                <SelectTrigger  className="w-full ">
                                    <SelectValue className=""  placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent className="z-[100]">
                                    <SelectItem value="Manager">Manager</SelectItem>
                                    <SelectItem value="Cashier">Cashier</SelectItem>
                                    <SelectItem value="Waiter">Waiter</SelectItem>
                                    <SelectItem value="Cleaner">Cleaner</SelectItem>
                                    <SelectItem value="Chef">Chef</SelectItem>
                                    <SelectItem value="Security">Security</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Salary */}
                        <div>
                            <Label htmlFor="salary" className="font-medium">
                                Salary (PKR)
                            </Label>
                            <Input
                                id="salary"
                                type="number"
                                value={formData.Salary}
                                onChange={(e) =>
                                    setFormData({ ...formData, Salary: e.target.value })
                                }
                                placeholder="30000"
                                min="0"
                                step="1000"
                            />
                        </div>

                        {/* Shift Times */}
                        <div>
                            <Label htmlFor="shiftStart" className="font-medium">
                                Shift Start Time
                            </Label>
                            <Input
                                id="shiftStart"
                                type="time"
                                value={formData.Shift_Start_Time}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        Shift_Start_Time: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="shiftEnd" className="font-medium">
                                Shift End Time
                            </Label>
                            <Input
                                id="shiftEnd"
                                type="time"
                                value={formData.Shift_End_Time}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        Shift_End_Time: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {/* Access Code - Only for Cashier and Manager */}
                        {(formData.Role === "Cashier" ||
                            formData.Role === "Manager" ||
                            formData.Role === "Waiter") && (
                                <div>
                                    <Label htmlFor="accessCode" className="font-medium">
                                        Access Code <span className="text-destructive">*</span>
                                        <span className="text-xs text-muted-foreground ml-1">
                                            (4 digits)
                                        </span>
                                    </Label>
                                    <Input
                                        id="accessCode"
                                        type="password"
                                        value={formData.Access_Code}
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 4);
                                            setFormData({ ...formData, Access_Code: value });
                                        }}
                                        className="font-mono tracking-widest"
                                        placeholder="••••"
                                        maxLength={4}
                                        required
                                    />
                                    {formData.Access_Code &&
                                        formData.Access_Code.length < 4 && (
                                            <p className="text-destructive text-xs mt-1">
                                                Access code must be exactly 4 digits
                                            </p>
                                        )}
                                </div>
                            )}

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between py-2">
                            <Label className="font-medium">
                                Status
                            </Label>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`font-medium ${formData.Status === "Active"
                                        ? "text-green-600"
                                        : "text-red-500"
                                        }`}
                                >
                                    {formData.Status}
                                </span>
                                <Switch
                                    checked={formData.Status === "Active"}
                                    onCheckedChange={onStatusChange}
                                />
                            </div>
                        </div>
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
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!isFormValid() || actionLoading}
                        className="w-full sm:w-auto"
                    >
                        {actionLoading ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                                {isEditing ? "Updating..." : "Saving..."}
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                {isEditing ? "Update Staff" : "Add Staff"}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StaffModal;
import React from "react";
import { Save, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ButtonPage from "@/components/layout/ui/button";
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
    if (!isOpen) return null;

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
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-sm p-4 sm:p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
                    </h2>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block font-medium text-gray-700 mb-2">
                                Staff Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.Name}
                                onChange={(e) =>
                                    setFormData({ ...formData, Name: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                                placeholder="Enter staff name"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                value={formData.Contact}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d+\-\s]/g, "");
                                    setFormData({ ...formData, Contact: value });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                                placeholder="03001234567"
                            />
                        </div>

                        {/* CNIC */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                CNIC <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.CNIC}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        CNIC: formatCNIC(e.target.value),
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                                placeholder="35202-1234567-8"
                                maxLength={15}
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <textarea
                                value={formData.Address}
                                onChange={(e) =>
                                    setFormData({ ...formData, Address: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent resize-none transition-colors"
                                placeholder="Enter complete address"
                                rows={3}
                            />
                        </div>

                        {/* Role Dropdown */}
                        <div className="flex flex-col gap-1 relative">
                            <label className="block font-medium text-gray-700 mb-2">
                                Role
                            </label>

                            <DropdownMenu.Root modal={false}>
                                <DropdownMenu.Trigger className="px-3 py-2 rounded-lg border border-gray-300 bg-white flex items-center gap-2 w-full focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors hover:border-gray-400">
                                    <span
                                        className={
                                            formData.Role ? "text-gray-900" : "text-gray-500"
                                        }
                                    >
                                        {formData.Role || "Select Role"}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className="text-gray-500 ml-auto"
                                    />
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content
                                        className="min-w-[200px] rounded-sm bg-white shadow-lg border border-gray-200 p-1 relative outline-none z-[100] max-h-60 overflow-y-auto"
                                        sideOffset={6}
                                    >
                                        <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                                        <DropdownMenu.Item
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded outline-none text-gray-500"
                                            onClick={() =>
                                                setFormData({ ...formData, Role: "" })
                                            }
                                        >
                                            Select Role
                                        </DropdownMenu.Item>

                                        {[
                                            "Manager",
                                            "Cashier",
                                            "Waiter",
                                            "Cleaner",
                                            "Chef",
                                            "Security",
                                        ].map((role) => (
                                            <DropdownMenu.Item
                                                key={role}
                                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:text-gray-700 rounded outline-none"
                                                onClick={() =>
                                                    setFormData({ ...formData, Role: role })
                                                }
                                            >
                                                {role}
                                            </DropdownMenu.Item>
                                        ))}
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Salary (PKR)
                            </label>
                            <input
                                type="number"
                                value={formData.Salary}
                                onChange={(e) =>
                                    setFormData({ ...formData, Salary: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                                placeholder="30000"
                                min="0"
                                step="1000"
                            />
                        </div>

                        {/* Shift Times */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Shift Start Time
                            </label>
                            <input
                                type="time"
                                value={formData.Shift_Start_Time}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        Shift_Start_Time: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Shift End Time
                            </label>
                            <input
                                type="time"
                                value={formData.Shift_End_Time}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        Shift_End_Time: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                            />
                        </div>

                        {/* Access Code - Only for Cashier and Manager */}
                        {(formData.Role === "Cashier" ||
                            formData.Role === "Manager" ||
                            formData.Role === "Waiter") && (
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2">
                                        Access Code <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">
                                            (4 digits)
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.Access_Code}
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 4);
                                            setFormData({ ...formData, Access_Code: value });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent font-mono tracking-widest transition-colors"
                                        placeholder="••••"
                                        maxLength={4}
                                        required
                                    />
                                    {formData.Access_Code &&
                                        formData.Access_Code.length < 4 && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Access code must be exactly 4 digits
                                            </p>
                                        )}
                                </div>
                            )}

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between py-2">
                            <label className="block font-medium text-gray-700">
                                Status
                            </label>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`font-medium ${formData.Status === "Active"
                                            ? "text-green-600"
                                            : "text-red-500"
                                        }`}
                                >
                                    {formData.Status}
                                </span>
                                <ButtonPage
                                    checked={formData.Status === "Active"}
                                    onChange={onStatusChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 justify-end border-t border-gray-200 mt-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={actionLoading}
                        className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!isFormValid() || actionLoading}
                        className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 ${!isFormValid() || actionLoading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#2C2C2C] text-white hover:bg-gray-700"
                            }`}
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
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffModal;
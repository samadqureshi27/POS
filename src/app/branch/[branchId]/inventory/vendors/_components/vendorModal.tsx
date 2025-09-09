"use client";
import React, { useEffect } from "react";
import { X, Save } from "lucide-react";
import { VendorModalProps } from "@/types/vendors";

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
            <div className="bg-white rounded-lg p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {editingItem ? "Edit Vendor" : `Add New Vendor - Branch #${branchId}`}
                    </h2>
                </div>

                {/* Scrollable Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1 pl-1">
                    {/* Company Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.Company_Name}
                            onChange={(e) =>
                                onFormDataChange({ Company_Name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter company name"
                            required
                        />
                    </div>

                    {/* Contact Person Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Person Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.Name}
                            onChange={(e) =>
                                onFormDataChange({ Name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter contact person name"
                            required
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Number
                            <span className="text-xs text-gray-500 ml-1">
                                (Phone/Mobile)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.Contact}
                            onChange={(e) =>
                                onFormDataChange({ Contact: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter contact number"
                        />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                            <span className="text-xs text-gray-500 ml-1">
                                (Business email)
                            </span>
                        </label>
                        <input
                            type="email"
                            value={formData.Email}
                            onChange={(e) =>
                                onFormDataChange({ Email: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter email address"
                        />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Address
                            <span className="text-xs text-gray-500 ml-1">
                                (Complete address)
                            </span>
                        </label>
                        <textarea
                            value={formData.Address}
                            onChange={(e) =>
                                onFormDataChange({ Address: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent h-24 resize-none"
                            placeholder="Enter complete business address..."
                            rows={3}
                        />
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
                        <X size={16} />
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            !formData.Name.trim() ||
                            !formData.Company_Name.trim() ||
                            actionLoading
                        }
                        className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2  ${!formData.Name.trim() ||
                                !formData.Company_Name.trim() ||
                                actionLoading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#2C2C2C] text-white hover:bg-gray-700"
                            }`}
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
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorModal;
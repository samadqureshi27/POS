// _components/BranchModal.tsx
"use client";

import React from "react";
import { X, Save } from "lucide-react";
import ButtonPage from "@/components/layout/UI/button";
import { BranchModalProps } from "../../../types/branch";

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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71 px-4">
            <div className="bg-white rounded-sm p-4 sm:p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        {editingItem ? "Edit Branch" : "Add New Branch"}
                    </h2>
                </div>

                {/* Scrollable Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1 p-2">
                    {/* Branch Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.Branch_Name}
                            onChange={(e) =>
                                onFormDataChange({ Branch_Name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter branch name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                            <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                onFormDataChange({ email: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter email address"
                        />
                    </div>

                    {/* Address */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.Address}
                            onChange={(e) =>
                                onFormDataChange({ Address: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent h-32 resize-none"
                            placeholder="Enter branch address"
                            required
                        />
                    </div>

                    {/* Postal Code */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code
                            <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) =>
                                onFormDataChange({ postalCode: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter postal code"
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="sm:col-span-2 flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <ButtonPage
                            checked={formData.Status === "Active"}
                            onChange={onStatusChange}
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
                        onClick={onSubmit}
                        disabled={
                            !formData.Branch_Name.trim() ||
                            !formData["Contact-Info"].trim() ||
                            !formData.Address.trim() ||
                            actionLoading
                        }
                        className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 ${!formData.Branch_Name.trim() ||
                                !formData["Contact-Info"].trim() ||
                                !formData.Address.trim() ||
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
                                {editingItem ? "Update Branch" : "Add Branch"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BranchModal;
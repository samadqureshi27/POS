"use client";

import React, { useEffect } from "react";
import { X, Save } from "lucide-react";
import ButtonPage from "@/components/layout/UI/button";
import { PosItem, PosModalFormData } from "@/types/pos";

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71 px-4">
            <div className="bg-white rounded-sm p-4 sm:p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        {editingItem ? "Edit POS" : `Add New POS - Branch #${branchId}`}
                    </h2>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-1 pl-1">
                    {/* POS Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            POS Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.POS_Name}
                            onChange={(e) =>
                                onFormDataChange({ POS_Name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                            placeholder="Enter POS name"
                            required
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between">
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
                        disabled={!formData.POS_Name.trim() || actionLoading}
                        className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 ${!formData.POS_Name.trim() || actionLoading
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
                                {editingItem ? "Update POS" : "Add POS"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PosModal;
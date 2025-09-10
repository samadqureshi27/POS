"use client";
import React from "react";
import { ChevronDown, X, Save } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ButtonPage from "@/components/layout/UI/button";
import { PaymentMethod, ModalFormData } from "@/types/payment";

interface PaymentModalProps {
  isOpen: boolean;
  editingItem: PaymentMethod | null;
  formData: ModalFormData;
  actionLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormDataChange: (updates: Partial<ModalFormData>) => void;
  onStatusChange: (isActive: boolean) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
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
            {editingItem ? "Edit Payment Method" : "Add New Payment Method"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1 pl-1">
          {/* Payment Method Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.Name}
              onChange={(e) => onFormDataChange({ Name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
              placeholder="Enter payment method name"
              required
            />
          </div>

          {/* Payment Type */}
          <div className="sm:col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="px-3 py-2 w-full rounded-sm text-sm bg-white border border-gray-300 outline-none flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]">
                {formData.PaymentType}
                <ChevronDown size={16} className="text-gray-500" />
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[240px] rounded-sm bg-white shadow-md border border-gray-200 p-1 relative outline-none z-100"
                  sideOffset={6}
                >
                  <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 z-100" />

                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-red-100 text-red-700 rounded outline-none"
                    onClick={() => onFormDataChange({ PaymentType: "Cash" })}
                  >
                    Cash
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 text-blue-700 rounded outline-none"
                    onClick={() => onFormDataChange({ PaymentType: "Card" })}
                  >
                    Card
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                    onClick={() => onFormDataChange({ PaymentType: "Online" })}
                  >
                    Online
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          {/* Tax Type */}
          <div className="sm:col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.TaxType}
              onChange={(e) => onFormDataChange({ TaxType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
              placeholder="e.g., GST, VAT, Service Tax"
              required
            />
          </div>

          {/* Tax Percentage */}
          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Percentage (%)
              <span className="text-xs text-gray-500 ml-1">
                (Enter rate between 0-100)
              </span>
            </label>
            <input
              type="text"
              value={formData.TaxPercentage || ''}
              onChange={(e) => {
                const value = e.target.value;
                // Allow numbers with decimal points
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  const numValue = value === '' ? 0 : parseFloat(value);
                  if (value === '' || (numValue >= 0 && numValue <= 100)) {
                    onFormDataChange({
                      TaxPercentage: value === '' ? 0 : numValue
                    });
                  }
                }
                // If invalid input, just ignore it (don't update state)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          {/* Status - Replaced with Toggle */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <ButtonPage
                checked={formData.Status === "Active"}
                onChange={onStatusChange}
              />
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
            <X size={16} />
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!formData.Name.trim() || actionLoading}
            className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 ${!formData.Name.trim() || actionLoading
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
                {editingItem ? "Update Item" : "Add Item"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
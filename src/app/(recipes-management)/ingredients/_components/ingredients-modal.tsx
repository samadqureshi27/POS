import React from 'react';
import { X, Save } from 'lucide-react';
import ButtonPage from "@/components/layout/ui/button";

interface InventoryItem {
  ID: string;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Unit: string;
  Priority: number;
}

interface IngredientsModalProps {
  isOpen: boolean;
  editItem: InventoryItem | null;
  formData: InventoryItem;
  setFormData: (data: InventoryItem) => void;
  onClose: () => void;
  onSave: () => void;
  actionLoading: boolean;
}

const IngredientsModal: React.FC<IngredientsModalProps> = ({
  isOpen,
  editItem,
  formData,
  setFormData,
  onClose,
  onSave,
  actionLoading
}) => {
  const handleStatusChange = (isActive: boolean) => {
    setFormData({
      ...formData,
      Status: isActive ? "Active" : "Inactive",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
      <div className="bg-white rounded-sm p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {editItem ? "Edit Ingredients" : "Add New Ingredients"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.Name}
              onChange={(e) =>
                setFormData({ ...formData, Name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              placeholder="Enter item name"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.Description}
              onChange={(e) =>
                setFormData({ ...formData, Description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              placeholder="Enter description"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <input
              type="text"
              value={formData.Unit}
              onChange={(e) =>
                setFormData({ ...formData, Unit: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              placeholder="Unit (e.g. Kg, Bottles)"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <input
              type="text"
              value={formData.Priority || ""}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers and empty string
                if (value === '' || /^\d+$/.test(value)) {
                  setFormData({
                    ...formData,
                    Priority: value === '' ? 0 : Number(value)
                  });
                }
                // If invalid input, just ignore it (don't update state)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              placeholder="1"
              min={1}
              required
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="flex items-center gap-3">
              <ButtonPage
                checked={formData.Status === "Active"}
                onChange={handleStatusChange}
              />
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex flex-col p-2 md:flex-row gap-3 pt-6 justify-end md:pr-6 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-2 md:order-1"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!formData.Name.trim() || actionLoading}
            className={`px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 order-1 md:order-2 ${
              !formData.Name.trim() || actionLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#2C2C2C] text-white hover:bg-gray-700"
            }`}
          >
            {actionLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                {editItem ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {editItem ? "Update Item" : "Add Item"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientsModal;
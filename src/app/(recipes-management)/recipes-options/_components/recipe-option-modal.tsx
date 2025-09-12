import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

interface RecipeOption {
  ID: number;
  Name: string;
  price: number;
}

interface RecipeModalProps {
  isOpen: boolean;
  editingItem: RecipeOption | null;
  onClose: () => void;
  onSubmit: (data: Omit<RecipeOption, "ID">) => void;
  actionLoading: boolean;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  editingItem,
  onClose,
  onSubmit,
  actionLoading,
}) => {
  const [formData, setFormData] = useState<Omit<RecipeOption, "ID">>({
    Name: "",
    price: 0,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        price: editingItem.price,
      });
    } else {
      setFormData({
        Name: "",
        price: 0,
      });
    }
  }, [editingItem, isOpen]);

  // Prevent background scrolling when modal is open
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
    if (!formData.Name.trim()) {
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
      <div className="bg-white rounded-sm p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {editingItem ? "Edit Option" : "Add Option"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-1 py-2">
          {/* Name */}
          <div>
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
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setFormData({
                    ...formData,
                    price: value === '' ? 0 : Number(value)
                  });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              placeholder="Enter price"
              required
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-6 sm:justify-end border-t border-gray-200 mt-auto">
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
            disabled={!formData.Name.trim() || actionLoading}
            className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 ${
              !formData.Name.trim() || actionLoading
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
                {editingItem ? "Update" : "Save & Close"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
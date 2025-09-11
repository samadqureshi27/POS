// components/MenuModal.tsx
import React, { useState, useEffect } from 'react';
import DetailsForm from './detail-form';
import OptionValuesForm from './option-value-form';
import { MenuItemOptions } from '@/lib/types/interfaces';

interface MenuModalProps {
  isOpen: boolean;
  editingItem: MenuItemOptions | null;
  formData: Omit<MenuItemOptions, "ID">;
  onFormDataChange: (data: Omit<MenuItemOptions, "ID">) => void;
  onSubmit: () => void;
  onClose: () => void;
  isFormValid: () => boolean;
}

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  editingItem,
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
  isFormValid,
}) => {
  const [activeTab, setActiveTab] = useState("Details");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveTab("Details");
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-sm w-full max-w-lg lg:max-w-2xl h-[70vh] shadow-lg relative flex flex-col mx-2 sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Fixed */}
        <div className="flex-shrink-0 p-3 sm:p-4 md:p-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-center sm:text-left pl-0 sm:pl-1 md:pl-5 pt-0 sm:pt-1 md:pt-2">
            {editingItem ? "Edit Option" : "Add Option"}
          </h1>

          {/* Tab Navigation */}
          <div className="flex w-full sm:w-[280px] md:w-[320px] lg:w-[350px] items-center justify-center border-b border-gray-200 mx-auto mt-4">
            {["Details", "Option Values"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors ${activeTab === tab
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9" }}>
          {activeTab === "Details" && (
            <DetailsForm
              formData={formData}
              onFormDataChange={onFormDataChange}
            />
          )}

          {activeTab === "Option Values" && (
            <OptionValuesForm
              formData={formData}
              onFormDataChange={onFormDataChange}
            />
          )}
        </div>

        {/* Action buttons - Fixed at bottom */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-3 sm:p-4 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="order-2 sm:order-1 px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!isFormValid()}
            className={`order-1 sm:order-2 px-4 py-2 text-sm sm:text-base rounded-sm transition-colors ${isFormValid()
              ? "bg-black text-white hover:bg-gray-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {editingItem ? "Update" : "Save & Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
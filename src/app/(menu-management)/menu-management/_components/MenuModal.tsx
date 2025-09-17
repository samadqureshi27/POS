import React from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TabNavigation from "./tab-menu";
import MenuItemTab from "./menu-item-tab";
import DetailsTab from "./details-tab";
import OptionsTab from "./options-tab";
import MealTab from "./meal-tab";
import SpecialsTab from "./specials-tab";
import PriceTab from "./price-table";

import {MenuModalProps,MenuItem} from "@/lib/types/menum";

const MenuModal: React.FC<MenuModalProps> = ({
    isOpen,
    editingItem,
    activeTab,
    setActiveTab,
    formData,
    onClose,
    onSubmit,
    actionLoading,
    isFormValid,
    preview,
    setPreview,
    fileInputRef,
    updateFormData,
    handleFormFieldChange,
    handleStatusChange,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-lg h-[70vh] lg:max-w-2xl flex flex-col">
                <ModalHeader
                    editingItem={editingItem}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    formData={formData}
                />

                <ModalContent
                    activeTab={activeTab}
                    formData={formData}
                    preview={preview}
                    setPreview={setPreview}
                    fileInputRef={fileInputRef}
                    updateFormData={updateFormData}
                    handleFormFieldChange={handleFormFieldChange}
                    handleStatusChange={handleStatusChange}
                />

                <ModalFooter
                    editingItem={editingItem}
                    onClose={onClose}
                    onSubmit={onSubmit}
                    actionLoading={actionLoading}
                    isFormValid={isFormValid}
                />
            </DialogContent>
        </Dialog>
    );
};

const ModalHeader: React.FC<{
    editingItem: MenuItem | null;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    formData: Omit<MenuItem, "ID">;
}> = ({ editingItem, activeTab, setActiveTab, formData }) => (
    <div className="flex-shrink-0">
        <h1 className="text-xl sm:text-2xl px-4 sm:px-6 pt-3 sm:pt-4 font-medium">
            {editingItem ? "Edit Menu Item" : "Add Menu Item"}
        </h1>
        <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
        />
    </div>
);

const ModalContent: React.FC<{
    activeTab: string;
    formData: Omit<MenuItem, "ID">;
    preview: string | null;
    setPreview: (preview: string | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    updateFormData: (updates: Partial<Omit<MenuItem, "ID">>) => void;
    handleFormFieldChange: (field: keyof Omit<MenuItem, "ID">, value: any) => void;
    handleStatusChange: (field: keyof Omit<MenuItem, "ID">, isActive: boolean) => void;
}> = ({
    activeTab,
    formData,
    preview,
    setPreview,
    fileInputRef,
    updateFormData,
    handleFormFieldChange,
    handleStatusChange,
}) => (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === "Menu Items" && (
                <MenuItemTab
                    formData={formData}
                    updateFormData={updateFormData}
                    handleFormFieldChange={handleFormFieldChange}
                    handleStatusChange={handleStatusChange}
                    preview={preview}
                    setPreview={setPreview}
                    fileInputRef={fileInputRef}
                />
            )}

            {activeTab === "Details" && (
                <DetailsTab
                    formData={formData}
                    updateFormData={updateFormData}
                    handleFormFieldChange={handleFormFieldChange}
                    handleStatusChange={handleStatusChange}
                />
            )}

            {activeTab === "Options" && (
                <OptionsTab
                    formData={formData}
                    updateFormData={updateFormData}
                    handleFormFieldChange={handleFormFieldChange}
                />
            )}

            {activeTab === "Meal" && (
                <MealTab
                    formData={formData}
                    setFormData={updateFormData}
                    handleStatusChange={handleStatusChange}
                />
            )}

            {activeTab === "Specials" && (
                <SpecialsTab
                    formData={formData}
                    setFormData={updateFormData}
                    handleStatusChange={handleStatusChange}
                />
            )}

            {activeTab === "Price" && (
                <PriceTab
                    formData={formData}
                    setFormData={updateFormData}
                />
            )}
        </div>
    );

const ModalFooter: React.FC<{
    editingItem: MenuItem | null;
    onClose: () => void;
    onSubmit: () => void;
    actionLoading: boolean;
    isFormValid: boolean;
}> = ({ editingItem, onClose, onSubmit, actionLoading, isFormValid }) => (
    <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-3 p-4 border-t border-gray-200 bg-white">
        <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 order-2 sm:order-1"
            disabled={actionLoading}
        >
            Cancel
        </button>
        <button
            type="button"
            onClick={onSubmit}
            disabled={actionLoading || !isFormValid}
            className={`px-4 py-2 min-w-[120px] rounded-sm transition-colors text-white order-1 sm:order-2 ${actionLoading || !isFormValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-700"
                }`}
        >
            {actionLoading ? (
                <div className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin w-4 h-4" />
                    {editingItem ? "Updating..." : "Saving..."}
                </div>
            ) : editingItem ? (
                "Update"
            ) : (
                "Save & Close"
            )}
        </button>
    </div>
);

export default MenuModal;
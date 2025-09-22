import React from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
    menuOptions,
    menuItems,
    categories,
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
            <DialogContent
                className="max-w-lg lg:max-w-2xl h-[85vh] max-h-[700px] flex flex-col"
                showCloseButton={false}
            >
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl">
                        {editingItem ? "Edit Menu Item" : "Add Menu Item"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-6 flex-shrink-0">
                        <TabsTrigger value="Menu Items">Menu Item</TabsTrigger>
                        <TabsTrigger value="Details">Details</TabsTrigger>
                        <TabsTrigger value="Options">Options</TabsTrigger>
                        <TabsTrigger value="Meal">Meal</TabsTrigger>
                        <TabsTrigger value="Specials">Specials</TabsTrigger>
                        <TabsTrigger value="Price">Price</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto mt-4">
                        <TabsContent value="Menu Items" className="mt-0">
                            <MenuItemTab
                                formData={formData}
                                updateFormData={updateFormData}
                                handleFormFieldChange={handleFormFieldChange}
                                handleStatusChange={handleStatusChange}
                                preview={preview}
                                setPreview={setPreview}
                                fileInputRef={fileInputRef}
                                categories={categories}
                            />
                        </TabsContent>

                        <TabsContent value="Details" className="mt-0">
                            <DetailsTab
                                formData={formData}
                                updateFormData={updateFormData}
                                handleFormFieldChange={handleFormFieldChange}
                                handleStatusChange={handleStatusChange}
                            />
                        </TabsContent>

                        <TabsContent value="Options" className="mt-0">
                            <OptionsTab
                                formData={formData}
                                updateFormData={updateFormData}
                                handleFormFieldChange={handleFormFieldChange}
                                menuOptions={menuOptions}
                            />
                        </TabsContent>

                        <TabsContent value="Meal" className="mt-0">
                            <MealTab
                                formData={formData}
                                setFormData={updateFormData}
                                handleStatusChange={handleStatusChange}
                                menuItems={menuItems}
                            />
                        </TabsContent>

                        <TabsContent value="Specials" className="mt-0">
                            <SpecialsTab
                                formData={formData}
                                setFormData={updateFormData}
                                handleStatusChange={handleStatusChange}
                            />
                        </TabsContent>

                        <TabsContent value="Price" className="mt-0">
                            <PriceTab
                                formData={formData}
                                setFormData={updateFormData}
                            />
                        </TabsContent>
                    </div>

                    <ModalFooter
                        editingItem={editingItem}
                        onClose={onClose}
                        onSubmit={onSubmit}
                        actionLoading={actionLoading}
                        isFormValid={isFormValid}
                    />
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};


const ModalFooter: React.FC<{
    editingItem: MenuItem | null;
    onClose: () => void;
    onSubmit: () => void;
    actionLoading: boolean;
    isFormValid: () => boolean;
}> = ({ editingItem, onClose, onSubmit, actionLoading, isFormValid }) => (
    <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200 bg-white">
        <Button
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
            className="order-2 sm:order-1"
        >
            Cancel
        </Button>
        <Button
            onClick={onSubmit}
            disabled={actionLoading || !isFormValid()}
            className="min-w-[120px] order-1 sm:order-2"
        >
            {actionLoading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    {editingItem ? "Updating..." : "Saving..."}
                </div>
            ) : editingItem ? (
                "Update"
            ) : (
                "Save & Close"
            )}
        </Button>
    </div>
);

export default MenuModal;
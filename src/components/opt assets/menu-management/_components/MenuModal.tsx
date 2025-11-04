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

import { MenuModalProps, MenuItem } from "@/lib/types/menum";

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
    // Determine if Price tab should be accessible
    const isPriceTabAccessible = formData.Displaycat === "Var";

    // Handle tab change with validation
    const handleTabChange = (value: string) => {
        if (value === "Price" && !isPriceTabAccessible) {
            return; // Prevent switching to Price tab if not accessible
        }
        setActiveTab(value);
    };

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

                <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-6 flex-shrink-0">
                        <TabsTrigger value="Menu Items">Menu Item</TabsTrigger>
                        <TabsTrigger value="Details">Details</TabsTrigger>
                        <TabsTrigger value="Options">Options</TabsTrigger>
                        <TabsTrigger value="Meal">Meal</TabsTrigger>
                        <TabsTrigger value="Specials">Specials</TabsTrigger>
                        <TabsTrigger
                            value="Price"
                            disabled={!isPriceTabAccessible}
                            className={!isPriceTabAccessible ?
                                "opacity-50 cursor-not-allowed text-gray-400 bg-gray-100" :
                                ""
                            }
                        >
                            Price
                        </TabsTrigger>
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
                            {isPriceTabAccessible ? (
                                <PriceTab
                                    formData={formData}
                                    setFormData={updateFormData}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="text-gray-400 mb-3">
                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                        Price Variations Unavailable
                                    </h4>
                                    <p className="text-xs text-gray-500 max-w-sm">
                                        Select "Var (Variations)" as the Display Type in the Menu Item tab to access price variations.
                                    </p>
                                </div>
                            )}
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
    <div className="flex-shrink-0 pt-4 border-t border-gray-100 bg-white flex justify-end gap-2">
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
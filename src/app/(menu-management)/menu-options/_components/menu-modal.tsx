// components/MenuModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DetailsForm from './detail-form';
import OptionValuesForm from './option-value-form';
import { MenuItemOptions, MenuModalProps } from '@/lib/types/menuItemOptions';

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  editingItem,
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
  isFormValid,
}) => {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg lg:max-w-2xl h-[80vh] max-h-[800px] flex flex-col p-0 overflow-hidden"
        showCloseButton={false}
        onWheel={(e) => e.preventDefault()}
      >
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            {editingItem ? "Edit Option" : "Add Option"}
          </DialogTitle>
        </DialogHeader>

        {/* Main Content Area */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex-shrink-0 px-6 pt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="option-values">Option Values</TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content - Scrollable */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <TabsContent value="details" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <div className="flex-1 min-h-0 overflow-hidden">
                  <DetailsForm
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="option-values" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <div className="flex-1 min-h-0 overflow-hidden">
                  <OptionValuesForm
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="flex-shrink-0 p-6 pt-4 border-t border-gray-100 bg-white flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!isFormValid()}
          >
            {editingItem ? "Update" : "Save & Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;